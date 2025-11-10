import { SwapProductItem, SwapSaleFormData } from "./types";
import { formatNaira } from "../../utils/formatters";
import {
	calculateSwapFinalTotal,
	calculateSwapSubtotal,
} from "../../utils/swapHelpers";
import { PaymentType, useBrandsQuery, Brand } from "../../generated/graphql";
import { phoneConditionOptions } from "./constants";

interface ReviewOrderProps {
	productItems: SwapProductItem[];
	formData: SwapSaleFormData;
}

const ReviewOrder = ({ productItems, formData }: ReviewOrderProps) => {
	// Fetch brands for formatting
	const { data: brands } = useBrandsQuery({
		variables: { pagination: { first: 100 } },
	});

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

	// Helper functions to format dropdown values
	const formatBrand = (value: string) => {
		const brand = brands?.brands.edges
			.map((edge) => edge.node as Brand)
			.find((brand) => brand.uuid === value);
		return brand ? brand.name : value;
	};

	const formatCondition = (value: string) => {
		const option = phoneConditionOptions.find((opt) => opt.value === value);
		return option ? option.label : value;
	};

	// const formatStorage = (value: string) => {
	// 	const option = storageOptions.find((opt) => opt.value === value);
	// 	return option ? option.label : value;
	// };

	return (
		<div className="flex flex-col gap-[24px] border border-gray-200 rounded-[10px] p-[20px]">
			<h3 className="text-[20px] font-semibold">Review Swap Order</h3>

			{/* Swap Phone Details Section */}
			<div className="p-[16px] rounded-[8px] bg-gray-50">
				<h4 className="font-semibold mb-[12px] text-[16px] text-orange-800">
					Swap Phone Details
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
					<div className="flex justify-between items-center py-[6px] px-[8px] rounded-[4px]">
						<span className="text-[14px] font-medium text-gray-700">
							Serial Number:
						</span>
						<span className="text-[14px] text-gray-800">
							{formData.swapPhoneDetails.serialNumber || "Not provided"}
						</span>
					</div>
					<div className="flex justify-between items-center py-[6px] px-[8px]">
						<span className="text-[14px] font-medium text-gray-700">
							Brand:
						</span>
						<span className="text-[14px] text-gray-800">
							{formatBrand(formData.swapPhoneDetails.brand) || "Not provided"}
						</span>
					</div>
					{/* <div className="flex justify-between items-center py-[6px] px-[8px] rounded-[4px]">
						<span className="text-[14px] font-medium text-gray-700">
							Model:
						</span>
						<span className="text-[14px] text-gray-800">
							{formData.swapPhoneDetails.model || "Not provided"}
						</span>
					</div> */}
					{/* <div className="flex justify-between items-center py-[6px] px-[8px]">
						<span className="text-[14px] font-medium text-gray-700">
							Color:
						</span>
						<span className="text-[14px] text-gray-800">
							{formData.swapPhoneDetails.color || "Not provided"}
						</span>
					</div> */}
					{/* <div className="flex justify-between items-center py-[6px] px-[8px] rounded-[4px]">
						<span className="text-[14px] font-medium text-gray-700">
							Storage:
						</span>
						<span className="text-[14px] text-gray-800">
							{formatStorage(formData.swapPhoneDetails.storage) ||
								"Not provided"}
						</span>
					</div> */}
					<div className="flex justify-between items-center py-[6px] px-[8px]">
						<span className="text-[14px] font-medium text-gray-700">
							Condition:
						</span>
						<span className="text-[14px] text-gray-800">
							{formatCondition(formData.swapPhoneDetails.condition) ||
								"Not provided"}
						</span>
					</div>
				</div>
			</div>

			{/* Products Section */}
			<div className="bg-gray-50 p-[16px] rounded-[8px]">
				<h4 className="font-semibold mb-[12px] text-[16px]">Products</h4>
				<div className="space-y-[8px]">
					{productItems.map((item, index) => (
						<div
							key={item.id}
							className="bg-white p-[12px] rounded-[6px] border border-gray-200"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<p className="font-medium text-[14px] text-gray-800">
										{item.productName || "Product not selected"}
									</p>
									<p className="text-[12px] text-gray-500 mt-[2px]">
										Product {index + 1}
									</p>
								</div>
								<div className="text-right">
									<p className="text-[14px] font-medium">
										{formatNaira(item.unitPrice)}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Customer Information Section */}
			<div className="bg-gray-50 p-[16px] rounded-[8px]">
				<h4 className="font-semibold mb-[12px] text-[16px]">
					Customer Information
				</h4>
				<div className="grid grid-cols-1 gap-[8px]">
					<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
						<span className="text-[14px] font-medium text-gray-700">Name:</span>
						<span className="text-[14px] text-gray-800">
							{formData.customerName || "Not provided"}
						</span>
					</div>
					<div className="flex justify-between items-center py-[6px] px-[8px]">
						<span className="text-[14px] font-medium text-gray-700">
							Email:
						</span>
						<span className="text-[14px] text-gray-800">
							{formData.customerEmail || "Not provided"}
						</span>
					</div>
					<div className="flex justify-between items-center py-[6px] px-[8px] bg-white rounded-[4px]">
						<span className="text-[14px] font-medium text-gray-700">
							Phone:
						</span>
						<span className="text-[14px] text-gray-800">
							{formData.customerPhone || "Not provided"}
						</span>
					</div>
					<div className="flex justify-between items-center py-[6px] px-[8px]">
						<span className="text-[14px] font-medium text-gray-700">
							Payment Type:
						</span>
						<span className="text-[14px] text-gray-800 font-medium">
							{formatPaymentType(formData.paymentType)}
						</span>
					</div>
				</div>
			</div>

			{/* Order Summary Section */}
			<div className="bg-[#e7f6f57a] p-[16px] rounded-[8px] border border-green-200">
				<h4 className="font-semibold mb-[12px] text-[16px]">Order Summary</h4>
				<div className="space-y-[8px]">
					<div className="flex justify-between items-center py-[6px]">
						<span className="text-[14px]">Subtotal:</span>
						<span className="text-[14px] font-medium">
							{formatNaira(calculateSwapSubtotal(productItems))}
						</span>
					</div>
					<div className="flex justify-between items-center py-[6px]">
						<span className="text-[14px]">Discount:</span>
						<span className="text-[14px] font-medium text-red-600">
							-{formatNaira(formData.discountAmount)}
						</span>
					</div>
					<div className="border-t border-green-200 pt-[8px]">
						<div className="flex justify-between items-center">
							<span className="text-[16px] font-semibold ">Total Amount:</span>
							<span className="text-[18px] font-bold">
								{formatNaira(
									calculateSwapFinalTotal(productItems, formData.discountAmount)
								)}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-2 gap-[12px]">
				<div className="bg-gray-100 p-[12px] rounded-[6px] text-center">
					<p className="text-[20px] font-bold text-gray-800">
						{productItems.length}
					</p>
					<p className="text-[12px] text-gray-600">
						Product{productItems.length !== 1 ? "s" : ""}
					</p>
				</div>
				<div className="bg-gray-100 p-[12px] rounded-[6px] text-center">
					<p className="text-[16px] font-bold text-gray-800">
						{formatNaira(
							calculateSwapFinalTotal(productItems, formData.discountAmount)
						)}
					</p>
					<p className="text-[12px] text-gray-600">Final Total</p>
				</div>
			</div>
		</div>
	);
};

export default ReviewOrder;
