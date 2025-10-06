import Modal from "react-responsive-modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import {
	CategoryStatus,
	useCreateCategoryMutation,
} from "../../generated/graphql";
import Select from "react-select";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

const AddCategory: React.FC<ModalProps> = ({ open, setOpen, refetch }) => {
	const [createCategory, { loading }] = useCreateCategoryMutation();
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
		await createCategory({
			variables: {
				input: {
					name: data.name,
					status: data.status,
					description: data.description,
				},
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
								label: status,
							}))}
							placeholder="Select status"
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								setValue(
									"status",
									option
										? (option.value as CategoryStatus)
										: ("" as CategoryStatus)
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

export default AddCategory;
