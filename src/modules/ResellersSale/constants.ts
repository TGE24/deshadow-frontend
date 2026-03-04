import { Step } from "./types";

export const steps: Step[] = [
	{
		id: 1,
		title: "Product Information",
		description: "Select product and price",
	},
	{ id: 2, title: "Review", description: "Review your order details" },
	// { id: 3, title: "Payment", description: "Set payment details" },
];

export const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};
