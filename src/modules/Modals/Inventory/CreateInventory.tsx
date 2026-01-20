import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";
import { useState, useMemo } from "react";

import Button from "../../../components/Button";
import {
	Product,
	ProductCondition,
	useCreateProductItemMutation,
	useProductsQuery,
	useSetProductItemAttributeValuesMutation,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";

interface CreateInventoryModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedProduct?: Product | null;
	externalProduct?: boolean;
}

interface CreateInventoryForm {
	productUuid: string;
	serialNumber: string;
	condition?: ProductCondition;
	notes: string;
	costPrice?: string;
	sellingPrice?: string;
	externalStoreName?: string;
	externalStoreAddress?: string;
	externalStoreContact?: string;
	images?: FileList;
	attributeValues?: Record<string, string>;
}

const CreateInventory: React.FC<CreateInventoryModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedProduct,
	externalProduct = false,
}) => {
	const { data: products } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	const [createProductItem, { loading }] = useCreateProductItemMutation();
	const [setProductItemAttributeValues] =
		useSetProductItemAttributeValuesMutation();
	const [costPriceDisplay, setCostPriceDisplay] = useState("");
	const [sellingPriceDisplay, setSellingPriceDisplay] = useState("");
	const [currentSelectedProduct, setCurrentSelectedProduct] =
		useState<Product | null>(selectedProduct || null);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [attributeValues, setAttributeValues] = useState<
		Record<string, string>
	>({});

	// Memoized product options
	const productOptions = useMemo(
		() =>
			products?.products.edges.map((product) => ({
				value: (product.node as Product).uuid,
				label: (product.node as Product).name,
				product: product.node as Product,
			})) || [],
		[products?.products.edges],
	);

	// Helper function to extract numeric value from formatted currency
	const extractNumericValue = (formattedValue: string) => {
		return formattedValue.replace(/[^\d.]/g, "");
	};

	// Handle cost price change
	const handleCostPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("costPrice", numericValue);
		setCostPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : "",
		);
		// Trigger validation for both fields
		trigger(["costPrice", "sellingPrice"]);
	};

	// Handle selling price change
	const handleSellingPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("sellingPrice", numericValue);
		setSellingPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : "",
		);
		// Trigger validation for both fields
		trigger(["costPrice", "sellingPrice"]);
	};

	// Handle multiple image upload
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length > 0) {
			// Add new files to existing ones
			setSelectedImages((prev) => [...prev, ...files]);

			// Create previews for new files
			files.forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					setImagePreviews((prev) => [...prev, reader.result as string]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	// Remove image from selection
	const removeImage = (index: number) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	// Upload images to the API
	const uploadImages = async (productItemUuid: string, images: File[]) => {
		if (images.length === 0) return [];

		const formData = new FormData();

		// Append all images to the same FormData
		images.forEach((image) => {
			formData.append("file", image); // Use 'files' for multiple file upload
		});

		formData.append("product_item_uuid", productItemUuid);

		try {
			const token = localStorage.getItem("accessToken");
			const response = await fetch(
				`${
					import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL
				}/api/v1/product-item-images`,
				{
					method: "POST",
					headers: {
						Authorization: token ? `Bearer ${token}` : "",
					},
					body: formData,
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to upload images: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error uploading images:", error);
			throw error;
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
		trigger,
	} = useForm<CreateInventoryForm>({
		defaultValues: {
			productUuid: selectedProduct?.uuid,
			serialNumber: "",
			notes: "",
			condition: undefined,
			costPrice: "",
			sellingPrice: "",
		},
		mode: "onChange",
	});

	const handleSubmitForm = async (data: CreateInventoryForm) => {
		try {
			// Build the base input object
			const baseInput = {
				productUuid: selectedProduct?.uuid || data.productUuid,
				serialNumber: data.serialNumber,
				condition: data.condition as ProductCondition,
				notes: data.notes,
				costPrice: data.costPrice ? parseFloat(data.costPrice) : undefined,
				sellingPrice: data.sellingPrice
					? parseFloat(data.sellingPrice)
					: undefined,
			};

			// Add external store fields if needed
			const input = externalProduct
				? {
						...baseInput,
						externalStoreName: data.externalStoreName,
						externalStoreAddress: data.externalStoreAddress,
						externalStoreContact: data.externalStoreContact,
					}
				: baseInput;

			await createProductItem({
				variables: { input },
				async onCompleted(response) {
					try {
						const productItemUuid = response.createProductItem.uuid;

						// Save attribute values if any
						const attributeInputs = Object.entries(attributeValues)
							.filter(([, value]) => value.trim() !== "")
							.map(([attributeUuid, valueText]) => ({
								productItemUuid,
								attributeUuid,
								valueText,
							}));

						if (attributeInputs.length > 0) {
							await setProductItemAttributeValues({
								variables: { inputs: attributeInputs },
							});
						}

						// Upload images if any are selected
						if (selectedImages.length > 0) {
							await uploadImages(productItemUuid, selectedImages);
							toast.success(
								`Product created successfully with ${selectedImages.length} images uploaded`,
							);
						} else {
							toast.success("Product created successfully");
						}
					} catch (error) {
						console.error("Error uploading images:", error);
						toast.warning("Product created but some images failed to upload");
					}

					setOpen(false);
					reset();
					setCurrentSelectedProduct(selectedProduct || null);
					setCostPriceDisplay("");
					setSellingPriceDisplay("");
					setImagePreviews([]);
					setSelectedImages([]);
					setAttributeValues({});
					refetch();
				},
				onError(error) {
					toast.error(error.message);
				},
			});
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error("Failed to create product");
		}
	};

	return (
		<Modal
			open={open}
			onClose={() => {
				setOpen(false);
				reset();
				setCurrentSelectedProduct(selectedProduct || null);
				setCostPriceDisplay("");
				setSellingPriceDisplay("");
				setImagePreviews([]);
				setSelectedImages([]);
				setAttributeValues({});
			}}
			center
			classNames={{
				modal:
					"rounded-[16px] !px-[32px] !py-[24px] w-full !max-w-[900px] !m-0 shadow-2xl !max-h-[90vh] overflow-hidden flex flex-col",
				overlay: "backdrop-blur-[8px] bg-black/30",
			}}
		>
			<div className="flex items-center gap-[12px] mb-[24px] pb-[16px] border-b border-gray-200">
				<div className="w-[48px] h-[48px] bg-gradient-to-br from-[#278783] to-[#1a5f5c] rounded-[12px] flex items-center justify-center shadow-lg">
					<svg
						className="w-[28px] h-[28px] text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
				</div>
				<div>
					<h2 className="text-[#1F2937] font-bold text-[22px]">
						Add Product Item
					</h2>
					<p className="text-[13px] text-gray-500">
						Fill in the details to add a new inventory item
					</p>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(handleSubmitForm)}
				className="flex flex-col flex-1 overflow-hidden"
			>
				<div
					className="flex gap-[16px] flex-col overflow-y-auto pr-[8px] flex-1 pb-[16px]"
					style={{
						scrollbarWidth: "thin",
						scrollbarColor: "#278783 #f1f1f1",
					}}
				>
					{/* Product Selection Section */}
					<div className="rounded-[12px] p-[20px] border-[2px] border-[#E5E7EB] hover:border-[#278783]/30 transition-all">
						<div className="flex items-center gap-[8px] mb-[12px]">
							<svg
								className="w-[18px] h-[18px] text-[#278783]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
							<label className="text-[14px] text-[#1F2937] font-bold">
								Product <span className="text-red-500">*</span>
							</label>
						</div>
						<Select
							options={productOptions}
							placeholder="Select a product..."
							classNames={{
								control: () =>
									"h-[50px] !rounded-[10px] !border-[#E5E7EB] border-[2px] hover:!border-[#278783] cursor-pointer outline-none focus:outline-none text-[14px] !shadow-sm",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
								menu: () => "!rounded-[10px] !shadow-xl !border-[#E5E7EB]",
								option: () => "!text-[14px] hover:!bg-[#278783]/10",
							}}
							onChange={(option) => {
								setValue("productUuid", option?.value || "", {
									shouldValidate: true,
								});
								setCurrentSelectedProduct(option?.product || null);
								setAttributeValues({});
							}}
							value={
								currentSelectedProduct
									? {
											value: currentSelectedProduct.uuid,
											label: currentSelectedProduct.name,
											product: currentSelectedProduct,
										}
									: null
							}
							name="productUuid"
							isDisabled={!!selectedProduct}
						/>
						{errors.productUuid && (
							<div className="flex items-center gap-[6px] mt-[8px] text-red-500 text-[13px]">
								<svg
									className="w-[14px] h-[14px]"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
								{errors.productUuid.message}
							</div>
						)}
					</div>

					{/* Serial Number & Condition Row */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
						<div className="rounded-[12px] p-[20px] border-[2px] border-[#E5E7EB] hover:border-[#278783]/30 transition-all">
							<div className="flex items-center gap-[8px] mb-[12px]">
								<svg
									className="w-[18px] h-[18px] text-[#278783]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
									/>
								</svg>
								<label className="text-[14px] text-[#1F2937] font-bold">
									Serial Number <span className="text-red-500">*</span>
								</label>
							</div>
							<input
								id="serialNumber"
								type="text"
								placeholder="Enter serial number"
								{...register("serialNumber", {
									required: "Serial number is required",
									minLength: {
										value: 3,
										message: "Serial number must be at least 3 characters",
									},
								})}
								className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
							/>
							{errors.serialNumber && (
								<div className="flex items-center gap-[6px] mt-[8px] text-red-500 text-[13px]">
									<svg
										className="w-[14px] h-[14px]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.serialNumber.message}
								</div>
							)}
						</div>

						<div className="rounded-[12px] p-[20px] border-[2px] border-[#E5E7EB] hover:border-[#278783]/30 transition-all">
							<div className="flex items-center gap-[8px] mb-[12px]">
								<svg
									className="w-[18px] h-[18px] text-[#278783]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<label className="text-[14px] text-[#1F2937] font-bold">
									Condition <span className="text-red-500">*</span>
								</label>
							</div>
							<Select
								options={Object.values(ProductCondition).map((condition) => ({
									value: condition,
									label: condition
										.replace("_", " ")
										.toLowerCase()
										.replace(/\b\w/g, (c) => c.toUpperCase()),
								}))}
								placeholder="Select condition..."
								classNames={{
									control: () =>
										"h-[50px] !rounded-[10px] !border-[#E5E7EB] border-[2px] hover:!border-[#278783] cursor-pointer outline-none focus:outline-none text-[14px] !shadow-sm",
									container: () => "w-full",
									indicatorSeparator: () => "hidden",
									menu: () => "!rounded-[10px] !shadow-xl !border-[#E5E7EB]",
									option: () => "!text-[14px] hover:!bg-[#278783]/10",
								}}
								onChange={(option) =>
									setValue(
										"condition",
										option ? (option.value as ProductCondition) : undefined,
									)
								}
								name="condition"
							/>
							{errors.condition && (
								<div className="flex items-center gap-[6px] mt-[8px] text-red-500 text-[13px]">
									<svg
										className="w-[14px] h-[14px]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.condition.message}
								</div>
							)}
						</div>
					</div>

					{/* Pricing Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
						<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
							<div className="flex items-center gap-[8px] mb-[12px]">
								<svg
									className="w-[16px] h-[16px]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<label className="text-[14px] text-[#1F2937] font-bold">
									Cost Price <span className="text-red-500">*</span>
								</label>
							</div>
							<div className="relative">
								<span className="absolute left-[14px] top-[50%] translate-y-[-50%] font-bold text-[16px]">
									₦
								</span>
								<input
									id="costPrice"
									type="text"
									placeholder="0.00"
									value={costPriceDisplay}
									onChange={(e) => handleCostPriceChange(e.target.value)}
									className="w-full h-[50px] rounded-[10px]  bg-white border-[2px] pl-[36px] pr-[14px] outline-none text-[14px] font-medium transition-all border-[#E5E7EB]"
								/>
								<input
									type="hidden"
									{...register("costPrice", {
										required: "Cost price is required",
										pattern: {
											value: /^\d+(\.\d{1,2})?$/,
											message: "Please enter a valid price",
										},
										min: {
											value: 0.01,
											message: "Price must be greater than 0",
										},
										validate: (value) => {
											const sellingPrice = watch("sellingPrice");
											if (sellingPrice && value) {
												const costPriceNum = parseFloat(value);
												const sellingPriceNum = parseFloat(sellingPrice);
												if (costPriceNum > sellingPriceNum) {
													return "Cost price cannot be higher than selling price";
												}
											}
											return true;
										},
									})}
								/>
							</div>
							{errors.costPrice && (
								<div className="flex items-center gap-[6px] mt-[8px] text-red-600 text-[13px]">
									<svg
										className="w-[14px] h-[14px]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.costPrice.message}
								</div>
							)}
						</div>

						<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
							<div className="flex items-center gap-[8px] mb-[12px]">
								<svg
									className="w-[16px] h-[16px]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<label className="text-[14px] text-[#1F2937] font-bold">
									Selling Price <span className="text-red-500">*</span>
								</label>
							</div>
							<div className="relative">
								<span className="absolute left-[14px] top-[50%] translate-y-[-50%] font-bold text-[16px]">
									₦
								</span>
								<input
									id="sellingPrice"
									type="text"
									placeholder="0.00"
									value={sellingPriceDisplay}
									onChange={(e) => handleSellingPriceChange(e.target.value)}
									className="w-full h-[50px] rounded-[10px]  bg-white border-[2px] pl-[36px] pr-[14px] outline-none text-[14px] font-medium transition-all border-[#E5E7EB]"
								/>
								<input
									type="hidden"
									{...register("sellingPrice", {
										required: "Selling price is required",
										pattern: {
											value: /^\d+(\.\d{1,2})?$/,
											message: "Please enter a valid price",
										},
										min: {
											value: 0.01,
											message: "Price must be greater than 0",
										},
										validate: (value) => {
											const costPrice = watch("costPrice");
											if (costPrice && value) {
												const costPriceNum = parseFloat(costPrice);
												const sellingPriceNum = parseFloat(value);
												if (costPriceNum > sellingPriceNum) {
													return "Selling price must be higher than cost price";
												}
											}
											return true;
										},
									})}
								/>
							</div>
							{errors.sellingPrice && (
								<div className="flex items-center gap-[6px] mt-[8px] text-red-600 text-[13px]">
									<svg
										className="w-[14px] h-[14px]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.sellingPrice.message}
								</div>
							)}
						</div>
					</div>

					{externalProduct && (
						<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
							<div className="flex items-center gap-[8px] mb-[12px]">
								<svg
									className="w-[18px] h-[18px] text-[#278783]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
								<label className="text-[14px] text-[#1F2937] font-bold">
									External Store Details
								</label>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
								<div>
									<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
										Store Name
									</label>
									<input
										id="externalStoreName"
										type="text"
										placeholder="Enter store name"
										{...register("externalStoreName")}
										className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
									/>
								</div>
								<div>
									<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
										Store Contact
									</label>
									<input
										id="externalStoreContact"
										type="text"
										placeholder="Enter phone number"
										{...register("externalStoreContact")}
										className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
									/>
								</div>
								<div>
									<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
										Store Address
									</label>
									<input
										id="externalStoreAddress"
										type="text"
										placeholder="Enter store address"
										{...register("externalStoreAddress")}
										className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
									/>
								</div>
							</div>
						</div>
					)}
					{/* Dynamic Attribute Inputs */}
					{currentSelectedProduct?.attributes &&
						currentSelectedProduct.attributes.length > 0 && (
							<div className="w-full rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
								<div className="flex items-center gap-[8px] mb-[12px]">
									<svg
										className="w-[18px] h-[18px] text-[#278783]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<label className="text-[14px] text-[#1F2937] font-bold">
										Product Attributes
									</label>
									<span className="ml-auto text-[12px] text-gray-500 bg-white px-[10px] py-[4px] rounded-full">
										{currentSelectedProduct.attributes.length} attribute
										{currentSelectedProduct.attributes.length > 1 ? "s" : ""}
									</span>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
									{currentSelectedProduct.attributes.map((attr, index) => (
										<div
											key={attr.uuid}
											className="bg-white rounded-[10px] p-[12px] shadow-sm hover:shadow-md transition-shadow"
										>
											<label
												className="text-[14px] text-[#1F2937] font-bold mb-[8px] flex items-center gap-[6px]"
												htmlFor={`attr-${attr.uuid}`}
											>
												<span className="flex items-center justify-center w-[20px] h-[20px] bg-[#278783] text-white text-[11px] rounded-full font-bold">
													{index + 1}
												</span>
												{attr.name}
											</label>
											<input
												id={`attr-${attr.uuid}`}
												type="text"
												placeholder={`Enter ${attr.name.toLowerCase()}`}
												value={attributeValues[attr.uuid] || ""}
												onChange={(e) =>
													setAttributeValues((prev) => ({
														...prev,
														[attr.uuid]: e.target.value,
													}))
												}
												className="w-full h-[44px] rounded-[8px] border-[#E5E7EB] border-[1.5px] px-[12px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
											/>
										</div>
									))}
								</div>
							</div>
						)}

					{/* Multiple Images Upload Field */}
					<div className="rounded-[12px] p-[16px] border-[2px] border-dashed border-[#E5E7EB] hover:border-[#278783]/50 transition-all">
						<div className="flex items-center gap-[8px] mb-[12px]">
							<svg
								className="w-[18px] h-[18px] text-[#278783]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<label className="text-[14px] text-[#1F2937] font-bold">
								Product Images
							</label>
							<span className="text-[12px] text-gray-500">(Optional)</span>
						</div>
						<div className="relative">
							<input
								id="images"
								type="file"
								accept="image/*"
								multiple
								{...register("images")}
								onChange={handleImageChange}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
							/>
							<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[10px] p-[16px] border-[2px] border-dashed border-gray-300 text-center hover:border-[#278783] hover:bg-gradient-to-br hover:from-[#278783]/5 hover:to-[#278783]/10 transition-all cursor-pointer">
								<svg
									className="w-[32px] h-[32px] text-gray-400 mx-auto mb-[8px]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
								<p className="text-[14px] font-semibold text-gray-700 mb-[4px]">
									Click to upload or drag and drop
								</p>
								<p className="text-[12px] text-gray-500">
									PNG, JPG, GIF up to 10MB
								</p>
							</div>
						</div>
						{imagePreviews.length > 0 && (
							<div className="mt-[12px]">
								<div className="flex items-center justify-between mb-[8px]">
									<p className="text-[13px] font-semibold text-gray-700">
										{imagePreviews.length} image
										{imagePreviews.length > 1 ? "s" : ""} selected
									</p>
									<span className="text-[11px] text-gray-500 bg-gray-100 px-[8px] py-[4px] rounded-full">
										First image is primary
									</span>
								</div>
								<div className="grid grid-cols-3 gap-[12px]">
									{imagePreviews.map((preview, index) => (
										<div key={index} className="relative group">
											<img
												src={preview}
												alt={`Preview ${index + 1}`}
												className="w-full h-[90px] object-cover rounded-[10px] border-[2px] border-gray-200 group-hover:border-[#278783] transition-all"
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute -top-[8px] -right-[8px] bg-red-500 text-white rounded-full w-[24px] h-[24px] flex items-center justify-center text-[14px] font-bold hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
											>
												×
											</button>
											{index === 0 && (
												<div className="absolute bottom-[6px] left-[6px] bg-[#278783] text-white text-[10px] font-bold px-[8px] py-[3px] rounded-full shadow-md">
													PRIMARY
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Notes Field */}
					<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB] hover:border-[#278783]/30 transition-all">
						<div className="flex items-center gap-[8px] mb-[12px]">
							<svg
								className="w-[18px] h-[18px] text-[#278783]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
							<label className="text-[14px] text-[#1F2937] font-bold">
								Additional Notes
							</label>
							<span className="text-[12px] text-gray-500">(Optional)</span>
						</div>
						<textarea
							id="notes"
							placeholder="Add any additional notes or comments..."
							{...register("notes")}
							rows={3}
							className="w-full rounded-[10px] border-[#E5E7EB] border-[2px] px-[14px] py-[12px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all resize-none"
						/>
						{errors.notes && (
							<div className="flex items-center gap-[6px] mt-[8px] text-red-500 text-[13px]">
								<svg
									className="w-[14px] h-[14px]"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
								{errors.notes.message}
							</div>
						)}
					</div>
				</div>
				<div className="flex gap-[12px] pt-[20px] border-t border-gray-200">
					<button
						type="button"
						onClick={() => {
							setOpen(false);
							reset();
						}}
						className="flex-1 h-[52px] rounded-[10px] border-[2px] border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
					>
						Cancel
					</button>
					<Button
						size="large"
						className="flex-1 h-[52px] !rounded-[10px] bg-gradient-to-r from-[#278783] to-[#1a5f5c] hover:from-[#1a5f5c] hover:to-[#278783] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						type="submit"
						disabled={loading}
					>
						{loading ? (
							<div className="flex items-center gap-[8px]">
								<svg
									className="animate-spin h-[18px] w-[18px] text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span>Creating...</span>
							</div>
						) : (
							<div className="flex items-center gap-[8px]">
								<svg
									className="w-[18px] h-[18px]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								<span>Create Product Item</span>
							</div>
						)}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default CreateInventory;
