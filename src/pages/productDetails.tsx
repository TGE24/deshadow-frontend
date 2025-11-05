import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
	ProductItem,
	ProductCondition,
	useProductItemsLazyQuery,
	useProductLazyQuery,
} from "../generated/graphql";
import { useParams } from "react-router-dom";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { Pagination } from "../modules/Pagination";
import { formatCurrency } from "../utils/formatters";

const ProductDetails = () => {
	const [page, setPage] = useState(1);
	const [selectedConditions, setSelectedConditions] = useState<
		ProductCondition[]
	>([]);
	const [getProduct, { data: products, loading }] = useProductLazyQuery();
	const [getProductItems, { data: itemsData }] = useProductItemsLazyQuery();
	const [data, setData] = useState<ProductItem[]>([]);
	const { id } = useParams<{ id: string }>();

	// Create options for react-select
	const conditionOptions = useMemo(
		() =>
			Object.values(ProductCondition).map((condition) => ({
				value: condition,
				label: condition
					.replace("_", " ")
					.replace(/\b\w/g, (char) => char.toUpperCase()),
			})),
		[]
	);

	const columns = useMemo<ColumnDef<ProductItem>[]>(() => {
		const baseColumns: ColumnDef<ProductItem>[] = [
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
			{
				accessorKey: "sellingPrice",
				cell: (info) => {
					const value = info.getValue() as number | null | undefined;
					return formatCurrency(value);
				},
				header: () => <h4>Selling Price</h4>,
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

		return baseColumns;
	}, []);

	useEffect(() => {
		if (itemsData?.productItems?.edges) {
			setData(
				itemsData?.productItems.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "ProductItem") as ProductItem[]
			);
		}
	}, [itemsData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
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

	// Get the first image if available
	const primaryImage = product.images?.[0]?.imageUrl;

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<div className="mb-6">
				<nav className="text-sm">
					<span className="text-gray-500">Products</span>
					<span className="text-gray-400 mx-2">/</span>
					<span className="text-gray-900 font-medium">{product.name}</span>
				</nav>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
				{/* Image Section */}
				<div className="lg:col-span-2 space-y-4">
					<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
						{primaryImage ? (
							<img
								src={primaryImage}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<div className="text-center text-gray-400">
									<svg
										className="mx-auto h-24 w-24 mb-4"
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
									<span className="text-lg">No Image Available</span>
								</div>
							</div>
						)}
					</div>

					{/* Additional Images Thumbnails */}
					{product.images && product.images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto">
							{product.images.slice(1, 5).map((image, index) => (
								<div
									key={index}
									className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border overflow-hidden"
								>
									<img
										src={image.imageUrl}
										alt={`${product.name} ${index + 2}`}
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Product Details Section */}
				<div className="lg:col-span-3 space-y-6">
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
					{product.items && product.items.length > 0 && (
						<div className="flex items-center gap-4">
							<span className="text-sm font-medium text-gray-600">
								Available Items: {product.items.length}
							</span>
						</div>
					)}

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
								<span className="text-gray-600">Total Items:</span>
								<span className="font-medium">
									{product.items?.length || 0}
								</span>
							</div>
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
										isMulti
										options={conditionOptions}
										value={conditionOptions.filter((option) =>
											selectedConditions.includes(option.value)
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
										styles={{
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
		</div>
	);
};

export default ProductDetails;
