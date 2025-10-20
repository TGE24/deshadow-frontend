import Select from "react-select";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Product } from "../../generated/graphql";
import { ProductItem } from "./types";
import { selectStyles } from "./constants";
import { formatNaira } from "../../utils/formatters";
import { cn } from "../../utils/cn";

interface ProductInformationProps {
	productItems: ProductItem[];
	products: Product[] | undefined;
	onAddProduct: () => void;
	onRemoveProduct: (id: string) => void;
	onUpdateProduct: (id: string, updates: Partial<ProductItem>) => void;
	onViewProductDetails: (id: string) => void;
	discountAmount: number;
	onDiscountChange: (value: number) => void;
}

const ProductInformation = ({
	productItems,
	products,
	onAddProduct,
	onRemoveProduct,
	onUpdateProduct,
	onViewProductDetails,
	discountAmount,
	onDiscountChange,
}: ProductInformationProps) => {
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
						}
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

					<div className="flex flex-col gap-[16px]">
						<div className="w-full">
							<label
								className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
								htmlFor={`product-${item.id}`}
							>
								Select Product
							</label>
							<Select
								options={products?.map((product) => ({
									value: product.uuid,
									label: `${product.name}`,
									product: product,
								}))}
								placeholder="Choose a product"
								classNames={selectStyles}
								onChange={(option) => {
									if (option && "product" in option) {
										onUpdateProduct(item.id, {
											product: option.product as Product,
											productUuid: option.value,
										});
									}
								}}
								value={
									item.product
										? {
												value: item.product.uuid,
												label: item.product.name,
												product: item.product,
										  }
										: null
								}
								name={`product-${item.id}`}
							/>
							{item.product && (
								<p
									className="text-[12px] text-blue-600 underline cursor-pointer mt-[6px] hover:text-blue-800"
									onClick={() =>
										item.product && onViewProductDetails(item.product.uuid)
									}
								>
									View product details
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-[16px]">
							<Input
								label="Quantity"
								type="number"
								placeholder="Enter quantity"
								value={item.quantity}
								onChange={(e) =>
									onUpdateProduct(item.id, {
										quantity: parseInt(e.target.value) || 1,
									})
								}
								className="outline-none focus:outline-none text-[14px]"
								min="1"
							/>
							<Input
								label="Unit Price"
								type="number"
								placeholder="Enter price per item"
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

						{item.product && item.quantity > 0 && item.unitPrice > 0 && (
							<div className="bg-white p-[12px] rounded-[6px] border border-gray-200">
								<div className="flex justify-between items-center text-[14px]">
									<span className="text-gray-600">Line Total:</span>
									<span className="font-semibold text-gray-800">
										{formatNaira(item.quantity * item.unitPrice)}
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
						label="Discount Amount (Optional)"
						type="number"
						placeholder="Enter discount amount"
						value={discountAmount || ""}
						onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
						className="outline-none focus:outline-none text-[14px]"
						min="0"
					/>
					<div className="flex justify-between items-center text-[16px] pt-[16px]">
						<span className="font-semibold ">Total:</span>
						<span className="font-bold">
							{formatNaira(
								productItems.reduce(
									(total, item) => total + item.quantity * item.unitPrice,
									0
								) - (discountAmount || 0)
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductInformation;
