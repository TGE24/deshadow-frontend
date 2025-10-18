import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import {
	Inventory,
	useUpdateInventoryMutation,
} from "../../../generated/graphql";
import { useEffect } from "react";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
	selectedProduct?: Inventory | null;
}

type UpdateInventoryForm = {
	productUuid: string;
	quantityAvailable: number;
	quantityReserved: number;
};

const UpdateInventory: React.FC<ModalProps> = ({
	open,
	setOpen,
	refetch,
	selectedProduct,
}) => {
	const [updateInventory, { loading }] = useUpdateInventoryMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<UpdateInventoryForm>({
		defaultValues: {
			productUuid: selectedProduct?.product.uuid,
			quantityAvailable: selectedProduct?.quantityAvailable || 0,
			quantityReserved: selectedProduct?.quantityReserved || 0,
		},
	});

	useEffect(() => {
		if (open && selectedProduct) {
			const formData = {
				productUuid: selectedProduct.product.uuid,
				quantityAvailable: selectedProduct.quantityAvailable,
				quantityReserved: selectedProduct.quantityReserved,
			};
			reset(formData);
		}
	}, [open, selectedProduct, reset]);

	const onSumbit = async (data: UpdateInventoryForm) => {
		await updateInventory({
			variables: {
				input: {
					productUuid: selectedProduct?.product.uuid ?? "",
					quantityAvailable: data.quantityAvailable,
					quantityReserved: data.quantityReserved,
				},
				uuid: selectedProduct?.uuid ?? "",
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
						label="Quantity Available"
						placeholder="Enter quantity available"
						variant="secondary"
						register={register("quantityAvailable", {
							required: "Please enter quantity available",
						})}
						errors={errors.quantityAvailable}
						id="quantityAvailable"
					/>
					<Input
						label="Quantity Reserved"
						placeholder="Enter quantity reserved"
						variant="secondary"
						register={register("quantityReserved")}
						errors={errors.quantityReserved}
						id="quantityReserved"
					/>
				</div>
				<Button
					size="large"
					className="w-full"
					disabled={loading}
					type="submit"
				>
					{loading ? "Updating..." : "Update Inventory"}
				</Button>
			</form>
		</Modal>
	);
};

export default UpdateInventory;
