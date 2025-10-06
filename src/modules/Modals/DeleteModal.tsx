import Modal from "react-responsive-modal";
import Button from "../../components/Button";

interface DeleteModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	title?: string;
	copy?: string;
	action: () => void;
	loading?: boolean;
}

const DeleteModal = ({
	open,
	setOpen,
	title,
	copy,
	action,
	loading,
}: DeleteModalProps) => {
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal: "rounded-[10px] !px-0 !py-[24px] w-full !max-w-[508px]",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<div className="border-b border-[#585656] px-[24px] pb-[16px]">
				<h2 className="font-bold text-[20px]">{title}</h2>
			</div>
			<div className="pt-[24px] pl-[24px]">
				<p>{copy}</p>
			</div>
			<div className="flex gap-[20px] justify-end mt-[55px] px-[24px]">
				<Button variant="tetriary" size="small" onClick={() => setOpen(false)}>
					Close
				</Button>
				<Button size="small" onClick={action} disabled={loading}>
					{loading ? "Removing..." : "Yes, Remove"}
				</Button>
			</div>
		</Modal>
	);
};

export default DeleteModal;
