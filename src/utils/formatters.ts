/**
 * Formats a number as Nigerian Naira currency
 * @param value - The numeric value to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
	value: number | null | undefined,
	options: {
		maximumFractionDigits?: number;
		minimumFractionDigits?: number;
		locale?: string;
		currency?: string;
		symbol?: string;
	} = {}
): string => {
	const {
		maximumFractionDigits = 0,
		minimumFractionDigits = 0,
		locale = "en-NG",
		symbol = "₦",
	} = options;

	if (!value && value !== 0) {
		return `${symbol}0`;
	}

	const formattedValue = value.toLocaleString(locale, {
		maximumFractionDigits,
		minimumFractionDigits,
	});

	return `${symbol}${formattedValue}`;
};

/**
 * Formats a number as Nigerian Naira without decimal places
 * @param value - The numeric value to format
 * @returns Formatted currency string
 */
export const formatNaira = (value: number | null | undefined): string => {
	return formatCurrency(value, { maximumFractionDigits: 0 });
};

/**
 * Formats a number as Nigerian Naira with 2 decimal places
 * @param value - The numeric value to format
 * @returns Formatted currency string
 */
export const formatNairaWithDecimals = (
	value: number | null | undefined
): string => {
	return formatCurrency(value, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});
};
