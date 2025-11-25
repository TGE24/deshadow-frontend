import { useEffect, useState, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
// import { SingleValue } from "react-select";

// Components
import Input from "../components/Input";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
// import FilterDropdown from "../components/FilterDropdown";

// Modals

// Modules
import { Pagination } from "../modules/Pagination";

// GraphQL & Store
import {
	ProductItem,
	useProductItemsLazyQuery,
	ProductItemStatus,
} from "../generated/graphql";

// Hooks
// import { useDebounce } from "../hooks/useDebounce";
import { formatCurrency } from "../utils/formatters";

// Constants
const ITEMS_PER_PAGE = 10;
// const SEARCH_DEBOUNCE_DELAY = 500;

const Inventory = () => {
	// Hooks
	// const navigate = useNavigate();

	// State Management
	const [page, setPage] = useState(1);
	const [data, setData] = useState<ProductItem[]>([]);

	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	// const [selectedStore, setSelectedStore] = useState("");
	// const [selectedBrand, setSelectedBrand] = useState("");
	// const [selectedCategory, setSelectedCategory] = useState("");

	// Debounced search term to prevent excessive API calls
	// const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

	// GraphQL Queries
	const [getProductItems, { data: products, loading }] =
		useProductItemsLazyQuery();
	// Filter Data Queries
	// const [getBrands, { data: brandsData }] = useBrandsLazyQuery();
	// const [getCategories, { data: categoriesData }] = useCategoriesLazyQuery();
	// const [getStores, { data: storesData }] = useStoresLazyQuery();

	// Memoized select options
	// const storeOptions = useMemo((): SelectOption[] => {
	// 	const options: SelectOption[] = [{ value: "", label: "All Stores" }];

	// 	if (storesData?.stores?.edges) {
	// 		storesData.stores.edges.forEach((edge) => {
	// 			const store = edge.node;
	// 			if (store.__typename === "Store" && store.uuid && store.name) {
	// 				options.push({ value: store.uuid, label: store.name });
	// 			}
	// 		});
	// 	}

	// 	return options;
	// }, [storesData?.stores?.edges]);

	// const brandOptions = useMemo((): SelectOption[] => {
	// 	const options: SelectOption[] = [{ value: "", label: "All Brands" }];

	// 	if (brandsData?.brands?.edges) {
	// 		brandsData.brands.edges.forEach((edge) => {
	// 			const brand = edge.node;
	// 			if (brand.__typename === "Brand" && brand.uuid && brand.name) {
	// 				options.push({ value: brand.uuid, label: brand.name });
	// 			}
	// 		});
	// 	}

	// 	return options;
	// }, [brandsData?.brands?.edges]);

	// const categoryOptions = useMemo((): SelectOption[] => {
	// 	const options: SelectOption[] = [{ value: "", label: "All Categories" }];

	// 	if (categoriesData?.categories?.edges) {
	// 		categoriesData.categories.edges.forEach((edge) => {
	// 			const category = edge.node;
	// 			if (
	// 				category.__typename === "Category" &&
	// 				category.uuid &&
	// 				category.name
	// 			) {
	// 				options.push({ value: category.uuid, label: category.name });
	// 			}
	// 		});
	// 	}

	// 	return options;
	// }, [categoriesData?.categories?.edges]);

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

		// Actions column removed - moved to product details page

		return baseColumns;
	}, []);

	// Effects Section

	// Load filter data on component mount
	// useEffect(() => {
	// 	getBrands({ variables: { pagination: { first: 100 } } });
	// 	getCategories({ variables: { pagination: { first: 100 } } });

	// 	getStores({ variables: { pagination: { first: 100 } } });
	// }, [getBrands, getCategories, getStores]);

	// Load products with filters (using debounced search term)
	useEffect(() => {
		getProductItems({
			variables: {
				pagination: { first: ITEMS_PER_PAGE },
				filter: { status: ProductItemStatus.Available },
			},
		});

		// Reset page when filters change
		setPage(1);
	}, [
		getProductItems,
		// debouncedSearchTerm,
		// selectedStore,
		// selectedBrand,
		// selectedCategory,
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

	// Event Handlers

	// Clear all filters
	// const handleClearFilters = useCallback(() => {
	// 	setSearchTerm("");
	// 	setSelectedStore("");
	// 	setSelectedBrand("");
	// 	setSelectedCategory("");
	// }, []);

	// Handle select changes
	// const handleStoreChange = useCallback((option: SingleValue<SelectOption>) => {
	// 	setSelectedStore(option?.value || "");
	// }, []);

	// const handleBrandChange = useCallback((option: SingleValue<SelectOption>) => {
	// 	setSelectedBrand(option?.value || "");
	// }, []);

	// const handleCategoryChange = useCallback(
	// 	(option: SingleValue<SelectOption>) => {
	// 		setSelectedCategory(option?.value || "");
	// 	},
	// 	[]
	// );

	// Pagination handlers
	const handleNextPage = useCallback(() => {
		if (products?.productItems?.pageInfo?.hasNextPage) {
			getProductItems({
				variables: {
					pagination: {
						first: ITEMS_PER_PAGE,
						after: products?.productItems?.pageInfo?.endCursor,
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
	]);

	const handlePrevPage = useCallback(() => {
		if (products?.productItems?.pageInfo?.hasPreviousPage) {
			getProductItems({
				variables: {
					pagination: {
						last: ITEMS_PER_PAGE,
						before: products?.productItems?.pageInfo?.startCursor,
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
