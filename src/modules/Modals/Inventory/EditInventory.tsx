import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";
import { useState, useEffect } from "react";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
	Product,
	ProductCondition,
	ProductItem,
	useProductsQuery,
	useUpdateProductItemMutation,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";

interface CreateInventoryModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedProduct: Product | null;
	selectedProductItem: ProductItem | null;
}

interface CreateInventoryForm {
	productUuid: string;
	serialNumber: string;
	condition?: ProductCondition;
	notes: string;
	costPrice?: string;
	sellingPrice?: string;
	images?: FileList;
}

const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};

const EditInventory: React.FC<CreateInventoryModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedProduct,
	selectedProductItem,
}) => {
	const { data: products } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	const [createProductItem, { loading }] = useUpdateProductItemMutation();
	const [costPriceDisplay, setCostPriceDisplay] = useState("");
	const [sellingPriceDisplay, setSellingPriceDisplay] = useState("");
	const [selectedCondition, setSelectedCondition] = useState<{
		value: ProductCondition;
		label: string;
	} | null>(null);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);

	// Initialize display values with default data
	useEffect(() => {
		if (selectedProductItem) {
			// Set cost price display
			if (selectedProductItem.costPrice != null) {
				setCostPriceDisplay(formatNaira(selectedProductItem.costPrice));
			} else {
				setCostPriceDisplay("");
			}

			// Set selling price display
			if (selectedProductItem.sellingPrice != null) {
				setSellingPriceDisplay(formatNaira(selectedProductItem.sellingPrice));
			} else {
				setSellingPriceDisplay("");
			}

			// Set selected condition
			if (selectedProductItem.condition) {
				setSelectedCondition({
					value: selectedProductItem.condition,
					label: selectedProductItem.condition
						.replace("_", " ")
						.toLowerCase()
						.replace(/\b\w/g, (c) => c.toUpperCase()),
				});
			} else {
				setSelectedCondition(null);
			}
		} else {
			// Reset display values when no product item is selected
			setCostPriceDisplay("");
			setSellingPriceDisplay("");
			setSelectedCondition(null);
		}
	}, [selectedProductItem]);

	// Helper function to extract numeric value from formatted currency
	const extractNumericValue = (formattedValue: string) => {
		return formattedValue.replace(/[^\d.]/g, "");
	};

	// Handle cost price change
	const handleCostPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("costPrice", numericValue);
		setCostPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : ""
		);
		// Trigger validation for both fields
		trigger(["costPrice", "sellingPrice"]);
	};

	// Handle selling price change
	const handleSellingPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("sellingPrice", numericValue);
		setSellingPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : ""
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
			const response = await fetch(
				`${
					import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL
				}/api/v1/product-item-images`,
				{
					method: "POST",
					headers: {
						"X-API-Key": `${import.meta.env.VITE_ENV_UPLOAD_API_KEY}`,
					},
					body: formData,
				}
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
			serialNumber: selectedProductItem?.serialNumber || "",
			notes: selectedProductItem?.notes || "",
			condition: selectedProductItem?.condition || undefined,
			costPrice:
				selectedProductItem?.costPrice != null
					? String(selectedProductItem.costPrice)
					: undefined,
			sellingPrice:
				selectedProductItem?.sellingPrice != null
					? String(selectedProductItem.sellingPrice)
					: undefined,
		},
		mode: "onChange",
	});

	// Reset form when selectedProductItem changes
	useEffect(() => {
		if (selectedProductItem) {
			reset({
				productUuid: selectedProduct?.uuid,
				serialNumber: selectedProductItem.serialNumber || "",
				notes: selectedProductItem.notes || "",
				condition: selectedProductItem.condition || undefined,
				costPrice:
					selectedProductItem.costPrice != null
						? String(selectedProductItem.costPrice)
						: "",
				sellingPrice:
					selectedProductItem.sellingPrice != null
						? String(selectedProductItem.sellingPrice)
						: "",
			});
			// Reset image states when switching product items
			setImagePreviews([]);
			setSelectedImages([]);
		}
	}, [selectedProductItem, selectedProduct, reset]);

	// Handle modal close
	const handleClose = () => {
		setOpen(false);
		// Reset form and display states
		reset({
			productUuid: "",
			serialNumber: "",
			notes: "",
			condition: undefined,
			costPrice: "",
			sellingPrice: "",
		});
		setCostPriceDisplay("");
		setSellingPriceDisplay("");
		setSelectedCondition(null);
		setImagePreviews([]);
		setSelectedImages([]);
	};

	const handleSubmitForm = async (data: CreateInventoryForm) => {
		try {
			await createProductItem({
				variables: {
					uuid: selectedProductItem?.uuid || "",
					input: {
						serialNumber: data.serialNumber,
						condition: data.condition as ProductCondition,
						notes: data.notes,
						costPrice: data.costPrice ? parseFloat(data.costPrice) : undefined,
						sellingPrice: data.sellingPrice
							? parseFloat(data.sellingPrice)
							: undefined,
					},
				},
				async onCompleted() {
					// Upload images if any are selected
					if (selectedImages.length > 0 && selectedProductItem?.uuid) {
						try {
							await uploadImages(selectedProductItem.uuid, selectedImages);
							toast.success("Product and images updated successfully");
						} catch (error) {
							console.error("Error uploading images:", error);
							toast.success(
								"Product updated successfully, but some images failed to upload"
							);
						}
					} else {
						toast.success("Product updated successfully");
					}

					handleClose();
					reset();
					refetch();
				},
				onError(error) {
					toast.error(error.message);
				},
			});
		} catch (error) {
			console.error("Error updating product:", error);
			toast.error("Failed to update product");
		}
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			center
			classNames={{
				modal:
					"rounded-[10px] !px-[40px] !pb-[48px] w-full !max-w-[508px] !m-0",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<h2 className="text-[#278783] font-bold text-[20px] mb-[30px]">
				Enter product details
			</h2>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<div className="mb-[40px] mt-[16px] flex gap-[24px] flex-col">
					<div className="w-full">
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="store"
						>
							Product
						</label>
						<Select
							options={products?.products.edges.map((product) => ({
								value: (product.node as Product).uuid,
								label: (product.node as Product).name,
							}))}
							placeholder="Select Product"
							classNames={selectStyles}
							onChange={(option) => {
								setValue("productUuid", option?.value || "", {
									shouldValidate: true,
								});
							}}
							value={
								selectedProduct
									? {
											value: selectedProduct.uuid,
											label: selectedProduct.name,
									  }
									: null
							}
							name="productUuid"
							isDisabled={!!selectedProduct}
						/>
						{errors.productUuid && (
							<span className="text-red-500 text-sm">
								{errors.productUuid.message}
							</span>
						)}
					</div>

					<Input
						label="Serial Number"
						placeholder="Enter serial Number"
						id="serialNumber"
						variant="secondary"
						register={register("serialNumber", {
							required: "Serial number is required",
							minLength: {
								value: 3,
								message: "Serial number must be at least 3 characters",
							},
						})}
						errors={errors.serialNumber}
						disabled
					/>
					<div className="w-full">
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="status"
						>
							Condition
						</label>
						<Select
							options={Object.values(ProductCondition).map((condition) => ({
								value: condition,
								label: condition
									.replace("_", " ")
									.toLowerCase()
									.replace(/\b\w/g, (c) => c.toUpperCase()),
							}))}
							value={selectedCondition}
							placeholder="Select condition"
							classNames={selectStyles}
							onChange={(option) => {
								setSelectedCondition(option);
								setValue(
									"condition",
									option ? (option.value as ProductCondition) : undefined
								);
							}}
							name="condition"
						/>
						{errors.condition && (
							<span className="text-red-500 text-sm">
								{errors.condition.message}
							</span>
						)}
					</div>

					<div className="flex flex-col md:flex-row gap-[16px]">
						<div className="w-full">
							<label
								className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
								htmlFor="costPrice"
							>
								Cost Price
							</label>
							<input
								id="costPrice"
								type="text"
								placeholder="Enter cost price"
								value={costPriceDisplay}
								onChange={(e) => handleCostPriceChange(e.target.value)}
								className="w-full h-[48px] rounded-[10px] border-[#F0F0FF] border-[1px] px-[12px] outline-none focus:outline-none text-[14px]"
							/>
							<input
								type="hidden"
								{...register("costPrice", {
									required: "Cost price is required",
									pattern: {
										value: /^\d+(\.\d{1,2})?$/,
										message: "Please enter a valid price",
									},
									min: { value: 0.01, message: "Price must be greater than 0" },
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
							{errors.costPrice && (
								<span className="text-red-500 text-sm">
									{errors.costPrice.message}
								</span>
							)}
						</div>
						<div className="w-full">
							<label
								className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
								htmlFor="sellingPrice"
							>
								Selling Price
							</label>
							<input
								id="sellingPrice"
								type="text"
								placeholder="Enter selling price"
								value={sellingPriceDisplay}
								onChange={(e) => handleSellingPriceChange(e.target.value)}
								className="w-full h-[48px] rounded-[10px] border-[#F0F0FF] border-[1px] px-[12px] outline-none focus:outline-none text-[14px]"
							/>
							<input
								type="hidden"
								{...register("sellingPrice", {
									required: "Selling price is required",
									pattern: {
										value: /^\d+(\.\d{1,2})?$/,
										message: "Please enter a valid price",
									},
									min: { value: 0.01, message: "Price must be greater than 0" },
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
							{errors.sellingPrice && (
								<span className="text-red-500 text-sm">
									{errors.sellingPrice.message}
								</span>
							)}
						</div>
					</div>

					<Input
						label="Notes"
						placeholder="Enter notes"
						id="notes"
						variant="secondary"
						register={register("notes")}
						errors={errors.notes}
					/>

					{/* Multiple Images Upload Field */}
					<div className="w-full">
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="images"
						>
							Product Images (Optional)
						</label>
						<div className="w-full">
							<input
								id="images"
								type="file"
								accept="image/*"
								multiple
								{...register("images")}
								onChange={handleImageChange}
								className="w-full h-[48px] rounded-[10px] border-[#F0F0FF] border-[1px] px-[12px] outline-none focus:outline-none text-[14px] flex items-center file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							{imagePreviews.length > 0 && (
								<div className="mt-[12px] grid grid-cols-3 gap-[8px]">
									{imagePreviews.map((preview, index) => (
										<div key={index} className="relative">
											<img
												src={preview}
												alt={`Preview ${index + 1}`}
												className="w-full h-[80px] object-cover rounded-[6px] border border-gray-200"
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
											>
												×
											</button>
											{index === 0 && (
												<div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
													Primary
												</div>
											)}
										</div>
									))}
								</div>
							)}
							{imagePreviews.length > 0 && (
								<p className="text-xs text-gray-500 mt-2">
									{imagePreviews.length} image(s) selected. First image will be
									set as primary.
								</p>
							)}
						</div>
						{errors.images && (
							<span className="text-red-500 text-sm">
								{errors.images.message}
							</span>
						)}
					</div>
				</div>
				<Button
					size="large"
					className="w-full"
					type="submit"
					disabled={loading}
				>
					{loading ? "Loading..." : "Update Product Item"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditInventory;
