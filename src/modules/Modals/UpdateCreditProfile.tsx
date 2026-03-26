import { useEffect } from "react";
import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {
	CreditProfile,
	useUpdateCreditProfileMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedUser?: Omit<
		CreditProfile,
		"totalPendingAmount" | "updatedAt" | "createdAt" | "updatedAt"
	>;
}

const EditCreditProfile: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedUser,
}) => {
	const [updateUser, { loading }] = useUpdateCreditProfileMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<{
		email: string;
		name: string;
	}>({
		defaultValues: {
			email: "",
			name: "",
		},
	});

	// Update form values when selectedUser changes or modal opens
	useEffect(() => {
		if (open && selectedUser) {
			const formData = {
				email: selectedUser.customerEmail || "",
				name: selectedUser.customerName || "",
			};
			reset(formData);
		} else if (open && !selectedUser) {
			// Reset to empty values for new user
			const formData = {
				email: "",
				name: "",
			};
			reset(formData);
		}
	}, [open, selectedUser, reset]);

	const onSumbit = async (data: { email: string; name: string }) => {
		await updateUser({
			variables: {
				input: {
					uuid: selectedUser?.uuid,
					customerEmail: data.email,
					customerName: data.name,
				},
			},
			onCompleted() {
				setOpen(false);
				toast("User Updated Successfully", { type: "success" });
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
					"rounded-[10px] !px-[40px] !pb-[48px] w-full !max-w-[508px] !m-0",
				overlay: "backdrop-blur-[6px]",
			}}
		>
			<h2 className="text-[#278783] font-bold text-[20px] mb-[30px]">
				Update {selectedUser?.customerName}
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<Input
						label="Email"
						placeholder="Enter email address"
						variant="secondary"
						register={register("email", {
							required: "Please Enter your Email Address",
						})}
						errors={errors.email}
						id="email"
					/>
					<Input
						label="Name"
						placeholder="Enter name"
						variant="secondary"
						register={register("name", {
							required: "Please Enter your Name",
						})}
						errors={errors.name}
						id="name"
					/>
				</div>
				<Button
					size="large"
					className="w-full"
					disabled={loading}
					type="submit"
				>
					{loading ? "Updating..." : "Update"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditCreditProfile;
