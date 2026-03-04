import React, { useState } from "react";
import Modal from "react-responsive-modal";
import {
	Sale,
	PaymentType,
	SaleType,
	SaleStatus,
	SaleItem,
} from "../../../generated/graphql";
import { formatNaira, formatDateTime } from "../../../utils/formatters";
import Button from "../../../components/Button";
import UpdateStatus from "./UpdateStatus";
import UpdateItemFulfillment from "./UpdateItemFulfillment";

interface ViewSaleProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	sale: Sale;
	refetch?: () => void;
}

const ViewSale: React.FC<ViewSaleProps> = ({
	open,
	setOpen,
	sale,
	refetch,
}) => {
	const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
	const [updateItemFulfillmentOpen, setUpdateItemFulfillmentOpen] =
		useState(false);
	const [selectedSaleItem, setSelectedSaleItem] = useState<SaleItem | null>(
		null,
	);
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
				return "Unknown";
		}
	};

	// Helper function to get status styles
	const getStatusStyles = (status: SaleStatus) => {
		switch (status?.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border-red-200";
			case "returned":
				return "bg-purple-100 text-purple-800 border-purple-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const isCreditPending =
		sale?.saleType === SaleType.Credit &&
		sale?.saleStatus === SaleStatus.Pending;

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
								Sale Details
							</h2>
							<p className="text-[14px] text-gray-500 mt-[4px]">
								Invoice ID:{" "}
								{sale?.invoices?.length > 0
									? sale?.invoices[0]?.invoiceNumber
									: "N/A"}
							</p>
						</div>
						<div className="flex items-center gap-[8px]">
							<span
								className={`px-[8px] py-[4px] rounded-[4px] text-[12px] font-medium border ${getStatusStyles(
									sale?.saleStatus,
								)}`}
							>
								{sale?.saleStatus?.charAt(0).toUpperCase() +
									sale?.saleStatus?.slice(1)}
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

					{/* Sale Information */}
					<div className="bg-gray-50 p-[16px] rounded-[8px]">
						<h4 className="font-semibold mb-[12px] text-[16px]">
							Sale Information
						</h4>
						<div className="grid grid-cols-2 gap-[12px]">
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Type:
								</span>
								<span className="text-[14px] text-gray-800">
									{formatSaleType(sale?.saleType)}
								</span>
							</div>
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Payment:
								</span>
								<span className="text-[14px] text-gray-800">
									{formatPaymentType(sale?.paymentType)}
								</span>
							</div>
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Date:
								</span>
								<span className="text-[14px] text-gray-800">
									{formatDateTime(sale?.saleDate)}
								</span>
							</div>
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Store:
								</span>
								<span className="text-[14px] text-gray-800">
									{sale?.store?.name || "N/A"}
								</span>
							</div>
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px] col-span-2">
								<span className="text-[14px] font-medium text-gray-700">
									Created By:
								</span>
								<span className="text-[14px] text-gray-800">
									{sale?.createdBy
										? `${sale?.createdBy.firstName} ${sale?.createdBy.lastName}${
												sale?.createdBy.role
													? ` (${sale?.createdBy.role
															.replace("_", " ")
															.toLocaleUpperCase()})`
													: ""
											}`
										: "N/A"}
								</span>
							</div>
						</div>
					</div>

					{/* Customer Information */}
					<div className="bg-gray-50 p-[16px] rounded-[8px]">
						<h4 className="font-semibold mb-[12px] text-[16px]">
							Customer Information
						</h4>
						<div className="grid grid-cols-1 gap-[8px]">
							<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
								<span className="text-[14px] font-medium text-gray-700">
									Name:
								</span>
								<span className="text-[14px] text-gray-800">
									{sale?.customerName || "Not provided"}
								</span>
							</div>
							{sale?.customerEmail && (
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Email:
									</span>
									<span className="text-[14px] text-gray-800">
										{sale.customerEmail}
									</span>
								</div>
							)}
							{sale?.customerPhone && (
								<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
									<span className="text-[14px] font-medium text-gray-700">
										Phone:
									</span>
									<span className="text-[14px] text-gray-800">
										{sale.customerPhone}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Products Section */}
					<div className="bg-gray-50 p-[16px] rounded-[8px]">
						<h4 className="font-semibold mb-[12px] text-[16px]">Products</h4>
						<div className="space-y-[8px]">
							{sale?.items
								?.filter(
									(item) =>
										item.productItem?.status !== "available" ||
										!item.productItem,
								)
								.map((item, index) => {
									const isCredit = sale.saleType === SaleType.Credit;
									const hasMultipleItems = (sale.items?.length || 0) > 1;
									const isSalePending = sale.saleStatus === SaleStatus.Pending;
									const isClickable =
										isCredit && hasMultipleItems && isSalePending;

									const getItemStatusColor = (status: string) => {
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

									return (
										<div
											key={item.uuid}
											className={`bg-white p-[12px] rounded-[6px] border ${
												isClickable
													? "border-[#278783] cursor-pointer hover:shadow-md hover:border-[#278783] transition-all"
													: "border-gray-200"
											}`}
											onClick={() => {
												if (isClickable) {
													setSelectedSaleItem(item);
													setUpdateItemFulfillmentOpen(true);
												}
											}}
										>
											<div className="flex justify-between items-start">
												<div className="flex-1">
													{" "}
													{isClickable && (
														<div className="flex items-center gap-[8px] mb-[8px]">
															<span
																className={`px-[6px] py-[2px] rounded-[4px] text-[10px] font-medium border ${getItemStatusColor(
																	item.fulfillmentStatus,
																)}`}
															>
																{item.fulfillmentStatus?.toUpperCase()}
															</span>
															<span className="text-[10px] text-[#278783] font-medium flex items-center gap-[2px]">
																<svg
																	className="w-[12px] h-[12px]"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
																	/>
																</svg>
																Click to update
															</span>
														</div>
													)}{" "}
													<p className="font-medium text-[14px] text-gray-800">
														{item.product?.name ||
															item.accessory?.name ||
															"Product not available"}
													</p>
													<p className="text-[12px] text-gray-500 mt-[2px]">
														{item.productItem?.serialNumber
															? `Serial: ${item.productItem.serialNumber}`
															: item.accessory
																? `Accessory`
																: `Item ${index + 1}`}
													</p>
													{item.productItem?.status && (
														<p className="text-[12px] text-gray-500">
															Item Status:{" "}
															<span
																className={`inline-block px-[6px] py-[2px] rounded-[4px] text-[10px] font-medium uppercase ${
																	item.productItem.status === "available"
																		? "bg-green-100 text-green-800"
																		: item.productItem.status === "sold"
																			? "bg-red-100 text-red-800"
																			: item.productItem.status === "reserved"
																				? "bg-blue-100 text-blue-800"
																				: item.productItem.status === "returned"
																					? "bg-yellow-100 text-yellow-800"
																					: item.productItem.status ===
																						  "damaged"
																						? "bg-gray-100 text-gray-800"
																						: "bg-gray-100 text-gray-800"
																}`}
															>
																{item.productItem.status.replace("_", " ")}
															</span>
														</p>
													)}
													<p className="text-[12px] text-gray-500">
														Quantity: {item.quantity}
													</p>{" "}
													{item.productItem?.attributeValues &&
														item.productItem.attributeValues.length > 0 && (
															<div className="mt-[6px] flex flex-wrap gap-[4px]">
																{item.productItem.attributeValues.map(
																	(attrValue, index) => (
																		<span
																			key={index}
																			className="inline-flex items-center gap-[4px] bg-gray-100 text-gray-700 text-[11px] px-[6px] py-[2px] rounded-[4px]"
																		>
																			<span className="font-medium">
																				{attrValue.attribute?.name}:
																			</span>
																			<span>{attrValue.valueText}</span>
																		</span>
																	),
																)}
															</div>
														)}{" "}
												</div>
												<div className="text-right">
													<p className="text-[14px] font-medium">
														{formatNaira(item.unitPrice)}
													</p>
													<p className="text-[12px] text-gray-500">
														Total: {formatNaira(item.lineTotal)}
													</p>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>

					{/* Order Summary */}
					<div className="bg-[#e7f6f57a] p-[16px] rounded-[8px] border border-green-200">
						<h4 className="font-semibold mb-[12px] text-[16px]">
							Order Summary
						</h4>
						<div className="space-y-[8px]">
							<div className="flex justify-between items-center py-[6px]">
								<span className="text-[14px]">Subtotal:</span>
								<span className="text-[14px] font-medium">
									{formatNaira(
										(sale?.totalAmount || 0) + (sale?.discountAmount || 0),
									)}
								</span>
							</div>
							{sale?.discountAmount > 0 && (
								<div className="flex justify-between items-center py-[6px]">
									<span className="text-[14px]">Discount:</span>
									<span className="text-[14px] font-medium text-red-600">
										-{formatNaira(sale?.discountAmount)}
									</span>
								</div>
							)}
							<div className="border-t border-green-200 pt-[8px]">
								<div className="flex justify-between items-center">
									<span className="text-[16px] font-semibold">
										Total Amount:
									</span>
									<span className="text-[18px] font-bold">
										{formatNaira(sale?.totalAmount)}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Notes Section */}
					{sale?.notes && (
						<div className="bg-gray-50 p-[16px] rounded-[8px]">
							<h4 className="font-semibold mb-[12px] text-[16px]">Notes</h4>
							<p className="text-[14px] text-gray-700 whitespace-pre-wrap">
								{sale?.notes}
							</p>
						</div>
					)}

					{/* Summary Stats */}
					<div className="grid grid-cols-3 gap-[12px]">
						<div className="bg-gray-100 p-[12px] rounded-[6px] text-center">
							<p className="text-[20px] font-bold text-gray-800">
								{sale?.items?.length || 0}
							</p>
							<p className="text-[12px] text-gray-600">
								Product{(sale?.items?.length || 0) !== 1 ? "s" : ""}
							</p>
						</div>
						<div className="bg-gray-100 p-[12px] rounded-[6px] text-center">
							<p className="text-[16px] font-bold text-gray-800">
								{formatNaira(sale?.totalAmount)}
							</p>
							<p className="text-[12px] text-gray-600">Total Amount</p>
						</div>
						<div className="bg-gray-100 p-[12px] rounded-[6px] text-center">
							<p className="text-[14px] font-bold text-gray-800">
								{formatDateTime(sale?.createdAt)}
							</p>
							<p className="text-[12px] text-gray-600">Created</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-[12px] pt-[16px] border-t border-gray-200">
						{sale?.invoices?.length > 0 &&
							sale.invoices[0]?.filePath &&
							!isCreditPending && (
								<Button
									type="button"
									variant="primary"
									onClick={() => {
										const invoiceFilePath = sale.invoices[0]?.filePath;
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
									className="flex items-center gap-2 p-2.5"
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
						{isCreditPending && (
							<Button
								type="button"
								variant="primary"
								className="flex items-center gap-2 p-2.5"
								onClick={() => setUpdateStatusOpen(true)}
							>
								Update Sale
							</Button>
						)}
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
			<UpdateStatus
				open={updateStatusOpen}
				setOpen={setUpdateStatusOpen}
				sale={sale}
				refetch={refetch || (() => {})}
				setDetailsOpen={setOpen}
			/>
			{selectedSaleItem && (
				<UpdateItemFulfillment
					open={updateItemFulfillmentOpen}
					setOpen={setUpdateItemFulfillmentOpen}
					saleItem={selectedSaleItem}
					refetch={refetch}
				/>
			)}
		</>
	);
};

export default ViewSale;
