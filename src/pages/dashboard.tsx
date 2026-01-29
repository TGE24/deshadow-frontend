import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Sale,
	SaleStatus,
	SaleType,
	useConditionSummaryLazyQuery,
	useSalesLazyQuery,
	useSalesReportLazyQuery,
} from "../generated/graphql";
import { formatDateTime, formatNaira } from "../utils/formatters";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { Link } from "react-router-dom";
import {
	ProductItem,
	useProductItemsLazyQuery,
	ProductItemStatus,
} from "../generated/graphql";
import { formatCurrency } from "../utils/formatters";
import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
import UpdateStatus from "../modules/Modals/SalesDetails/UpdateStatus";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState<Sale[]>([]);
	const [selectedSale, setSelectedSale] = useState<Sale>({} as Sale);
	const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
	const [getSalesReport, { data: salesReport }] = useSalesReportLazyQuery();
	const [getConditionSummary, { data: conditionSummary }] =
		useConditionSummaryLazyQuery();

	const salesReportStats = useMemo(() => {
		if (!salesReport?.salesReport) {
			return null;
		}
		return JSON.parse(salesReport?.salesReport)?.breakdown ?? null;
	}, [salesReport]);

	// Process condition summary data
	const stats = useMemo(() => {
		if (!conditionSummary?.conditionSummary) {
			return {
				inventory: { total: 0, new: 0, used: 0 },
				sales: { total: 0, new: 0, used: 0 },
			};
		}

		const { inventory, sales } = JSON.parse(conditionSummary.conditionSummary);

		// Helper to sum specific keys from an object
		const sumValues = (
			obj: Record<string, number | undefined>,
			keys: string[],
		) => keys.reduce((sum, key) => sum + (obj?.[key] ?? 0), 0);

		// Process inventory or sales data
		const processData = (data: Record<string, number | undefined>) => {
			const newCount = sumValues(data, [
				"new_active",
				"new_locked",
				"new_non_active",
				"new_sealed_box",
			]);
			const usedCount = sumValues(data, [
				"nigeria_used",
				"uk_used",
				"used_locked",
			]);
			return {
				new: newCount,
				used: usedCount,
				total: newCount + usedCount,
			};
		};

		return {
			inventory: processData(inventory),
			sales: processData(sales),
		};
	}, [conditionSummary]);

	const [getSales, { data: sales, loading, refetch }] = useSalesLazyQuery({
		fetchPolicy: "network-only",
	});

	// Load sales with filters
	useEffect(() => {
		getSales({
			variables: {
				pagination: { first: 5 },
			},
		});
	}, [getSales]);

	useEffect(() => {
		getConditionSummary({
			variables: {
				startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
				endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
			},
		});
	}, [getConditionSummary]);

	useEffect(() => {
		getSalesReport({
			variables: {
				startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
				endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
			},
		});
	}, [getSalesReport]);

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
								status,
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

	useEffect(() => {
		if (sales?.sales?.edges) {
			setData(
				sales.sales.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Sale") as Sale[],
			);
		}
	}, [sales]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Inventory preview (5 items)
	const [inventoryData, setInventoryData] = useState<ProductItem[]>([]);
	const [getProductItems, { data: inventory, loading: inventoryLoading }] =
		useProductItemsLazyQuery();

	useEffect(() => {
		getProductItems({
			variables: {
				pagination: { first: 5 },
				filter: { status: ProductItemStatus.Available },
			},
		});
	}, [getProductItems]);

	useEffect(() => {
		if (inventory?.productItems?.edges) {
			const processed = inventory.productItems.edges
				.map((edge) => edge.node)
				.filter((n) => n.__typename === "ProductItem") as ProductItem[];
			setInventoryData(processed);
		}
	}, [inventory]);

	const inventoryColumns = useMemo<ColumnDef<ProductItem>[]>(() => {
		return [
			{
				accessorKey: "product.category.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Category</h4>,
			},
			{
				accessorKey: "product.brand.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Brand</h4>,
			},
			{
				accessorKey: "product.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				accessorKey: "serialNumber",
				cell: (info) => info.getValue(),
				header: () => <h4>Serial</h4>,
			},
			{
				accessorKey: "sellingPrice",
				cell: (info) =>
					formatCurrency(info.getValue() as number | null | undefined),
				header: () => <h4>Price</h4>,
			},
			{
				accessorKey: "store.name",
				cell: (info) => info.getValue() ?? "N/A",
				header: () => <h4>Store</h4>,
			},
			{
				accessorKey: "condition",
				cell: (info) => {
					const condition = info.getValue() as string;
					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium uppercase ${
								condition === "new"
									? "bg-green-100 text-green-800"
									: condition === "fairly_used"
										? "bg-yellow-100 text-yellow-800"
										: condition === "refurbished"
											? "bg-blue-100 text-blue-800"
											: "bg-gray-100 text-gray-800"
							}`}
						>
							{condition.replace("_", " ")}
						</span>
					);
				},
				header: () => <h4>Condition</h4>,
			},
		];
	}, []);

	const inventoryTable = useReactTable({
		data: inventoryData,
		columns: inventoryColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			{/* {import.meta.env.MODE === "development" && <AuthTester />} */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Activity Report
					</h2>
					<p className="text-[14px] text-[#6A6A6A]">
						View your analytic store performance from the reports
					</p>
				</div>
				{/* <Button
					variant="primary"
					size="small"
					icon={<Plus />}
					onClick={() => setOpen(true)}
				>
					Create Invoice
				</Button> */}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px] mt-[24px]">
				<StatCard
					bgColor="#FFEBD0"
					headline={"Total Sales"}
					stat1={{ copy: "Used Phones Sold", value: stats.sales.used }}
					stat2={{ copy: "Brand New Phones Sold", value: stats.sales.new }}
					bottomStat={`${stats.sales.total > 0 ? Math.round((stats.sales.new / stats.sales.total) * 100) : 0}%`}
				/>
				<StatCard
					bgColor="rgba(39,135,131,0.2)"
					headline={"New Stocks"}
					stat1={{ copy: "Used Stock", value: stats.inventory.used }}
					stat2={{ copy: "Brand New Stock", value: stats.inventory.new }}
					bottomStat={
						stats.inventory.total > 0 ? `${stats.inventory.total} total` : ""
					}
				/>
				<StatCard
					bgColor="#FFEBD0"
					headline={"Sales Report"}
					stat1={{
						copy: "Credit Sales",
						value: salesReportStats?.credit_sales,
					}}
					stat2={{ copy: "Swap Sales", value: salesReportStats?.swap_sales }}
					bottomStat={`${stats.inventory.total > 0 ? Math.round((stats.inventory.used / stats.inventory.total) * 100) : 0}%`}
				/>
			</div>
			<div className="mt-[48px] flex flex-col gap-[20px]">
				<div>
					<div className="w-full mt-[48px] overflow-x-auto">
						<div>
							<h2 className="text-[16px] md:text-[20px] font-bold mb-[20px]">
								Recent Sales
							</h2>
						</div>
						<table className="w-full">
							<thead className="bg-[#D4E7E6] h-[41px]">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr
										key={headerGroup.id}
										className="text-[14px] font-semibold"
									>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className="text-left first-of-type:pl-[18px] whitespace-nowrap px-[12px]"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
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
												className={`border-b-[1px] border-[#E3E3E3] cursor-pointer ${
													isCreditPending
														? "bg-orange-50 hover:bg-orange-100 border-orange-200"
														: ""
												}`}
												onClick={() => {
													setSelectedSale(sale);
													if (isCreditPending) {
														setUpdateStatusOpen(true);
													} else {
														setOpen(true);
													}
												}}
											>
												{row.getVisibleCells().map((cell) => (
													<td
														key={cell.id}
														className="first-of-type:pl-[18px] py-[20px] text-[14px] whitespace-nowrap px-[12px]"
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</td>
												))}
											</tr>
										);
									})}
								</tbody>
							)}
						</table>
					</div>
				</div>
				<div>
					<div className="w-full mt-[48px] overflow-x-auto">
						<div className="flex items-center justify-between">
							<h2 className="text-[16px] md:text-[20px] font-bold mb-[20px]">
								Inventory
							</h2>
							<Link to="/inventory" className="text-sm text-[#0B7285]">
								View All
							</Link>
						</div>
						<table className="w-full min-w-[600px]">
							<thead className="bg-[#D4E7E6] h-[41px]">
								{inventoryTable.getHeaderGroups().map((headerGroup) => (
									<tr
										key={headerGroup.id}
										className="text-[14px] font-semibold"
									>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className="text-left first-of-type:pl-[18px] whitespace-nowrap px-[12px]"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</th>
										))}
									</tr>
								))}
							</thead>
							{inventoryLoading ? (
								<TableLoader columns={inventoryColumns.length} />
							) : inventoryData.length === 0 ? (
								<TableEmptyState
									title="No products found"
									description="No products available"
									colSpan={inventoryColumns.length}
								/>
							) : (
								<tbody>
									{inventoryTable.getRowModel().rows.map((row) => (
										<tr
											key={row.id}
											className="border-b-[1px] border-[#E3E3E3] cursor-pointer hover:bg-gray-50"
										>
											{row.getVisibleCells().map((cell) => (
												<td
													key={cell.id}
													className="first-of-type:pl-[18px] py-[20px] text-[14px] whitespace-nowrap px-[12px]"
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							)}
						</table>
					</div>
				</div>
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

export default Dashboard;
