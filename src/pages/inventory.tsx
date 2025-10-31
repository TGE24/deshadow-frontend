import { useState } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	ProductItem,
	useDeleteProductMutation,
	UserRole,
} from "../generated/graphql";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import { useUserStore } from "../store/userStore";
import TableEmptyState from "../components/TableEmptyState";
import {
	createInventoryColumns,
	useInventoryData,
	StoreFilter,
} from "../modules/Inventory";
import { Pagination } from "../modules/Pagination";
import DeleteModal from "../modules/Modals/DeleteModal";
import { toast } from "react-toastify";
import CreateInventory from "../modules/Modals/Inventory/CreateInventory";

const StoreInventory = () => {
	const { user } = useUserStore();
	const [filterStore, setFilterStore] = useState("");
	const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
		null
	);
	const [open, setOpen] = useState(false);
	const [updateOpen, setUpdateOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [page, setPage] = useState(1);

	const { data, loading, stores, products, nextPage, prevPage, refetch } =
		useInventoryData({ filterStore, setFilterStore });

	const [deleteProduct, { loading: deleteLoading }] =
		useDeleteProductMutation();

	const handleUpdateProduct = (product: ProductItem) => {
		setUpdateOpen(true);
		setSelectedProduct(product);
	};

	const columns = createInventoryColumns({
		onUpdate: handleUpdateProduct,
		onDelete: (product: ProductItem) => {
			setSelectedProduct(product);
			setDeleteOpen(true);
		},
	});

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

			{user?.role === UserRole.StoreOwner && (
				<div className="mt-[24px]">
					<StoreFilter
						filterStore={filterStore}
						setFilterStore={setFilterStore}
						setPage={setPage}
						stores={stores}
					/>
				</div>
			)}

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
							title="No product found"
							description="You haven't added any products yet. Create your first product to get started."
							colSpan={columns.length}
							action={() => setOpen(true)}
							buttonCopy="Add Product"
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
					totalCount={products?.productItems.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={products?.productItems?.pageInfo?.hasNextPage ?? false}
					hasPreviousPage={
						products?.productItems?.pageInfo?.hasPreviousPage ?? false
					}
					onNextPage={nextPage}
					onPrevPage={prevPage}
				/>
			</div>

			<CreateInventory open={open} setOpen={setOpen} refetch={refetch} />
			{/* <UpdateInventory
				open={updateOpen}
				setOpen={setUpdateOpen}
				refetch={refetch}
				selectedProduct={selectedProduct}
			/> */}

			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Delete Product"
				copy={`Are you sure you want to delete ${selectedProduct?.product.name}?`}
				action={() => {
					deleteProduct({
						variables: { uuid: selectedProduct?.product.uuid },
						onCompleted: () => {
							setDeleteOpen(false);
							refetch();
							toast.success("Product deleted successfully");
						},
					});
				}}
				loading={deleteLoading}
			/>
		</>
	);
};

export default StoreInventory;
