import React from "react";
import Button from "../../components/Button";
import { formatNaira, formatDateTime } from "../../utils/formatters";
import { CreditSaleFormData } from "./types";
import { SaleType, PaymentType } from "../../generated/graphql";

interface CreditSaleSuccessProps {
	saleData: {
		saleId: string;
		customerName: string;
		totalAmount: number;
		saleType: SaleType;
		paymentType: PaymentType | "" | null;
		createdAt: string;
	};
	productItems: Array<{
		id: string;
		productName?: string;
		serialNumber?: string;
		unitPrice?: number;
		attributeValues?: Record<string, string>;
		product?: Record<string, unknown> | null;
	}>;
	formData: CreditSaleFormData;
	onNewSale: () => void;
	onViewSale?: () => void;
	onClose: () => void;
}

const CreditSaleSuccess: React.FC<CreditSaleSuccessProps> = ({
	saleData,
	productItems,
	formData,
	onNewSale,
	onViewSale,
}) => {
	const formatPaymentType = (paymentType: PaymentType | "" | null) => {
		if (!paymentType) return "Not specified";
		switch (paymentType) {
			case PaymentType.Cash:
				return "Cash";
			case PaymentType.Transfer:
				return "Transfer";
			case PaymentType.Pos:
				return "POS";
			case PaymentType.CashTransfer:
				return "Cash + Transfer";
			case PaymentType.PosCash:
				return "POS + Cash";
			case PaymentType.PosTransfer:
				return "POS + Transfer";
			default:
				return String(paymentType);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[600px] p-[32px] text-center">
			<div className="w-[80px] h-[80px] bg-green-100 rounded-full flex items-center justify-center mb-[24px]">
				<svg
					className="w-[40px] h-[40px] text-green-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>

			<div className="mb-[24px]">
				<h2 className="text-[28px] font-bold text-gray-900 mb-[8px]">
					Credit Sale Completed
				</h2>
				<p className="text-[16px] text-gray-600">
					The credit sale has been recorded. See the summary below.
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-[12px] p-[24px] max-w-[600px] w-full mb-[24px] shadow-sm">
				<div className="space-y-[16px]">
					<div className="bg-gray-50 p-[12px] rounded-[8px]">
						<p className="text-[12px] text-gray-500 mb-[4px]">Sale ID</p>
						<p className="text-[16px] font-mono font-medium text-gray-800">
							{saleData.saleId}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-[16px]">
						<div>
							<p className="text-[12px] text-gray-500 mb-[4px]">Customer</p>
							<p className="text-[14px] font-medium text-gray-800">
								{saleData.customerName || "Walk-in Customer"}
							</p>
						</div>
						<div>
							<p className="text-[12px] text-gray-500 mb-[4px]">Total Amount</p>
							<p className="text-[18px] font-bold text-green-600">
								{formatNaira(saleData.totalAmount)}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-[16px]">
						<div>
							<p className="text-[12px] text-gray-500 mb-[4px]">
								Payment Method
							</p>
							<p className="text-[14px] font-medium text-gray-800">
								{formatPaymentType(saleData.paymentType)}
							</p>
						</div>
						<div>
							<p className="text-[12px] text-gray-500 mb-[4px]">Completed At</p>
							<p className="text-[14px] font-medium text-gray-800">
								{formatDateTime(saleData.createdAt)}
							</p>
						</div>
					</div>

					{/* Swap details (if any) */}
					{formData.creditSaleType === "swap" && (
						<div className="border-t border-gray-200 pt-[12px]">
							<p className="text-[12px] text-gray-500 mb-[8px]">
								Swap Device Details
							</p>
							<div className="bg-blue-50 p-[12px] rounded-[6px] space-y-[4px]">
								<div className="flex justify-between text-[12px]">
									<span className="text-gray-600">Device:</span>
									<span className="font-medium text-gray-800">
										{formData.swapPhoneDetails?.selectedProduct?.name ||
											formData.swapPhoneDetails.brand ||
											"Unknown"}
									</span>
								</div>
								{formData.swapPhoneDetails?.selectedProduct?.attributes &&
									formData.swapPhoneDetails.selectedProduct.attributes.length >
										0 && (
										<div className="mt-[4px]">
											{formData.swapPhoneDetails.selectedProduct.attributes.map(
												(attribute) => {
													const val =
														formData.swapPhoneDetails.attributeValues?.[
															attribute.uuid
														];
													return (
														<div
															key={attribute.uuid}
															className="flex justify-between text-[12px]"
														>
															<span className="text-gray-600">
																{attribute.name}:
															</span>
															<span className="font-medium text-gray-800">
																{val || "Not provided"}
															</span>
														</div>
													);
												},
											)}
										</div>
									)}

								<div className="flex justify-between text-[12px]">
									<span className="text-gray-600">Condition:</span>
									<span className="font-medium text-gray-800">
										{formData.swapPhoneDetails.condition || "-"}
									</span>
								</div>
								<div className="flex justify-between text-[12px]">
									<span className="text-gray-600">Estimated Value:</span>
									<span className="font-medium text-red-600">
										{formatNaira(formData.swapPhoneDetails.estimatedValue || 0)}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Sold Item(s) */}
					<div className="border-t border-gray-200 pt-[12px]">
						<p className="text-[12px] text-gray-500 mb-[8px]">
							{formData.isAccessory ? "Sold Accessory" : "Sold Item"}
						</p>

						{formData.isAccessory ? (
							/* Accessory Display */
							<div className="bg-white p-[12px] rounded-[6px] border border-gray-200">
								<div className="flex justify-between items-start">
									<div className="flex-1 text-left">
										<p className="font-medium text-[14px] text-gray-800">
											{formData.accessoryName}
										</p>
										<p className="text-[12px] text-gray-500 mt-[4px]">
											Quantity: {formData.accessoryQuantity}
										</p>
										<p className="text-[12px] text-gray-500">
											Unit Price: {formatNaira(formData.sellingPrice)}
										</p>
									</div>
									<div className="text-right pl-[12px]">
										<p className="text-[14px] font-medium text-gray-800">
											{formatNaira(
												formData.sellingPrice *
													(formData.accessoryQuantity || 1),
											)}
										</p>
									</div>
								</div>
							</div>
						) : (
							/* Product Display */
							<div className="space-y-[8px]">
								{productItems.map((item, idx) => (
									<div
										key={item.id || idx}
										className="bg-white p-[12px] rounded-[6px] border border-gray-200"
									>
										<div className="flex justify-between items-start">
											<div className="flex-1 text-left">
												<p className="font-medium text-[14px] text-gray-800">
													{item.productName || `Item ${idx + 1}`}
												</p>
												<p className="text-[12px] text-gray-500 mt-[4px]">
													Serial:{" "}
													<span className="font-mono">
														{item.serialNumber || "—"}
													</span>
												</p>
												{item.attributeValues &&
													Object.keys(item.attributeValues).length > 0 && (
														<div className="mt-[8px] space-y-[4px]">
															{Object.entries(item.attributeValues).map(
																([attrUuid, val]) => (
																	<p
																		key={attrUuid}
																		className="text-[12px] text-gray-600"
																	>
																		{attrUuid}:{" "}
																		<span className="font-medium text-gray-800">
																			{val}
																		</span>
																	</p>
																),
															)}
														</div>
													)}
											</div>
											<div className="text-right pl-[12px]">
												<p className="text-[14px] font-medium text-gray-800">
													{formatNaira(item.unitPrice || 0)}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-[12px] w-full max-w-[400px]">
				<Button
					type="button"
					variant="primary"
					onClick={onNewSale}
					className="flex-1 h-[48px] text-[14px] font-medium"
				>
					New Credit Sale
				</Button>
				{onViewSale && (
					<Button
						type="button"
						variant="secondary"
						onClick={onViewSale}
						className="flex-1 h-[48px] text-[14px] font-medium"
					>
						View Sale Details
					</Button>
				)}
			</div>
		</div>
	);
};

export default CreditSaleSuccess;
