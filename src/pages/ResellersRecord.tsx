import { useEffect, useState, useMemo } from "react";
import {
	Sale,
	SaleType,
	SaleStatus,
	useSalesLazyQuery,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { formatDateTime, formatNaira } from "../utils/formatters";
import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
import { Pagination } from "../modules/Pagination";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import DirectSale from "../modules/DirectSale";
import { Modal } from "react-responsive-modal";
import PurchaseOverview from "../modules/Modals/PurchaseOverview";
import ViewProduct from "../modules/Modals/ViewProduct";

const ResellersRecord = () => {
	const [open, setOpen] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [creditDeviceModalOpen, setCreditDeviceModalOpen] = useState(false);
	const [overviewOpen, setOverviewOpen] = useState(false);
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
				header: "Created By",
				cell: ({ row }) => {
					const value = row.original.createdBy;
					return `${value?.firstName} ${value?.lastName} (${
						value?.role ?? ""
					})`;
				},
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
				accessorKey: "saleType",
				cell: (info) => {
					const saleType = info.getValue() as SaleType;
					const getSaleTypeStyles = (type: SaleType) => {
						switch (type) {
							case SaleType.Direct:
								return "bg-blue-100 text-blue-800";
							case SaleType.Swap:
								return "bg-green-100 text-green-800";
							case SaleType.Credit:
								return "bg-orange-100 text-orange-800";
							default:
								return "bg-gray-100 text-gray-800";
						}
					};

					const getSaleTypeLabel = (type: SaleType) => {
						switch (type) {
							case SaleType.Direct:
								return "Direct Sale";
							case SaleType.Swap:
								return "Swap Sale";
							case SaleType.Credit:
								return "Credit Sale";
							default:
								return type;
						}
					};

					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${getSaleTypeStyles(
								saleType
							)}`}
						>
							{getSaleTypeLabel(saleType)}
						</span>
					);
				},
				header: () => <h4>Sale Type</h4>,
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

		return baseColumns;
	}, []);

	// Load credit sales only
	useEffect(() => {
		getSales({
			variables: {
				pagination: { first: 10 },
				filter: {
					saleTypes: [SaleType.Credit],
				},
			},
		});

		setPage(1);
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

	const buildCurrentFilters = () => {
		return {
			saleTypes: [SaleType.Credit],
		};
	};

	const nextPage = () => {
		if (sales?.sales?.pageInfo?.hasNextPage) {
			getSales({
				variables: {
					pagination: {
						first: 10,
						after: sales?.sales?.pageInfo?.endCursor,
					},
					filter: buildCurrentFilters(),
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
					filter: buildCurrentFilters(),
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
						Resellers Record
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setCreditDeviceModalOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Credit Device
				</Button>
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
							{table.getRowModel().rows.map((row) => {
								const sale = row.original;
								const isCreditPending =
									sale.saleType === SaleType.Credit &&
									sale.saleStatus === SaleStatus.Pending;

								return (
									<tr
										key={row.id}
										className={`border-b-[1px] border-[#E3E3E3] cursor-pointer hover:bg-[#F9F9F9] ${
											isCreditPending
												? "bg-orange-50 hover:bg-orange-100 border-orange-200"
												: ""
										}`}
										onClick={() => {
											setSelectedSale(sale);
											setOpen(true);
										}}
									>
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
								);
							})}
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
			<ViewSale
				open={open}
				setOpen={setOpen}
				sale={selectedSale}
				refetch={refetch}
			/>
			<Modal
				open={creditDeviceModalOpen}
				onClose={() => setCreditDeviceModalOpen(false)}
				center
				classNames={{
					modal: "customModal w-[90vw] max-w-[1200px]",
				}}
			>
				<DirectSale
					setOpen={setDetailsOpen}
					setOverviewOpen={setOverviewOpen}
					saleType={SaleType.Credit}
					showSteps={false}
					refetch={refetch}
				/>
			</Modal>
			<PurchaseOverview open={overviewOpen} setOpen={setOverviewOpen} />
			<ViewProduct open={detailsOpen} setOpen={setDetailsOpen} />
		</>
	);
};

export default ResellersRecord;
