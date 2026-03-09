import React from "react";
import Modal from "react-responsive-modal";
import {
	SaleItem,
	useReturnCreditSaleItemMutation,
} from "../../../generated/graphql";
import { formatNaira } from "../../../utils/formatters";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import Input from "../../../components/Input";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	data: SaleItem;
	profileId: string;
}

const ReturnItemModal: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	data,
	profileId,
}) => {
	const [returnItem, { loading }] = useReturnCreditSaleItemMutation();
	const isAccessoryItem = Boolean(data.accessory);
	const [quantity, setQuantity] = React.useState<number>(data.quantity || 1);

	React.useEffect(() => {
		setQuantity(data.quantity || 1);
	}, [data.quantity, data.uuid]);

	const hadnleSubmit = async () => {
		if (isAccessoryItem && (quantity < 1 || quantity > data.quantity)) {
			toast.error(`Quantity must be between 1 and ${data.quantity}`);
			return;
		}

		try {
			await returnItem({
				variables: {
					creditProfileUuid: profileId,
					items: [
						{
							saleItemUuid: data.uuid,
							reason: "",
							...(isAccessoryItem ? { quantity } : {}),
						},
					],
				},
				onCompleted() {
					setOpen(false);
					refetch();
				},
				onError(error) {
					toast.error(error.message);
				},
			});
		} catch (error) {
			console.error("Error returning item:", error);
		}
	};

	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal:
					"rounded-[10px] !md:px-[40px] !md:py-[48px] w-full !max-w-[400px]",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-4">Return Item</h2>
				<p className="text-gray-600 mb-4">
					Are you sure you want to return this item from the credit sale?
				</p>
				<div className="bg-gray-50 p-4 rounded mb-6 space-y-3">
					{(data.product?.name || data.productItem?.product?.name) && (
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Product:</span>{" "}
							{data.product?.name || data.productItem?.product?.name}
						</p>
					)}
					{data.accessory?.name && (
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Accessory:</span>{" "}
							{data.accessory.name}
						</p>
					)}
					{data.productItem?.attributeValues &&
						data.productItem.attributeValues.length > 0 && (
							<div className="text-sm text-gray-600">
								<span className="font-semibold">Attributes:</span>
								<div className="mt-2 flex flex-wrap gap-2">
									{data.productItem.attributeValues.map((av, index) => (
										<span
											key={index}
											className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
										>
											{av.attribute.name}: {av.valueText || "N/A"}
										</span>
									))}
								</div>
							</div>
						)}
					{data.lineTotal && (
						<p className="text-sm text-gray-600">
							<span className="font-semibold">Amount:</span>{" "}
							{formatNaira(data.lineTotal)}
						</p>
					)}
					{isAccessoryItem && (
						<div className="space-y-2">
							<Input
								type="number"
								label="Quantity"
								placeholder="Enter quantity"
								min={1}
								max={data.quantity}
								value={quantity}
								onChange={(event) => {
									const nextQuantity = Number(event.target.value);
									setQuantity(Number.isNaN(nextQuantity) ? 1 : nextQuantity);
								}}
							/>
							<p className="text-xs text-gray-500">
								Max returnable: {data.quantity}
							</p>
						</div>
					)}
				</div>
				<div className="flex gap-3 justify-end">
					<Button
						variant="primary"
						size="large"
						className="w-full"
						onClick={() => {
							hadnleSubmit();
						}}
					>
						{loading ? "Confirming..." : "Confirm Return"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ReturnItemModal;
