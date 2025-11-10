import Modal from "react-responsive-modal";
import {
	Sale,
	SaleStatus,
	SaleType,
	PaymentType,
	useUpdateSaleStatusMutation,
} from "../../../generated/graphql";
import Select from "react-select";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { formatNaira } from "../../../utils/formatters";

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
		register,
	} = useForm<{
		uuid: string;
		status: SaleStatus;
		totalAmount?: number;
		paymentType?: PaymentType;
	}>({
		defaultValues: {
			uuid: sale.uuid,
			status: "" as SaleStatus,
			totalAmount: sale.totalAmount,
			paymentType:
				sale.saleType === SaleType.Credit ? undefined : sale.paymentType,
		},
	});

	const onSubmit = async (data: {
		uuid: string;
		status: SaleStatus;
		totalAmount?: number;
		paymentType?: PaymentType;
	}) => {
		await updateSale({
			variables: {
				uuid: sale.uuid,
				status: data.status,
				totalAmount: data.totalAmount,
				paymentType: data.paymentType,
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
					<div>
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
					<div className="mt-4">
						<Input
							label="Total Amount"
							type="text"
							placeholder="₦0.00"
							defaultValue={
								sale.totalAmount ? formatNaira(sale.totalAmount) : ""
							}
							register={register("totalAmount", {
								setValueAs: (value: string) => {
									// Remove currency symbol and commas, keep only numbers and decimal
									const numericValue = value
										.replace(/₦|,/g, "")
										.replace(/[^0-9.]/g, "");
									return parseFloat(numericValue) || 0;
								},
							})}
							onChange={(e) => {
								// Format the input value for display
								const numericValue = e.target.value
									.replace(/₦|,/g, "")
									.replace(/[^0-9.]/g, "");
								const parsedValue = parseFloat(numericValue) || 0;
								e.target.value = formatNaira(parsedValue);
							}}
						/>
					</div>

					<div className="mt-4">
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="paymentType"
						>
							Payment Type
						</label>
						<Select
							options={Object.values(PaymentType).map((paymentType) => ({
								value: paymentType,
								label: paymentType
									.replace(/_/g, " ")
									.replace(/\b\w/g, (l) => l.toUpperCase()),
							}))}
							placeholder="Select payment type"
							defaultValue={
								sale.saleType === SaleType.Credit
									? null
									: {
											value: sale?.paymentType,
											label: sale?.paymentType
												?.replace(/_/g, " ")
												.replace(/\b\w/g, (l) => l.toUpperCase()),
									  }
							}
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
									"paymentType",
									option ? (option.value as PaymentType) : undefined
								);
							}}
							name="paymentType"
						/>
						{errors.paymentType && (
							<span className="text-red-500 text-sm">
								{errors.paymentType.message}
							</span>
						)}
					</div>
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
