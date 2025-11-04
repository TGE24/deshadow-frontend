import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";
import { useState } from "react";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
	Product,
	ProductCondition,
	useCreateProductItemMutation,
	useProductsQuery,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";

interface CreateInventoryModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedProduct: Product | null;
}

interface CreateInventoryForm {
	productUuid: string;
	serialNumber: string;
	condition?: ProductCondition;
	notes: string;
	costPrice?: string;
	sellingPrice?: string;
}

const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};

const CreateInventory: React.FC<CreateInventoryModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedProduct,
}) => {
	const { data: products } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	const [createProductItem, { loading }] = useCreateProductItemMutation();
	const [costPriceDisplay, setCostPriceDisplay] = useState("");
	const [sellingPriceDisplay, setSellingPriceDisplay] = useState("");

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
	};

	// Handle selling price change
	const handleSellingPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("sellingPrice", numericValue);
		setSellingPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : ""
		);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
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
			await createProductItem({
				variables: {
					input: {
						productUuid: selectedProduct?.uuid,
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
									option ? (option.value as ProductCondition) : undefined
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
				</div>
				<Button
					size="large"
					className="w-full"
					type="submit"
					disabled={loading}
				>
					{loading ? "Loading..." : "Create Product Item"}
				</Button>
			</form>
		</Modal>
	);
};

export default CreateInventory;
