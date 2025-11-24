import { useEffect, useState, useMemo } from "react";
import { ProductItem, useProductItemsLazyQuery } from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
// import { formatNaira, formatDateTime } from "../utils/formatters";
// import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
// import DropdownMenu from "../components/DropdownMenu";
// import MoreVertical from "../components/Icons/MoreVertical";
// import UpdateStatus from "../modules/Modals/SalesDetails/UpdateStatus";
import { Pagination } from "../modules/Pagination";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import CreateInventory from "../modules/Modals/Inventory/CreateInventory";

const SalesManagement = () => {
	const [open, setOpen] = useState(false);
	// const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
	// const [selectedSale, setSelectedSale] = useState<Sale>({} as Sale);
	const [page, setPage] = useState(1);
	const [getProductItems, { data: productItems, loading }] =
		useProductItemsLazyQuery({
			fetchPolicy: "network-only",
		});

	const [data, setData] = useState<ProductItem[]>([]);

	const columns = useMemo<ColumnDef<ProductItem>[]>(() => {
		const baseColumns: ColumnDef<ProductItem>[] = [
			{
				accessorKey: "product.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Product Name</h4>,
			},
			{
				accessorKey: "product.brand.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Brand Name</h4>,
			},
			{
				accessorKey: "serialNumber",
				cell: (info) => info.getValue(),
				header: () => <h4>Serial Number</h4>,
			},
			{
				accessorKey: "externalStoreName",
				cell: (info) => info.getValue(),
				header: () => <h4>Customer Number</h4>,
			},
			{
				accessorKey: "status",
				cell: (info) => {
					const status = info.getValue() as string;
					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium uppercase ${
								status === "available"
									? "bg-green-100 text-green-800"
									: status === "sold"
									? "bg-red-100 text-red-800"
									: status === "reserved"
									? "bg-blue-100 text-blue-800"
									: status === "returned"
									? "bg-yellow-100 text-yellow-800"
									: status === "damaged"
									? "bg-gray-100 text-gray-800"
									: "bg-gray-100 text-gray-800"
							}`}
						>
							{status.replace("_", " ")}
						</span>
					);
				},
				header: () => <h4>Status</h4>,
			},
		];
		// {
		// 	baseColumns.push({
		// 		header: "Actions",
		// 		cell: ({ row }) => (
		// 			<DropdownMenu
		// 				trigger={
		// 					<div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
		// 						<MoreVertical className="w-4 h-4" color="black" />
		// 					</div>
		// 				}
		// 				items={[
		// 					{
		// 						label: "View Sale",
		// 						onClick: () => {
		// 							setSelectedSale(row.original);
		// 							setOpen(true);
		// 						},
		// 					},
		// 					...(row.original.saleStatus?.toLowerCase() !== "completed"
		// 						? [
		// 								{
		// 									label: "Update Status",
		// 									onClick: () => {
		// 										setSelectedSale(row.original);
		// 										setUpdateStatusOpen(true);
		// 									},
		// 								},
		// 						  ]
		// 						: []),
		// 				]}
		// 			/>
		// 		),
		// 	});
		// }

		return baseColumns;
	}, []);

	useEffect(() => {
		getProductItems({
			variables: {
				pagination: { first: 10 },
				filter: {
					externalStoreOnly: true,
				},
			},
		});
	}, [getProductItems]);

	useEffect(() => {
		if (productItems?.productItems?.edges) {
			setData(
				productItems.productItems.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "ProductItem") as ProductItem[]
			);
		}
	}, [productItems]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (productItems?.productItems?.pageInfo?.hasNextPage) {
			getProductItems({
				variables: {
					pagination: {
						first: 10,
						after: productItems?.productItems?.pageInfo?.endCursor,
					},
					filter: {
						externalStoreOnly: true,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (productItems?.productItems?.pageInfo?.hasPreviousPage) {
			getProductItems({
				variables: {
					pagination: {
						last: 10,
						before: productItems?.productItems?.pageInfo?.startCursor,
					},
					filter: {
						externalStoreOnly: true,
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
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Product
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
							title="No Product Items Found"
							description="There are no product items to display. Product items will appear here once they are created."
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
					totalCount={productItems?.productItems.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={
						productItems?.productItems?.pageInfo?.hasNextPage ?? false
					}
					hasPreviousPage={
						productItems?.productItems?.pageInfo?.hasPreviousPage ?? false
					}
					onNextPage={nextPage}
					onPrevPage={prevPage}
				/>
			</div>

			<CreateInventory
				open={open}
				setOpen={setOpen}
				refetch={() => {
					// getProduct({ variables: { uuid: id! } });
					// getProductItems({
					// 	variables: {
					// 		filter: { productUuid: id },
					// 		pagination: { first: 15, after: null },
					// 	},
					// });
				}}
				externalProduct={true}
				// selectedProduct={product as Product}
			/>
			{/* <ViewSale open={open} setOpen={setOpen} sale={selectedSale} />
			<UpdateStatus
				open={updateStatusOpen}
				setOpen={setUpdateStatusOpen}
				sale={selectedSale}
				refetch={refetch}
			/> */}
		</>
	);
};

export default SalesManagement;
