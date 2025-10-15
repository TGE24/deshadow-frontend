import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useCreateStoreMutation } from "../../../generated/graphql";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

type FormData = {
	name: string;
	address: string;
	description: string;
	phone: string;
	businessRegistration: string;
};

const CreateStore: React.FC<ModalProps> = ({ open, setOpen, refetch }) => {
	const [createStore, { loading }] = useCreateStoreMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		defaultValues: {
			name: "",
			address: "",
			description: "",
			phone: "",
			businessRegistration: "",
		},
	});

	const onSumbit = async (data: FormData) => {
		await createStore({
			variables: {
				input: {
					name: data.name,
					description: data.description,
					address: data.address,
					phone: data.phone,
					businessRegistration: data.businessRegistration,
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
				Enter store details
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<Input
						label="Store name"
						placeholder="Enter store name"
						variant="secondary"
						register={register("name", {
							required: "Please Enter Store Name",
						})}
						errors={errors.name}
						id="name"
					/>
					<Input
						label="Address"
						placeholder="Enter address"
						variant="secondary"
						register={register("address", {
							required: "Please Enter your Address",
						})}
						errors={errors.address}
						id="address"
					/>
					<Input
						label="Phone"
						placeholder="Enter phone number"
						variant="secondary"
						register={register("phone", {
							required: "Please Enter your Phone Number",
						})}
						errors={errors.phone}
						id="phone"
					/>
					<Input
						label="Business Registration"
						placeholder="Enter business registration"
						variant="secondary"
						register={register("businessRegistration", {
							required: "Please Enter your Business Registration",
						})}
						errors={errors.businessRegistration}
						id="businessRegistration"
					/>
					<Input
						label="Store description"
						placeholder="Enter store description"
						variant="secondary"
						register={register("description", {
							required: "Please Enter your Store Description",
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
					{loading ? "Creating..." : "SAVE"}
				</Button>
			</form>
		</Modal>
	);
};

export default CreateStore;
