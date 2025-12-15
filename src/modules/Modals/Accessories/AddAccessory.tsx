import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import Select from "react-select";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
	useCreateAccessoryMutation,
	useMeQuery,
	UserRole,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";

interface AddProductModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

interface AddAccessoryForm {
	storeUuid: string;
	name: string;
	quantity: number;
	costPrice: number;
	sellingPrice: number;
}

const AddAccessory: React.FC<AddProductModalProps> = ({
	open,
	setOpen,
	refetch,
}) => {
	const { data: meData } = useMeQuery();

	const [createAccessory, { loading }] = useCreateAccessoryMutation();
	const [costPriceDisplay, setCostPriceDisplay] = useState("");
	const [sellingPriceDisplay, setSellingPriceDisplay] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		setError,
		trigger,
		watch,
	} = useForm<AddAccessoryForm>({
		defaultValues: {
			storeUuid: "",
			name: "",
			costPrice: 0,
			sellingPrice: 0,
			quantity: 0,
		},
		mode: "onChange",
	});

	// Helper function to extract numeric value from formatted currency
	const extractNumericValue = (formattedValue: string) => {
		return formattedValue.replace(/[^\d.]/g, "");
	};

	// Handle cost price change
	const handleCostPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("costPrice", numericValue ? parseFloat(numericValue) : 0);
		setCostPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue), false) : ""
		);
		// Trigger validation for both fields
		trigger(["costPrice", "sellingPrice"]);
	};

	// Handle selling price change
	const handleSellingPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("sellingPrice", numericValue ? parseFloat(numericValue) : 0);
		setSellingPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue), false) : ""
		);
		// Trigger validation for both fields
		trigger(["costPrice", "sellingPrice"]);
	};

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

	const handleSubmitForm = async (data: AddAccessoryForm) => {
		// Validate select fields
		if (!data.storeUuid) {
			setError("storeUuid", { message: "Please select a store" });
			return;
		}

		try {
			await createAccessory({
				variables: {
					input: {
						name: data.name,
						quantity: data.quantity,
						costPrice: data.costPrice,
						sellingPrice: data.sellingPrice,
						storeUuid: data.storeUuid,
					},
				},
				async onCompleted() {
					reset();
					setOpen(false);
					refetch();
					toast.success("Accessory created successfully");
				},
				onError(error) {
					toast.error(error.message);
				},
			});
		} catch (error) {
			console.error("Error creating accessory:", error);
			toast.error("Failed to create accessory");
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
				Enter Accessory details
			</h2>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<div className="mb-[40px] mt-[16px] flex gap-[24px] flex-col">
					{/* Store Select - Only for StoreOwners */}
					{meData?.me?.role === UserRole.StoreOwner && (
						<div>
							<label className="block text-[14px] font-semibold text-gray-900 mb-2">
								Store
							</label>
							<Select
								options={
									meData?.me?.ownedStores?.map((store) => ({
										value: store.uuid,
										label: store.name,
									})) || []
								}
								value={
									watch("storeUuid")
										? {
												value: watch("storeUuid"),
												label:
													meData?.me?.ownedStores?.find(
														(s) => s.uuid === watch("storeUuid")
													)?.name || "",
										  }
										: null
								}
								onChange={(option) =>
									setValue("storeUuid", option?.value || "")
								}
								isSearchable
								isClearable={false}
								styles={{
									control: (base) => ({
										...base,
										minHeight: "50px",
										borderRadius: "10px",
										borderColor: "#E5E7EB",
										borderWidth: "2px",
										fontSize: "14px",
									}),
									option: (base, state) => ({
										...base,
										backgroundColor: state.isSelected ? "#278783" : "white",
										color: state.isSelected ? "white" : "black",
										cursor: "pointer",
									}),
								}}
							/>
							{errors.storeUuid && (
								<span className="text-red-500 text-[12px] mt-1">
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
					<Input
						label="Quantity"
						placeholder="Enter quantity"
						id="quantity"
						variant="secondary"
						register={register("quantity")}
						errors={errors.quantity}
					/>
					{/* Cost Price with Money Format */}
					<div>
						<label className="block text-[14px] font-semibold text-gray-900 mb-2">
							Cost Price (Per Unit)
						</label>
						<div className="relative">
							<span className="absolute left-[14px] top-[50%] translate-y-[-50%] font-bold text-[16px] text-gray-400">
								₦
							</span>
							<input
								id="costPrice"
								type="text"
								placeholder="0.00"
								value={costPriceDisplay}
								onChange={(e) => handleCostPriceChange(e.target.value)}
								className="w-full h-[50px] rounded-[10px] bg-white border-[2px] pl-[36px] pr-[14px] outline-none text-[14px] font-medium transition-all border-[#E5E7EB]"
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
											const costPriceNum = value;
											const sellingPriceNum = sellingPrice;
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
							<span className="text-red-500 text-[12px] mt-1">
								{errors.costPrice.message}
							</span>
						)}
					</div>
					{/* Selling Price with Money Format */}
					<div>
						<label className="block text-[14px] font-semibold text-gray-900 mb-2">
							Selling Price (Per Unit)
						</label>
						<div className="relative">
							<span className="absolute left-[14px] top-[50%] translate-y-[-50%] font-bold text-[16px] text-gray-400">
								₦
							</span>
							<input
								id="sellingPrice"
								type="text"
								placeholder="0.00"
								value={sellingPriceDisplay}
								onChange={(e) => handleSellingPriceChange(e.target.value)}
								className="w-full h-[50px] rounded-[10px] bg-white border-[2px] pl-[36px] pr-[14px] outline-none text-[14px] font-medium transition-all border-[#E5E7EB]"
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
								})}
							/>
						</div>
						{errors.sellingPrice && (
							<span className="text-red-500 text-[12px] mt-1">
								{errors.sellingPrice.message}
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
					{loading ? "Adding..." : "ADD ACCESSORY"}
				</Button>
			</form>
		</Modal>
	);
};

export default AddAccessory;
