import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import StatCard from "../components/StatCard";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Sale,
	SaleType,
	useSalesLazyQuery,
	useStoresLazyQuery,
} from "../generated/graphql";
import { formatToISODateTime } from "../utils/helpers";
import DropdownMenu from "../components/DropdownMenu";
import MoreVertical from "../components/Icons/MoreVertical";
import { formatDateTime, formatNaira } from "../utils/formatters";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { SingleValue } from "react-select";
import { SelectOption } from "./Sales";
import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
import SalesFilterDropdown from "../components/SalesFilterDropdown";
import { Pagination } from "../modules/Pagination";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	// const [startDate] = useState(new Date());
	// const [endDate] = useState(addDays(new Date(), 3));
	const [page, setPage] = useState(1);
	const [data, setData] = useState<Sale[]>([]);
	const [selectedSale, setSelectedSale] = useState<Sale>({} as Sale);

	// Filter States
	const [selectedSaleTypes, setSelectedSaleTypes] = useState([
		SaleType.Direct,
		SaleType.Swap,
	]);

	const [getSales, { data: sales, loading }] = useSalesLazyQuery({
		fetchPolicy: "network-only",
	});

	const [getStores, { data: storesData }] = useStoresLazyQuery();

	// Load stores on component mount
	useEffect(() => {
		getStores();
	}, [getStores]);

	// Filter States
	const [selectedSaleType, setSelectedSaleType] = useState("");
	const [selectedStore, setSelectedStore] = useState("");
	const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

	// Filter Handlers
	const handleSaleTypeChange = useCallback(
		(selectedOptions: SelectOption[] | []) => {
			setSelectedSaleTypes(
				selectedOptions.map((option) => option.value as SaleType)
			);
		},
		[]
	);

	const handleStoreChange = useCallback((option: SingleValue<SelectOption>) => {
		setSelectedStore(option?.value || "");
	}, []);

	const handleDateRangeChange = useCallback(
		(newDateRange: { fromDate: string; toDate: string }) => {
			setDateRange(newDateRange);
		},
		[]
	);

	const handleClearFilters = useCallback(() => {
		setSelectedSaleType("");
		setSelectedStore("");
		setDateRange({ fromDate: "", toDate: "" });
	}, []);

	const handleApplyFilters = useCallback(() => {
		// Filters are applied automatically through useEffect when state changes
		// This is just a placeholder for the FilterDropdown component
	}, []);

	// Load sales with filters
	useEffect(() => {
		const buildFilters = () => {
			const filters: Record<string, unknown> = {};

			if (selectedSaleTypes && selectedSaleTypes.length > 0) {
				filters.saleTypes = selectedSaleTypes;
			}

			if (selectedStore) {
				filters.storeUuid = selectedStore;
			}

			if (dateRange.fromDate) {
				filters.fromDate = formatToISODateTime(dateRange.fromDate, false);
			}

			if (dateRange.toDate) {
				filters.toDate = formatToISODateTime(dateRange.toDate, true);
			}

			return Object.keys(filters).length > 0 ? filters : undefined;
		};

		getSales({
			variables: {
				pagination: { first: 10 },
				filter: buildFilters(),
			},
		});

		// Reset page when filters change
		setPage(1);
	}, [getSales, selectedSaleTypes, selectedStore, dateRange]);

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
							{
								label: "Update Status",
								onClick: () => {
									setSelectedSale(row.original);
								},
							},
						]}
					/>
				),
			});
		}

		return baseColumns;
	}, []);

	// Filter Options
	const saleTypeOptions = useMemo(
		(): SelectOption[] => [
			{ value: "", label: "All Sale Types" },
			{ value: SaleType.Direct, label: "Direct Sale" },
			{ value: SaleType.Swap, label: "Swap Sale" },
		],
		[]
	);

	const storeOptions = useMemo((): SelectOption[] => {
		const options: SelectOption[] = [{ value: "", label: "All Stores" }];

		if (storesData?.stores?.edges) {
			storesData.stores.edges.forEach((edge) => {
				const store = edge.node;
				if (store.__typename === "Store" && store.uuid && store.name) {
					options.push({
						value: store.uuid,
						label: store.name,
					});
				}
			});
		}

		return options;
	}, [storesData]);

	const buildCurrentFilters = () => {
		const filters: Record<string, unknown> = {};

		if (selectedSaleType) {
			filters.saleType = selectedSaleType;
		}

		if (selectedStore) {
			filters.storeUuid = selectedStore;
		}

		if (dateRange.fromDate) {
			filters.fromDate = formatToISODateTime(dateRange.fromDate, false);
		}

		if (dateRange.toDate) {
			filters.toDate = formatToISODateTime(dateRange.toDate, true);
		}

		return Object.keys(filters).length > 0 ? filters : undefined;
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

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Daily Activity Report
					</h2>
					<p className="text-[14px] text-[#6A6A6A]">
						View your analytic store performance from the reports
					</p>
				</div>
				<Button
					variant="primary"
					size="small"
					icon={<Plus />}
					onClick={() => setOpen(true)}
				>
					Create Invoice
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px] mt-[24px]">
				<StatCard
					bgColor="#FFEBD0"
					headline={"Total Sales"}
					stat1={{ copy: "Total Uk Used Phones Sold", value: 63 }}
					stat2={{ copy: "Total Brand New Phones Sold", value: 43 }}
					bottomStat={"25%"}
				/>
				<StatCard
					bgColor="rgba(39,135,131,0.2)"
					headline={"New Stocks"}
					stat1={{ copy: "Total Uk Used Stock", value: 63 }}
					stat2={{ copy: "Total Brand New Stock", value: 43 }}
					bottomStat={""}
				/>
				<StatCard
					bgColor="#FFEBD0"
					headline={"Total Returns"}
					stat1={{ copy: "Total Uk Used Stock", value: 2 }}
					stat2={{ copy: "Total (pbeg)", value: 0 }}
					bottomStat={"30%"}
				/>
			</div>
			<div className="mt-[48px]">
				{/* Filters */}
				<div className="mt-6 flex justify-end items-center">
					<SalesFilterDropdown
						saleTypeOptions={saleTypeOptions}
						storeOptions={storeOptions}
						selectedSaleTypes={selectedSaleTypes}
						selectedStore={selectedStore}
						dateRange={dateRange}
						onSaleTypeChange={handleSaleTypeChange}
						onStoreChange={handleStoreChange}
						onDateRangeChange={handleDateRangeChange}
						onClearFilters={handleClearFilters}
						onApplyFilters={handleApplyFilters}
					/>
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
			</div>
			{/* <AddProduct open={open} setOpen={setOpen} refetch={() => {}} /> */}

			<ViewSale open={open} setOpen={setOpen} sale={selectedSale} />
		</>
	);
};

export default Dashboard;
