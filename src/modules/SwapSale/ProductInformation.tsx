import Input from "../../components/Input";
import SerialNumberAutoSuggest from "../../components/SerialNumberAutoSuggest";
import Select, { SingleValue } from "react-select";
import { SwapProductItem, SwapPhoneDetails } from "./types";
import { formatNaira } from "../../utils/formatters";
import { cn } from "../../utils/cn";
import {
	phoneBrandOptions,
	phoneConditionOptions,
	storageOptions,
} from "./constants";

interface ProductInformationProps {
	productItems: SwapProductItem[];
	onUpdateProduct: (id: string, updates: Partial<SwapProductItem>) => void;
	onViewProductDetails: (id: string) => void;
	discountAmount: number;
	onDiscountChange: (value: number) => void;
	swapPhoneDetails: SwapPhoneDetails;
	onSwapPhoneDetailsChange: (details: Partial<SwapPhoneDetails>) => void;
}

const ProductInformation = ({
	productItems,
	onUpdateProduct,
	onViewProductDetails,
	discountAmount,
	onDiscountChange,
	swapPhoneDetails,
	onSwapPhoneDetailsChange,
}: ProductInformationProps) => {
	return (
		<div className="flex flex-col gap-[32px]">
			{/* Swap Phone Details Section */}
			<div className="border border-gray-200 rounded-[10px] p-[20px]">
				<h3 className="text-[20px] font-semibold mb-[16px]">
					Swap Phone Details
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
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

					<div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Phone Brand
						</label>
						<Select
							value={phoneBrandOptions.find(
								(option) => option.value === swapPhoneDetails?.brand
							)}
							onChange={(
								selectedOption: SingleValue<{ value: string; label: string }>
							) => {
								if (selectedOption) {
									onSwapPhoneDetailsChange({ brand: selectedOption.value });
								}
							}}
							options={phoneBrandOptions}
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
					</div>

					<Input
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
					/>

					<div className="w-full">
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
					</div>

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
				</div>
			</div>

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
							{/* Remove button hidden for swap sales - only allow single product */}
						</div>

						<div className="flex flex-col gap-[16px]">
							<div className="w-full">
								<SerialNumberAutoSuggest
									value=""
									onSelect={(productItem) => {
										if (productItem) {
											onUpdateProduct(item.id, {
												productUuid: productItem.uuid,
												productItemUuid: productItem.uuid,
												productName: productItem.product?.name,
											});
										} else {
											onUpdateProduct(item.id, {
												productUuid: "",
												productItemUuid: "",
												productName: "",
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
												const uuid = item.productItemUuid || item.productUuid;
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
									type="number"
									placeholder="Enter price of item"
									value={item.unitPrice || ""}
									onChange={(e) =>
										onUpdateProduct(item.id, {
											unitPrice: parseFloat(e.target.value) || 0,
										})
									}
									className="outline-none focus:outline-none text-[14px]"
									min="0"
									step="0.01"
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

				{/* "Add Another Product" button hidden for swap sales - only allow single product */}

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
						<div className="flex justify-between items-center text-[16px] pt-[16px]">
							<span className="font-semibold ">Total:</span>
							<span className="font-bold">
								{formatNaira(
									productItems.reduce(
										(total, item) => total + item.unitPrice,
										0
									) - (discountAmount || 0)
								)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductInformation;
