import { useEffect, useMemo, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import SerialNumberAutoSuggest from "../../components/SerialNumberAutoSuggest";
import Select, { SingleValue } from "react-select";
import { SwapProductItem, SwapPhoneDetails } from "./types";
import { formatNaira } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import { phoneConditionOptions } from "./constants";
import {
	useProductsQuery,
	Product,
	useAccessoriesLazyQuery,
} from "../../generated/graphql";
import Plus from "../../components/Icons/Plus";
import AddProduct from "../Modals/Product/AddProduct";

interface ProductInformationProps {
	productItems: SwapProductItem[];
	onAddProduct: () => void;
	onRemoveProduct: (id: string) => void;
	onUpdateProduct: (id: string, updates: Partial<SwapProductItem>) => void;
	onViewProductDetails: (id: string) => void;
	discountAmount: number;
	onDiscountChange: (value: number) => void;
	swapPhoneDetails: SwapPhoneDetails;
	onSwapPhoneDetailsChange: (details: Partial<SwapPhoneDetails>) => void;
}

const ProductInformation = ({
	productItems,
	onAddProduct,
	onRemoveProduct,
	onUpdateProduct,
	onViewProductDetails,
	discountAmount,
	onDiscountChange,
	swapPhoneDetails,
	onSwapPhoneDetailsChange,
}: ProductInformationProps) => {
	// Fetch products for selection
	const [open, setOpen] = useState(false);
	const { data: products, refetch } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

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

	// Subtotal for all product items (used in breakdown)
	const productsSubtotal = productItems.reduce((total, item) => {
		const price = item.unitPrice || 0;
		const quantity = item.isAccessory ? item.quantity || 1 : 1;
		return total + price * quantity;
	}, 0);

	return (
		<>
			<div className="flex flex-col gap-[32px]">
				{/* Swap Phone Details Section */}
				<div className="border border-gray-200 rounded-[10px] p-[20px]">
					<h3 className="text-[20px] font-semibold mb-[16px]">
						Swap Phone Details
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Select Product
							</label>
							<Select
								value={
									swapPhoneDetails?.selectedProduct &&
									swapPhoneDetails.selectedProduct.uuid
										? {
												value: swapPhoneDetails.selectedProduct.uuid,
												label: swapPhoneDetails.selectedProduct.name,
											}
										: null
								}
								onChange={(
									selectedOption: SingleValue<{ value: string; label: string }>,
								) => {
									if (selectedOption) {
										const selectedProduct = products?.products.edges
											.map((edge) => edge.node as Product)
											.find((product) => product.uuid === selectedOption.value);

										if (selectedProduct) {
											onSwapPhoneDetailsChange({
												...swapPhoneDetails,
												selectedProduct,
											});
										}
									} else {
										onSwapPhoneDetailsChange({
											...swapPhoneDetails,
											selectedProduct: null,
										});
									}
								}}
								options={
									products?.products.edges.map((edge) => {
										const product = edge.node as Product;
										return {
											value: product.uuid,
											label: product.name,
										};
									}) || []
								}
								className="text-sm"
								placeholder="Select a product..."
								menuPortalTarget={document.body}
								menuPosition="fixed"
								isClearable
								styles={{
									control: (base) => ({
										...base,
										minHeight: "48px",
										borderColor: "#d1d5db",
										borderRadius: "8px",
										"&:hover": {
											borderColor: "#9ca3af",
										},
									}),
									menuPortal: (base) => ({
										...base,
										zIndex: 9999,
									}),
								}}
								components={{
									NoOptionsMessage: () => (
										<Button
											size="large"
											className="w-full"
											icon={<Plus />}
											onClick={() => setOpen(true)}
										>
											Create Product
										</Button>
									),
								}}
							/>
						</div>

						<Input
							label="Phone Serial Number"
							type="text"
							placeholder="Enter phone serial number"
							value={swapPhoneDetails?.serialNumber}
							onChange={(e) =>
								onSwapPhoneDetailsChange({ serialNumber: e.target.value })
							}
							className="outline-none focus:outline-none text-[14px]"
						/>

						<Input
							label="Estimated Value"
							type="text"
							placeholder="₦0.00"
							value={
								swapPhoneDetails.estimatedValue
									? formatNaira(swapPhoneDetails.estimatedValue)
									: ""
							}
							onChange={(e) => {
								// Remove currency symbol and commas, keep only numbers and decimal
								const numericValue = e.target.value
									.replace(/₦|,/g, "")
									.replace(/[^0-9.]/g, "");

								// Parse the numeric value
								const parsedValue = parseFloat(numericValue) || 0;

								onSwapPhoneDetailsChange({
									estimatedValue: parsedValue,
								});
							}}
							className="outline-none focus:outline-none text-[14px]"
						/>

						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Phone Condition
							</label>
							<Select
								value={phoneConditionOptions.find(
									(option) => option.value === swapPhoneDetails?.condition,
								)}
								onChange={(
									selectedOption: SingleValue<{ value: string; label: string }>,
								) => {
									if (selectedOption) {
										onSwapPhoneDetailsChange({
											condition: selectedOption.value,
										});
									}
								}}
								options={phoneConditionOptions}
								className="text-sm"
								placeholder="Select phone condition..."
								menuPortalTarget={document.body}
								menuPosition="fixed"
								styles={{
									control: (base) => ({
										...base,
										minHeight: "48px",
										borderColor: "#d1d5db",
										borderRadius: "8px",
										"&:hover": {
											borderColor: "#9ca3af",
										},
									}),
									menuPortal: (base) => ({
										...base,
										zIndex: 9999,
									}),
								}}
							/>
						</div>

						{/* Attributes for selected swap product */}
						{swapPhoneDetails?.selectedProduct?.attributes &&
							swapPhoneDetails.selectedProduct.attributes.length > 0 && (
								<>
									{swapPhoneDetails.selectedProduct.attributes.map(
										(attribute) => (
											<div key={attribute.uuid} className="w-full">
												<Input
													label={attribute.name}
													type="text"
													placeholder={`Enter ${attribute.name.toLowerCase()}`}
													value={
														swapPhoneDetails.attributeValues?.[
															attribute.uuid
														] || ""
													}
													onChange={(e) =>
														onSwapPhoneDetailsChange({
															attributeValues: {
																...(swapPhoneDetails.attributeValues || {}),
																[attribute.uuid]: e.target.value,
															},
														})
													}
													className="outline-none focus:outline-none text-[14px]"
												/>
											</div>
										),
									)}
								</>
							)}
					</div>
				</div>{" "}
				{/* Product Information Section */}
				<div className="border border-gray-200 rounded-[10px] p-[20px]">
					<h3 className="text-[20px] font-semibold mb-[16px]">
						Product Information
					</h3>

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
										className="text-red-500 hover:text-red-700 text-[12px] font-medium px-[8px] py-[4px] rounded-[4px] hover:bg-red-50 transition-colors cursor-pointer"
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
											unitPrice: undefined,
											storeUuid: null,
											accessoryUuid: "",
											quantity: 1,
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
											onChange={(option) => {
												if (option) {
													onUpdateProduct(item.id, {
														accessoryUuid: option.value,
														productName: option.label,
														unitPrice: 0,
													});
												} else {
													onUpdateProduct(item.id, {
														accessoryUuid: "",
														productName: "",
														unitPrice: undefined,
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
													backgroundColor: state.isSelected
														? "#278783"
														: "white",
													color: state.isSelected ? "white" : "black",
													cursor: "pointer",
												}),
											}}
										/>
										{item.productName && (
											<div className="mt-2">
												<p className="text-[12px] text-gray-600">
													Selected:{" "}
													<span className="font-medium">
														{item.productName}
													</span>
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
											value=""
											onSelect={(productItem) => {
												if (productItem) {
													onUpdateProduct(item.id, {
														// productUuid: productItem.uuid,
														// productItemUuid: productItem.uuid,
														productName: productItem.product?.name,
														serialNumber: productItem.serialNumber,
														product: productItem.product,
														storeUuid: productItem.store?.uuid || null,
													});
												} else {
													onUpdateProduct(item.id, {
														// productUuid: "",
														// productItemUuid: "",
														productName: "",
														serialNumber: "",
														product: null,
														storeUuid: null,
													});
												}
											}}
											placeholder="Enter serial number to search..."
											label="Search by Serial Number"
										/>
										{item.productName && (
											<div className="mt-2">
												<p className="text-[12px] text-gray-600">
													Selected:{" "}
													<span className="font-medium">
														{item.productName}
													</span>
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
										label="Price"
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
										className="outline-none focus:outline-none text-[14px]"
									/>
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
						className="self-start text-[14px] flex items-center gap-[8px] py-[16px]"
					>
						<span>+</span>
						Add Another Product
					</Button>

					<div className="bg-[#e7f6f57a] p-[16px] rounded-[8px] border border-blue-100">
						<div className="space-y-[8px]">
							<Input
								label="Discount Amount (Optional)"
								type="number"
								placeholder="Enter discount amount"
								value={discountAmount || ""}
								onChange={(e) =>
									onDiscountChange(parseFloat(e.target.value) || 0)
								}
								className="outline-none focus:outline-none text-[14px]"
								min="0"
							/>
							<div className="text-[14px] pt-[12px] space-y-[6px]">
								<div className="flex justify-between">
									<span className="text-gray-600">Products Subtotal:</span>
									<span className="font-medium">
										{formatNaira(productsSubtotal)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Discount:</span>
									<span className="font-medium">
										-{formatNaira(discountAmount || 0)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Swap Phone Value:</span>
									<span className="font-medium">
										-{formatNaira(swapPhoneDetails?.estimatedValue || 0)}
									</span>
								</div>
								<div className="flex justify-between items-center text-[16px] pt-[12px] border-t border-blue-100">
									<span className="font-semibold">Total:</span>
									<span className="font-bold">
										{formatNaira(
											productsSubtotal -
												(discountAmount || 0) -
												(swapPhoneDetails?.estimatedValue || 0),
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddProduct open={open} setOpen={setOpen} refetch={refetch} />
		</>
	);
};

export default ProductInformation;
