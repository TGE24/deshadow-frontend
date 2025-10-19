import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Accordion from "../../../components/Accordion";
import {
	Brand,
	Category,
	ProductCondition,
	Store,
	useBrandsLazyQuery,
	useCategoriesLazyQuery,
	useCreateProductMutation,
	useStoresQuery,
	useUpdateInventoryMutation,
} from "../../../generated/graphql";

interface AddProductModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

interface ProductSpecifications {
	storage?: string;
	color?: string;
}

interface AddProductForm {
	storeUuid: string;
	categoryUuid: string;
	brandUuid: string;
	name: string;
	description: string;
	model: string;
	condition: ProductCondition | "";
	imei: string;
	costPrice: string;
	sellingPrice: string;
	specifications: ProductSpecifications;
}

const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};

const AddProduct: React.FC<AddProductModalProps> = ({
	open,
	setOpen,
	refetch,
}) => {
	const [quantity, setQuantity] = useState<{
		available: number;
		reserved: number;
	}>({ available: 0, reserved: 0 });
	const [updateInventory, { loading: inventoryLoading }] =
		useUpdateInventoryMutation();
	const [getCategories, { data: categories }] = useCategoriesLazyQuery({
		fetchPolicy: "network-only",
	});
	const { data: stores } = useStoresQuery({
		variables: { pagination: { first: 100 } },
	});
	const [getBrands, { data: brands }] = useBrandsLazyQuery({
		fetchPolicy: "network-only",
	});

	const [createProduct, { loading }] = useCreateProductMutation();

	useEffect(() => {
		getCategories({ variables: { pagination: { first: 100 } } });
		getBrands({ variables: { pagination: { first: 100 } } });
	}, [getCategories, getBrands]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		setError,
		watch,
	} = useForm<AddProductForm>({
		defaultValues: {
			storeUuid: "",
			categoryUuid: "",
			brandUuid: "",
			name: "",
			imei: "",
			costPrice: "",
			sellingPrice: "",
			condition: "" as ProductCondition,
			model: "",
			description: "",
			specifications: {},
		},
		mode: "onChange",
	});

	const updateSpecification = (
		key: keyof ProductSpecifications,
		value: string
	) => {
		const currentSpecs = watch("specifications") || {};
		setValue("specifications", { ...currentSpecs, [key]: value });
	};

	const handleSubmitForm = async (data: AddProductForm) => {
		// Validate select fields
		if (!data.storeUuid) {
			setError("storeUuid", { message: "Please select a store" });
			return;
		}
		if (!data.categoryUuid) {
			setError("categoryUuid", { message: "Please select a category" });
			return;
		}
		if (!data.brandUuid) {
			setError("brandUuid", { message: "Please select a brand" });
			return;
		}
		if (!data.condition) {
			setError("condition", { message: "Please select a condition" });
			return;
		}

		try {
			await createProduct({
				variables: {
					input: {
						storeUuid: data.storeUuid,
						categoryUuid: data.categoryUuid,
						brandUuid: data.brandUuid,
						name: data.name,
						serialNumber: data.imei,
						costPrice: parseFloat(data.costPrice),
						sellingPrice: parseFloat(data.sellingPrice),
						condition: data.condition as ProductCondition,
						model: data.model,
						description: data.description,
						specifications: JSON.stringify(data.specifications),
					},
				},
				async onCompleted(data) {
					if (quantity.available > 0 || quantity.reserved > 0) {
						await updateInventory({
							variables: {
								input: {
									productUuid: data.createProduct.uuid ?? "",
									quantityAvailable: quantity.available,
									quantityReserved: quantity.reserved,
								},
								uuid: data.createProduct.inventory?.uuid ?? "",
							},
							onCompleted() {
								setOpen(false);
								reset();
								refetch();
								toast.success("Product created successfully");
							},
							onError(error: { message: string }) {
								console.log(error.message);
							},
						});
						return;
					}
					setOpen(false);
					reset();
					refetch();
					toast.success("Product created successfully");
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
			onClose={() => setOpen(false)}
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
					<div className="flex flex-col md:flex-row gap-[16px]">
						<div className="w-full">
							<label
								className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
								htmlFor="store"
							>
								Store
							</label>
							<Select
								options={stores?.stores.edges.map((store) => ({
									value: (store.node as Store).uuid,
									label: (store.node as Store).name,
								}))}
								placeholder="Select Store"
								classNames={selectStyles}
								onChange={(option) => {
									setValue("storeUuid", option?.value || "", {
										shouldValidate: true,
									});
								}}
								name="storeUuid"
							/>
							{errors.storeUuid && (
								<span className="text-red-500 text-sm">
									{errors.storeUuid.message}
								</span>
							)}
						</div>
						<div className="w-full">
							<label
								className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
								htmlFor="brandUuid"
							>
								Brand
							</label>
							<Select
								options={brands?.brands.edges.map((brand) => ({
									value: (brand.node as Brand).uuid,
									label: (brand.node as Brand).name,
								}))}
								placeholder="Select Brand"
								classNames={selectStyles}
								onChange={(option) =>
									setValue("brandUuid", option?.value || "")
								}
								name="brandUuid"
							/>
							{errors.brandUuid && (
								<span className="text-red-500 text-sm">
									{errors.brandUuid.message}
								</span>
							)}
						</div>
					</div>
					<div>
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="categoryUuid"
						>
							Category
						</label>
						<Select
							options={categories?.categories.edges
								.filter((category) => category.node.__typename === "Category")
								.map((category) => ({
									value: (category.node as Category).uuid,
									label: (category.node as Category).name,
								}))}
							placeholder="Select Category"
							classNames={selectStyles}
							onChange={(option) =>
								setValue("categoryUuid", option?.value || "")
							}
							name="categoryUuid"
						/>
						{errors.categoryUuid && (
							<span className="text-red-500 text-sm">
								{errors.categoryUuid.message}
							</span>
						)}
					</div>
					<Input
						label="Name"
						placeholder="Enter name"
						id="name"
						variant="secondary"
						register={register("name", {
							required: "Product name is required",
							minLength: {
								value: 2,
								message: "Name must be at least 2 characters",
							},
						})}
						errors={errors.name}
					/>
					<Input
						label="Description"
						placeholder="Enter description"
						id="description"
						variant="secondary"
						register={register("description", {
							required: "Product description is required",
							minLength: {
								value: 10,
								message: "Description must be at least 10 characters",
							},
						})}
						errors={errors.description}
					/>
					<div className="flex flex-col md:flex-row gap-[16px]">
						<Input
							label="Model"
							placeholder="Enter model"
							id="model"
							variant="secondary"
							register={register("model", {
								required: "Product model is required",
								minLength: { value: 1, message: "Model is required" },
							})}
							errors={errors.model}
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
								placeholder="Select condition"
								classNames={selectStyles}
								onChange={(option) =>
									setValue(
										"condition",
										option ? (option.value as ProductCondition) : ""
									)
								}
								name="condition"
							/>
							{errors.condition && (
								<span className="text-red-500 text-sm">
									{errors.condition.message}
								</span>
							)}
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-[16px]">
						<Input
							label="Storage"
							placeholder="Enter storage"
							id="storage"
							variant="secondary"
							onChange={(e) => updateSpecification("storage", e.target.value)}
						/>
						<Input
							label="Color"
							placeholder="Enter color"
							id="color"
							variant="secondary"
							onChange={(e) => updateSpecification("color", e.target.value)}
						/>
					</div>
					<Input
						label="Serial Number"
						placeholder="Enter serial Number"
						id="imei"
						variant="secondary"
						register={register("imei", {
							required: "Serial number is required",
							minLength: {
								value: 3,
								message: "Serial number must be at least 3 characters",
							},
						})}
						errors={errors.imei}
					/>

					<div className="flex flex-col md:flex-row gap-[16px]">
						<Input
							label="Cost Price"
							placeholder="Enter cost price"
							id="costPrice"
							variant="secondary"
							register={register("costPrice", {
								required: "Cost price is required",
								pattern: {
									value: /^\d+(\.\d{1,2})?$/,
									message: "Please enter a valid price",
								},
								min: { value: 0.01, message: "Price must be greater than 0" },
							})}
							errors={errors.costPrice}
						/>
						<Input
							label="Selling Price"
							placeholder="Enter selling price"
							id="sellingPrice"
							variant="secondary"
							register={register("sellingPrice", {
								required: "Selling price is required",
								pattern: {
									value: /^\d+(\.\d{1,2})?$/,
									message: "Please enter a valid price",
								},
								min: { value: 0.01, message: "Price must be greater than 0" },
							})}
							errors={errors.sellingPrice}
						/>
					</div>
					<Accordion title="Update Quantity" defaultOpen={false}>
						<div className="flex gap-[16px]">
							<Input
								label="Available"
								placeholder="Enter quantity available"
								variant="secondary"
								id="quantityAvailable"
								onChange={(e) =>
									setQuantity((prev) => ({
										...prev,
										available: parseInt(e.target.value, 10) || 0,
									}))
								}
							/>
							<Input
								label="Reserved"
								placeholder="Enter quantity reserved"
								variant="secondary"
								id="quantityReserved"
								onChange={(e) =>
									setQuantity((prev) => ({
										...prev,
										reserved: parseInt(e.target.value, 10) || 0,
									}))
								}
							/>
						</div>
					</Accordion>
				</div>
				<Button
					size="large"
					className="w-full"
					type="submit"
					disabled={loading || inventoryLoading}
				>
					{loading || inventoryLoading ? "Adding..." : "ADD PRODUCT"}
				</Button>
			</form>
		</Modal>
	);
};

export default AddProduct;
