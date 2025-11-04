import { useEffect, useState, useMemo } from "react";
import { Sale, SaleType, useSalesLazyQuery } from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { formatNaira, formatDateTime } from "../utils/formatters";
import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
import DropdownMenu from "../components/DropdownMenu";
import MoreVertical from "../components/Icons/MoreVertical";
import UpdateStatus from "../modules/Modals/SalesDetails/UpdateStatus";
import { Pagination } from "../modules/Pagination";

const SalesManagement = () => {
	const [open, setOpen] = useState(false);
	const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
	const [selectedSale, setSelectedSale] = useState<Sale>({} as Sale);
	const [page, setPage] = useState(1);
	const [getSales, { data: sales, loading, refetch }] = useSalesLazyQuery({
		fetchPolicy: "network-only",
	});

	const [data, setData] = useState<Sale[]>([]);

	const columns = useMemo<ColumnDef<Sale>[]>(() => {
		const baseColumns: ColumnDef<Sale>[] = [
			{
				accessorKey: "customerName",
				cell: (info) => info.getValue(),
				header: () => <h4>Customer Name</h4>,
			},
			{
				accessorKey: "totalAmount",
				cell: (info) => {
					const value = info.getValue() as number;
					return formatNaira(value);
				},
				header: () => <h4>Total Amount</h4>,
			},
			{
				accessorKey: "createdAt",
				cell: (info) => {
					const value = info.getValue() as string;
					return formatDateTime(value);
				},
				header: () => <h4>Created At</h4>,
			},

			{
				accessorKey: "saleStatus",
				cell: (info) => {
					const status = info.getValue() as string;
					const getStatusStyles = (status: string) => {
						switch (status?.toLowerCase()) {
							case "completed":
								return "bg-green-100 text-green-800 border-green-200";
							case "pending":
								return "bg-yellow-100 text-yellow-800 border-yellow-200";
							case "cancelled":
								return "bg-red-100 text-red-800 border-red-200";
							case "returned":
								return "bg-gray-100 text-gray-800 border-gray-200";
							default:
								return "bg-gray-100 text-gray-800 border-gray-200";
						}
					};

					return (
						<span
							className={`px-[8px] py-[4px] rounded-[4px] text-[12px] font-medium border capitalize ${getStatusStyles(
								status
							)}`}
						>
							{status}
						</span>
					);
				},
				header: () => <h4>Sale Status</h4>,
			},
		];
		{
			baseColumns.push({
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu
						trigger={
							<div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
								<MoreVertical className="w-4 h-4" color="black" />
							</div>
						}
						items={[
							{
								label: "View Sale",
								onClick: () => {
									setSelectedSale(row.original);
									setOpen(true);
								},
							},
							...(row.original.saleStatus?.toLowerCase() !== "completed"
								? [
										{
											label: "Update Status",
											onClick: () => {
												setSelectedSale(row.original);
												setUpdateStatusOpen(true);
											},
										},
								  ]
								: []),
						]}
					/>
				),
			});
		}

		return baseColumns;
	}, []);

	useEffect(() => {
		getSales({
			variables: {
				pagination: { first: 10 },
				filter: {
					saleType: SaleType.Credit,
				},
			},
		});
	}, [getSales]);

	useEffect(() => {
		if (sales?.sales?.edges) {
			setData(
				sales.sales.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Sale") as Sale[]
			);
		}
	}, [sales]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (sales?.sales?.pageInfo?.hasNextPage) {
			getSales({
				variables: {
					pagination: {
						first: 10,
						after: sales?.sales?.pageInfo?.endCursor,
					},
					filter: {
						saleType: SaleType.Credit,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (sales?.sales?.pageInfo?.hasPreviousPage) {
			getSales({
				variables: {
					pagination: {
						last: 10,
						before: sales?.sales?.pageInfo?.startCursor,
					},
					filter: {
						saleType: SaleType.Credit,
					},
				},
			});
			setPage(page - 1);
		}
	};

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Manage Resellers Record
					</h2>
				</div>
			</div>
			<div className="w-full mt-[48px] overflow-x-auto">
				<table className="w-full min-w-[800px]">
					<thead className="bg-[#D4E7E6] h-[41px]">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="text-[14px] font-semibold">
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="text-left first-of-type:pl-[18px] whitespace-nowrap px-[12px]"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</th>
								))}
							</tr>
						))}
					</thead>
					{loading ? (
						<TableLoader columns={columns.length} />
					) : data.length === 0 ? (
						<TableEmptyState
							title="No Sales Found"
							description="There are no sales records to display. Sales will appear here once they are created."
							colSpan={columns.length}
						/>
					) : (
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="border-b-[1px] border-[#E3E3E3]">
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="first-of-type:pl-[18px] py-[20px] text-[14px] whitespace-nowrap px-[12px]"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					)}
				</table>

				<Pagination
					page={page}
					loading={loading}
					totalCount={sales?.sales.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={sales?.sales?.pageInfo?.hasNextPage ?? false}
					hasPreviousPage={sales?.sales?.pageInfo?.hasPreviousPage ?? false}
					onNextPage={nextPage}
					onPrevPage={prevPage}
				/>
			</div>
			<ViewSale open={open} setOpen={setOpen} sale={selectedSale} />
			<UpdateStatus
				open={updateStatusOpen}
				setOpen={setUpdateStatusOpen}
				sale={selectedSale}
				refetch={refetch}
			/>
		</>
	);
};

export default SalesManagement;
