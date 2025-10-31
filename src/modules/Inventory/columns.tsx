import { ColumnDef } from "@tanstack/react-table";
import { formatNaira } from "../../utils/formatters";
import { ConditionBadge } from "./components/ConditionBadge";
import { ActionCell } from "./components/ActionCell";
import { Inventory } from "../../generated/graphql";

interface CreateColumnsProps {
	onUpdate: (product: Inventory) => void;
	onDelete: (product: Inventory) => void;
}

export const createInventoryColumns = ({
	onUpdate,
	onDelete,
}: CreateColumnsProps): ColumnDef<Inventory>[] => [
	{
		accessorKey: "product.name",
		cell: (info) => info.getValue(),
		header: () => <h4>Product Name</h4>,
	},
	{
		accessorKey: "product.model",
		cell: (info) => info.getValue(),
		header: () => <h4>Model</h4>,
	},
	{
		accessorKey: "product.condition",
		cell: (info) => {
			const condition = info.getValue() as string;
			return <ConditionBadge condition={condition} />;
		},
		header: () => <h4>Condition</h4>,
	},
	{
		accessorKey: "quantityAvailable",
		cell: (info) => info.getValue(),
		header: () => <h4>Quantity Available</h4>,
	},
	{
		accessorKey: "product.costPrice",
		cell: (info) => {
			const value = info.getValue() as number;
			return formatNaira(value);
		},
		header: () => <h4>Cost Price</h4>,
	},
	{
		accessorKey: "product.sellingPrice",
		cell: (info) => {
			const value = info.getValue() as number;
			return formatNaira(value);
		},
		header: () => <h4>Selling Price</h4>,
	},
	{
		header: "Actions",
		cell: ({ row }) => (
			<div className="flex gap-[20px]">
				<ActionCell onUpdate={() => onUpdate(row.original)} copy="Update" />
				<ActionCell onUpdate={() => onDelete(row.original)} copy="Delete" />
			</div>
		),
	},
];
