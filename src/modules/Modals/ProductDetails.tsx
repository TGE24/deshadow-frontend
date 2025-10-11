import Modal from "react-responsive-modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "react-select";
import {
	Brand,
	Category,
	ProductCondition,
	useBrandsLazyQuery,
	useCategoriesLazyQuery,
	useCreateProductMutation,
} from "../../generated/graphql";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

type AddProductForm = {
	category: string;
	brand: string;
	product: string;
	color: string;
	storage: string;
	imei: string;
	costPrice: string;
	sellingPrice: string;
	condition: ProductCondition | "";
	model?: string;
};

const ProductDetails: React.FC<ModalProps> = ({ open, setOpen }) => {
	const [getcategories, { data: categories }] = useCategoriesLazyQuery({
		fetchPolicy: "network-only",
	});
	const [getBrands, { data: brands }] = useBrandsLazyQuery({
		fetchPolicy: "network-only",
	});

	const [createProduct, { loading }] = useCreateProductMutation();

	useEffect(() => {
		getcategories({ variables: { pagination: { first: 100 } } });
		getBrands({ variables: { pagination: { first: 100 } } });
	}, [getcategories, getBrands]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<AddProductForm>({
		defaultValues: {
			category: "",
			brand: "",
			product: "",
			color: "",
			storage: "",
			imei: "",
			costPrice: "",
			sellingPrice: "",
			condition: "" as ProductCondition,
			model: "",
		},
	});

	const onSumbit = async (data: AddProductForm) => {
		await createProduct({
			variables: {
				input: {
					storeUuid: "1d6f3b1e-5f7e-4f0a-8c8d-3b9e4e2c8f1a",
					categoryUuid: data.category,
					brandUuid: data.brand,
					name: data.product,
					serialNumber: data.imei,
					costPrice: parseFloat(data.costPrice),
					sellingPrice: parseFloat(data.sellingPrice),
					condition: data.condition as ProductCondition,
					// color: data.color,
					// storage: data.storage,
					model: data.model,
				},
			},
			onCompleted() {
				setOpen(false);
				reset();
			},
			onError(error: { message: string }) {
				console.log(error.message);
			},
		});
	};

	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal:
					"rounded-[10px] !px-[40px] !py-[48px] w-full !max-w-[508px] !m-0",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<h2 className="text-[#278783] font-bold text-[20px]">
				Enter product details
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[76px] mt-[16px] flex gap-[24px] flex-col">
					<div>
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="category"
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
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								setValue("category", option?.value);
							}}
							name="category"
						/>
						{errors.category && (
							<span className="text-red-500 text-sm">
								{errors.category.message}
							</span>
						)}
					</div>
					<div>
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="brand"
						>
							Brand
						</label>
						<Select
							options={brands?.brands.edges.map((brand) => ({
								value: (brand.node as Brand).uuid,
								label: (brand.node as Brand).name,
							}))}
							placeholder="Select Brand"
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								setValue("brand", option?.value);
							}}
							name="brand"
						/>
						{errors.brand && (
							<span className="text-red-500 text-sm">
								{errors.brand.message}
							</span>
						)}
					</div>
					<Input
						label="Model"
						placeholder="Enter model"
						id="model"
						variant="secondary"
						{...register("model", { required: "Please Enter Model" })}
					/>
					<Input
						label="Color"
						placeholder="Enter color"
						id="color"
						variant="secondary"
						{...register("color", { required: "Please Enter Color" })}
					/>
					<Input
						label="Storage"
						placeholder="Enter storage"
						id="storage"
						variant="secondary"
						{...register("storage", { required: "Please Enter Storage" })}
					/>
					<div>
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
									.replace(/_/g, " ")
									.toUpperCase() as ProductCondition,
							}))}
							placeholder="Select condition"
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								setValue(
									"condition",
									option
										? (option.value as ProductCondition)
										: ("" as ProductCondition)
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
					<Input
						label="IMEI Number"
						placeholder="Enter IMEI Number"
						id="imei"
						variant="secondary"
						{...register("imei", { required: "Please Enter IMEI Number" })}
					/>

					<Input
						label="Cost Price"
						placeholder="Enter cost price"
						id="costPrice"
						variant="secondary"
						{...register("costPrice", { required: "Please Enter IMEI Number" })}
					/>
					<Input
						label="Selling Price"
						placeholder="Enter selling price"
						id="sellingPrice"
						variant="secondary"
						{...register("sellingPrice", {
							required: "Please Enter Selling Price",
						})}
					/>
				</div>
				<Button
					size="large"
					className="w-full"
					type="submit"
					disabled={loading}
				>
					{loading ? "Adding..." : "ADD ITEM"}
				</Button>
			</form>
		</Modal>
	);
};

export default ProductDetails;
