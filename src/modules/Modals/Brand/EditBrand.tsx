import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { Brand, useUpdateBrandMutation } from "../../../generated/graphql";
import { useEffect } from "react";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedBrand?: Brand | null;
}

const EditBrand: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedBrand,
}) => {
	const [updateBrand, { loading }] = useUpdateBrandMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<{ name: string; logoUrl: string; description: string }>({
		defaultValues: {
			name: selectedBrand?.name || "",
			logoUrl: selectedBrand?.logoUrl || "",
			description: selectedBrand?.description || "",
		},
	});

	// Update form values when selectedUser changes or modal opens
	useEffect(() => {
		if (open && selectedBrand) {
			const formData = {
				name: selectedBrand.name || "",
				logoUrl: selectedBrand.logoUrl || "",
				description: selectedBrand.description || "",
			};
			reset(formData);
		} else if (open && !selectedBrand) {
			// Reset to empty values for new user
			const formData = {
				name: "",
				logoUrl: "",
				description: "",
			};
			reset(formData);
		}
	}, [open, selectedBrand, reset]);

	const onSumbit = async (data: {
		name: string;
		logoUrl: string;
		description: string;
	}) => {
		await updateBrand({
			variables: {
				input: {
					name: data.name,
					description: data.description,
					logoUrl: data.logoUrl,
				},
				uuid: selectedBrand?.uuid || "",
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
				Enter brand details
			</h2>
			<form onSubmit={handleSubmit(onSumbit)}>
				<div className="mb-[46px] mt-[16px] flex gap-[24px] flex-col">
					<Input
						label="Brand name"
						placeholder="Enter brand name"
						variant="secondary"
						register={register("name", {
							required: "Please Enter Brand Name",
						})}
						errors={errors.name}
						id="name"
					/>
					<Input
						label="Logo Url"
						placeholder="Enter logo url"
						variant="secondary"
						register={register("logoUrl", {
							required: "Please Enter your Logo Url",
						})}
						errors={errors.logoUrl}
						id="logoUrl"
					/>
					<Input
						label="Brand description"
						placeholder="Enter brand description"
						variant="secondary"
						register={register("description", {
							required: "Please Enter your Brand Description",
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
					{loading ? "updating..." : "SAVE CHANGES"}
				</Button>
			</form>
		</Modal>
	);
};

export default EditBrand;
