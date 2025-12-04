import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import Select from "react-select";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// Components
import Input from "../components/Input";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";

// Modals

// Modules
import { Pagination } from "../modules/Pagination";

// GraphQL & Store
import {
	ProductItem,
	useProductItemsLazyQuery,
	ProductItemStatus,
	ProductCondition,
} from "../generated/graphql";

// Hooks
import { formatCurrency } from "../utils/formatters";
import { useDebounce } from "../hooks/useDebounce";

// Constants
const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_DELAY = 500;

const Inventory = () => {
	// State Management
	const [page, setPage] = useState(1);
	const [data, setData] = useState<ProductItem[]>([]);

	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedConditions, setSelectedConditions] = useState<
		ProductCondition[]
	>([]);

	const conditionOptions = useMemo(
		() =>
			Object.values(ProductCondition).map((c) => ({
				label: c
					.replace(/_/g, " ")
					.replace(/\b\w/g, (char) => char.toUpperCase()),
				value: c,
			})),
		[]
	);

	// Debounced search term to prevent excessive API calls
	const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

	// GraphQL Queries
	const [getProductItems, { data: products, loading }] =
		useProductItemsLazyQuery();

	// Router location so we can refetch whenever user lands on this route
	const location = useLocation();

	const fetchItems = useCallback(
		(opts?: { after?: string; before?: string }) => {
			getProductItems({
				fetchPolicy: "network-only",
				variables: {
					pagination: {
						first: ITEMS_PER_PAGE,
						...(opts?.after ? { after: opts.after } : {}),
						...(opts?.before
							? { before: opts.before, last: ITEMS_PER_PAGE }
							: {}),
					},
					filter: {
						status: ProductItemStatus.Available,
						search: debouncedSearchTerm.trim() || undefined,
						conditions:
							selectedConditions && selectedConditions.length > 0
								? selectedConditions
								: undefined,
					},
				},
			});
		},
		[getProductItems, debouncedSearchTerm, selectedConditions]
	);

	// Run on mount, when pathname changes, or when filters/search change
	useEffect(() => {
		fetchItems();

		// Reset page when filters change
		setPage(1);
	}, [fetchItems, location.pathname]);

	// Re-fetch when window/tab regains focus or when document becomes visible
	useEffect(() => {
		const onFocus = () => fetchItems();
		const onVisibility = () => {
			if (document.visibilityState === "visible") fetchItems();
		};

		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [fetchItems]);

	const columns = useMemo<ColumnDef<ProductItem>[]>(() => {
		const baseColumns: ColumnDef<ProductItem>[] = [
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
								condition
							)}`}
						>
							{condition.replace(/_/g, " ")}
						</span>
					);
				},
				header: () => <h4>Condition</h4>,
			},
		];

		return baseColumns;
	}, []);

	// Load products with filters (using debounced search term)
	useEffect(() => {
		getProductItems({
			variables: {
				pagination: { first: ITEMS_PER_PAGE },
				filter: {
					status: ProductItemStatus.Available,
					search: debouncedSearchTerm.trim() || undefined,
					conditions:
						selectedConditions && selectedConditions.length > 0
							? selectedConditions
							: undefined,
				},
			},
		});

		// Reset page when filters change
		setPage(1);
	}, [
		getProductItems,
		debouncedSearchTerm,
		selectedConditions,
		location.pathname,
	]);

	// Process products data
	useEffect(() => {
		if (products?.productItems?.edges) {
			const processedData = products.productItems.edges
				.map((edge) => edge.node)
				.filter((node) => node.__typename === "ProductItem") as ProductItem[];

			setData(processedData);
		}
	}, [products]);

	// Table Configuration
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Pagination handlers
	const handleNextPage = useCallback(() => {
		if (products?.productItems?.pageInfo?.hasNextPage) {
			getProductItems({
				variables: {
					pagination: {
						first: ITEMS_PER_PAGE,
						after: products?.productItems?.pageInfo?.endCursor,
					},
					filter: {
						status: ProductItemStatus.Available,
						search: debouncedSearchTerm.trim() || undefined,
						conditions:
							selectedConditions && selectedConditions.length > 0
								? selectedConditions
								: undefined,
					},
				},
			});
			setPage(page + 1);
		}
	}, [
		getProductItems,
		products?.productItems?.pageInfo?.hasNextPage,
		products?.productItems?.pageInfo?.endCursor,
		page,
		debouncedSearchTerm,
		selectedConditions,
	]);

	const handlePrevPage = useCallback(() => {
		if (products?.productItems?.pageInfo?.hasPreviousPage) {
			getProductItems({
				variables: {
					pagination: {
						last: ITEMS_PER_PAGE,
						before: products?.productItems?.pageInfo?.startCursor,
					},
					filter: {
						status: ProductItemStatus.Available,
						search: debouncedSearchTerm.trim() || undefined,
						conditions:
							selectedConditions && selectedConditions.length > 0
								? selectedConditions
								: undefined,
					},
				},
			});
			setPage(page - 1);
		}
	}, [
		getProductItems,
		products?.productItems?.pageInfo?.hasPreviousPage,
		products?.productItems?.pageInfo?.startCursor,
		page,
		debouncedSearchTerm,
		selectedConditions,
	]);

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Manage Inventory
					</h2>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="mt-6 flex justify-between items-center">
				{/* Search Bar */}
				<div className="w-full md:w-96">
					<Input
						placeholder="Search products..."
						variant="search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* Condition Filter */}
				<div className="ml-4 w-80">
					<Select
						isMulti
						options={conditionOptions}
						value={selectedConditions.map((c) => ({
							label: c
								.replace(/_/g, " ")
								.replace(/\b\w/g, (char) => char.toUpperCase()),
							value: c,
						}))}
						onChange={(opts) =>
							setSelectedConditions(
								(opts as { label: string; value: ProductCondition }[] | null)
									? (opts as { label: string; value: ProductCondition }[]).map(
											(o) => o.value
									  )
									: []
							)
						}
					/>
				</div>
			</div>

			<div className="w-full mt-[24px] overflow-x-auto">
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
							title="No products found"
							description="No products match your current filters."
							colSpan={columns.length}
						/>
					) : (
						<tbody>
							{table.getRowModel().rows.map((row) => (
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

				<Pagination
					page={page}
					loading={loading}
					totalCount={products?.productItems.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={products?.productItems?.pageInfo?.hasNextPage ?? false}
					hasPreviousPage={
						products?.productItems?.pageInfo?.hasPreviousPage ?? false
					}
					onNextPage={handleNextPage}
					onPrevPage={handlePrevPage}
				/>
			</div>
		</>
	);
};

export default Inventory;
