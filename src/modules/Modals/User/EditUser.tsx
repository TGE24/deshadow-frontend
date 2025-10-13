import { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import {
	User,
	UserRole,
	useUpdateUserMutation,
} from "../../../generated/graphql";
import { toast } from "react-toastify";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedUser?: User | null;
}

const EditUser: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedUser,
}) => {
	const [updateUser, { loading }] = useUpdateUserMutation();
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<{
		email: string;
		role: UserRole;
		firstName: string;
		lastName: string;
		phone: string;
	}>({
		defaultValues: {
			email: "",
			role: UserRole.StoreOwner,
			firstName: "",
			lastName: "",
			phone: "",
		},
	});

	// Update form values when selectedUser changes or modal opens
	useEffect(() => {
		if (open && selectedUser) {
			const formData = {
				email: selectedUser.email || "",
				role: selectedUser.role as UserRole,
				firstName: selectedUser.firstName || "",
				lastName: selectedUser.lastName || "",
				phone: selectedUser.phone || "",
			};
			reset(formData);
			setSelectedRole(selectedUser.role as UserRole);
		} else if (open && !selectedUser) {
			// Reset to empty values for new user
			const formData = {
				email: "",
				role: UserRole.StoreOwner,
				firstName: "",
				lastName: "",
				phone: "",
			};
			reset(formData);
			setSelectedRole(UserRole.StoreOwner);
		}
	}, [open, selectedUser, reset]);

	// Reset state when modal closes
	useEffect(() => {
		if (!open) {
			setSelectedRole(null);
		}
	}, [open]);

	const onSumbit = async (data: {
		email: string;
		role: UserRole;
		firstName: string;
		lastName: string;
		phone: string;
	}) => {
		await updateUser({
			variables: {
				input: {
					email: data.email,
					role: data.role,
					firstName: data.firstName,
					lastName: data.lastName,
					phone: data.phone,
				},
				userId: selectedUser?.uuid || "",
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
				Update {selectedUser?.firstName} {selectedUser?.lastName}
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<div>
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="status"
						>
							Role
						</label>
						<Select
							options={Object.values(UserRole).map((status) => ({
								value: status,
								label: status
									.replace("_", " ")
									.toLowerCase()
									.replace(/\b\w/g, (c) => c.toUpperCase()),
							}))}
							value={
								selectedRole
									? {
											value: selectedRole,
											label: selectedRole
												.replace("_", " ")
												.toLowerCase()
												.replace(/\b\w/g, (c) => c.toUpperCase()),
									  }
									: null
							}
							placeholder="Select role"
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								const newRole = option
									? (option.value as UserRole)
									: ("" as UserRole);
								setValue("role", newRole);
								setSelectedRole(newRole || null);
							}}
							name="role"
						/>
						{errors.role && (
							<span className="text-red-500 text-sm">
								{errors.role.message}
							</span>
						)}
					</div>
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
					<div className="flex gap-[16px]">
						<Input
							label="First name"
							placeholder="Enter first name"
							variant="secondary"
							register={register("firstName", {
								required: "Please Enter your First Name",
							})}
							errors={errors.firstName}
							id="firstName"
						/>
						<Input
							label="Last name"
							placeholder="Enter last name"
							variant="secondary"
							register={register("lastName", {
								required: "Please Enter your Last Name",
							})}
							errors={errors.lastName}
							id="lastName"
						/>
					</div>
					<Input
						label="Phone Number"
						placeholder="Enter phone number"
						variant="secondary"
						register={register("phone", {
							required: "Please Enter your Phone Number",
						})}
						errors={errors.phone}
						id="phone"
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

export default EditUser;
