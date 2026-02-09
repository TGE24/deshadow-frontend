import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
} from "@tanstack/react-table";
import { SingleValue } from "react-select";

// Components
import Input from "../components/Input";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import FilterDropdown from "../components/FilterDropdown";
import Plus from "../components/Icons/Plus";

// Modals

// Modules
import { Pagination } from "../modules/Pagination";

// GraphQL & Store
import {
	Product,
	useProductsLazyQuery,
	useBrandsLazyQuery,
	useCategoriesLazyQuery,
} from "../generated/graphql";

// Hooks
import { useDebounce } from "../hooks/useDebounce";
import AddProduct from "../modules/Modals/Product/AddProduct";
import Button from "../components/Button";

// Types
interface SelectOption {
	value: string;
	label: string;
}

// Constants
const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_DELAY = 500;

const Products = () => {
	// Hooks
	const navigate = useNavigate();

	// State Management
	const [page, setPage] = useState(1);
	const [data, setData] = useState<Product[]>([]);
	const [open, setOpen] = useState(false);

	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStore, setSelectedStore] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "availableItemsCount", desc: true },
	]);

	// Debounced search term to prevent excessive API calls
	const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

	// GraphQL Queries
	const [getProducts, { data: products, loading, refetch }] =
		useProductsLazyQuery();
	// Filter Data Queries
	const [getBrands, { data: brandsData }] = useBrandsLazyQuery();
	const [getCategories, { data: categoriesData }] = useCategoriesLazyQuery();

	const brandOptions = useMemo((): SelectOption[] => {
		const options: SelectOption[] = [{ value: "", label: "All Brands" }];

		if (brandsData?.brands?.edges) {
			brandsData.brands.edges.forEach((edge) => {
				const brand = edge.node;
				if (brand.__typename === "Brand" && brand.uuid && brand.name) {
					options.push({ value: brand.uuid, label: brand.name });
				}
			});
		}

		return options;
	}, [brandsData?.brands?.edges]);

	const categoryOptions = useMemo((): SelectOption[] => {
		const options: SelectOption[] = [{ value: "", label: "All Categories" }];

		if (categoriesData?.categories?.edges) {
			categoriesData.categories.edges.forEach((edge) => {
				const category = edge.node;
				if (
					category.__typename === "Category" &&
					category.uuid &&
					category.name
				) {
					options.push({ value: category.uuid, label: category.name });
				}
			});
		}

		return options;
	}, [categoriesData?.categories?.edges]);

	const columns = useMemo<ColumnDef<Product>[]>(() => {
		const baseColumns: ColumnDef<Product>[] = [
			{
				accessorKey: "category.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Category</h4>,
			},
			{
				accessorKey: "brand.name",
				cell: (info) => info.getValue(),
				header: () => <h4>Brand</h4>,
			},
			{
				accessorKey: "name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				accessorKey: "availableItemsCount",
				enableSorting: true,
				cell: (info) => {
					const quantity = info.getValue() as number;

					if (quantity === 0) {
						return <span className="text-red-600 font-semibold">0</span>;
					}

					return quantity;
				},
				header: ({ column }) => (
					<h4
						className="flex items-center gap-1 cursor-pointer select-none"
						onClick={() => column.toggleSorting()}
					>
						Quantity
						<span className="text-xs">
							{column.getIsSorted() === "asc" && "↑"}
							{column.getIsSorted() === "desc" && "↓"}
						</span>
					</h4>
				),
			},
		];

		// Actions column removed - moved to product details page

		return baseColumns;
	}, []);

	// Effects Section

	// Load filter data on component mount
	useEffect(() => {
		getBrands({ variables: { pagination: { first: 100 } } });
		getCategories({ variables: { pagination: { first: 100 } } });
	}, [getBrands, getCategories]);

	// Load products with filters (using debounced search term)
	useEffect(() => {
		const buildFilters = () => {
			const filters: Record<string, unknown> = {};

			if (debouncedSearchTerm.trim()) {
				filters.search = debouncedSearchTerm.trim();
			}

			if (selectedStore) {
				filters.storeUuid = selectedStore;
			}

			if (selectedBrand) {
				filters.brandUuid = selectedBrand;
			}

			if (selectedCategory) {
				filters.categoryUuid = selectedCategory;
			}

			return Object.keys(filters).length > 0 ? filters : undefined;
		};

		getProducts({
			variables: {
				pagination: { first: ITEMS_PER_PAGE },
				filter: buildFilters(),
			},
		});

		// Reset page when filters change
		setPage(1);
	}, [
		getProducts,
		debouncedSearchTerm,
		selectedStore,
		selectedBrand,
		selectedCategory,
	]);

	// Process products data
	useEffect(() => {
		if (products?.products?.edges) {
			const processedData = products.products.edges
				.map((edge) => edge.node)
				.filter((node) => node.__typename === "Product") as Product[];

			setData(processedData);
		}
	}, [products]);

	// Table Configuration
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	// Event Handlers

	// Clear all filters
	const handleClearFilters = useCallback(() => {
		setSearchTerm("");
		setSelectedStore("");
		setSelectedBrand("");
		setSelectedCategory("");
	}, []);

	// Handle select changes
	const handleStoreChange = useCallback((option: SingleValue<SelectOption>) => {
		setSelectedStore(option?.value || "");
	}, []);

	const handleBrandChange = useCallback((option: SingleValue<SelectOption>) => {
		setSelectedBrand(option?.value || "");
	}, []);

	const handleCategoryChange = useCallback(
		(option: SingleValue<SelectOption>) => {
			setSelectedCategory(option?.value || "");
		},
		[],
	);

	// Pagination handlers
	const handleNextPage = useCallback(() => {
		if (products?.products?.pageInfo?.hasNextPage) {
			getProducts({
				variables: {
					pagination: {
						first: ITEMS_PER_PAGE,
						after: products?.products?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	}, [
		getProducts,
		products?.products?.pageInfo?.hasNextPage,
		products?.products?.pageInfo?.endCursor,
		page,
	]);

	const handlePrevPage = useCallback(() => {
		if (products?.products?.pageInfo?.hasPreviousPage) {
			getProducts({
				variables: {
					pagination: {
						last: ITEMS_PER_PAGE,
						before: products?.products?.pageInfo?.startCursor,
					},
				},
			});
			setPage(page - 1);
		}
	}, [
		getProducts,
		products?.products?.pageInfo?.hasPreviousPage,
		products?.products?.pageInfo?.startCursor,
		page,
	]);

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

				{/* Filter Dropdown */}
				<div className="flex items-center gap-4">
					<FilterDropdown
						brandOptions={brandOptions}
						categoryOptions={categoryOptions}
						selectedStore={selectedStore}
						selectedBrand={selectedBrand}
						selectedCategory={selectedCategory}
						onStoreChange={handleStoreChange}
						onBrandChange={handleBrandChange}
						onCategoryChange={handleCategoryChange}
						onClearFilters={handleClearFilters}
						onApplyFilters={() => {}}
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
									onClick={() => navigate(`/product/${row.original.uuid}`)}
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
					totalCount={products?.products.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={products?.products?.pageInfo?.hasNextPage ?? false}
					hasPreviousPage={
						products?.products?.pageInfo?.hasPreviousPage ?? false
					}
					onNextPage={handleNextPage}
					onPrevPage={handlePrevPage}
				/>
			</div>
			<AddProduct open={open} setOpen={setOpen} refetch={refetch} />
		</>
	);
};

export default Products;
