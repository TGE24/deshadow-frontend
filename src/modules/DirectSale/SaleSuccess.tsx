import React from "react";
import Button from "../../components/Button";
import { CreateSaleForm, ProductItem } from "./types";
import { formatNaira, formatDateTime } from "../../utils/formatters";
import { calculateSubtotal } from "../../utils/helpers";
import { SaleType, PaymentType } from "../../generated/graphql";

interface SaleSuccessProps {
	saleData: {
		saleId: string;
		customerName: string;
		totalAmount: number;
		saleType: SaleType;
		paymentType: PaymentType;
		createdAt: string;
		invoices?: Array<{
			uuid: string;
			filePath?: string | null;
			invoiceNumber: string;
		}>;
	};
	productItems: ProductItem[];
	formData: CreateSaleForm;
	onNewSale: () => void;
	onViewSale?: () => void;
	onClose: () => void;
}

const SaleSuccess: React.FC<SaleSuccessProps> = ({
	saleData,
	productItems,
	formData,
	onNewSale,
	onViewSale,
	onClose,
}) => {
	// Helper function to format payment type for display
	const formatPaymentType = (paymentType: PaymentType) => {
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

	// Helper function to format sale type for display
	const formatSaleType = (saleType: SaleType) => {
		switch (saleType) {
			case SaleType.Direct:
				return "Direct Sale";
			case SaleType.Credit:
				return "Credit Sale";
			case SaleType.Swap:
				return "Swap Sale";
			default:
				return "Sale";
		}
	};

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
					Sale Completed Successfully!
				</h2>
				<p className="text-[16px] text-gray-600">
					Your {formatSaleType(saleData.saleType).toLowerCase()} has been
					processed successfully.
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
							<p className="text-[12px] text-gray-500 mb-[4px]">Total Amount</p>
							<p className="text-[18px] font-bold text-green-600">
								{formatNaira(saleData.totalAmount)}
							</p>
						</div>
					</div>

					{/* Payment & Sale Type */}
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
							<p className="text-[12px] text-gray-500 mb-[4px]">Sale Type</p>
							<p className="text-[14px] font-medium text-gray-800">
								{formatSaleType(saleData.saleType)}
							</p>
						</div>
					</div>

					{/* Date & Time */}
					<div>
						<p className="text-[12px] text-gray-500 mb-[4px]">Completed At</p>
						<p className="text-[14px] font-medium text-gray-800">
							{formatDateTime(saleData.createdAt)}
						</p>
					</div>

					{/* Items Summary */}
					<div className="border-t border-gray-200 pt-[16px]">
						<p className="text-[12px] text-gray-500 mb-[8px]">Items Sold</p>
						<div className="space-y-[8px]">
							{productItems.slice(0, 3).map((item, index) => (
								<div
									key={item.id}
									className="flex justify-between items-center text-[14px]"
								>
									<span className="text-gray-700">
										{item.productName || `Product ${index + 1}`}
									</span>
									<span className="font-medium text-gray-800">
										{formatNaira(item.unitPrice)}
									</span>
								</div>
							))}
							{productItems.length > 3 && (
								<p className="text-[12px] text-gray-500 italic">
									+{productItems.length - 3} more items
								</p>
							)}
						</div>

						{/* Subtotal and Discount */}
						{formData.discountAmount > 0 && (
							<div className="flex justify-between items-center text-[14px] mt-[8px] pt-[8px] border-t border-gray-100">
								<span className="text-gray-600">Subtotal:</span>
								<span className="font-medium text-gray-800">
									{formatNaira(calculateSubtotal(productItems))}
								</span>
							</div>
						)}
						{formData.discountAmount > 0 && (
							<div className="flex justify-between items-center text-[14px]">
								<span className="text-gray-600">Discount:</span>
								<span className="font-medium text-red-600">
									-{formatNaira(formData.discountAmount)}
								</span>
							</div>
						)}
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
					Create New Sale
				</Button>
				{saleData?.invoices &&
					saleData.invoices.length > 0 &&
					saleData.invoices[0]?.filePath && (
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								const invoiceFilePath = saleData.invoices?.[0]?.filePath;
								if (invoiceFilePath) {
									// Remove leading slash if present to avoid double slashes
									const cleanPath = invoiceFilePath.startsWith("/")
										? invoiceFilePath.slice(1)
										: invoiceFilePath;
									const fullUrl = `${
										import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL
									}/${cleanPath}`;
									window.open(fullUrl, "_blank");
								}
							}}
							className="flex-1 h-[48px] text-[14px] font-medium flex items-center justify-center gap-2"
						>
							<span>View Invoice</span>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
								<polyline points="15,3 21,3 21,9" />
								<line x1="10" y1="14" x2="21" y2="3" />
							</svg>
						</Button>
					)}
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
				<Button
					type="button"
					variant="outline"
					onClick={onClose}
					className="flex-1 h-[48px] text-[14px] font-medium"
				>
					Close
				</Button>
			</div>

			{/* Success Stats */}
			<div className="grid grid-cols-3 gap-[16px] mt-[32px] max-w-[400px] w-full">
				<div className="text-center">
					<p className="text-[20px] font-bold text-gray-800">
						{productItems.length}
					</p>
					<p className="text-[12px] text-gray-500">
						Item{productItems.length !== 1 ? "s" : ""} Sold
					</p>
				</div>
				<div className="text-center">
					<p className="text-[16px] font-bold text-green-600">
						{formatNaira(saleData.totalAmount)}
					</p>
					<p className="text-[12px] text-gray-500">Revenue</p>
				</div>
				<div className="text-center">
					<p className="text-[14px] font-bold text-blue-600">
						{formatPaymentType(saleData.paymentType)}
					</p>
					<p className="text-[12px] text-gray-500">Payment</p>
				</div>
			</div>
		</div>
	);
};

export default SaleSuccess;
