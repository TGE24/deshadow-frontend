import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import {
	PayoutBank,
	useUpdatePayoutBankMutation,
} from "../../../generated/graphql";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedAccount?: PayoutBank | null;
}

const EditBank: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedAccount,
}) => {
	const [updateBank, { loading }] = useUpdatePayoutBankMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<{ bankName: string; accountNumber: string }>({
		defaultValues: {
			bankName: selectedAccount?.bankName || "",
			accountNumber: selectedAccount?.accountNumber || "",
		},
	});

	// Update form values when selectedUser changes or modal opens
	useEffect(() => {
		if (open && selectedAccount) {
			const formData = {
				bankName: selectedAccount?.bankName || "",
				accountNumber: selectedAccount?.accountNumber || "",
			};
			reset(formData);
		} else if (open && !selectedAccount) {
			// Reset to empty values for new user
			const formData = {
				bankName: "",
				accountNumber: "",
			};
			reset(formData);
		}
	}, [open, selectedAccount, reset]);

	const onSumbit = async (data: {
		bankName: string;
		accountNumber: string;
	}) => {
		await updateBank({
			variables: {
				input: {
					bankName: data.bankName,
					accountNumber: data.accountNumber,
				},
				uuid: selectedAccount?.uuid || "",
			},
			onCompleted() {
				setOpen(false);
				reset();
				refetch();
			},
			onError(error: { message: string }) {
				toast.error(error.message);
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
					"rounded-[10px] !px-[40px] !pb-[48px] w-full !max-w-[508px] !m-0",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<h2 className="text-[#278783] font-bold text-[20px] mb-[30px]">
				Enter Account Details
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<Input
						label="Bank name"
						placeholder="Enter Bank name"
						variant="secondary"
						register={register("bankName", {
							required: "Please Enter Bank Name",
						})}
						errors={errors.bankName}
						id="bankName"
					/>
					<Input
						label="Account Number"
						placeholder="Enter account number"
						variant="secondary"
						register={register("accountNumber", {
							required: "Please Enter your Account Number",
						})}
						errors={errors.accountNumber}
						id="accountNumber"
					/>
				</div>
				<Button
					size="large"
					className="w-full"
					disabled={loading}
					type="submit"
				>
					{loading ? "updating..." : "SAVE CHANGES"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditBank;
