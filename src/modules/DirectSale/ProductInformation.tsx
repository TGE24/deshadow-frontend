import { useEffect, useMemo } from "react";
import Select from "react-select";
import Input from "../../components/Input";
import Button from "../../components/Button";
import SerialNumberAutoSuggest from "../../components/SerialNumberAutoSuggest";
import { ProductItem } from "./types";
import { formatNaira } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import { SaleType, useAccessoriesLazyQuery } from "../../generated/graphql";
import debounce from "lodash/debounce";

interface ProductInformationProps {
	productItems: ProductItem[];
	onAddProduct: () => void;
	onRemoveProduct: (id: string) => void;
	onUpdateProduct: (id: string, updates: Partial<ProductItem>) => void;
	onViewProductDetails: (id: string) => void;
	discountAmount: number;
	onDiscountChange: (value: number) => void;
	saleType?: SaleType;
}

const ProductInformation = ({
	productItems,
	onAddProduct,
	onRemoveProduct,
	onUpdateProduct,
	onViewProductDetails,
	discountAmount,
	onDiscountChange,
	saleType,
}: ProductInformationProps) => {
	const isCreditSale = saleType === SaleType.Credit;
	const [getAccessories, { data: accessoriesData }] = useAccessoriesLazyQuery({
		fetchPolicy: "network-only",
	});

	const accessoriesOptions = useMemo(
		() =>
			accessoriesData?.accessories?.edges?.map((edge) => {
				const node = edge.node as { uuid: string; name: string };
				return {
					value: node.uuid,
					label: node.name,
					accessory: node,
				};
			}) || [],
		[accessoriesData?.accessories?.edges],
	);

	// Load accessories on component mount
	useEffect(() => {
		getAccessories({ variables: { pagination: { first: 100 } } });
	}, [getAccessories]);

	const handleAccessorySearch = useMemo(
		() =>
			debounce((inputValue: string) => {
				getAccessories({
					variables: {
						pagination: { first: 100 },
						...(inputValue ? { search: inputValue } : {}),
					},
				});
			}, 300),
		[getAccessories],
	);

	return (
		<div className="flex flex-col gap-[24px] border border-gray-200 rounded-[10px] p-[20px]">
			<h3 className="text-[20px] font-semibold">Product Information</h3>

			{productItems.map((item, index) => (
				<div
					key={item.id}
					className={cn(
						"bg-gray-50 p-[16px] rounded-[8px] border border-gray-100",
						{
							"mb-[16px]": index < productItems.length - 1,
						},
					)}
				>
					<div className="flex justify-end">
						{productItems.length > 1 && (
							<button
								type="button"
								onClick={() => onRemoveProduct(item.id)}
								className="text-red-500 hover:text-red-700 text-[12px] font-medium px-[8px] py-[4px] rounded-[4px] hover:bg-red-50 transition-colors"
							>
								Remove
							</button>
						)}
					</div>

					<div className="flex items-center gap-[16px] mb-[16px] pb-[16px] border-b border-gray-200">
						<input
							type="checkbox"
							id={`accessory-${item.id}`}
							checked={item.isAccessory || false}
							onChange={(e) =>
								onUpdateProduct(item.id, {
									isAccessory: e.target.checked,
									product: null,
									serialNumber: "",
									productName: "",
									sellingPrice: undefined,
									storeUuid: null,
									accessoryUuid: "",
								})
							}
							className="w-[18px] h-[18px] cursor-pointer"
						/>
						<label
							htmlFor={`accessory-${item.id}`}
							className="cursor-pointer text-[14px] font-medium text-gray-900"
						>
							Is this an Accessory?
						</label>
					</div>

					<div className="flex flex-col gap-[16px]">
						{item.isAccessory ? (
							// Accessory Selection
							<div className="w-full">
								<Select
									options={accessoriesOptions}
									value={
										item.accessoryUuid
											? accessoriesOptions.find(
													(opt) => opt.value === item.accessoryUuid,
												)
											: null
									}
									onInputChange={(inputValue, { action }) => {
										if (action === "input-change") {
											handleAccessorySearch(inputValue);
										}
									}}
									onChange={(option) => {
										if (option) {
											onUpdateProduct(item.id, {
												accessoryUuid: option.value,
												productName: option.label,
												sellingPrice: 0,
											});
										} else {
											onUpdateProduct(item.id, {
												accessoryUuid: "",
												productName: "",
												sellingPrice: undefined,
											});
										}
									}}
									isSearchable
									placeholder="Select an accessory..."
									styles={{
										control: (base) => ({
											...base,
											minHeight: "50px",
											borderRadius: "10px",
											borderColor: "#E5E7EB",
											borderWidth: "2px",
											fontSize: "14px",
										}),
										option: (base, state) => ({
											...base,
											backgroundColor: state.isSelected ? "#278783" : "white",
											color: state.isSelected ? "white" : "black",
											cursor: "pointer",
										}),
									}}
								/>
								{item.productName && (
									<div className="mt-2">
										<p className="text-[12px] text-gray-600">
											Selected:{" "}
											<span className="font-medium">{item.productName}</span>
										</p>
									</div>
								)}
								{item.isAccessory && item.productName && (
									<Input
										label="Quantity"
										type="number"
										value={item.quantity || ""}
										onChange={(e) => {
											const value = parseInt(e.target.value) || 0;
											onUpdateProduct(item.id, {
												quantity: value,
											});
										}}
										placeholder="Enter quantity"
										min="1"
										required
									/>
								)}
							</div>
						) : (
							// Gadget Selection
							<div className="w-full">
								<SerialNumberAutoSuggest
									value={item.serialNumber || ""}
									onSelect={(productItem) => {
										if (productItem) {
											onUpdateProduct(item.id, {
												product: productItem.product,
												serialNumber: productItem.serialNumber,
												productName: productItem.product?.name,
												sellingPrice: productItem.sellingPrice ?? 0,
												storeUuid: productItem.store?.uuid || null,
											});
										} else {
											onUpdateProduct(item.id, {
												product: null,
												serialNumber: "",
												productName: "",
												sellingPrice: undefined,
												storeUuid: null,
											});
										}
									}}
									placeholder="Enter serial number to search..."
									label="Search by Serial Number or Product Name"
								/>
								{item.productName && (
									<div className="mt-2">
										<p className="text-[12px] text-gray-600">
											Selected:{" "}
											<span className="font-medium">{item.productName}</span>
										</p>
										<p className="text-[12px] text-gray-500">
											Serial: {item.serialNumber}
										</p>
										<p
											className="text-[12px] text-blue-600 underline cursor-pointer mt-[6px] hover:text-blue-800"
											onClick={() => {
												const uuid = item.serialNumber;
												if (uuid) {
													onViewProductDetails(uuid);
												}
											}}
										>
											View product details
										</p>
									</div>
								)}
							</div>
						)}

						<div className="w-full">
							<Input
								label={`Unit Price ${isCreditSale ? "(Optional)" : ""}`}
								type="text"
								placeholder="₦0.00"
								value={item.unitPrice ? formatNaira(item.unitPrice) : ""}
								onChange={(e) => {
									// Remove currency symbol and commas, keep only numbers and decimal
									const numericValue = e.target.value
										.replace(/₦|,/g, "")
										.replace(/[^0-9.]/g, "");

									// Parse the numeric value
									const parsedValue = parseFloat(numericValue) || 0;

									onUpdateProduct(item.id, {
										unitPrice: parsedValue,
									});
								}}
								className={cn(
									"outline-none focus:outline-none text-[14px]",
									item.sellingPrice &&
										item.unitPrice &&
										item.unitPrice < item.sellingPrice
										? "border-red-500 focus:border-red-500"
										: "",
								)}
								required={!isCreditSale}
							/>
							{!!item.sellingPrice &&
								!!item.unitPrice &&
								item.unitPrice < item.sellingPrice && (
									<p className="text-red-500 text-xs mt-1">
										Unit price cannot be lower than selling price
									</p>
								)}
							{isCreditSale && (
								<p className="text-gray-500 text-xs mt-1">
									Unit price is optional for credit sales
								</p>
							)}
						</div>

						{item.productName && item.unitPrice > 0 && (
							<div className="bg-white p-[12px] rounded-[6px] border border-gray-200">
								<div className="flex justify-between items-center text-[14px]">
									<span className="text-gray-600">Price:</span>
									<span className="font-semibold text-gray-800">
										{formatNaira(
											item.isAccessory
												? (item.unitPrice || 0) * (item.quantity || 1)
												: item.unitPrice,
										)}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			))}

			<Button
				type="button"
				variant="secondary"
				onClick={onAddProduct}
				className="self-start text-[14px] flex items-center gap-[8px]"
			>
				<span>+</span>
				Add Another Product
			</Button>

			<div className="bg-[#e7f6f57a] p-[16px] rounded-[8px] border border-blue-100">
				<div className="space-y-[8px]">
					<Input
						label="Discount Amount - Optional"
						type="text"
						placeholder="₦0.00"
						value={discountAmount ? formatNaira(discountAmount) : ""}
						onChange={(e) => {
							// Remove currency symbol and commas, keep only numbers and decimal
							const numericValue = e.target.value
								.replace(/₦|,/g, "")
								.replace(/[^0-9.]/g, "");

							// Parse the numeric value
							const parsedValue = parseFloat(numericValue) || 0;

							onDiscountChange(parsedValue);
						}}
						className="outline-none focus:outline-none text-[14px]"
					/>
					<div className="flex justify-between items-center text-[16px] pt-[16px]">
						<span className="font-semibold ">Total:</span>
						<span className="font-bold">
							{formatNaira(
								productItems.reduce((total, item) => {
									const price = item.unitPrice || 0;
									const quantity = item.isAccessory ? item.quantity || 1 : 1;
									return total + price * quantity;
								}, 0) - (discountAmount || 0),
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductInformation;
