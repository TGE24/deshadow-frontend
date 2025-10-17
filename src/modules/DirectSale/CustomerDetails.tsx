import Input from "../../components/Input";
import { UseFormRegister } from "react-hook-form";
import { CreateSaleForm } from "./types";

interface CustomerDetailsProps {
	register: UseFormRegister<CreateSaleForm>;
}

const CustomerDetails = ({ register }: CustomerDetailsProps) => (
	<div className="flex flex-col gap-[24px] border border-gray-200 rounded-[10px] p-[20px]">
		<h3 className="text-[20px] font-semibold">Customer Details</h3>
		<Input
			placeholder="Enter customer name"
			name="customerName"
			id="customerName"
			label="Name"
			variant="secondary"
			register={register("customerName", {
				required: "Customer name is required",
			})}
		/>
		<div className="flex gap-[16px]">
			<Input
				placeholder="Enter customer Email"
				name="customerEmail"
				id="customerEmail"
				label="Email"
				variant="secondary"
				register={register("customerEmail", {
					required: "Customer email is required",
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
						message: "Invalid email address",
					},
				})}
			/>
			<Input
				placeholder="Enter customer phone number"
				name="customerPhone"
				id="customerPhone"
				label="Phone Number"
				variant="secondary"
				register={register("customerPhone", {
					required: "Customer phone number is required",
				})}
			/>
		</div>
	</div>
);

export default CustomerDetails;
