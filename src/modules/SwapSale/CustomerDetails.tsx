import Input from "../../components/Input";
import {
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { SwapSaleFormData } from "./types";
import { PaymentType } from "../../generated/graphql";

interface CustomerDetailsProps {
	register: UseFormRegister<SwapSaleFormData>;
	setValue: UseFormSetValue<SwapSaleFormData>;
	watch: UseFormWatch<SwapSaleFormData>;
}

const CustomerDetails = ({
	register,
	setValue,
	watch,
}: CustomerDetailsProps) => {
	const paymentType = watch("paymentType");

	// Payment type options
	const paymentTypeOptions = [
		{ value: PaymentType.Cash, label: "Cash" },
		{ value: PaymentType.Transfer, label: "Transfer" },
		{ value: PaymentType.Pos, label: "POS" },
		{ value: PaymentType.CashTransfer, label: "Cash + Transfer" },
		{ value: PaymentType.PosCash, label: "POS + Cash" },
		{ value: PaymentType.PosTransfer, label: "POS + Transfer" },
	];

	return (
		<div className="flex flex-col gap-[24px] border border-gray-200 rounded-[10px] p-[20px]">
			<h3 className="text-[20px] font-semibold">Customer Details</h3>
			<Input
				placeholder="Enter customer name"
				name="customerName"
				id="customerName"
				label="Name"
				variant="secondary"
				register={register("customerName", {
					required: "Customer name is required",
				})}
			/>
			<div className="flex gap-[16px]">
				<Input
					placeholder="Enter customer Email"
					name="customerEmail"
					id="customerEmail"
					label="Email"
					variant="secondary"
					register={register("customerEmail", {
						required: "Customer email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					})}
				/>
				<Input
					placeholder="Enter customer phone number"
					name="customerPhone"
					id="customerPhone"
					label="Phone Number"
					variant="secondary"
					register={register("customerPhone", {
						required: "Customer phone number is required",
					})}
				/>
			</div>

			{/* Payment Type Selection */}
			<div className="w-full">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Payment Type
				</label>
				<Select
					value={paymentTypeOptions.find(
						(option) => option.value === paymentType
					)}
					onChange={(
						selectedOption: SingleValue<{ value: PaymentType; label: string }>
					) => {
						if (selectedOption) {
							setValue("paymentType", selectedOption.value);
						}
					}}
					options={paymentTypeOptions}
					className="text-sm"
					placeholder="Select payment type..."
					menuPortalTarget={document.body}
					menuPosition="fixed"
					styles={{
						control: (base) => ({
							...base,
							minHeight: "48px",
							borderColor: "#d1d5db",
							borderRadius: "8px",
							"&:hover": {
								borderColor: "#9ca3af",
							},
						}),
						option: (base, state) => ({
							...base,
							backgroundColor: state.isSelected
								? "#3b82f6"
								: state.isFocused
								? "#eff6ff"
								: "white",
						}),
						menuPortal: (base) => ({
							...base,
							zIndex: 9999,
						}),
					}}
				/>
			</div>
		</div>
	);
};

export default CustomerDetails;
