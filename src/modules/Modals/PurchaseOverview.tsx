import Modal from "react-responsive-modal";
import Button from "../../components/Button";

interface PurchaseOverviewProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const PurchaseOverview = ({ open, setOpen }: PurchaseOverviewProps) => {
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal:
					"rounded-[10px] !md:px-[40px] !md:py-[48px] w-full !max-w-[508px]",
				overlay: "backdrop-blur-[6px]",
			}}
			closeIcon={null}
		>
			<div className="bg-[#F8F8F8] rounded-[10px] py-[34px] px-[42px]">
				<h2 className="text-[#278783] font-bold text-[20px]">
					Overview of purchase
				</h2>
				<div className="mt-[34px] flex gap-[16px] flex-col">
					<div className="flex justify-between w-full bg-[#FEFEFE] py-[7.5px] px-[8px] rounded-[6px]">
						<p className="text-[14px] font-semibold">Customer Name:</p>
						<p className="text-[14px]">John Doe</p>
					</div>
					<div className="flex justify-between w-full px-[8px]">
						<p className="text-[14px] font-semibold">Phone No:</p>
						<p className="text-[14px]">+1234567890</p>
					</div>
					<div className="flex justify-between w-full bg-[#FEFEFE] py-[7.5px] px-[8px] rounded-[6px]">
						<p className="text-[14px] font-semibold">IMEI:</p>
						<p className="text-[14px]">237890456189046</p>
					</div>
					<div className="flex justify-between w-full px-[8px]">
						<p className="text-[14px] font-semibold">Color:</p>
						<p className="text-[14px]">White</p>
					</div>
					<div className="flex justify-between w-full bg-[#FEFEFE] py-[7.5px] px-[8px] rounded-[6px]">
						<p className="text-[14px] font-semibold">Status:</p>
						<p className="text-[14px]">Uk Used</p>
					</div>
					<div className="flex justify-between w-full px-[8px]">
						<p className="text-[14px] font-semibold">Product Name:</p>
						<p className="text-[14px]">Iphone 13 promax</p>
					</div>

					<div className="flex justify-between w-full bg-[#FEFEFE] py-[7.5px] px-[8px] rounded-[6px]">
						<p className="text-[14px] font-semibold">Storage:</p>
						<p className="text-[14px]">256GB</p>
					</div>

					<div className="flex justify-between w-full px-[8px]">
						<p className="text-[14px] font-semibold">Amount Paid:</p>
						<p className="text-[14px]">N 780,000</p>
					</div>

					<div className="flex justify-between w-full bg-[#FEFEFE] py-[7.5px] px-[8px] rounded-[6px]">
						<p className="text-[14px] font-semibold">Payment Type:</p>
						<p className="text-[14px]">Credit Card</p>
					</div>
				</div>
				<div className="w-full mt-[33px]">
					<Button className="w-full" size="large" as="link" to="/invoice/1">
						NEXT
					</Button>
					<Button
						onClick={() => setOpen(false)}
						size="large"
						className="w-full mt-[16px] text-black border-none"
						variant="transparent"
					>
						BACK
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default PurchaseOverview;
