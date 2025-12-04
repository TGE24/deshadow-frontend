import { useEffect, useMemo, useState } from "react";
import {
	Product,
	ProductItem,
	ProductItemStatus,
	useProductItemsLazyQuery,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { formatCurrency } from "../utils/formatters";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { Pagination } from "../modules/Pagination";
import MoreVertical from "../components/Icons/MoreVertical";
import DropdownMenu from "../components/DropdownMenu";
import EditInventory from "../modules/Modals/Inventory/EditInventory";

const PendingItems = () => {
	const [page, setPage] = useState(1);

	// Product Item Actions
	const [selectedProductItem, setSelectedProductItem] =
		useState<ProductItem | null>(null);
	const [editProductItemOpen, setEditProductItemOpen] = useState(false);

	const [data, setData] = useState<ProductItem[]>([]);
	// const {
	// 	data: itemsData,
	// 	loading,
	// 	refetch,
	// } = useProductItemsQuery({
	// 	variables: {
	// 		filter: { status: ProductItemStatus.Pending },
	// 		pagination: { first: 100 },
	// 	},
	// 	fetchPolicy: "network-only",
	// });

	const [getProductItems, { data: itemsData, refetch, loading }] =
		useProductItemsLazyQuery();

	useEffect(() => {
		const onFocus = () => refetch().catch(() => {});
		const onVisibility = () => {
			if (document.visibilityState === "visible") refetch().catch(() => {});
		};
		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [refetch]);

	useEffect(() => {
		getProductItems({
			variables: { filter: { status: ProductItemStatus.Pending } },
		});
		setPage(1);
	}, [getProductItems]);

	useEffect(() => {
		if (itemsData?.productItems?.edges) {
			setData(
				itemsData?.productItems.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "ProductItem") as ProductItem[]
			);
		}
	}, [itemsData]);

	const columns = useMemo<ColumnDef<ProductItem>[]>(() => {
		const baseColumns: ColumnDef<ProductItem>[] = [
			{
				id: "image",
				cell: ({ row }) => {
					const productItem = row.original;
					const primaryImage =
						productItem.images?.find((img) => img.isPrimary) ||
						productItem.images?.[0];

					return (
						<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border">
							{primaryImage ? (
								<img
									src={`${import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL}${
										primaryImage.imageUrl
									}`}
									alt={primaryImage.altText || "Product image"}
									className="w-full h-full object-cover"
								/>
							) : (
								<svg
									className="w-6 h-6 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							)}
						</div>
					);
				},
				header: () => <h4>Image</h4>,
			},
			{
				accessorKey: "product.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				accessorKey: "serialNumber",
				cell: (info) => info.getValue(),
				header: () => <h4>Serial Number</h4>,
			},

			// Dynamic attribute columns will be inserted after this point
			{
				accessorKey: "sellingPrice",
				cell: (info) => {
					const value = info.getValue() as number | null | undefined;
					return formatCurrency(value);
				},
				header: () => <h4>Selling Price</h4>,
			},
			{
				accessorKey: "store.name",
				cell: (info) => {
					const value = info.getValue() as string | null | undefined;
					return value ?? "N/A";
				},
				header: () => <h4>Store Name</h4>,
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
									: status === "pending"
									? "bg-amber-100 text-amber-800"
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
			{
				id: "actions",
				cell: ({ row }) => {
					const productItem = row.original;
					return (
						<DropdownMenu
							trigger={
								<button className="p-2 hover:bg-gray-100 rounded-full">
									<MoreVertical />
								</button>
							}
							items={[
								{
									label: "Edit Product Item",
									onClick: () => {
										setSelectedProductItem(productItem);
										setEditProductItemOpen(true);
									},
								},
							]}
						/>
					);
				},
				header: () => <h4>Actions</h4>,
			},
		];
		return baseColumns;
	}, []);

	const nextPage = () => {
		if (itemsData?.productItems?.pageInfo?.hasNextPage) {
			getProductItems({
				variables: {
					filter: { status: ProductItemStatus.Pending },
					pagination: {
						first: 10,
						after: itemsData?.productItems?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (itemsData?.productItems?.pageInfo?.hasPreviousPage) {
			const filter = {
				status: ProductItemStatus.Pending,
			};
			getProductItems({
				variables: {
					filter,
					pagination: {
						last: 10,
						before: itemsData?.productItems?.pageInfo?.startCursor,
					},
				},
			});
			setPage(page - 1);
		}
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Pending Product Items</h2>

			<div className="w-full mt-[48px] overflow-x-auto">
				<table className="w-full">
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
								<tr
									key={row.id}
									className={`border-b-[1px] border-[#E3E3E3] cursor-pointer hover:bg-gray-50`}
									onClick={() => {
										setSelectedProductItem(row.original);
										setEditProductItemOpen(true);
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
							))}
						</tbody>
					)}
				</table>

				<Pagination
					page={page}
					loading={loading}
					totalCount={itemsData?.productItems.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={itemsData?.productItems.pageInfo.hasNextPage ?? false}
					hasPreviousPage={
						itemsData?.productItems.pageInfo.hasPreviousPage ?? false
					}
					onNextPage={nextPage}
					onPrevPage={prevPage}
				/>
			</div>
			{/* Edit Product Item Modal - Placeholder */}
			<EditInventory
				open={editProductItemOpen}
				setOpen={setEditProductItemOpen}
				refetch={refetch}
				selectedProduct={selectedProductItem?.product as Product}
				selectedProductItem={selectedProductItem as ProductItem}
			/>
		</div>
	);
};

export default PendingItems;
