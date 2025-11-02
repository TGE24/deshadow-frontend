import Input from "../../components/Input";
import { UseFormRegister } from "react-hook-form";
import { SwapSaleFormData, SwapProductItem } from "./types";
import { formatNaira } from "../../utils/formatters";
import { calculateSwapSubtotal } from "../../utils/swapHelpers";

interface PaymentDetailsProps {
	register: UseFormRegister<SwapSaleFormData>;
	productItems: SwapProductItem[];
}

const PaymentDetails = ({ register, productItems }: PaymentDetailsProps) => {
	const subtotal = calculateSwapSubtotal(productItems);

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
		</div>
	);
};

export default PaymentDetails;
