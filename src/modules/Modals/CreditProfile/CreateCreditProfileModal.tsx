import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateCreditProfileMutation } from "../../../generated/graphql";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

interface CreateCreditProfileModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onProfileCreated?: (profile: {
		customerName: string;
		customerEmail?: string | null;
		customerPhone?: string | null;
	}) => void;
}

interface CreditProfileFormData {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
}

const CreateCreditProfileModal = ({
	open,
	setOpen,
	onProfileCreated,
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
				onProfileCreated?.(result.data.createCreditProfile);
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

	const handleClose = () => {
		reset();
		setOpen(false);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				{/* Backdrop */}
				<div
					className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
					onClick={handleClose}
				/>

				{/* Modal */}
				<div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<div className="mb-4">
								<h3 className="text-lg font-semibold leading-6 text-gray-900">
									Create New Credit Profile
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Add a new customer for credit sales
								</p>
							</div>

							<div className="space-y-4">
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
											const emailRegex =
												/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
											return emailRegex.test(value) || "Invalid email address";
										},
									})}
									errors={errors.customerEmail}
								/>
							</div>
						</div>

						<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
							<Button
								type="submit"
								variant="primary"
								disabled={loading}
								className="w-full sm:w-auto"
							>
								{loading ? "Creating..." : "Create Profile"}
							</Button>
							<Button
								type="button"
								variant="secondary"
								onClick={handleClose}
								disabled={loading}
								className="w-full sm:w-auto mt-3 sm:mt-0"
							>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateCreditProfileModal;
