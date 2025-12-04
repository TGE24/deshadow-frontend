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
					{/* Display attributes if available */}
					{formData.swapPhoneDetails?.selectedProduct?.attributes &&
						formData.swapPhoneDetails.selectedProduct.attributes.length > 0 &&
						formData.swapPhoneDetails.selectedProduct.attributes.map(
							(attribute) => {
								const value =
									formData.swapPhoneDetails.attributeValues?.[attribute.uuid];
								if (value) {
									return (
										<div
											key={attribute.uuid}
											className="flex justify-between items-center py-[6px] px-[8px] rounded-[4px]"
										>
											<span className="text-[14px] font-medium text-gray-700">
												{attribute.name}:
											</span>
											<span className="text-[14px] text-gray-800">{value}</span>
										</div>
									);
								}
								return null;
							}
						)}
				</div>
			</div>{" "}
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
									{/* Display product attributes if available */}
									{item.product?.attributes &&
										item.product.attributes.length > 0 && (
											<div className="mt-[8px] space-y-[4px]">
												{item.product.attributes.map((attribute) => {
													const value = item.attributeValues?.[attribute.uuid];
													if (value) {
														return (
															<p
																key={attribute.uuid}
																className="text-[11px] text-gray-600"
															>
																{attribute.name}: {value}
															</p>
														);
													}
													return null;
												})}
											</div>
										)}
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
						<span className="text-[14px]">Products Subtotal:</span>
						<span className="text-[14px] font-medium">
							{formatNaira(calculateSwapSubtotal(productItems))}
						</span>
					</div>
					{formData.discountAmount > 0 && (
						<div className="flex justify-between items-center py-[6px]">
							<span className="text-[14px]">Discount:</span>
							<span className="text-[14px] font-medium text-red-600">
								-{formatNaira(formData.discountAmount)}
							</span>
						</div>
					)}
					<div className="flex justify-between items-center py-[6px]">
						<span className="text-[14px]">Total Amount:</span>
						<span className="text-[14px] font-medium">
							{formatNaira(
								calculateSwapFinalTotal(productItems, formData.discountAmount)
							)}
						</span>
					</div>
					<div className="flex justify-between items-center py-[6px]">
						<span className="text-[14px]">Swap Phone Value:</span>
						<span className="text-[14px] font-medium text-red-600">
							-{formatNaira(formData.swapPhoneDetails.estimatedValue || 0)}
						</span>
					</div>
					<div className="border-t border-green-300 pt-[8px] mt-[8px]">
						<div className="flex justify-between items-center">
							<span className="text-[16px] font-semibold">Final Price:</span>
							<span className="text-[18px] font-bold text-green-700">
								{formatNaira(
									Math.max(
										0,
										calculateSwapFinalTotal(
											productItems,
											formData.discountAmount
										) - (formData.swapPhoneDetails.estimatedValue || 0)
									)
								)}
							</span>
						</div>
						<p className="text-[11px] text-gray-600 mt-[4px] text-right">
							Amount customer pays
						</p>
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
				<div className="bg-green-100 p-[12px] rounded-[6px] text-center border border-green-300">
					<p className="text-[16px] font-bold text-green-700">
						{formatNaira(
							Math.max(
								0,
								calculateSwapFinalTotal(productItems, formData.discountAmount) -
									(formData.swapPhoneDetails.estimatedValue || 0)
							)
						)}
					</p>
					<p className="text-[12px] text-gray-600">Final Price</p>
				</div>
			</div>
		</div>
	);
};

export default ReviewOrder;
