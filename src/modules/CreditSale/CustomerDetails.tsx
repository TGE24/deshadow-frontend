import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { CreditSaleFormData } from "./types";
import {
	PaymentType,
	ProductCondition,
	useProductsQuery,
	Product,
	SaleType,
} from "../../generated/graphql";
import { formatNaira } from "../../utils/formatters";

interface CustomerDetailsProps {
	register: UseFormRegister<CreditSaleFormData>;
	setValue: UseFormSetValue<CreditSaleFormData>;
	watch: UseFormWatch<CreditSaleFormData>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
	register,
	setValue,
	watch,
}) => {
	const [estimatedValueDisplay, setEstimatedValueDisplay] = useState("");
	const [discountAmountDisplay, setDiscountAmountDisplay] = useState("");
	const formData = watch();

	const { data: productsData } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	const saleTypeOptions = [
		{ value: "direct" as SaleType.Direct, label: "Direct Sale" },
		{ value: "swap" as SaleType.Swap, label: "Swap Sale" },
	];

	const paymentTypeOptions = [
		{ value: PaymentType.Cash, label: "Cash" },
		{ value: PaymentType.Transfer, label: "Transfer" },
		{ value: PaymentType.Pos, label: "POS" },
		{ value: PaymentType.CashTransfer, label: "Cash + Transfer" },
		{ value: PaymentType.PosCash, label: "POS + Cash" },
		{ value: PaymentType.PosTransfer, label: "POS + Transfer" },
	];

	const conditionOptions = Object.values(ProductCondition).map((cond) => ({
		value: cond,
		label: cond
			.replace("_", " ")
			.toLowerCase()
			.replace(/\b\w/g, (c) => c.toUpperCase()),
	}));

	// Product options for swap phone
	const swapProductOptions = productsData?.products.edges
		.filter((edge) => edge.node.__typename === "Product")
		.map((edge) => {
			const product = edge.node as Product;
			return {
				value: product.uuid,
				label: product.name,
				product,
			};
		});

	const selectStyles = {
		control: () =>
			"h-[50px] !rounded-[10px] !border-[#E5E7EB] border-[2px] cursor-pointer outline-none focus:outline-none text-[14px]",
		container: () => "w-full",
		indicatorSeparator: () => "hidden",
	};

	const extractNumericValue = (formattedValue: string) => {
		return formattedValue.replace(/[^\d.]/g, "");
	};

	// Keep saleAmount in sync with sellingPrice (Amount is the product's selling price)
	React.useEffect(() => {
		setValue("saleAmount", formData.sellingPrice || 0);
	}, [formData.sellingPrice, setValue]);

	const handleDiscountAmountChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		const discount = parseFloat(numericValue) || 0;
		setValue("discountAmount", discount);
		setDiscountAmountDisplay(numericValue ? formatNaira(discount) : "");
	};

	const handleEstimatedValueChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		const estimatedValue = parseFloat(numericValue) || 0;
		setValue("swapPhoneDetails.estimatedValue", estimatedValue);
		setEstimatedValueDisplay(numericValue ? formatNaira(estimatedValue) : "");
	};

	// Update total amount when sale amount, discount, or swap value changes
	useEffect(() => {
		let total = formData.saleAmount - (formData.discountAmount || 0);

		// If swap sale, subtract swap value from total
		if (formData.creditSaleType === "swap") {
			const swapValue = formData.swapPhoneDetails.estimatedValue || 0;
			total = total - swapValue;
		}

		setValue("totalAmount", Math.max(0, total));
	}, [
		formData.creditSaleType,
		formData.saleAmount,
		formData.discountAmount,
		formData.swapPhoneDetails.estimatedValue,
		setValue,
	]);

	return (
		<div className="space-y-[20px]">
			{/* Sale Type Selection */}
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
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					<label className="text-[14px] text-[#1F2937] font-bold">
						Sale Type <span className="text-red-500">*</span>
					</label>
				</div>
				<Select
					options={saleTypeOptions}
					placeholder="Select sale type"
					classNames={selectStyles}
					value={
						saleTypeOptions.find(
							(opt) => opt.value === formData.creditSaleType
						) || null
					}
					onChange={(option) => {
						if (option) {
							setValue("creditSaleType", option.value);
						}
					}}
				/>
			</div>

			{/* Swap Phone Details - only show if swap sale */}
			{formData.creditSaleType === "swap" && (
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
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
						<label className="text-[14px] text-[#1F2937] font-bold">
							Swap Phone Details
						</label>
					</div>
					<div className="space-y-[12px]">
						<div>
							<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
								Select Swap Product
							</label>
							<Select
								options={swapProductOptions}
								placeholder="Choose swap product"
								classNames={selectStyles}
								onChange={(option) => {
									if (option) {
										const product = option.product as Product;
										setValue("swapPhoneDetails.selectedProduct", product);
										setValue(
											"swapPhoneDetails.brand",
											product.brand?.uuid || ""
										);
									}
								}}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
							<div>
								<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
									Serial Number
								</label>
								<input
									type="text"
									placeholder="Enter serial number"
									{...register("swapPhoneDetails.serialNumber")}
									className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
								/>
							</div>
							<div>
								<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
									Condition
								</label>
								<Select
									options={conditionOptions}
									placeholder="Select condition"
									classNames={selectStyles}
									onChange={(option) => {
										if (option) {
											setValue("swapPhoneDetails.condition", option.value);
										}
									}}
								/>
							</div>
							<div>
								<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
									Estimated Value
								</label>
								<div className="relative">
									<span className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#278783] font-bold text-[16px]">
										₦
									</span>
									<input
										type="text"
										placeholder="0.00"
										value={estimatedValueDisplay}
										onChange={(e) => handleEstimatedValueChange(e.target.value)}
										className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] pl-[36px] pr-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] font-medium transition-all"
									/>
								</div>
							</div>
						</div>

						{/* Attributes for selected swap product */}
						{formData.swapPhoneDetails?.selectedProduct?.attributes &&
							formData.swapPhoneDetails.selectedProduct.attributes.length >
								0 && (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mt-[12px]">
									{formData.swapPhoneDetails.selectedProduct.attributes.map(
										(attribute) => (
											<div key={attribute.uuid}>
												<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
													{attribute.name}
												</label>
												<input
													type="text"
													placeholder={`Enter ${attribute.name.toLowerCase()}`}
													{...register(
														`swapPhoneDetails.attributeValues.${attribute.uuid}` as const
													)}
													className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
												/>
											</div>
										)
									)}
								</div>
							)}
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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Customer Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							placeholder="Enter customer name"
							{...register("customerName")}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
						/>
					</div>
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Customer Email <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							placeholder="customer@example.com"
							{...register("customerEmail")}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
						/>
					</div>
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Customer Phone <span className="text-red-500">*</span>
						</label>
						<input
							type="tel"
							placeholder="Enter phone number"
							{...register("customerPhone")}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
						/>
					</div>
				</div>
			</div>

			{/* Payment Details */}
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
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						/>
					</svg>
					<label className="text-[14px] text-[#1F2937] font-bold">
						Payment Details
					</label>
				</div>
				<div className="space-y-[16px]">
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Payment Type <span className="text-red-500">*</span>
						</label>
						<Select
							options={paymentTypeOptions}
							placeholder="Select payment type"
							classNames={selectStyles}
							onChange={(option) => {
								if (option) {
									setValue("paymentType", option.value);
								}
							}}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
						<div>
							<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
								Amount (Selling Price)
							</label>
							<div className="relative">
								<span className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#278783] font-bold text-[16px]">
									₦
								</span>
								<div className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] pl-[36px] pr-[14px] flex items-center text-[14px] font-medium">
									{formatNaira(formData.sellingPrice)}
								</div>
							</div>
						</div>
						<div>
							<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
								Discount (Optional)
							</label>
							<div className="relative">
								<span className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#278783] font-bold text-[16px]">
									₦
								</span>
								<input
									type="text"
									placeholder="0.00"
									value={discountAmountDisplay}
									onChange={(e) => handleDiscountAmountChange(e.target.value)}
									className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] pl-[36px] pr-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] font-medium transition-all"
								/>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-r from-[#278783]/5 to-[#278783]/10 rounded-[10px] p-[16px] border-[2px] border-[#278783]/20">
						<div className="flex justify-between items-center">
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
		</div>
	);
};

export default CustomerDetails;
