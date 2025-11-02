import { SwapProductItem } from "./types";

// Calculate swap totals including the difference
export const calculateSwapTotals = (
	productItems: SwapProductItem[],
	swapPhoneValue: number = 0
) => {
	const subtotal = productItems.reduce((total, item) => {
		return total + item.unitPrice;
	}, 0);

	// Calculate the swap difference
	// Positive means customer pays more, negative means customer gets money back
	const swapDifference = subtotal - swapPhoneValue;
	const totalAmount = Math.max(0, swapDifference); // Customer only pays if positive

	return {
		subtotal,
		swapPhoneValue,
		swapDifference,
		totalAmount,
	};
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
	}).format(amount);
};

// Validate swap phone details
export const validateSwapPhoneDetails = (details: {
	serialNumber: string;
	brand: string;
	model: string;
	condition: string;
}) => {
	const requiredFields = ["serialNumber", "brand", "model", "condition"];
	return requiredFields.every((field) =>
		details[field as keyof typeof details]?.trim()
	);
};
