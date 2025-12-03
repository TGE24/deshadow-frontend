import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Sale, useSalesLazyQuery } from "../generated/graphql";
import { formatDateTime, formatNaira } from "../utils/formatters";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
// import AuthTester from "../components/AuthTester";
import { Link } from "react-router-dom";
import {
	ProductItem,
	useProductItemsLazyQuery,
	ProductItemStatus,
} from "../generated/graphql";
import { formatCurrency } from "../utils/formatters";
import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
import DropdownMenu from "../components/DropdownMenu";
import MoreVertical from "../components/Icons/MoreVertical";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState<Sale[]>([]);
	const [selectedSale, setSelectedSale] = useState<Sale>({} as Sale);

	const [getSales, { data: sales, loading }] = useSalesLazyQuery({
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
						Daily Activity Report
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
										<tr
											key={row.id}
											className="border-b-[1px] border-[#E3E3E3]"
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
									))}
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
															header.getContext()
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
														cell.getContext()
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
			{/* <AddProduct open={open} setOpen={setOpen} refetch={() => {}} /> */}

			<ViewSale open={open} setOpen={setOpen} sale={selectedSale} />
		</>
	);
};

export default Dashboard;
