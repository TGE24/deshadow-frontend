import { useEffect } from "react";
import Input from "../../components/Input";
import {
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { CreateSaleForm } from "./types";
import {
	PaymentType,
	SaleType,
	useCreditProfilesLazyQuery,
} from "../../generated/graphql";

interface CustomerDetailsProps {
	register: UseFormRegister<CreateSaleForm>;
	setValue: UseFormSetValue<CreateSaleForm>;
	watch: UseFormWatch<CreateSaleForm>;
}

const CustomerDetails = ({
	register,
	setValue,
	watch,
}: CustomerDetailsProps) => {
	const paymentType = watch("paymentType");
	const saleType = watch("saleType");

	const [
		getCreditProfiles,
		{ data: creditProfilesData, loading: loadingProfiles },
	] = useCreditProfilesLazyQuery({
		fetchPolicy: "network-only",
	});

	// Load credit profiles when credit sale is selected
	useEffect(() => {
		if (saleType === SaleType.Credit) {
			getCreditProfiles({
				variables: {
					pagination: { first: 100 },
				},
			});
		}
	}, [saleType, getCreditProfiles]);

	// Payment type options
	const paymentTypeOptions = [
		{ value: PaymentType.Cash, label: "Cash" },
		{ value: PaymentType.Transfer, label: "Transfer" },
		{ value: PaymentType.Pos, label: "POS" },
		{ value: PaymentType.CashTransfer, label: "Cash + Transfer" },
		{ value: PaymentType.PosCash, label: "POS + Cash" },
		{ value: PaymentType.PosTransfer, label: "POS + Transfer" },
	];

	// Credit profile options
	const creditProfileOptions =
		creditProfilesData?.creditProfiles.edges.map((edge) => {
			const profile = edge.node;
			return {
				value: profile.uuid,
				label: `${profile.customerName} - ${profile.customerPhone}${
					profile.customerEmail ? ` (${profile.customerEmail})` : ""
				}`,
				profile,
			};
		}) || [];

	const handleCreditProfileSelect = (
		selectedOption: SingleValue<{
			value: string;
			label: string;
			profile: {
				customerName: string;
				customerEmail?: string | null;
				customerPhone?: string | null;
			};
		}>,
	) => {
		if (selectedOption) {
			// Set the credit profile UUID
			setValue("creditProfileUuid", selectedOption.value);
			// Auto-fill customer details from selected profile
			setValue("customerName", selectedOption.profile.customerName);
			setValue("customerEmail", selectedOption.profile.customerEmail || "");
			setValue("customerPhone", selectedOption.profile.customerPhone || "");
		} else {
			// Clear credit profile UUID when selection is cleared
			setValue("creditProfileUuid", undefined);
		}
	};

	return (
		<div className="flex flex-col gap-[24px] border border-gray-200 rounded-[10px] p-[20px]">
			<h3 className="text-[20px] font-semibold">Customer Profile</h3>

			{/* Credit Profile Dropdown - Only show for credit sales */}
			{saleType === SaleType.Credit && (
				<div className="w-full">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Select Customer
					</label>
					<Select
						value={null}
						onChange={handleCreditProfileSelect}
						options={creditProfileOptions}
						className="text-sm"
						placeholder="Select a customer..."
						isLoading={loadingProfiles}
						isClearable
						menuPortalTarget={document.body}
						menuPosition="fixed"
						noOptionsMessage={() => "No profiles found create profile below"}
						styles={{
							control: (base) => ({
								...base,
								minHeight: "48px",
								borderColor: "#d1d5db",
								borderRadius: "8px",
								"&:hover": {
									borderColor: "#9ca3af",
								},
							}),
							option: (base, state) => ({
								...base,
								backgroundColor: state.isSelected
									? "#3b82f6"
									: state.isFocused
										? "#eff6ff"
										: "white",
							}),
							menuPortal: (base) => ({
								...base,
								zIndex: 9999,
							}),
						}}
					/>
					<p className="text-xs text-gray-500 mt-1">
						Select an existing profile or enter new customer details below. If
						the profile doesn't exist,
					</p>
				</div>
			)}

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
					placeholder={
						saleType === SaleType.Credit
							? "customer@example.com (optional)"
							: "Enter customer Email"
					}
					name="customerEmail"
					id="customerEmail"
					label="Email"
					variant="secondary"
					register={register("customerEmail", {
						validate: (value: string) => {
							const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
							if (!value || value.trim() === "") {
								return saleType === SaleType.Credit
									? true
									: "Customer email is required";
							}
							return emailRegex.test(value) || "Invalid email address";
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

			{/* Payment Type Selection */}
			<div className="w-full">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Payment Type
				</label>
				<Select
					value={paymentTypeOptions.find(
						(option) => option.value === paymentType,
					)}
					onChange={(
						selectedOption: SingleValue<{ value: PaymentType; label: string }>,
					) => {
						if (selectedOption) {
							setValue("paymentType", selectedOption.value);
						}
					}}
					options={paymentTypeOptions}
					className="text-sm"
					placeholder="Select payment type..."
					menuPortalTarget={document.body}
					menuPosition="fixed"
					styles={{
						control: (base) => ({
							...base,
							minHeight: "48px",
							borderColor: "#d1d5db",
							borderRadius: "8px",
							"&:hover": {
								borderColor: "#9ca3af",
							},
						}),
						option: (base, state) => ({
							...base,
							backgroundColor: state.isSelected
								? "#3b82f6"
								: state.isFocused
									? "#eff6ff"
									: "white",
						}),
						menuPortal: (base) => ({
							...base,
							zIndex: 9999,
						}),
					}}
				/>
			</div>
		</div>
	);
};

export default CustomerDetails;
