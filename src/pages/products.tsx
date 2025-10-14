import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	Product,
	useDeleteProductMutation,
	useProductsLazyQuery,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import AddProduct from "../modules/Modals/Product/AddProduct";
import EditProduct from "../modules/Modals/Product/EditProduct";
import DeleteModal from "../modules/Modals/DeleteModal";
import { toast } from "react-toastify";
// import DeleteModal from "../modules/Modals/DeleteModal";

const Products = () => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [getProducts, { data: products, loading, refetch }] =
		useProductsLazyQuery({
			fetchPolicy: "network-only",
		});
	const [deleteProduct, { loading: deleteLoading }] =
		useDeleteProductMutation();
	const [data, setData] = useState<Product[]>([]);

	const columns = useMemo<ColumnDef<Product>[]>(
		() => [
			{
				accessorKey: "name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				accessorKey: "model",
				cell: (info) => info.getValue(),
				header: () => <h4>Model</h4>,
			},
			{
				accessorKey: "condition",
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
				accessorKey: "store.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Store</h4>,
			},
			{
				accessorKey: "costPrice",
				cell: (info) => {
					const value = info.getValue() as number;
					return `₦${
						value?.toLocaleString("en-NG", {
							maximumFractionDigits: 0,
						}) || "0"
					}`;
				},
				header: () => <h4>Cost Price</h4>,
			},
			{
				accessorKey: "sellingPrice",
				cell: (info) => {
					const value = info.getValue() as number;
					return `₦${
						value?.toLocaleString("en-NG", {
							maximumFractionDigits: 0,
						}) || "0"
					}`;
				},
				header: () => <h4>Selling Price</h4>,
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-[20px]">
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setSelectedProduct(row.original);
								setEditOpen(true);
							}}
						>
							Edit
						</button>
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setDeleteOpen(true);
								setSelectedProduct(row.original);
							}}
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[]
	);

	useEffect(() => {
		getProducts({
			variables: { pagination: { first: 10 } },
		});
	}, [getProducts]);

	useEffect(() => {
		if (products?.products?.edges) {
			setData(
				products.products.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Product") as Product[]
			);
		}
	}, [products]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (products?.products?.pageInfo?.hasNextPage) {
			getProducts({
				variables: {
					pagination: {
						first: 10,
						after: products?.products?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (products?.products?.pageInfo?.hasPreviousPage) {
			getProducts({
				variables: {
					pagination: {
						last: 10,
						before: products?.products?.pageInfo?.startCursor,
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
						Manage Products
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
						Showing 1 to {data.length} of {products?.products?.totalCount}{" "}
						entries
					</p>
					<div className="flex items-center gap-[15px]">
						<Button
							variant="tetriary"
							disabled={
								!products?.products?.pageInfo?.hasPreviousPage || loading
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
							disabled={!products?.products?.pageInfo?.hasNextPage || loading}
							onClick={nextPage}
						>
							Next
						</Button>
					</div>
				</div>
			</div>

			<AddProduct open={open} setOpen={setOpen} refetch={refetch} />
			<EditProduct
				open={editOpen}
				setOpen={setEditOpen}
				refetch={refetch}
				selectedProduct={selectedProduct}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Delete Product"
				copy={`Are you sure you want to delete ${selectedProduct?.name}?`}
				action={() => {
					deleteProduct({
						variables: { uuid: selectedProduct?.uuid },
						onCompleted: () => {
							setDeleteOpen(false);
							refetch();
							toast("Product deleted successfully", { type: "success" });
						},
					});
				}}
				loading={deleteLoading}
			/>
		</>
	);
};

export default Products;
