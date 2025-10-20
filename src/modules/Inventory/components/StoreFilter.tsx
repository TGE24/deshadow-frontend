import React from "react";
import Select from "react-select";

interface StoreFilterProps {
	filterStore: string;
	setFilterStore: (store: string) => void;
	setPage: (page: number) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	stores: any;
}

export const StoreFilter: React.FC<StoreFilterProps> = ({
	filterStore,
	setFilterStore,
	setPage,
	stores,
}) => {
	return (
		<div className="flex flex-col sm:flex-row gap-[16px] items-start sm:items-center">
			<label className="text-[14px] font-medium text-gray-700">
				Filter by Store:
			</label>
			<div className="w-full sm:w-[200px]">
				<Select
					value={{
						value: filterStore,
						label: stores?.stores.edges
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							.map((edge: any) => edge.node)
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							.find((store: any) => store.uuid === filterStore)?.name,
					}}
					onChange={(option) => {
						setFilterStore((option?.value as string) || "");
						setPage(1); // Reset to first page when filter changes
					}}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					options={stores?.stores.edges.map((edge: any) => ({
						value: edge.node.uuid,
						label: edge.node.name,
					}))}
					classNames={{
						control: () =>
							"h-[40px] !rounded-[8px] !border-[#E5E7EB] border-[1px] cursor-pointer outline-none focus:outline-none text-[14px]",
						container: () => "w-full",
						indicatorSeparator: () => "hidden",
					}}
					placeholder="Select store..."
				/>
			</div>
		</div>
	);
};
