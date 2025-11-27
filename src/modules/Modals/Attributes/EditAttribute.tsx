import Modal from "react-responsive-modal";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useForm } from "react-hook-form";
import {
	Attribute,
	useUpdateAttributeMutation,
} from "../../../generated/graphql";
import { toast } from "react-toastify";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedAttribute?: Attribute | null;
}

const EditAttribute: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedAttribute,
}) => {
	const [updateAttribute, { loading }] = useUpdateAttributeMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<{
		name: string;
	}>({
		defaultValues: {
			name: "",
		},
	});

	const onSumbit = async (data: { name: string }) => {
		// Build input object conditionally
		const input: {
			name: string;
		} = {
			name: data.name,
		};

		await updateAttribute({
			variables: {
				input,
				uuid: selectedAttribute?.uuid,
			},
			onCompleted() {
				setOpen(false);
				toast("Attribute updated successfully", { type: "success" });
				reset();
				refetch();
			},
			onError(error: { message: string }) {
				toast(error.message, { type: "error" });
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
				Update Attribute
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px]">
					<Input
						label="Name"
						placeholder="Enter attribute name"
						variant="secondary"
						register={register("name", {
							required: "Please Enter the attribute name",
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
					{loading ? "loading..." : "Edit Attribute"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditAttribute;
