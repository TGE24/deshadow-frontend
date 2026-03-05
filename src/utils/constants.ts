import { PaymentType } from "../generated/graphql";

export const selectStyles = {
	control: () =>
		"h-[48px] !rounded-[10px] !border-[#F0F0FF] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
	container: () => "w-full",
	indicatorSeparator: () => "hidden",
};
export const DEFAULT_PAGINATION_SIZE = 10;

export const CONDITION_STYLES = {
	new: "bg-green-100 text-green-800 border-green-200",
	used: "bg-yellow-100 text-yellow-800 border-yellow-200",
	refurbished: "bg-blue-100 text-blue-800 border-blue-200",
	damaged: "bg-red-100 text-red-800 border-red-200",
	default: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

export const PaymentTypeOptions = [
	{ value: PaymentType.Cash, label: "Cash" },
	{ value: PaymentType.Transfer, label: "Transfer" },
	{ value: PaymentType.Pos, label: "POS" },
	{ value: PaymentType.CashTransfer, label: "Cash + Transfer" },
	{ value: PaymentType.PosCash, label: "POS + Cash" },
	{ value: PaymentType.PosTransfer, label: "POS + Transfer" },
];
