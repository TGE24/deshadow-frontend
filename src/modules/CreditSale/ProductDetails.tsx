import React, { useState } from "react";
import Select from "react-select";
import {
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { CreditSaleFormData } from "./types";
import {
	Product,
	ProductCondition,
	useProductsQuery,
} from "../../generated/graphql";
import { formatNaira } from "../../utils/formatters";

interface ProductDetailsProps {
	register: UseFormRegister<CreditSaleFormData>;
	setValue: UseFormSetValue<CreditSaleFormData>;
	watch: UseFormWatch<CreditSaleFormData>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
	register,
	setValue,
	watch,
}) => {
	const { data: productsData } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [costPriceDisplay, setCostPriceDisplay] = useState("");
	const [sellingPriceDisplay, setSellingPriceDisplay] = useState("");

	const formData = watch();

	// Product options for select
	const productOptions = productsData?.products.edges
		.filter((edge) => edge.node.__typename === "Product")
		.map((edge) => {
			const product = edge.node as Product;
			return {
				value: product.uuid,
				label: product.name,
				product,
			};
		});

	// Condition options
	const conditionOptions = [
		{ value: ProductCondition.New, label: "New" },
		{ value: ProductCondition.FairlyUsed, label: "Fairly Used" },
		{ value: ProductCondition.Refurbished, label: "Refurbished" },
	];

	const selectStyles = {
		control: () =>
			"h-[50px] !rounded-[10px] !border-[#E5E7EB] border-[2px] cursor-pointer outline-none focus:outline-none text-[14px]",
		container: () => "w-full",
		indicatorSeparator: () => "hidden",
	};

	const extractNumericValue = (formattedValue: string) => {
		return formattedValue.replace(/[^\d.]/g, "");
	};

	const handleCostPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("costPrice", parseFloat(numericValue) || 0);
		setCostPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : ""
		);
	};

	const handleSellingPriceChange = (value: string) => {
		const numericValue = extractNumericValue(value);
		setValue("sellingPrice", parseFloat(numericValue) || 0);
		setSellingPriceDisplay(
			numericValue ? formatNaira(parseFloat(numericValue)) : ""
		);
	};

	return (
		<div className="space-y-[20px]">
			<h2 className="text-[16px] font-bold text-gray-900 mb-[24px]">
				Product Details
			</h2>

			{/* Product Selection */}
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
						Select Product <span className="text-red-500">*</span>
					</label>
				</div>
				<Select
					options={productOptions}
					placeholder="Choose a product"
					classNames={selectStyles}
					onChange={(option) => {
						if (option) {
							setValue("productUuid", option.value);
							setSelectedProduct(option.product);
						}
					}}
				/>
			</div>

			{/* Serial Number & Condition */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
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
								d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
							/>
						</svg>
						<label className="text-[14px] text-[#1F2937] font-bold">
							Serial Number <span className="text-red-500">*</span>
						</label>
					</div>
					<input
						type="text"
						placeholder="Enter serial number"
						{...register("serialNumber")}
						className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
					/>
				</div>

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
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<label className="text-[14px] text-[#1F2937] font-bold">
							Condition <span className="text-red-500">*</span>
						</label>
					</div>
					<Select
						options={conditionOptions}
						placeholder="Select condition"
						classNames={selectStyles}
						onChange={(option) => {
							if (option) {
								setValue("condition", option.value);
							}
						}}
					/>
				</div>
			</div>

			{/* Pricing */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
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
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<label className="text-[14px] text-[#1F2937] font-bold">
							Cost Price <span className="text-red-500">*</span>
						</label>
					</div>
					<div className="relative">
						<span className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#278783] font-bold text-[16px]">
							₦
						</span>
						<input
							type="text"
							placeholder="0.00"
							value={costPriceDisplay}
							onChange={(e) => handleCostPriceChange(e.target.value)}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] pl-[36px] pr-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] font-medium transition-all"
						/>
					</div>
				</div>

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
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<label className="text-[14px] text-[#1F2937] font-bold">
							Selling Price <span className="text-red-500">*</span>
						</label>
					</div>
					<div className="relative">
						<span className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#278783] font-bold text-[16px]">
							₦
						</span>
						<input
							type="text"
							placeholder="0.00"
							value={sellingPriceDisplay}
							onChange={(e) => handleSellingPriceChange(e.target.value)}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] pl-[36px] pr-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] font-medium transition-all"
						/>
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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Store Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							placeholder="Enter store name"
							{...register("externalStoreName")}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
						/>
					</div>
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Store Contact <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							placeholder="Enter phone number"
							{...register("externalStoreContact")}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
						/>
					</div>
					<div>
						<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
							Store Address <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							placeholder="Enter store address"
							{...register("externalStoreAddress")}
							className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
						/>
					</div>
				</div>
			</div>

			{/* Product Attributes */}
			{selectedProduct?.attributes && selectedProduct.attributes.length > 0 && (
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
							{selectedProduct.attributes.length} attribute
							{selectedProduct.attributes.length > 1 ? "s" : ""}
						</span>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
						{selectedProduct.attributes.map((attr, index) => (
							<div
								key={attr.uuid}
								className="bg-white rounded-[10px] p-[12px] shadow-sm hover:shadow-md transition-shadow"
							>
								<label
									className="text-[14px] text-[#1F2937] font-bold mb-[8px] flex items-center gap-[6px]"
									htmlFor={`attr-${attr.uuid}`}
								>
									<span className="flex items-center justify-center w-[20px] h-[20px] bg-[#278783] text-white text-[11px] rounded-full font-bold">
										{index + 1}
									</span>
									{attr.name}
								</label>
								<input
									id={`attr-${attr.uuid}`}
									type="text"
									placeholder={`Enter ${attr.name.toLowerCase()}`}
									value={formData.attributeValues[attr.uuid] || ""}
									onChange={(e) => {
										setValue(`attributeValues.${attr.uuid}`, e.target.value);
									}}
									className="w-full h-[44px] rounded-[8px] border-[#E5E7EB] border-[1.5px] px-[12px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
