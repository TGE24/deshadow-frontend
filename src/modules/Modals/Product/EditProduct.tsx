import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
	Brand,
	Category,
	Product,
	Store,
	useBrandsLazyQuery,
	useCategoriesLazyQuery,
	useStoresQuery,
	useUpdateProductMutation,
} from "../../../generated/graphql";

interface AddProductModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedProduct: Product | null;
}

interface AddProductForm {
	storeUuid: string;
	categoryUuid: string;
	brandUuid: string;
	name: string;
	description: string;
	model: string;
}

const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};

const EditProduct: React.FC<AddProductModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedProduct,
}) => {
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);

	const [getCategories, { data: categories }] = useCategoriesLazyQuery({
		fetchPolicy: "network-only",
	});
	const { data: stores } = useStoresQuery({
		variables: { pagination: { first: 100 } },
	});
	const [getBrands, { data: brands }] = useBrandsLazyQuery({
		fetchPolicy: "network-only",
	});

	const [updateProduct, { loading }] = useUpdateProductMutation();

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
	} = useForm<AddProductForm>({
		defaultValues: {
			storeUuid: "",
			categoryUuid: "",
			brandUuid: "",
			name: "",
			model: "",
			description: "",
		},
		mode: "onChange",
	});

	// Update form values when selectedUser changes or modal opens
	useEffect(() => {
		if (open && selectedProduct) {
			const formData = {
				storeUuid: selectedProduct.store?.uuid || "",
				categoryUuid: selectedProduct.category?.uuid || "",
				brandUuid: selectedProduct.brand?.uuid || "",
				name: selectedProduct.name || "",
				model: selectedProduct.model || "",
				description: selectedProduct.description || "",
			};
			reset(formData);
			setSelectedStore(selectedProduct.store ? selectedProduct.store : null);
			setSelectedBrand(selectedProduct.brand ? selectedProduct.brand : null);
			setSelectedCategory(
				selectedProduct.category ? selectedProduct.category : null
			);
		}
	}, [open, selectedProduct, reset]);

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

		try {
			await updateProduct({
				variables: {
					input: {
						storeUuid: data.storeUuid,
						categoryUuid: data.categoryUuid,
						brandUuid: data.brandUuid,
						name: data.name,
						model: data.model,
						description: data.description,
					},
					uuid: selectedProduct?.uuid || "",
				},
				onCompleted() {
					setOpen(false);
					reset();
					refetch();
					toast.success("Product updated successfully");
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
				<div className="mb-[76px] mt-[16px] flex gap-[24px] flex-col">
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
							value={
								selectedStore
									? {
											value: selectedStore.uuid,
											label: selectedStore.name,
									  }
									: null
							}
							placeholder="Select Store"
							classNames={selectStyles}
							onChange={(option) => {
								const newStore = option ? option.value : null;
								setValue("storeUuid", newStore);
								const storeObj =
									option &&
									stores?.stores.edges
										.map((store) => store.node as Store)
										.find((store) => store.uuid === option.value);
								setSelectedStore(storeObj || null);
							}}
							name="storeUuid"
						/>
						{errors.storeUuid && (
							<span className="text-red-500 text-sm">
								{errors.storeUuid.message}
							</span>
						)}
					</div>

					<div className="flex flex-col md:flex-row gap-[16px]">
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
								value={
									selectedBrand
										? {
												value: selectedBrand.uuid,
												label: selectedBrand.name,
										  }
										: null
								}
								onChange={(option) => {
									const newBrand = option ? option.value : null;
									setValue("brandUuid", newBrand);
									const brandObj =
										option &&
										brands?.brands.edges
											.map((brand) => brand.node as Brand)
											.find((brand) => brand.uuid === option.value);
									setSelectedBrand(brandObj || null);
								}}
								name="brandUuid"
							/>
							{errors.brandUuid && (
								<span className="text-red-500 text-sm">
									{errors.brandUuid.message}
								</span>
							)}
						</div>
						<div className="w-full">
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
								value={
									selectedCategory
										? {
												value: selectedCategory.uuid,
												label: selectedCategory.name,
										  }
										: null
								}
								onChange={(option) => {
									const newCategory = option ? option.value : null;
									setValue("categoryUuid", newCategory);
									const categoryObj =
										option &&
										categories?.categories.edges
											.map((category) => category.node as Category)
											.find((category) => category.uuid === option.value);
									setSelectedCategory(categoryObj || null);
								}}
								name="categoryUuid"
							/>
							{errors.categoryUuid && (
								<span className="text-red-500 text-sm">
									{errors.categoryUuid.message}
								</span>
							)}
						</div>
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
						register={register("description")}
						errors={errors.description}
					/>
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
				</div>
				<Button
					size="large"
					className="w-full"
					type="submit"
					disabled={loading}
				>
					{loading ? "Updating..." : "UPDATE PRODUCT"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditProduct;
