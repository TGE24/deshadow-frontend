import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Select from "react-select";
import {
	Category,
	CategoryStatus,
	useUpdateCategoryMutation,
} from "../../../generated/graphql";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedCategory?: Category | null;
}

const EditCategory: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedCategory,
}) => {
	const [updateCategory, { loading }] = useUpdateCategoryMutation();
	const [selectedStatus, setSelectedStatus] = useState<CategoryStatus | null>(
		null
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<{ name: string; status: CategoryStatus; description: string }>({
		defaultValues: {
			name: "",
			status: "" as CategoryStatus,
			description: "",
		},
	});

	const onSumbit = async (data: {
		name: string;
		status: CategoryStatus;
		description: string;
	}) => {
		await updateCategory({
			variables: {
				input: {
					name: data.name,
					status: data.status as CategoryStatus,
					description: data.description,
				},
				uuid: selectedCategory?.uuid as string,
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

	// Update form values when selectedUser changes or modal opens
	useEffect(() => {
		if (open && selectedCategory) {
			const formData = {
				name: selectedCategory.name || "",
				description: selectedCategory.description || "",
				status: selectedCategory.status || ("" as CategoryStatus),
			};
			reset(formData);
			setSelectedStatus(selectedCategory.status as CategoryStatus);
		} else if (open && !selectedCategory) {
			// Reset to empty values for new user
			const formData = {
				name: "",
				status: "" as CategoryStatus,
				description: "",
			};
			reset(formData);
			setSelectedStatus(CategoryStatus.Inactive);
		}
	}, [open, selectedCategory, reset]);

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
				Enter category details
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<Input
						label="Category name"
						placeholder="Enter category name"
						variant="secondary"
						register={register("name", {
							required: "Please Enter your Category Name",
						})}
						errors={errors.name}
						id="name"
					/>
					<div>
						<label
							className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
							htmlFor="status"
						>
							Status
						</label>
						<Select
							options={Object.values(CategoryStatus).map((status) => ({
								value: status,
								label: status
									.replace("_", " ")
									.toLowerCase()
									.replace(/\b\w/g, (c) => c.toUpperCase()),
							}))}
							value={
								selectedStatus
									? {
											value: selectedStatus,
											label: selectedStatus
												.replace("_", " ")
												.toLowerCase()
												.replace(/\b\w/g, (c) => c.toUpperCase()),
									  }
									: null
							}
							placeholder="Select status"
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px] text-black",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								const newStatus = option
									? (option.value as CategoryStatus)
									: ("" as CategoryStatus);
								setValue("status", newStatus);
								setSelectedStatus(newStatus || null);
							}}
							name="status"
						/>
						{errors.status && (
							<span className="text-red-500 text-sm">
								{errors.status.message}
							</span>
						)}
					</div>
					<Input
						label="Category description"
						placeholder="Enter category description"
						variant="secondary"
						register={register("description", {
							required: "Please Enter your Category Description",
						})}
						errors={errors.description}
						id="description"
					/>
				</div>
				<Button
					size="large"
					className="w-full"
					disabled={loading}
					type="submit"
				>
					{loading ? "Creating..." : "SAVE CHANGES"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditCategory;
