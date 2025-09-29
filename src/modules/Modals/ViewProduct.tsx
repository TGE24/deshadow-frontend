import Modal from "react-responsive-modal";

interface ViewProductProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ViewProduct = ({ open, setOpen }: ViewProductProps) => {
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal: "rounded-[10px] !px-[40px] !py-[48px] w-full !max-w-[508px]",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<div className="bg-[#F8F8F8] rounded-[10px] py-[48px]">
				<h2 className="text-[#278783] font-bold text-[20px] text-center">
					Item Details
				</h2>
				<div className="mt-[58px] flex gap-[25px] flex-col items-center">
					<div className="flex justify-between w-full max-w-[304px]">
						<p className="text-[14px] font-semibold">IMEI:</p>
						<p className="text-[14px]">237890456189046</p>
					</div>
					<div className="flex justify-between w-full max-w-[304px]">
						<p className="text-[14px] font-semibold">Color:</p>
						<p className="text-[14px]">White</p>
					</div>
					<div className="flex justify-between w-full max-w-[304px]">
						<p className="text-[14px] font-semibold">Status:</p>
						<p className="text-[14px]">Uk Used</p>
					</div>
					<div className="flex justify-between w-full max-w-[304px]">
						<p className="text-[14px] font-semibold">Product Name:</p>
						<p className="text-[14px]">Iphone 13 promax</p>
					</div>
					<div className="flex justify-between w-full max-w-[304px]">
						<p className="text-[14px] font-semibold">Storage:</p>
						<p className="text-[14px]">256GB</p>
					</div>
				</div>
				<img
					src="/phone.jpeg"
					alt="phone"
					className="mx-auto mt-[40px] size-[173px]"
				/>
			</div>
		</Modal>
	);
};

export default ViewProduct;
