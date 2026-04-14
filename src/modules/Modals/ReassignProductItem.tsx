import Modal from "react-responsive-modal";
import Button from "../../components/Button";
import {
	Product,
	ProductItem,
	useProductsQuery,
	useReassignProductItemMutation,
} from "../../generated/graphql";
import Select from "react-select";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface ReassignItemModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedProductItem: ProductItem | null;
}

const ReassignProductItem = ({
	open,
	setOpen,
	selectedProductItem,
	refetch,
}: ReassignItemModalProps) => {
	const [newProduct, setNewProduct] = useState("");
	const [reassignProductItem, { loading }] = useReassignProductItemMutation();
	const { data: products } = useProductsQuery({
		variables: { pagination: { first: 100 } },
	});

	// Memoized product options
	const productOptions = useMemo(
		() =>
			products?.products.edges.map((product) => ({
				value: (product.node as Product).uuid,
				label: (product.node as Product).name,
				product: product.node as Product,
			})) || [],
		[products?.products.edges],
	);

	const onSubmit = () => {
		reassignProductItem({
			variables: {
				productItemUuid: selectedProductItem?.uuid,
				newProductUuid: newProduct,
			},
			onCompleted() {
				setOpen(false);
				refetch();
				toast.success("Product item reassigned successfully");
			},
		});
	};

	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal: "rounded-[10px] !px-0 !py-[24px] w-full !max-w-[508px] h-auto",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<div className="border-b border-[#585656] px-[24px] pb-[16px]">
				<h2 className="font-bold text-[20px]">Rassign Product Item</h2>
			</div>
			<div className="pt-[24px] px-[24px]">
				<div className="flex items-center gap-[8px] mb-[12px]">
					<label className="text-[14px] text-[#1F2937] font-bold">
						Select New Product <span className="text-red-500">*</span>
					</label>
				</div>
				<Select
					menuPortalTarget={
						typeof document !== "undefined" ? document.body : undefined
					}
					options={productOptions}
					placeholder="Select a product..."
					styles={{
						menuPortal: (base) => ({ ...base, zIndex: 9999 }),
						menu: (base) => ({ ...base, zIndex: 9999 }),
					}}
					classNames={{
						control: () =>
							"h-[50px] !rounded-[10px] !border-[#E5E7EB] border-[2px] hover:!border-[#278783] cursor-pointer outline-none focus:outline-none text-[14px] !shadow-sm",
						container: () => "w-full",
						indicatorSeparator: () => "hidden",
						menu: () => "!rounded-[10px] !shadow-xl !border-[#E5E7EB]",
						option: () => "!text-[14px] hover:!bg-[#278783]/10",
					}}
					onChange={(option) => {
						setNewProduct(option?.value);
					}}
					name="productUuid"
				/>
			</div>
			<div className="flex gap-[20px] justify-end mt-[55px] px-[24px]">
				<Button variant="tetriary" size="small" onClick={() => setOpen(false)}>
					Close
				</Button>
				<Button size="small" onClick={onSubmit}>
					{loading ? "Loading..." : "Reassign"}
				</Button>
			</div>
		</Modal>
	);
};

export default ReassignProductItem;
