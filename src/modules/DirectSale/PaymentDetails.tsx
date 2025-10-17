import Select from "react-select";
import Input from "../../components/Input";
import { PaymentStatus } from "../../generated/graphql";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { CreateSaleForm, ProductItem } from "./types";
import { selectStyles } from "./constants";
import { formatNaira } from "../../utils/formatters";
import { calculateSubtotal } from "../../utils/helpers";

interface PaymentDetailsProps {
	register: UseFormRegister<CreateSaleForm>;
	setValue: UseFormSetValue<CreateSaleForm>;
	errors: FieldErrors<CreateSaleForm>;
	productItems: ProductItem[];
}

const PaymentDetails = ({
	register,
	setValue,
	errors,
	productItems,
}: PaymentDetailsProps) => {
	const subtotal = calculateSubtotal(productItems);

	return (
		<div className="flex flex-col gap-[24px]">
			<h3 className="text-[20px] font-semibold">Payment Details</h3>

			<div className="bg-blue-50 p-[16px] rounded-[8px]">
				<div className="flex justify-between items-center">
					<span className="font-medium">Calculated Subtotal:</span>
					<span className="text-[18px] font-semibold text-blue-600">
						{formatNaira(subtotal)}
					</span>
				</div>
			</div>

			<Input
				placeholder="Enter total amount"
				name="totalAmount"
				id="totalAmount"
				label="Total Amount"
				variant="secondary"
				type="number"
				register={register("totalAmount", {
					required: "Total amount is required",
					min: { value: 0, message: "Amount must be positive" },
				})}
				defaultValue={subtotal}
			/>
			<Input
				placeholder="Enter discount amount (leave empty if none)"
				name="discountAmount"
				id="discountAmount"
				label="Discount Amount"
				variant="secondary"
				type="number"
				register={register("discountAmount", {
					min: { value: 0, message: "Discount must be positive" },
				})}
			/>
			<div className="w-full">
				<label
					className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
					htmlFor="status"
				>
					Payment Status
				</label>
				<Select
					options={Object.values(PaymentStatus).map((status) => ({
						value: status,
						label: status
							.replace("_", " ")
							.toLowerCase()
							.replace(/\b\w/g, (c) => c.toUpperCase()),
					}))}
					placeholder="Select payment status"
					classNames={selectStyles}
					onChange={(option) => {
						if (option) {
							setValue("paymentStatus", option.value as PaymentStatus);
						}
					}}
					name="paymentStatus"
				/>
				{errors.paymentStatus && (
					<span className="text-red-500 text-sm">
						{errors.paymentStatus.message}
					</span>
				)}
			</div>
		</div>
	);
};

export default PaymentDetails;
