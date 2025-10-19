import React from "react";
import { getConditionStyle, formatConditionText } from "../utils";

interface ConditionBadgeProps {
	condition: string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({
	condition,
}) => {
	return (
		<span
			className={`px-3 py-1 rounded-full text-xs font-medium border ${getConditionStyle(
				condition
			)}`}
		>
			{formatConditionText(condition)}
		</span>
	);
};
