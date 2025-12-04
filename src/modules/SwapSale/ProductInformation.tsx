import Input from "../../components/Input";
import Button from "../../components/Button";
import SerialNumberAutoSuggest from "../../components/SerialNumberAutoSuggest";
import Select, { SingleValue } from "react-select";
import { SwapProductItem, SwapPhoneDetails } from "./types";
import { formatNaira } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import { phoneConditionOptions } from "./constants";
import { useProductsQuery, Product } from "../../generated/graphql";

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
	const { data: products } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	// Subtotal for all product items (used in breakdown)
	const productsSubtotal = productItems.reduce(
		(total, item) => total + (item.unitPrice || 0),
		0
	);

	return (
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
								selectedOption: SingleValue<{ value: string; label: string }>
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

					{/* <div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
								estimatedValue: parseFloat(e.target.value) || 0,
							})
						}
						className="outline-none focus:outline-none text-[14px]"
						min="0"
						step="0.01"
					/>

					{/* <div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Phone Brand
						</label>
						<Select
							value={
								brands?.brands.edges
									.map((edge) => edge.node as Brand)
									.map((brand) => ({
										value: brand.uuid,
										label: brand.name,
									}))
									.find((option) => option.value === swapPhoneDetails?.brand) ||
								null
							}
							onChange={(
								selectedOption: SingleValue<{ value: string; label: string }>
							) => {
								if (selectedOption) {
									onSwapPhoneDetailsChange({ brand: selectedOption.value });
								}
							}}
							options={
								brands?.brands.edges.map((edge) => {
									const brand = edge.node as Brand;
									return {
										value: brand.uuid,
										label: brand.name,
									};
								}) || []
							}
							className="text-sm"
							placeholder="Select phone brand..."
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
					</div> */}

					{/* <Input
						label="Phone Model"
						type="text"
						placeholder="Enter phone model"
						value={swapPhoneDetails?.model}
						onChange={(e) =>
							onSwapPhoneDetailsChange({ model: e.target.value })
						}
						className="outline-none focus:outline-none text-[14px]"
					/>

					<Input
						label="Phone Color"
						type="text"
						placeholder="Enter phone color"
						value={swapPhoneDetails?.color}
						onChange={(e) =>
							onSwapPhoneDetailsChange({ color: e.target.value })
						}
						className="outline-none focus:outline-none text-[14px]"
					/> */}

					{/* <div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Storage Capacity
						</label>
						<Select
							value={storageOptions.find(
								(option) => option.value === swapPhoneDetails?.storage
							)}
							onChange={(
								selectedOption: SingleValue<{ value: string; label: string }>
							) => {
								if (selectedOption) {
									onSwapPhoneDetailsChange({ storage: selectedOption.value });
								}
							}}
							options={storageOptions}
							className="text-sm"
							placeholder="Select storage capacity..."
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
					</div> */}

					<div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Phone Condition
						</label>
						<Select
							value={phoneConditionOptions.find(
								(option) => option.value === swapPhoneDetails?.condition
							)}
							onChange={(
								selectedOption: SingleValue<{ value: string; label: string }>
							) => {
								if (selectedOption) {
									onSwapPhoneDetailsChange({ condition: selectedOption.value });
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
													swapPhoneDetails.attributeValues?.[attribute.uuid] ||
													""
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
									)
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
							}
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
						</div>{" "}
						<div className="flex flex-col gap-[16px]">
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
											<span className="font-medium">{item.productName}</span>
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
											{formatNaira(item.unitPrice)}
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
											(swapPhoneDetails?.estimatedValue || 0)
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductInformation;
