import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateCreditProfileMutation } from "../../../generated/graphql";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Modal from "react-responsive-modal";

interface CreateCreditProfileModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

interface CreditProfileFormData {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
}

const CreateCreditProfileModal = ({
	open,
	setOpen,
	refetch,
}: CreateCreditProfileModalProps) => {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreditProfileFormData>();

	const [createCreditProfile] = useCreateCreditProfileMutation();

	const onSubmit = async (data: CreditProfileFormData) => {
		setLoading(true);
		try {
			const result = await createCreditProfile({
				variables: {
					input: {
						customerName: data.customerName,
						customerEmail: data.customerEmail || null,
						customerPhone: data.customerPhone,
					},
				},
			});

			if (result.data?.createCreditProfile) {
				toast.success("Credit profile created successfully!");
				refetch();
				reset();
				setOpen(false);
			}
		} catch (error) {
			console.error("Error creating credit profile:", error);
			toast.error("Failed to create credit profile. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!open) return null;

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
				Enter customer details
			</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<Input
						placeholder="Enter customer name"
						name="customerName"
						id="customerName"
						label="Customer Name *"
						variant="secondary"
						register={register("customerName", {
							required: "Customer name is required",
						})}
						errors={errors.customerName}
					/>

					<Input
						placeholder="Enter phone number"
						name="customerPhone"
						id="customerPhone"
						label="Phone Number *"
						variant="secondary"
						register={register("customerPhone", {
							required: "Phone number is required",
							pattern: {
								value: /^[0-9+\-\s()]+$/,
								message: "Invalid phone number format",
							},
						})}
						errors={errors.customerPhone}
					/>

					<Input
						placeholder="Enter email (optional)"
						name="customerEmail"
						id="customerEmail"
						label="Email Address"
						variant="secondary"
						register={register("customerEmail", {
							validate: (value) => {
								if (!value || value.trim() === "") return true;
								const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
								return emailRegex.test(value) || "Invalid email address";
							},
						})}
						errors={errors.customerEmail}
					/>
				</div>

				<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
					<Button
						type="submit"
						variant="primary"
						disabled={loading}
						size="large"
						className="w-full"
					>
						{loading ? "Creating..." : "Create Profile"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default CreateCreditProfileModal;
