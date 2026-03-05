import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import {
	CreditProfile,
	CreditProfilePendingSale,
	PaymentAllocationType,
	PaymentType,
	SaleItem,
	useRecordManualPaymentMutation,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";
import Select, { SingleValue } from "react-select";
import Button from "../../../components/Button";
import { PaymentTypeOptions } from "../../../utils/constants";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	profile: CreditProfile;
	pendingSales: CreditProfilePendingSale;
	selectedItems: SaleItem[];
	totalAmount: number;
}

const RepayAllModal: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	profile,
	pendingSales,
	selectedItems,
	totalAmount,
}) => {
	const [payAllPaymentType, setPayAllPaymentType] = useState<PaymentType>(
		PaymentType.Cash,
	);
	const [payAllAmount, setPayAllAmount] = useState<number>(totalAmount || 0);
	const [recordPayment, { loading: repaymentLoading }] =
		useRecordManualPaymentMutation();

	useEffect(() => {
		if (open) {
			setPayAllAmount(totalAmount);
		}
	}, [open, totalAmount]);

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
					Pay For Selected Items
				</h2>
				<p className="text-gray-600 mb-4">
					Process payment for the {selectedItems.length} selected item
					{selectedItems.length !== 1 ? "s" : ""}.
				</p>

				<div className="bg-gray-50 p-4 rounded mb-6 space-y-3">
					<div className="space-y-2">
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Customer:</span>{" "}
							{profile?.customerName}
						</p>
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Selected Items:</span>{" "}
							{selectedItems?.length || 0}
						</p>
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Total Amount:</span>{" "}
							{formatNaira(totalAmount)}
						</p>
					</div>

					<div className="border-t border-gray-200 pt-3 mt-3">
						<p className="text-xs text-gray-500 mb-2 font-semibold">Items:</p>
						<div className="max-h-40 overflow-y-auto space-y-1">
							{selectedItems?.map((item, idx: number) => (
								<div
									key={idx}
									className="flex justify-between text-xs text-gray-600 py-1"
								>
									<span>
										{item.product?.name || item.accessory?.name || "N/A"}
									</span>
									<span className="font-medium">
										{formatNaira(item.lineTotal)}
									</span>
								</div>
							))}
						</div>
					</div>
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
						onClick={async () => {
							const itemsAllocations =
								selectedItems?.map((item) => ({
									saleItemUuid: item.uuid,
									amount: Number(item.lineTotal),
								})) || [];

							try {
								await recordPayment({
									variables: {
										input: {
											saleUuid: pendingSales?.sale.uuid ?? "",
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
						}}
					>
						{repaymentLoading ? "Processing..." : "Process Payment"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default RepayAllModal;
