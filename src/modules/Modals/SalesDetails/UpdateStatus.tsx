import Modal from "react-responsive-modal";
import {
	Sale,
	SaleStatus,
	useUpdateSaleStatusMutation,
} from "../../../generated/graphql";
import Select from "react-select";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";

interface UpdateSaleProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	sale: Sale;
	refetch: () => void;
}

const UpdateStatus: React.FC<UpdateSaleProps> = ({
	open,
	setOpen,
	sale,
	refetch,
}) => {
	const [updateSale, { loading }] = useUpdateSaleStatusMutation();
	const {
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<{ uuid: string; status: SaleStatus }>({
		defaultValues: {
			uuid: sale.uuid,
			status: "" as SaleStatus,
		},
	});

	const onSubmit = async (data: { uuid: string; status: SaleStatus }) => {
		await updateSale({
			variables: {
				uuid: sale.uuid,
				status: data.status,
			},
			onCompleted() {
				setOpen(false);
				reset();
				refetch();
			},
			onError(error: { message: string }) {
				console.log(error.message);
			},
		});
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
			closeIcon={null}
		>
			<h2 className="text-[#278783] font-bold text-[20px] mb-[30px]">
				Update Sale Status
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="pb-[20px]">
				<div className="my-8">
					<label
						className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
						htmlFor="status"
					>
						Status
					</label>
					<Select
						options={Object.values(SaleStatus).map((status) => ({
							value: status,
							label: status,
						}))}
						placeholder="Select status"
						classNames={{
							control: () =>
								"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
							container: () => "w-full",
							indicatorSeparator: () => "hidden",
						}}
						menuPortalTarget={document.body}
						styles={{
							menuPortal: (base) => ({ ...base, zIndex: 9999 }),
						}}
						onChange={(option) => {
							setValue(
								"status",
								option ? (option.value as SaleStatus) : ("" as SaleStatus)
							);
						}}
						name="status"
					/>
					{errors.status && (
						<span className="text-red-500 text-sm">
							{errors.status.message}
						</span>
					)}
				</div>
				<Button
					size="large"
					className="w-full"
					disabled={loading}
					type="submit"
				>
					{loading ? "Updating..." : "SAVE CHANGES"}
				</Button>
			</form>
		</Modal>
	);
};

export default UpdateStatus;
