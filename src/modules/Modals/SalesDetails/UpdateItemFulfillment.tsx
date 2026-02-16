import React, { useState } from "react";
import Modal from "react-responsive-modal";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import {
	SaleItem,
	SaleItemFulfillmentStatus,
	useUpdateSaleItemFulfillmentStatusMutation,
} from "../../../generated/graphql";

interface UpdateItemFulfillmentProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	saleItem: SaleItem;
	refetch?: () => void;
}

const UpdateItemFulfillment: React.FC<UpdateItemFulfillmentProps> = ({
	open,
	setOpen,
	saleItem,
	refetch,
}) => {
	const [selectedStatus, setSelectedStatus] =
		useState<SaleItemFulfillmentStatus>(saleItem.fulfillmentStatus);

	const [updateFulfillmentStatus, { loading }] =
		useUpdateSaleItemFulfillmentStatusMutation();

	const handleSubmit = async () => {
		try {
			await updateFulfillmentStatus({
				variables: {
					saleItemUuid: saleItem.uuid,
					status: selectedStatus,
				},
				onCompleted: () => {
					toast.success("Item fulfillment status updated successfully");
					refetch?.();
					setOpen(false);
				},
				onError: (error) => {
					toast.error(error.message || "Failed to update fulfillment status");
				},
			});
		} catch (error) {
			console.error("Error updating fulfillment status:", error);
			toast.error("Failed to update fulfillment status");
		}
	};

	const getStatusLabel = (status: SaleItemFulfillmentStatus) => {
		switch (status) {
			case SaleItemFulfillmentStatus.Pending:
				return "Pending";
			case SaleItemFulfillmentStatus.Delivered:
				return "Delivered";
			case SaleItemFulfillmentStatus.Returned:
				return "Returned";
			default:
				return status;
		}
	};

	const getStatusColor = (status: SaleItemFulfillmentStatus) => {
		switch (status) {
			case SaleItemFulfillmentStatus.Pending:
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case SaleItemFulfillmentStatus.Delivered:
				return "bg-green-100 text-green-800 border-green-200";
			case SaleItemFulfillmentStatus.Returned:
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal:
					"rounded-[12px] !px-[32px] !py-[24px] w-full !max-w-[500px] !m-0 shadow-2xl",
				overlay: "backdrop-blur-[8px] bg-black/30",
			}}
		>
			<div className="flex flex-col gap-[24px]">
				{/* Header */}
				<div className="flex items-center gap-[12px] pb-[16px] border-b border-gray-200">
					<div className="w-[48px] h-[48px] bg-gradient-to-br from-[#278783] to-[#1a5f5c] rounded-[12px] flex items-center justify-center shadow-lg">
						<svg
							className="w-[28px] h-[28px] text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div>
						<h2 className="text-[#1F2937] font-bold text-[22px]">
							Update Fulfillment Status
						</h2>
						<p className="text-[13px] text-gray-500">
							Change the fulfillment status for this item
						</p>
					</div>
				</div>

				{/* Item Details */}
				<div className="bg-gray-50 p-[16px] rounded-[8px] border border-gray-200">
					<h4 className="font-semibold mb-[8px] text-[14px] text-gray-700">
						Item Details
					</h4>
					<div className="space-y-[6px]">
						<p className="text-[14px] font-medium text-gray-900">
							{saleItem.product?.name || saleItem.accessory?.name || "Product"}
						</p>
						{saleItem.productItem?.serialNumber && (
							<p className="text-[12px] text-gray-600">
								Serial: {saleItem.productItem.serialNumber}
							</p>
						)}
						<p className="text-[12px] text-gray-600">
							Quantity: {saleItem.quantity}
						</p>
						{saleItem.productItem?.attributeValues &&
							saleItem.productItem.attributeValues.length > 0 && (
								<div className="mt-[8px]">
									<p className="text-[12px] font-medium text-gray-700 mb-[4px]">
										Attributes:
									</p>
									<div className="flex flex-wrap gap-[4px]">
										{saleItem.productItem.attributeValues.map(
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
								</div>
							)}
					</div>
				</div>

				{/* Status Selection */}
				<div>
					<label className="block text-[14px] font-bold text-[#1F2937] mb-[12px]">
						New Fulfillment Status <span className="text-red-500">*</span>
					</label>
					<div className="space-y-[12px]">
						{Object.values(SaleItemFulfillmentStatus)
							.filter((status) => status !== SaleItemFulfillmentStatus.Pending)
							.map((status) => (
								<label
									key={status}
									className={`flex items-center p-[16px] border-[2px] rounded-[10px] cursor-pointer transition-all ${
										selectedStatus === status
											? "border-[#278783] bg-[#278783]/5"
											: "border-gray-200 hover:border-[#278783]/30"
									}`}
								>
									<input
										type="radio"
										name="fulfillmentStatus"
										value={status}
										checked={selectedStatus === status}
										onChange={(e) =>
											setSelectedStatus(
												e.target.value as SaleItemFulfillmentStatus,
											)
										}
										className="w-[18px] h-[18px] text-[#278783] focus:ring-[#278783] cursor-pointer"
									/>
									<div className="ml-[12px] flex-1">
										<span className="text-[14px] font-medium text-gray-900">
											{getStatusLabel(status)}
										</span>
										<p className="text-[12px] text-gray-500 mt-[2px]">
											{status === SaleItemFulfillmentStatus.Delivered &&
												"Item has been delivered to customer"}
											{status === SaleItemFulfillmentStatus.Returned &&
												"Item has been returned by customer"}
										</p>
									</div>
									<span
										className={`px-[8px] py-[4px] rounded-[4px] text-[11px] font-medium border ${getStatusColor(
											status,
										)}`}
									>
										{getStatusLabel(status)}
									</span>
								</label>
							))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-[12px] pt-[16px] border-t border-gray-200">
					<Button
						type="button"
						variant="primary"
						onClick={handleSubmit}
						disabled={loading || selectedStatus === saleItem.fulfillmentStatus}
						className="flex items-center gap-2 w-full"
						size="large"
					>
						{loading ? (
							<>
								<svg
									className="animate-spin h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Updating...
							</>
						) : (
							"Update Status"
						)}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default UpdateItemFulfillment;
