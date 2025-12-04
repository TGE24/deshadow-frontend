import React from "react";
import { CreditSaleFormData } from "./types";
import { formatNaira } from "../../utils/formatters";
import { useProductQuery } from "../../generated/graphql";

interface ReviewOrderProps {
	formData: CreditSaleFormData;
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({ formData }) => {
	const attributeEntries = Object.entries(formData.attributeValues).filter(
		([, value]) => value
	);

	// Fetch product to resolve attribute UUID -> friendly name
	const { data: productData } = useProductQuery({
		variables: { uuid: formData.productUuid },
		skip: !formData.productUuid,
	});

	const productAttributes = productData?.product?.attributes || [];
	const attributeNameByUuid: Record<string, string> = {};
	productAttributes.forEach((attr) => {
		if (attr?.uuid) attributeNameByUuid[attr.uuid] = attr.name || attr.uuid;
	});

	return (
		<div className="space-y-[20px]">
			<h2 className="text-[24px] font-bold text-gray-900 mb-[24px]">
				Review & Confirm
			</h2>

			{/* Product Information */}
			<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
				<div className="flex items-center gap-[8px] mb-[12px]">
					<svg
						className="w-[18px] h-[18px] text-[#278783]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
					<label className="text-[14px] text-[#1F2937] font-bold">
						Product Information
					</label>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] text-[14px]">
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Serial Number:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.serialNumber}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Condition:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.condition
								?.replace(/_/g, " ")
								.replace(/\b\w/g, (l) => l.toUpperCase())}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Cost Price:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formatNaira(formData.costPrice)}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Selling Price:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formatNaira(formData.sellingPrice)}
						</p>
					</div>
				</div>
			</div>

			{/* External Store Details */}
			<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
				<div className="flex items-center gap-[8px] mb-[12px]">
					<svg
						className="w-[18px] h-[18px] text-[#278783]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/>
					</svg>
					<label className="text-[14px] text-[#1F2937] font-bold">
						External Store Details
					</label>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] text-[14px]">
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Store Name:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.externalStoreName}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Store Contact:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.externalStoreContact}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Store Address:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.externalStoreAddress}
						</p>
					</div>
				</div>
			</div>

			{/* Attributes */}
			{attributeEntries.length > 0 && (
				<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
					<div className="flex items-center gap-[8px] mb-[12px]">
						<svg
							className="w-[18px] h-[18px] text-[#278783]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<label className="text-[14px] text-[#1F2937] font-bold">
							Product Attributes
						</label>
						<span className="ml-auto text-[12px] text-gray-500 bg-white px-[10px] py-[4px] rounded-full">
							{attributeEntries.length} attribute
							{attributeEntries.length > 1 ? "s" : ""}
						</span>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] text-[14px]">
						{attributeEntries.map(([key, value], idx) => (
							<div
								key={`${key}-${idx}`}
								className="bg-white rounded-[8px] p-[12px]"
							>
								<span className="text-gray-500 font-medium">
									{attributeNameByUuid[key] || key}:
								</span>
								<p className="text-gray-900 font-semibold mt-[4px]">{value}</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Customer Information */}
			<div className="rounded-[12px] p-[16px] border-[2px] border-[#E5E7EB]">
				<div className="flex items-center gap-[8px] mb-[12px]">
					<svg
						className="w-[18px] h-[18px] text-[#278783]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
					<label className="text-[14px] text-[#1F2937] font-bold">
						Customer Information
					</label>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] text-[14px]">
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Customer Name:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.customerName}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Email:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.customerEmail}
						</p>
					</div>
					<div className="bg-white rounded-[8px] p-[12px]">
						<span className="text-gray-500 font-medium">Phone:</span>
						<p className="text-gray-900 font-semibold mt-[4px]">
							{formData.customerPhone}
						</p>
					</div>
				</div>
			</div>

			{/* Payment Summary */}
			<div className="rounded-[12px] p-[20px] border-[2px] border-[#E5E7EB] bg-gradient-to-r from-[#278783]/5 to-[#278783]/10">
				<div className="flex items-center gap-[8px] mb-[16px]">
					<svg
						className="w-[18px] h-[18px] text-[#278783]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						/>
					</svg>
					<label className="text-[14px] text-[#1F2937] font-bold">
						Payment Summary
					</label>
				</div>
				<div className="space-y-[12px]">
					<div className="flex justify-between items-center">
						<span className="text-[14px] text-[#1F2937] font-medium">
							Payment Type:
						</span>
						<span className="text-[14px] font-semibold text-gray-700">
							{formData.paymentType
								?.replace(/_/g, " ")
								.replace(/\b\w/g, (l) => l.toUpperCase())}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[14px] text-[#1F2937] font-medium">
							Sale Amount:
						</span>
						<span className="text-[16px] font-semibold text-gray-700">
							{formatNaira(formData.saleAmount)}
						</span>
					</div>
					{formData.discountAmount > 0 && (
						<div className="flex justify-between items-center">
							<span className="text-[14px] text-[#1F2937] font-medium">
								Discount:
							</span>
							<span className="text-[14px] font-semibold text-red-500">
								-{formatNaira(formData.discountAmount)}
							</span>
						</div>
					)}
					{formData.creditSaleType === "swap" &&
						formData.swapPhoneDetails.estimatedValue > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-[14px] text-[#1F2937] font-medium">
									Swap Value:
								</span>
								<span className="text-[14px] font-semibold text-green-600">
									-{formatNaira(formData.swapPhoneDetails.estimatedValue)}
								</span>
							</div>
						)}
					<div className="flex justify-between items-center pt-[12px] border-t-[2px] border-[#278783]/30">
						<span className="text-[16px] text-[#1F2937] font-bold">
							Total Amount:
						</span>
						<span className="text-[22px] font-bold text-[#278783]">
							{formatNaira(formData.totalAmount)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewOrder;
