import Input from "../../components/Input";
import Button from "../../components/Button";

interface DirectSaleProps {
	setOverviewOpen: (open: boolean) => void;
	setOpen: (open: boolean) => void;
}

const DirectSale = ({ setOverviewOpen, setOpen }: DirectSaleProps) => {
	return (
		<div className="px-[24px] py-[48px]">
			<h3 className="text-[18px] font-semibold mb-[16px]">
				Enter product Details
			</h3>
			<div className="flex flex-col gap-[24px] max-w-[600px]">
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
				<Button size="large" onClick={() => setOverviewOpen(true)}>
					Continue
				</Button>
			</div>
		</div>
	);
};

export default DirectSale;
