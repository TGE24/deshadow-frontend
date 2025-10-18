import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	Inventory,
	UserRole,
	useInventoryLazyQuery,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import AddProduct from "../modules/Modals/Product/AddProduct";
import { formatNaira } from "../utils/formatters";
import { useUserStore } from "../store/userStore";
import UpdateInventory from "../modules/Modals/Inventory/UpdateInventory";
// import EditProduct from "../modules/Modals/Product/EditProduct";

const StoreInventory = () => {
	const { user } = useUserStore();
	const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(
		null
	);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [updateOpen, setUpdateOpen] = useState(false);
	// const [editOpen, setEditOpen] = useState(false);
	const [getInventory, { data: products, loading, refetch }] =
		useInventoryLazyQuery({
			fetchPolicy: "network-only",
		});
	const [data, setData] = useState<Inventory[]>([]);

	const columns = useMemo<ColumnDef<Inventory>[]>(() => {
		const baseColumns: ColumnDef<Inventory>[] = [
			{
				accessorKey: "product.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
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
					const getConditionStyle = (condition: string) => {
						switch (condition?.toLowerCase()) {
							case "new":
								return "bg-green-100 text-green-800 border-green-200";
							case "used":
								return "bg-yellow-100 text-yellow-800 border-yellow-200";
							case "refurbished":
								return "bg-blue-100 text-blue-800 border-blue-200";
							case "damaged":
								return "bg-red-100 text-red-800 border-red-200";
							default:
								return "bg-gray-100 text-gray-800 border-gray-200";
						}
					};

					return (
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium border ${getConditionStyle(
								condition
							)}`}
						>
							{condition
								?.replace("_", " ")
								.toLowerCase()
								.replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown"}
						</span>
					);
				},
				header: () => <h4>Condition</h4>,
			},
			{
				accessorKey: "quantityAvailable",
				cell: (info) => info.getValue(),
				header: () => <h4>Quantity Available</h4>,
			},

			{
				accessorKey: "quantityReserved",
				cell: (info) => info.getValue(),
				header: () => <h4>Quantity Reserved</h4>,
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
		];

		// Only add Actions column if user is not a reseller
		if (user?.role !== UserRole.Reseller) {
			baseColumns.push({
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-[20px]">
						{/* <button
							className="font-medium cursor-pointer"
							onClick={() => {
								setSelectedProduct(row.original);
								setEditOpen(true);
							}}
						>
							Edit
						</button> */}
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setUpdateOpen(true);
								setSelectedProduct(row.original);
							}}
						>
							Update
						</button>
					</div>
				),
			});
		}

		return baseColumns;
	}, [user?.role]);

	useEffect(() => {
		getInventory({
			variables: {
				pagination: { first: 10 },
				storeUuid: "c12b3258-55e7-4ebc-8403-a00d80eeab66",
			},
		});
	}, [getInventory]);

	useEffect(() => {
		if (products?.inventory?.edges) {
			setData(
				products.inventory.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Inventory") as Inventory[]
			);
		}
	}, [products]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (products?.inventory?.pageInfo?.hasNextPage) {
			getInventory({
				variables: {
					pagination: {
						first: 10,
						after: products?.inventory?.pageInfo?.endCursor,
					},
					storeUuid: "c12b3258-55e7-4ebc-8403-a00d80eeab66",
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (products?.inventory?.pageInfo?.hasPreviousPage) {
			getInventory({
				variables: {
					pagination: {
						last: 10,
						before: products?.inventory?.pageInfo?.startCursor,
					},
					storeUuid: "c12b3258-55e7-4ebc-8403-a00d80eeab66",
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
						Manage Inventory
					</h2>
				</div>
				{user?.role !== UserRole.Reseller && (
					<Button
						size="small"
						icon={<Plus color="#060606" />}
						onClick={() => setOpen(true)}
						className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
					>
						Add Product
					</Button>
				)}
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
				<div className="flex items-center justify-between mt-[30px]">
					<p>
						Showing 1 to {data.length} of {products?.inventory?.totalCount}{" "}
						entries
					</p>
					<div className="flex items-center gap-[15px]">
						<Button
							variant="tetriary"
							disabled={
								!products?.inventory?.pageInfo?.hasPreviousPage || loading
							}
							size="small"
							onClick={prevPage}
						>
							Previous
						</Button>
						<div className="px-[18px] py-[11px] bg-[#278783] rounded-[6px] text-white">
							{page}
						</div>
						<Button
							variant="tetriary"
							size="small"
							disabled={!products?.inventory?.pageInfo?.hasNextPage || loading}
							onClick={nextPage}
						>
							Next
						</Button>
					</div>
				</div>
			</div>

			<AddProduct open={open} setOpen={setOpen} refetch={refetch} />
			<UpdateInventory
				open={updateOpen}
				setOpen={setUpdateOpen}
				refetch={refetch}
				selectedProduct={selectedProduct}
			/>
			{/* <EditProduct
				open={editOpen}
				setOpen={setEditOpen}
				refetch={refetch}
				selectedProduct={selectedProduct}
			/> */}
		</>
	);
};

export default StoreInventory;
