import React from "react";
import Button from "../../components/Button";
import { formatNaira } from "../../utils/formatters";

interface CreditSaleSuccessProps {
	serialNumber: string;
	customerName: string;
	totalAmount: number;
	onNewSale: () => void;
	onClose: () => void;
}

const CreditSaleSuccess: React.FC<CreditSaleSuccessProps> = ({
	serialNumber,
	customerName,
	totalAmount,
	onNewSale,
	onClose,
}) => {
	return (
		<div className="flex flex-col items-center justify-center py-[40px] px-[20px]">
			{/* Success Icon */}
			<div className="w-[100px] h-[100px] bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-[24px] animate-pulse">
				<svg
					className="w-[60px] h-[60px] text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={3}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>

			{/* Success Message */}
			<h2 className="text-[28px] font-bold text-gray-900 mb-[12px] text-center">
				Credit Sale Successful!
			</h2>
			<p className="text-[16px] text-gray-600 mb-[32px] text-center max-w-[500px]">
				The credit sale has been recorded successfully. The customer can now
				make payments for the remaining balance.
			</p>

			{/* Sale Summary */}
			<div className="w-full max-w-[500px] rounded-[12px] border-[2px] border-[#E5E7EB] p-[24px] mb-[32px]">
				<div className="space-y-[16px]">
					<div className="flex justify-between items-center pb-[12px] border-b border-gray-200">
						<span className="text-[14px] text-gray-600">Serial Number:</span>
						<span className="text-[16px] font-bold text-gray-900">
							{serialNumber}
						</span>
					</div>
					<div className="flex justify-between items-center pb-[12px] border-b border-gray-200">
						<span className="text-[14px] text-gray-600">Customer:</span>
						<span className="text-[16px] font-bold text-gray-900">
							{customerName}
						</span>
					</div>
					<div className="flex justify-between items-center pb-[12px] border-b border-gray-200">
						<span className="text-[14px] text-gray-600">Total Amount:</span>
						<span className="text-[18px] font-bold text-[#278783]">
							{formatNaira(totalAmount)}
						</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-[12px] w-full max-w-[500px]">
				<Button variant="secondary" onClick={onNewSale} className="flex-1">
					New Sale
				</Button>
				<Button onClick={onClose} className="flex-1">
					Close
				</Button>
			</div>
		</div>
	);
};

export default CreditSaleSuccess;
