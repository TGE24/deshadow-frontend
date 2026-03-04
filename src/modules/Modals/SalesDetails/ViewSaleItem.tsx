import React from "react";
import Modal from "react-responsive-modal";
import {
	SaleItem,
	SaleItemFulfillmentStatus,
} from "../../../generated/graphql";
import { formatNaira, formatDateTime } from "../../../utils/formatters";
import Button from "../../../components/Button";

interface ViewSaleItemProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	saleItem: SaleItem;
}

const ViewSaleItem: React.FC<ViewSaleItemProps> = ({
	open,
	setOpen,
	saleItem,
}) => {
	// Helper function to get status styles
	const getStatusStyles = (status: SaleItemFulfillmentStatus) => {
		switch (status?.toLowerCase()) {
			case "delivered":
				return "bg-green-100 text-green-800 border-green-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "returned":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getProductItemStatusStyles = (status: string) => {
		switch (status?.toLowerCase()) {
			case "available":
				return "bg-green-100 text-green-800";
			case "sold":
				return "bg-red-100 text-red-800";
			case "reserved":
				return "bg-blue-100 text-blue-800";
			case "returned":
				return "bg-yellow-100 text-yellow-800";
			case "damaged":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				center
				classNames={{
					modal:
						"rounded-[10px] !md:px-[40px] !md:py-[48px] w-full !max-w-[700px]",
					overlay: "backdrop-blur-[6px]",
				}}
				closeIcon={<></>}
			>
				<div className="flex flex-col gap-[24px]">
					{/* Header */}
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-[24px] font-bold text-gray-900">
								Sale Item Details
							</h2>
							<p className="text-[14px] text-gray-500 mt-[4px]">
								Item ID: {saleItem?.uuid?.substring(0, 8) || "N/A"}
							</p>
						</div>
						<div className="flex items-center gap-[8px]">
							<span
								className={`px-[8px] py-[4px] rounded-[4px] text-[12px] font-medium border ${getStatusStyles(
									saleItem?.fulfillmentStatus,
								)}`}
							>
								{saleItem?.fulfillmentStatus?.charAt(0).toUpperCase() +
									saleItem?.fulfillmentStatus?.slice(1)}
							</span>
							<Button
								type="button"
								variant="transparent"
								onClick={() => setOpen(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								✕
							</Button>
						</div>
					</div>

					{/* Product Information */}
					<div className="bg-gray-50 p-[16px] rounded-[8px]">
						<h4 className="font-semibold mb-[12px] text-[16px]">
							Product Information
						</h4>
						<div className="grid grid-cols-1 gap-[8px]">
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Product Name:
								</span>
								<span className="text-[14px] text-gray-800">
									{saleItem?.product?.name ||
										saleItem?.productItem?.product?.name ||
										saleItem?.accessory?.name ||
										"N/A"}
								</span>
							</div>
							{saleItem?.productItem?.serialNumber && (
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Serial Number:
									</span>
									<span className="text-[14px] text-gray-800 font-mono">
										{saleItem.productItem.serialNumber}
									</span>
								</div>
							)}
							{saleItem?.product?.brand && (
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Brand:
									</span>
									<span className="text-[14px] text-gray-800">
										{saleItem.product.brand.name}
									</span>
								</div>
							)}
							{saleItem?.product?.category && (
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Category:
									</span>
									<span className="text-[14px] text-gray-800">
										{saleItem.product.category.name}
									</span>
								</div>
							)}
							{saleItem?.productItem?.status && (
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Item Status:
									</span>
									<span
										className={`px-[6px] py-[2px] rounded-[4px] text-[12px] font-medium uppercase ${getProductItemStatusStyles(
											saleItem.productItem.status,
										)}`}
									>
										{saleItem.productItem.status.replace("_", " ")}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Attributes Section */}
					{saleItem?.productItem?.attributeValues &&
						saleItem.productItem.attributeValues.length > 0 && (
							<div className="bg-gray-50 p-[16px] rounded-[8px]">
								<h4 className="font-semibold mb-[12px] text-[16px]">
									Product Attributes
								</h4>
								<div className="flex flex-wrap gap-[8px]">
									{saleItem.productItem.attributeValues.map(
										(attrValue, index) => (
											<div
												key={index}
												className="bg-white px-[12px] py-[8px] rounded-[6px] border border-gray-200"
											>
												<span className="text-[12px] font-medium text-gray-700">
													{attrValue.attribute?.name}:
												</span>{" "}
												<span className="text-[14px] text-gray-900">
													{attrValue.valueText}
												</span>
											</div>
										),
									)}
								</div>
							</div>
						)}

					{/* Pricing Information */}
					<div className="bg-gray-50 p-[16px] rounded-[8px]">
						<h4 className="font-semibold mb-[12px] text-[16px]">
							Pricing Information
						</h4>
						<div className="grid grid-cols-2 gap-[12px]">
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Unit Price:
								</span>
								<span className="text-[14px] text-gray-800 font-semibold">
									{formatNaira(saleItem?.unitPrice)}
								</span>
							</div>
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Quantity:
								</span>
								<span className="text-[14px] text-gray-800">
									{saleItem?.quantity}
								</span>
							</div>
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px] col-span-2">
								<span className="text-[14px] font-medium text-gray-700">
									Line Total:
								</span>
								<span className="text-[16px] text-gray-800 font-bold">
									{formatNaira(saleItem?.lineTotal)}
								</span>
							</div>
						</div>
					</div>

					{/* Sale Information */}
					{saleItem?.sale && (
						<div className="bg-gray-50 p-[16px] rounded-[8px]">
							<h4 className="font-semibold mb-[12px] text-[16px]">
								Sale Information
							</h4>
							<div className="grid grid-cols-1 gap-[8px]">
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Customer Name:
									</span>
									<span className="text-[14px] text-gray-800">
										{saleItem.sale.customerName || "N/A"}
									</span>
								</div>
								{saleItem.sale.customerPhone && (
									<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
										<span className="text-[14px] font-medium text-gray-700">
											Customer Phone:
										</span>
										<span className="text-[14px] text-gray-800">
											{saleItem.sale.customerPhone}
										</span>
									</div>
								)}
								{saleItem.sale.customerEmail && (
									<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
										<span className="text-[14px] font-medium text-gray-700">
											Customer Email:
										</span>
										<span className="text-[14px] text-gray-800">
											{saleItem.sale.customerEmail}
										</span>
									</div>
								)}
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Sale Date:
									</span>
									<span className="text-[14px] text-gray-800">
										{formatDateTime(saleItem.sale.saleDate)}
									</span>
								</div>
								{saleItem.sale.store && (
									<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
										<span className="text-[14px] font-medium text-gray-700">
											Store:
										</span>
										<span className="text-[14px] text-gray-800">
											{saleItem.sale.store.name}
										</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* External Store Information */}
					{saleItem?.productItem?.externalStoreName && (
						<div className="bg-blue-50 p-[16px] rounded-[8px] border border-blue-200">
							<h4 className="font-semibold mb-[12px] text-[16px]">
								External Store Information
							</h4>
							<div className="grid grid-cols-1 gap-[8px]">
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Store Name:
									</span>
									<span className="text-[14px] text-gray-800">
										{saleItem.productItem.externalStoreName}
									</span>
								</div>
								{saleItem.productItem.externalStoreContact && (
									<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
										<span className="text-[14px] font-medium text-gray-700">
											Contact:
										</span>
										<span className="text-[14px] text-gray-800">
											{saleItem.productItem.externalStoreContact}
										</span>
									</div>
								)}
								{saleItem.productItem.externalStoreAddress && (
									<div className="py-[6px] px-[8px] bg-white rounded-[4px]">
										<span className="text-[14px] font-medium text-gray-700 block mb-1">
											Address:
										</span>
										<p className="text-[14px] text-gray-800">
											{saleItem.productItem.externalStoreAddress}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Timestamps */}
					<div className="grid grid-cols-2 gap-[12px]">
						<div className="bg-gray-100 p-[12px] rounded-[6px]">
							<p className="text-[12px] text-gray-600 mb-1">Created At</p>
							<p className="text-[14px] font-semibold text-gray-800">
								{formatDateTime(saleItem?.createdAt)}
							</p>
						</div>
						<div className="bg-gray-100 p-[12px] rounded-[6px]">
							<p className="text-[12px] text-gray-600 mb-1">Updated At</p>
							<p className="text-[14px] font-semibold text-gray-800">
								{formatDateTime(saleItem?.updatedAt)}
							</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-[12px] pt-[16px] border-t border-gray-200">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setOpen(false)}
						>
							Close
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ViewSaleItem;
