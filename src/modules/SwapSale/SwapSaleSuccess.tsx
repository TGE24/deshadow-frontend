import React from "react";
import Button from "../../components/Button";
import { SwapSaleFormData, SwapProductItem } from "./types";
import { formatNaira, formatDateTime } from "../../utils/formatters";
import { calculateSwapSubtotal } from "../../utils/swapHelpers";
import {
	SaleType,
	PaymentType,
	useBrandsQuery,
	Brand,
} from "../../generated/graphql";

interface SwapSaleSuccessProps {
	saleData: {
		saleId: string;
		customerName: string;
		totalAmount: number;
		saleType: SaleType;
		paymentType: PaymentType | null;
		createdAt: string;
	};
	productItems: SwapProductItem[];
	formData: SwapSaleFormData;
	onNewSale: () => void;
	onViewSale?: () => void;
	onClose: () => void;
}

const SwapSaleSuccess: React.FC<SwapSaleSuccessProps> = ({
	saleData,
	productItems,
	formData,
	onNewSale,
	onViewSale,
}) => {
	// Helper function to format payment type for display
	const formatPaymentType = (paymentType: PaymentType | null) => {
		if (paymentType === null) {
			return "None";
		}
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
				return "Not specified";
		}
	};

	// Helper function to format condition for display
	const formatCondition = (condition: string) => {
		switch (condition.toLowerCase()) {
			case "excellent":
				return "Excellent";
			case "good":
				return "Good";
			case "fair":
				return "Fair";
			case "poor":
				return "Poor";
			default:
				return condition;
		}
	};

	const subtotal = calculateSwapSubtotal(productItems);
	const swapPhoneValue = formData.swapPhoneDetails.estimatedValue || 0;
	const swapDifference = subtotal - swapPhoneValue;

	// Fetch brands to resolve brand UUID to name when needed
	const { data: brands } = useBrandsQuery({
		variables: { pagination: { first: 100 } },
	});

	const formatBrand = (value: string) => {
		const brand = brands?.brands.edges
			.map((edge) => edge.node as Brand)
			.find((brand) => brand.uuid === value);
		return brand ? brand.name : value;
	};

	// Selected product attributes (if any) and helper flag to avoid duplicate storage display
	const selectedAttributes =
		formData.swapPhoneDetails.selectedProduct?.attributes || [];
	const hasStorageAttribute = selectedAttributes.some(
		(a) => a.name && a.name.toLowerCase().includes("storag")
	);

	return (
		<div className="flex flex-col items-center justify-center min-h-[600px] p-[32px] text-center">
			{/* Success Icon */}
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

			{/* Success Message */}
			<div className="mb-[32px]">
				<h2 className="text-[28px] font-bold text-gray-900 mb-[8px]">
					Swap Sale Completed Successfully!
				</h2>
				<p className="text-[16px] text-gray-600">
					Your device swap transaction has been processed successfully.
				</p>
			</div>

			{/* Sale Summary Card */}
			<div className="bg-white border border-gray-200 rounded-[12px] p-[24px] max-w-[500px] w-full mb-[32px] shadow-sm">
				<div className="space-y-[16px]">
					{/* Sale ID */}
					<div className="bg-gray-50 p-[12px] rounded-[8px]">
						<p className="text-[12px] text-gray-500 mb-[4px]">Sale ID</p>
						<p className="text-[16px] font-mono font-medium text-gray-800">
							{saleData.saleId}
						</p>
					</div>

					{/* Customer & Amount */}
					<div className="grid grid-cols-2 gap-[16px]">
						<div>
							<p className="text-[12px] text-gray-500 mb-[4px]">Customer</p>
							<p className="text-[14px] font-medium text-gray-800">
								{saleData.customerName || "Walk-in Customer"}
							</p>
						</div>
						<div>
							<p className="text-[12px] text-gray-500 mb-[4px]">Final Amount</p>
							<p
								className={`text-[18px] font-bold ${
									swapDifference >= 0 ? "text-green-600" : "text-blue-600"
								}`}
							>
								{swapDifference >= 0 ? "+" : ""}
								{formatNaira(Math.abs(swapDifference))}
							</p>
							<p className="text-[10px] text-gray-500">
								{swapDifference >= 0 ? "Customer pays" : "Customer receives"}
							</p>
						</div>
					</div>

					{/* Payment Type & Date */}
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

					{/* Swap Phone Details */}
					<div className="border-t border-gray-200 pt-[16px]">
						<p className="text-[12px] text-gray-500 mb-[8px]">
							Swap Device Details
						</p>
						<div className="bg-blue-50 p-[12px] rounded-[6px] space-y-[4px]">
							<div className="flex justify-between text-[12px]">
								<span className="text-gray-600">Device:</span>
								<span className="font-medium text-gray-800">
									{formData.swapPhoneDetails.selectedProduct?.name ||
										formatBrand(formData.swapPhoneDetails.brand) ||
										"Unknown"}
								</span>
							</div>
							{selectedAttributes.length > 0 && (
								<div className="mt-[4px]">
									{selectedAttributes.map((attribute) => {
										const val =
											formData.swapPhoneDetails.attributeValues?.[
												attribute.uuid
											];
										return (
											<div
												key={attribute.uuid}
												className="flex justify-between text-[12px]"
											>
												<span className="text-gray-600">{attribute.name}:</span>
												<span className="font-medium text-gray-800">
													{val || "Not provided"}
												</span>
											</div>
										);
									})}
								</div>
							)}

							{!hasStorageAttribute &&
								formData.swapPhoneDetails.selectedProduct?.attributes &&
								formData.swapPhoneDetails.selectedProduct.attributes.some(
									(a) => a.name && a.name.toLowerCase().includes("storag")
								) && (
									<div className="flex justify-between text-[12px]">
										<span className="text-gray-600">Storage:</span>
										<span className="font-medium text-gray-800">
											{formData.swapPhoneDetails.storage}
										</span>
									</div>
								)}
							<div className="flex justify-between text-[12px]">
								<span className="text-gray-600">Condition:</span>
								<span className="font-medium text-gray-800">
									{formatCondition(formData.swapPhoneDetails.condition)}
								</span>
							</div>
							<div className="flex justify-between text-[12px]">
								<span className="text-gray-600">Estimated Value:</span>
								<span className="font-medium text-red-600">
									{formatNaira(swapPhoneValue)}
								</span>
							</div>
						</div>
					</div>

					{/* Products Summary */}
					<div className="border-t border-gray-200 pt-[16px]">
						<p className="text-[12px] text-gray-500 mb-[8px]">New Devices</p>
						<div className="space-y-[8px]">
							{productItems.slice(0, 10).map((item, index) => (
								<div
									key={item.id}
									className="bg-white p-[12px] rounded-[6px] border border-gray-200"
								>
									<div className="flex justify-between items-start">
										<div className="flex-1 text-left">
											<p className="font-medium text-[14px] text-gray-800">
												{item.productName || `Product ${index + 1}`}
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
															([attrUuid, val]) => {
																const attrName =
																	item.product?.attributes.find(
																		(a) => a.uuid === attrUuid
																	)?.name || attrUuid;
																return (
																	<p
																		key={attrUuid}
																		className="text-[12px] text-gray-600"
																	>
																		{attrName}:{" "}
																		<span className="font-medium text-gray-800">
																			{val}
																		</span>
																	</p>
																);
															}
														)}
													</div>
												)}
										</div>
										<div className="text-right pl-[12px]">
											<p className="text-[14px] font-medium text-gray-800">
												{formatNaira(item.unitPrice)}
											</p>
											<p className="text-[11px] text-gray-500 mt-[6px]">
												{item.product?.brand?.name || item.product?.model || ""}
											</p>
										</div>
									</div>
								</div>
							))}
							{productItems.length > 10 && (
								<p className="text-[11px] text-gray-500 italic">
									+{productItems.length - 10} more items
								</p>
							)}
						</div>

						{/* Swap Calculation */}
						<div className="mt-[8px] pt-[8px] border-t border-gray-100 space-y-[4px]">
							<div className="flex justify-between text-[12px]">
								<span className="text-gray-600">New Devices Total:</span>
								<span className="font-medium text-gray-800">
									{formatNaira(subtotal)}
								</span>
							</div>
							<div className="flex justify-between text-[12px]">
								<span className="text-gray-600">Swap Device Credit:</span>
								<span className="font-medium text-red-600">
									-{formatNaira(swapPhoneValue)}
								</span>
							</div>
							{formData.discountAmount > 0 && (
								<div className="flex justify-between text-[12px]">
									<span className="text-gray-600">Additional Discount:</span>
									<span className="font-medium text-red-600">
										-{formatNaira(formData.discountAmount)}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-[12px] w-full max-w-[400px]">
				<Button
					type="button"
					variant="primary"
					onClick={onNewSale}
					className="flex-1 h-[48px] text-[14px] font-medium"
				>
					New Swap Sale
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

			{/* Success Stats */}
			<div className="grid grid-cols-3 gap-[16px] mt-[32px] max-w-[400px] w-full">
				<div className="text-center">
					<p className="text-[20px] font-bold text-gray-800">
						{productItems.length}
					</p>
					<p className="text-[12px] text-gray-500">
						New Device{productItems.length !== 1 ? "s" : ""}
					</p>
				</div>
				<div className="text-center">
					<p className="text-[16px] font-bold text-red-600">
						{formatNaira(swapPhoneValue)}
					</p>
					<p className="text-[12px] text-gray-500">Swap Credit</p>
				</div>
				<div className="text-center">
					<p className="text-[14px] font-bold text-green-600">
						{formatPaymentType(saleData.paymentType)}
					</p>
					<p className="text-[12px] text-gray-500">Payment</p>
				</div>
			</div>
		</div>
	);
};

export default SwapSaleSuccess;
