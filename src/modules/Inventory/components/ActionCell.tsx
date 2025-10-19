import React from "react";

interface ActionCellProps {
	onUpdate: () => void;
	copy: string;
}

export const ActionCell: React.FC<ActionCellProps> = ({ onUpdate, copy }) => {
	return (
		<div className="flex gap-[20px]">
			<button className="font-medium cursor-pointer" onClick={onUpdate}>
				{copy}
			</button>
		</div>
	);
};
