import React from "react";
import Button from "./Button";
import Plus from "./Icons/Plus";

interface TableEmptyStateProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	colSpan: number;
	action?: () => void;
	buttonCopy?: string;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({
	title,
	description,
	icon,
	colSpan,
	action,
	buttonCopy,
}) => {
	const defaultIcon = (
		<svg
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			className="text-gray-400"
		>
			<path d="M3 3v18h18" />
			<path d="M18.7 8a3 3 0 0 0-5.4 0l-6.6 8" />
			<path d="M7 16h8" />
		</svg>
	);

	return (
		<tbody>
			<tr>
				<td colSpan={colSpan} className="text-center py-[60px] px-[18px]">
					<div className="flex flex-col items-center justify-center gap-[16px] border-[1px] border-[#E3E3E3] rounded-[8px] p-[40px]">
						<div className="w-[80px] h-[80px] bg-gray-100 rounded-full flex items-center justify-center">
							{icon || defaultIcon}
						</div>
						<div className="text-center">
							<h3 className="text-[18px] font-semibold text-gray-700 mb-[8px]">
								{title}
							</h3>
							<p className="text-[14px] text-gray-500 max-w-[300px]">
								{description}
							</p>
							{buttonCopy && (
								<Button
									size="small"
									icon={<Plus color="#060606" />}
									onClick={action}
									className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
								>
									{buttonCopy}
								</Button>
							)}
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	);
};

export default TableEmptyState;
