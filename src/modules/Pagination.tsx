import React from "react";
import Button from "../components/Button";

interface PaginationProps {
	page: number;
	loading: boolean;
	totalCount: number;
	dataLength: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onNextPage: () => void;
	onPrevPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	page,
	loading,
	totalCount,
	dataLength,
	hasNextPage,
	hasPreviousPage,
	onNextPage,
	onPrevPage,
}) => {
	if (totalCount <= 10) {
		return null;
	}

	return (
		<div className="flex items-center justify-between mt-[30px]">
			<p>
				Showing 1 to {dataLength} of {totalCount} entries
			</p>
			<div className="flex items-center gap-[15px]">
				<Button
					variant="tetriary"
					disabled={!hasPreviousPage || loading}
					size="small"
					onClick={onPrevPage}
				>
					Previous
				</Button>
				<div className="px-[18px] py-[11px] bg-[#278783] rounded-[6px] text-white">
					{page}
				</div>
				<Button
					variant="tetriary"
					size="small"
					disabled={!hasNextPage || loading}
					onClick={onNextPage}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
