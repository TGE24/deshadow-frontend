import React, { useState } from "react";
import Modal from "react-responsive-modal";
import {
	PaymentAllocationType,
	PaymentType,
	SaleItem,
	useRecordManualPaymentMutation,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";
import Button from "../../../components/Button";
import { PaymentTypeOptions } from "../../../utils/constants";
import Select, { SingleValue } from "react-select";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	data: SaleItem;
	saleUuid: string;
}

const RepaymentModal: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	data,
	saleUuid,
}) => {
	const [payAllPaymentType, setPayAllPaymentType] = useState<PaymentType>(
		PaymentType.Cash,
	);
	const [payAllAmount, setPayAllAmount] = useState<number>(data.lineTotal || 0);
	const [recordPayment, { loading: repaymentLoading }] =
		useRecordManualPaymentMutation();

	const handleSubmit = async () => {
		const itemsAllocations = [
			{ saleItemUuid: data.uuid, amount: Number(data.lineTotal) },
		];

		try {
			await recordPayment({
				variables: {
					input: {
						saleUuid: saleUuid,
						amount: payAllAmount,
						paymentMethod: payAllPaymentType,
						allocationType: PaymentAllocationType.Items,
						itemAllocations: itemsAllocations,
					},
				},
				onCompleted: () => {
					refetch();
					setOpen(false);
				},
			});
		} catch (error) {
			console.error("Error recording payment:", error);
		}
	};
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal: "customModal w-[90vw] max-w-[600px]",
			}}
		>
			<div className="p-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Process Payment
				</h2>
				<p className="text-gray-600 mb-4">
					Enter the payment amount for this sale.
				</p>

				<div className="bg-gray-50 p-4 rounded mb-6 space-y-3">
					{(data.product?.name || data.productItem?.product?.name) && (
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Product:</span>{" "}
							{data.product?.name || data.productItem?.product?.name}
						</p>
					)}
					{data.productItem?.attributeValues &&
						data.productItem.attributeValues.length > 0 && (
							<div className="text-sm text-gray-600">
								<span className="font-semibold">Attributes:</span>
								<div className="mt-2 flex flex-wrap gap-2">
									{data.productItem.attributeValues.map((av, index) => (
										<span
											key={index}
											className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
										>
											{av.attribute.name}: {av.valueText || "N/A"}
										</span>
									))}
								</div>
							</div>
						)}
					{data.lineTotal && (
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Amount:</span>{" "}
							{formatNaira(data.lineTotal)}
						</p>
					)}
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Payment Type
					</label>
					<Select
						value={PaymentTypeOptions.find(
							(option) => option.value === payAllPaymentType,
						)}
						onChange={(
							selectedOption: SingleValue<{
								value: PaymentType;
								label: string;
							}>,
						) => {
							if (selectedOption) {
								setPayAllPaymentType(selectedOption.value);
							}
						}}
						options={PaymentTypeOptions}
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
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Payment Amount
					</label>
					<input
						type="text"
						placeholder="₦0.00"
						value={payAllAmount ? formatNaira(payAllAmount) : ""}
						onChange={(e) => {
							// Remove currency symbol and commas, keep only numbers and decimal
							const numericValue = e.target.value
								.replace(/₦|,/g, "")
								.replace(/[^0-9.]/g, "");

							// Parse the numeric value
							const parsedValue = parseFloat(numericValue) || 0;
							setPayAllAmount(parsedValue);
						}}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex gap-3 justify-end">
					<Button
						variant="primary"
						size="large"
						className="w-full"
						onClick={handleSubmit}
					>
						{repaymentLoading ? "Processing..." : "Process Payment"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default RepaymentModal;
