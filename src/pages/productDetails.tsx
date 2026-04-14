import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
	ProductItem,
	ProductCondition,
	ProductItemStatus,
	useProductItemsLazyQuery,
	useProductLazyQuery,
	useDeleteProductMutation,
	Product,
	useDeleteProductItemMutation,
	UserRole,
} from "../generated/graphql";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import Button from "../components/Button";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { Pagination } from "../modules/Pagination";
import { formatCurrency } from "../utils/formatters";
import Plus from "../components/Icons/Plus";
import DropdownMenu from "../components/DropdownMenu";
import MoreVertical from "../components/Icons/MoreVertical";

// Modals
import EditProduct from "../modules/Modals/Product/EditProduct";
import DeleteModal from "../modules/Modals/DeleteModal";
import CreateInventory from "../modules/Modals/Inventory/CreateInventory";
import EditInventory from "../modules/Modals/Inventory/EditInventory";
import { useUserStore } from "../store/userStore";
import ReassignProductItem from "../modules/Modals/ReassignProductItem";

const ProductDetails = () => {
	const [page, setPage] = useState(1);
	const { user } = useUserStore();
	const [selectedConditions, setSelectedConditions] = useState<
		ProductCondition[]
	>([]);
	const [getProduct, { data: products, loading, refetch: refetchProduct }] =
		useProductLazyQuery();
	const [getProductItems, { data: itemsData, refetch }] =
		useProductItemsLazyQuery();
	const [data, setData] = useState<ProductItem[]>([]);
	const { id } = useParams<{ id: string }>();

	// Modal States
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [productItemOpen, setProductItemOpen] = useState(false);

	// Product Item Actions
	const [selectedProductItem, setSelectedProductItem] =
		useState<ProductItem | null>(null);
	const [editProductItemOpen, setEditProductItemOpen] = useState(false);
	const [deleteProductItemOpen, setDeleteProductItemOpen] = useState(false);
	const [reassignProductItemOpen, setReassignProductItemOpen] = useState(false);

	// Navigation and mutations
	const navigate = useNavigate();
	const [deleteProduct, { loading: deleteLoading }] =
		useDeleteProductMutation();
	const [deleteProductItem, { loading: deleteProductItemLoading }] =
		useDeleteProductItemMutation();

	// Create options for react-select
	const conditionOptions = useMemo(
		() =>
			Object.values(ProductCondition).map((condition) => ({
				value: condition,
				label: condition
					.replace("_", " ")
					.replace(/\b\w/g, (char) => char.toUpperCase()),
			})),
		[],
	);

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
				accessorKey: "notes",
				cell: (info) => info.getValue() || "—",
				header: () => <h4>Notes</h4>,
			},
			{
				accessorKey: "condition",
				cell: (info) => {
					const condition = info.getValue() as string;
					const getConditionStyles = (cond: string) => {
						switch (cond) {
							case "new_active":
								return "bg-green-100 text-green-800";
							case "new_locked":
								return "bg-blue-100 text-blue-800";
							case "new_non_active":
								return "bg-purple-100 text-purple-800";
							case "new_sealed_box":
								return "bg-indigo-100 text-indigo-800";
							case "nigeria_used":
								return "bg-yellow-100 text-yellow-800";
							case "uk_used":
								return "bg-orange-100 text-orange-800";
							case "used_locked":
								return "bg-red-100 text-red-800";
							default:
								return "bg-gray-100 text-gray-800";
						}
					};
					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium uppercase ${getConditionStyles(
								condition,
							)}`}
						>
							{condition.replace(/_/g, " ")}
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
									label: "Reassign Product Item",
									onClick: () => {
										setSelectedProductItem(productItem);
										setReassignProductItemOpen(true);
									},
								},
								{
									label: "Edit Product Item",
									onClick: () => {
										setSelectedProductItem(productItem);
										setEditProductItemOpen(true);
									},
								},
								{
									label: "Delete Product Item",
									onClick: () => {
										setSelectedProductItem(productItem);
										setDeleteProductItemOpen(true);
									},
									className: "text-red-600 hover:text-red-700",
								},
							]}
						/>
					);
				},
				header: () => <h4>Actions</h4>,
			},
		];

		// If the queried product has attributes, insert a column per attribute
		const productAttributes = products?.product?.attributes || [];
		if (productAttributes.length > 0) {
			// build columns for each attribute
			const attributeColumns: ColumnDef<ProductItem>[] = productAttributes.map(
				(attr) => ({
					id: `attr_${attr.uuid}`,
					header: () => <h4>{attr.name}</h4>,
					cell: ({ row }) => {
						const productItem = row.original;
						const av =
							productItem.attributeValues?.find(
								(a) => a.attribute?.uuid === attr.uuid,
							) || null;
						return (
							<span className="text-sm text-gray-700">
								{av?.valueText ?? "—"}
							</span>
						);
					},
				}),
			);

			// insert attribute columns after the serialNumber column
			const serialIndex = baseColumns.findIndex(
				(c) =>
					(c as ColumnDef<ProductItem> & { accessorKey?: string })
						.accessorKey === "serialNumber",
			);
			if (serialIndex >= 0) {
				baseColumns.splice(serialIndex + 1, 0, ...attributeColumns);
			} else {
				baseColumns.push(...attributeColumns);
			}
		}

		return baseColumns;
	}, [products?.product?.attributes]);

	const handleDeleteProductItem = () => {
		if (selectedProductItem) {
			deleteProductItem({
				variables: { uuid: selectedProductItem.uuid },
				onCompleted: () => {
					toast("Product item deleted successfully", { type: "success" });
					setDeleteProductItemOpen(false);
				},
			});
		}
	};

	// Delete product handler
	const handleDeleteProduct = () => {
		if (product) {
			deleteProduct({
				variables: { uuid: product.uuid },
				onCompleted: () => {
					setDeleteOpen(false);
					toast("Product deleted successfully", { type: "success" });
					navigate("/products"); // Navigate back to products list
				},
				onError: (error) => {
					toast(`Error deleting product: ${error.message}`, { type: "error" });
				},
			});
		}
	};

	useEffect(() => {
		if (itemsData?.productItems?.edges) {
			setData(
				itemsData?.productItems.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "ProductItem") as ProductItem[],
			);
		}
	}, [itemsData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnVisibility: {
				actions: user?.role === UserRole.Reseller ? false : true,
			},
		},
	});

	useEffect(() => {
		if (id) {
			getProduct({ variables: { uuid: id } });
			const filter = {
				productUuid: id,
				...(selectedConditions.length > 0 && {
					conditions: selectedConditions,
				}),
			};
			getProductItems({ variables: { filter } });
			setPage(1); // Reset to page 1 when filters change
		}
	}, [id, selectedConditions, getProduct, getProductItems]);

	const product = products?.product;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-600 mb-2">
						Product Not Found
					</h2>
					<p className="text-gray-500">
						The product you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	const nextPage = () => {
		if (itemsData?.productItems?.pageInfo?.hasNextPage) {
			const filter = {
				productUuid: id,
				...(selectedConditions.length > 0 && {
					conditions: selectedConditions,
				}),
			};
			getProductItems({
				variables: {
					filter,
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
				productUuid: id,
				...(selectedConditions.length > 0 && {
					conditions: selectedConditions,
				}),
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

	return (
		<div className="px-4 py-8">
			{/* Breadcrumb */}
			<div className="mb-6">
				<nav className="text-sm">
					<Link to="/products" className="text-gray-500">
						Products
					</Link>
					<span className="text-gray-400 mx-2">/</span>
					<span className="text-gray-900 font-medium">{product.name}</span>
				</nav>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
				{/* Product Details Section */}
				<div className="lg:col-span-5 space-y-6">
					{/* Title and Brand */}
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{product.name}
						</h1>
						{product.brand && (
							<p className="text-lg text-gray-600">{product.brand.name}</p>
						)}
					</div>

					{/* Availability Status */}
					{/* {product.items &&
						product.items.filter(
							(item) => item.status === ProductItemStatus.Available
						).length > 0 && (
							<div className="flex items-center gap-4">
								<span className="text-sm font-medium text-gray-600">
									Available Items:{" "}
									{
										product.items.filter(
											(item) => item.status === ProductItemStatus.Available
										).length
									}
								</span>
							</div>
						)} */}

					{/* Description */}
					{product.description && (
						<div className="space-y-2">
							<h3 className="text-lg font-semibold text-gray-900">
								Description
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{product.description}
							</p>
						</div>
					)}

					{/* Product Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Product Information
						</h3>
						<div className="bg-gray-50 rounded-lg p-4 space-y-3">
							{product.category && (
								<div className="flex justify-between">
									<span className="text-gray-600">Category:</span>
									<span className="font-medium">{product.category.name}</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="text-gray-600">Available Items:</span>
								<span className="font-medium">
									{product.items?.filter(
										(item) => item.status === ProductItemStatus.Available,
									)?.length || 0}
								</span>
							</div>
						</div>
					</div>

					{/* Product Actions */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Product Actions
						</h3>
						<div className="flex flex-wrap gap-3">
							<Button
								size="small"
								onClick={() => setEditOpen(true)}
								className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
							>
								Edit Product
							</Button>
							<Button
								size="small"
								onClick={() => setProductItemOpen(true)}
								icon={<Plus color="#059669" />}
								className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
							>
								Add Product Item
							</Button>
							<Button
								size="small"
								onClick={() => setDeleteOpen(true)}
								className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
							>
								Delete Product
							</Button>
						</div>
					</div>

					<div className="w-full mt-[48px] overflow-x-auto">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Available Items
							</h3>
							<div className="flex items-center gap-4">
								<label className="text-sm font-medium text-gray-600">
									Filter by condition:
								</label>
								<div className="min-w-[300px]">
									<Select
										menuPortalTarget={
											typeof document !== "undefined"
												? document.body
												: undefined
										}
										menuPosition="fixed"
										styles={{
											menuPortal: (base) => ({ ...base, zIndex: 9999 }),
											menu: (base) => ({ ...base, zIndex: 9999 }),
											control: (provided) => ({
												...provided,
												minHeight: "32px",
												fontSize: "14px",
												borderColor: "#d1d5db",
												"&:hover": {
													borderColor: "#9ca3af",
												},
											}),
											valueContainer: (provided) => ({
												...provided,
												padding: "2px 8px",
											}),
											input: (provided) => ({
												...provided,
												margin: "0px",
											}),
											indicatorSeparator: () => ({
												display: "none",
											}),
											indicatorsContainer: (provided) => ({
												...provided,
												height: "32px",
											}),
										}}
										isMulti
										options={conditionOptions}
										value={conditionOptions.filter((option) =>
											selectedConditions.includes(option.value),
										)}
										onChange={(selectedOptions) => {
											const values = selectedOptions
												? selectedOptions.map((option) => option.value)
												: [];
											setSelectedConditions(values);
										}}
										placeholder="Select conditions..."
										className="text-sm"
										classNamePrefix="react-select"
										isClearable
									/>
								</div>
							</div>
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
									title="No Product Items Found"
									description="There are no product items to display. Product items will appear here once they are created."
									colSpan={columns.length}
								/>
							) : (
								<tbody>
									{table.getRowModel().rows.map((row) => (
										<tr
											key={row.id}
											className={`border-b-[1px] border-[#E3E3E3] ${
												row.original.status === "pending" ? "bg-amber-50" : ""
											}`}
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

						<Pagination
							page={page}
							loading={loading}
							totalCount={itemsData?.productItems.totalCount ?? 0}
							dataLength={data.length}
							hasNextPage={
								itemsData?.productItems.pageInfo.hasNextPage ?? false
							}
							hasPreviousPage={
								itemsData?.productItems.pageInfo.hasPreviousPage ?? false
							}
							onNextPage={nextPage}
							onPrevPage={prevPage}
						/>
					</div>
				</div>
			</div>

			{/* Modals */}
			<EditProduct
				open={editOpen}
				setOpen={setEditOpen}
				refetch={refetchProduct}
				selectedProduct={product as Product}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetchProduct}
				title="Delete Product"
				copy={`Are you sure you want to delete ${product?.name}?`}
				action={handleDeleteProduct}
				loading={deleteLoading}
			/>
			<CreateInventory
				open={productItemOpen}
				setOpen={setProductItemOpen}
				refetch={() => {
					refetchProduct();
					refetch();
				}}
				selectedProduct={product as Product}
			/>

			{/* Product Item Modals */}
			<DeleteModal
				open={deleteProductItemOpen}
				setOpen={setDeleteProductItemOpen}
				refetch={refetch}
				title="Delete Product Item"
				copy={`Are you sure you want to delete this product item with serial number ${selectedProductItem?.serialNumber}?`}
				action={handleDeleteProductItem}
				loading={deleteProductItemLoading}
			/>

			{/* Edit Product Item Modal - Placeholder */}
			<EditInventory
				open={editProductItemOpen}
				setOpen={setEditProductItemOpen}
				refetch={refetch}
				selectedProduct={products.product as Product}
				selectedProductItem={selectedProductItem as ProductItem}
			/>
			<ReassignProductItem
				open={reassignProductItemOpen}
				setOpen={setReassignProductItemOpen}
				refetch={refetch}
				selectedProductItem={selectedProductItem as ProductItem}
			/>
		</div>
	);
};

export default ProductDetails;
