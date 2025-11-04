import { Step, SwapSaleFormData } from "./types";
import { PaymentType, ProductCondition } from "../../generated/graphql";

export const SWAP_SALE_STEPS: Step[] = [
	{
		id: 1,
		title: "Product & Swap Details",
		description: "Select product and swap phone details",
	},
	{
		id: 2,
		title: "Customer Details",
		description: "Enter customer information",
	},
	{ id: 3, title: "Review", description: "Review your swap details" },
];

export const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};

// Phone condition options for dropdown using GraphQL ProductCondition enum
export const phoneConditionOptions = Object.values(ProductCondition).map(
	(condition) => ({
		value: condition,
		label: condition
			.replace("_", " ")
			.toLowerCase()
			.replace(/\b\w/g, (c) => c.toUpperCase()),
	})
);

// Storage options for dropdown
export const storageOptions = [
	{ value: "16gb", label: "16GB" },
	{ value: "32gb", label: "32GB" },
	{ value: "64gb", label: "64GB" },
	{ value: "128gb", label: "128GB" },
	{ value: "256gb", label: "256GB" },
	{ value: "512gb", label: "512GB" },
	{ value: "1tb", label: "1TB" },
	{ value: "2tb", label: "2TB" },
];

// Initial form data
export const INITIAL_SWAP_SALE_FORM_DATA: SwapSaleFormData = {
	productItems: [],
	customerName: "",
	customerEmail: "",
	customerPhone: "",
	swapPhoneDetails: {
		serialNumber: "",
		brand: "",
		model: "",
		color: "",
		storage: "",
		condition: "",
		estimatedValue: 0,
	},
	subtotal: 0,
	totalAmount: 0,
	swapDifference: 0,
	discountAmount: 0,
	paymentType: PaymentType.Cash,
};
