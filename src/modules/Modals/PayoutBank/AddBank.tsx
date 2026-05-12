import Modal from "react-responsive-modal";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useCreatePayoutBankMutation } from "../../../generated/graphql";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { MyazaPOS } from "@myazahq/pos-sdk";
import Select from "react-select";

interface ModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	refetch: () => void;
}

interface Bank {
	available: boolean;
	country: string;
	currency: string;
	id: string;
	name: string;
	networkId: string;
}

const AddBank: React.FC<ModalProps> = ({ open, setOpen, refetch }) => {
	const [createBank, { loading }] = useCreatePayoutBankMutation();
	const [banks, setBanks] = useState<Bank[]>();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<{ bankName: string; accountNumber: string }>({
		defaultValues: {
			accountNumber: "",
			bankName: "",
		},
	});

	const onSumbit = async (data: {
		bankName: string;
		accountNumber: string;
	}) => {
		await createBank({
			variables: {
				input: {
					bankName: data.bankName,
					accountNumber: data.accountNumber,
				},
			},
			onCompleted() {
				setOpen(false);
				reset();
				refetch();
			},
			onError(error: { message: string }) {
				toast.error(error.message);
			},
		});
	};

	const sdk = new MyazaPOS({
		merchantId: import.meta.env.VITE_ENV_MYAZA_MERCHANT_ID,
		isSandbox: true,
	});

	useEffect(() => {
		const accountNumber = watch("accountNumber");
		const networkId = watch("bankName");
		(async () => {
			if (accountNumber.length === 10) {
				await sdk.init();

				const acount = await sdk.resolveAccount(networkId, accountNumber);

				console.log(acount);
			}
		})();
	}, [watch]);

	useEffect(() => {
		(async () => {
			await sdk.init();

			const banks = await sdk.getBanks("NGN");

			setBanks(banks);
		})();
	}, []);

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
				Enter Account Details
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
							options={banks?.map((bank) => ({
								value: bank.networkId,
								label: bank.name,
							}))}
							placeholder="Select status"
							classNames={{
								control: () =>
									"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
								container: () => "w-full",
								indicatorSeparator: () => "hidden",
							}}
							onChange={(option) => {
								setValue("bankName", option ? option.value : "");
							}}
							name="role"
							menuPortalTarget={document.body}
							menuPosition="fixed"
							styles={{
								menuPortal: (base) => ({
									...base,
									zIndex: 9999,
								}),
							}}
						/>
						{errors.bankName && (
							<span className="text-red-500 text-sm">
								{errors.bankName.message}
							</span>
						)}
					</div>
					<Input
						label="Account Number"
						placeholder="Enter account number"
						variant="secondary"
						register={register("accountNumber", {
							required: "Please Enter your Account Number",
						})}
						errors={errors.accountNumber}
						id="accountNumber"
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

export default AddBank;
