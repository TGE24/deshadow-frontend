import { CONDITION_STYLES } from "../../utils/constants";

export const getConditionStyle = (condition: string): string => {
	const normalizedCondition =
		condition?.toLowerCase() as keyof typeof CONDITION_STYLES;
	return CONDITION_STYLES[normalizedCondition] || CONDITION_STYLES.default;
};

export const formatConditionText = (condition: string): string => {
	return (
		condition
			?.replace("_", " ")
			.toLowerCase()
			.replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown"
	);
};
