import Modal from "react-responsive-modal";
import Input from "../../components/Input";
import Button from "../../components/Button";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ProductDetails: React.FC<ModalProps> = ({ open, setOpen }) => {
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal:
					"rounded-[10px] !px-[40px] !py-[48px] w-full !max-w-[508px] !m-0",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<h2 className="text-[#278783] font-bold text-[20px]">
				Enter product details
			</h2>
			<div className="mb-[76px] mt-[16px] flex gap-[24px] flex-col">
				<Input
					label="Product"
					placeholder="Enter product name"
					name="product"
					id="product"
					variant="secondary"
				/>
				<Input
					label="Brand"
					placeholder="Enter brand name"
					name="brand"
					id="brand"
					variant="secondary"
				/>
				<Input
					label="Color"
					placeholder="Enter color"
					name="color"
					id="color"
					variant="secondary"
				/>
				<Input
					label="Storage"
					placeholder="Enter storage"
					name="storage"
					id="storage"
					variant="secondary"
				/>
				<Input
					label="IMEI Number"
					placeholder="Enter IMEI Number"
					name="imei"
					id="imei"
					variant="secondary"
				/>

				<Input
					label="Cost Price"
					placeholder="Enter cost price"
					name="cost"
					id="cost"
					variant="secondary"
				/>
				<Input
					label="Selling Price"
					placeholder="Enter selling price"
					name="selling"
					id="selling"
					variant="secondary"
				/>
			</div>
			<Button size="large" className="w-full">
				ADD ITEM
			</Button>
		</Modal>
	);
};

export default ProductDetails;
