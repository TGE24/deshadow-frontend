import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
	Brand,
	Category,
	Store,
	useAssignAttributesToProductMutation,
	useAttributesLazyQuery,
	useBrandsLazyQuery,
	useCategoriesLazyQuery,
	useCreateProductMutation,
	useMeQuery,
	UserRole,
	useStoresLazyQuery,
} from "../../../generated/graphql";

interface AddProductModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

interface AddProductForm {
	storeUuid: string;
	categoryUuid: string;
	brandUuid: string;
	name: string;
	description: string;
	model: string;
	attributeUuids: string[];
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
	const { data: meData } = useMeQuery();
	const [getCategories, { data: categories }] = useCategoriesLazyQuery({
		fetchPolicy: "network-only",
	});
	const [getAttributes, { data: attributes }] = useAttributesLazyQuery({
		fetchPolicy: "network-only",
	});
	const [getBrands, { data: brands }] = useBrandsLazyQuery({
		fetchPolicy: "network-only",
	});
	const [getStores, { data: stores }] = useStoresLazyQuery({
		fetchPolicy: "network-only",
	});

	const [createProduct, { loading }] = useCreateProductMutation();
	const [assignAttributesToProduct] = useAssignAttributesToProductMutation();

	useEffect(() => {
		getCategories({ variables: { pagination: { first: 100 } } });
		getBrands({ variables: { pagination: { first: 100 } } });
		getAttributes({ variables: { pagination: { first: 100 } } });
		// Only fetch stores for store owners
		if (meData?.me?.role === UserRole.StoreOwner) {
			getStores({ variables: { pagination: { first: 100 } } });
		}
	}, [getCategories, getBrands, getAttributes, getStores, meData?.me?.role]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		setError,
		// watch,
	} = useForm<AddProductForm>({
		defaultValues: {
			storeUuid: "",
			categoryUuid: "",
			brandUuid: "",
			name: "",
			attributeUuids: [],
		},
		mode: "onChange",
	});

	// Set store for resellers automatically
	useEffect(() => {
		if (
			meData?.me?.role === UserRole.Reseller &&
			meData?.me?.assignedStore?.uuid
		) {
			setValue("storeUuid", meData.me.assignedStore.uuid, {
				shouldValidate: true,
			});
		}
	}, [meData, setValue]);

	const handleSubmitForm = async (data: AddProductForm) => {
		// Validate select fields (skip store validation for admins)
		const isAdmin =
			meData?.me?.role === UserRole.Admin ||
			meData?.me?.role === UserRole.SuperAdmin;

		if (!data.storeUuid && !isAdmin) {
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
			await createProduct({
				variables: {
					input: {
						categoryUuid: data.categoryUuid,
						brandUuid: data.brandUuid,
						name: data.name,
					},
				},
				async onCompleted(res) {
					if (data.attributeUuids.length > 0) {
						if (res.createProduct.uuid) {
							await assignAttributesToProduct({
								variables: {
									attributeUuids: data.attributeUuids,
									productUuid: res.createProduct.uuid,
								},
								onCompleted() {
									setOpen(false);
									reset();
									refetch();
									toast.success("Product created successfully");
								},
							});
						}
					} else {
						setOpen(false);
						reset();
						refetch();
						toast.success("Product created successfully");
					}
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
					</div>
					{meData?.me?.role === UserRole.StoreOwner && (
						<div>
							<label
								className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
								htmlFor="storeUuid"
							>
								Store
							</label>
							<Select
								options={
									stores?.stores?.edges?.map((store) => ({
										value: (store.node as Store).uuid,
										label: (store.node as Store).name,
									})) || []
								}
								placeholder="Select Store"
								classNames={selectStyles}
								onChange={(option) =>
									setValue("storeUuid", option?.value || "")
								}
								name="storeUuid"
							/>
							{errors.storeUuid && (
								<span className="text-red-500 text-sm">
									{errors.storeUuid.message}
								</span>
							)}
						</div>
					)}
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

					<div className="w-full">
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="attributes"
						>
							Attributes
						</label>
						<Select
							isMulti
							options={attributes?.attributes.edges
								.filter((attr) => attr.node.__typename === "Attribute")
								.map((attr) => ({
									value: (attr.node as { uuid: string; name: string }).uuid,
									label: (attr.node as { uuid: string; name: string }).name,
								}))}
							placeholder="Select Attributes"
							classNames={selectStyles}
							onChange={(options) => {
								const values = options ? options.map((opt) => opt.value) : [];
								setValue("attributeUuids", values, {
									shouldValidate: true,
								});
							}}
							menuPortalTarget={document.body}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 }),
							}}
							name="attributeUuids"
						/>
					</div>
				</div>
				<Button
					size="large"
					className="w-full"
					type="submit"
					disabled={loading}
				>
					{loading ? "Adding..." : "ADD PRODUCT"}
				</Button>
			</form>
		</Modal>
	);
};

export default AddProduct;
