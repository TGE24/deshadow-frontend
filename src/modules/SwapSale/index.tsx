import Input from "../../components/Input";
import Button from "../../components/Button";

interface SwapSaleProps {
	setOverviewOpen: (open: boolean) => void;
	setOpen: (open: boolean) => void;
}

const SwapSale = ({ setOverviewOpen, setOpen }: SwapSaleProps) => {
	return (
		<div className="px-[24px] py-[48px]">
			<h3 className="text-[18px] font-semibold mb-[16px]">
				Enter Swap Phone Details
			</h3>
			<div className="flex justify-between gap-[100px]">
				<div className="flex flex-col gap-[24px] w-full">
					<Input
						placeholder="Enter customer name"
						name="customerName"
						id="customerName"
						label="Customer Name"
						variant="secondary"
					/>
					<Input
						placeholder="Enter phone number"
						name="phoneNumber"
						id="phoneNumber"
						label="Phone Number"
						variant="secondary"
					/>

					<Input
						placeholder="Phone IMEI Number"
						name="imeiNumber"
						id="imeiNumber"
						label="IMEI Number"
						variant="secondary"
					/>

					<Input
						placeholder="Brand"
						name="brand"
						id="brand"
						label="Brand"
						variant="secondary"
					/>
				</div>
				<div className="flex flex-col gap-[24px] w-full">
					<Input
						placeholder="Color"
						name="color"
						id="color"
						label="Color"
						variant="secondary"
					/>
					<Input
						placeholder="Category"
						name="category"
						id="category"
						label="Category"
						variant="secondary"
					/>

					<Input
						placeholder="Storage"
						name="storage"
						id="storage"
						label="Storage"
						variant="secondary"
					/>

					<Input
						placeholder="Phone Condition"
						name="phoneCondition"
						id="phoneCondition"
						label="Phone Condition"
						variant="secondary"
					/>
				</div>
			</div>
			<h3 className="text-[18px] font-semibold mb-[16px] mt-[60px]">
				Enter New Phone Details
			</h3>

			<div className="flex flex-col gap-[24px]">
				<div className="flex flex-col gap-[8px]">
					<Input
						placeholder="Enter imei number"
						name="imeiNumber"
						id="imeiNumber"
						label="IMEI Number"
						variant="secondary"
					/>
					<p
						className="text-[14px] underline cursor-pointer text-right"
						onClick={() => setOpen(true)}
					>
						View device details
					</p>
				</div>

				<Input
					placeholder="Enter Amount Paid"
					name="amountPaid"
					id="amountPaid"
					label="Amount Paid"
					variant="secondary"
				/>

				<Input
					placeholder="Select Payment Method"
					name="paymentMethod"
					id="paymentMethod"
					label="Payment Method"
					variant="secondary"
				/>
			</div>

			<Button
				className="w-full mt-[33px]"
				size="large"
				onClick={() => setOverviewOpen(true)}
			>
				Continue
			</Button>
		</div>
	);
};

export default SwapSale;
