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
 * @param includeSymbol - Whether to include the ₦ symbol (default: true)
 * @returns Formatted currency string
 */
export const formatNaira = (
	value: number | null | undefined,
	includeSymbol: boolean = true
): string => {
	const formatted = formatCurrency(value, { maximumFractionDigits: 0 });
	if (!includeSymbol) {
		return formatted.replace(/₦\s?/g, "").trim();
	}
	return formatted;
};

/**
 * Formats a number as Nigerian Naira with 2 decimal places
 * @param value - The numeric value to format
 * @param includeSymbol - Whether to include the ₦ symbol (default: true)
 * @returns Formatted currency string
 */
export const formatNairaWithDecimals = (
	value: number | null | undefined,
	includeSymbol: boolean = true
): string => {
	const formatted = formatCurrency(value, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});
	if (!includeSymbol) {
		return formatted.replace(/₦\s?/g, "").trim();
	}
	return formatted;
};

/**
 * Formats a date string or Date object to a human-readable format
 * @param dateValue - The date string or Date object to format
 * @returns Formatted date string (e.g., "Nov 4, 2025 3:45 PM")
 */
export const formatDateTime = (
	dateValue: string | Date | null | undefined
): string => {
	if (!dateValue) return "N/A";

	try {
		const date =
			typeof dateValue === "string" ? new Date(dateValue) : dateValue;

		if (isNaN(date.getTime())) {
			return "Invalid Date";
		}

		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	} catch {
		return "Invalid Date";
	}
};
