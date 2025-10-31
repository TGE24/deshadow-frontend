import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { SingleValue } from "react-select";

// Components
import Button from "../components/Button";
import Input from "../components/Input";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import DropdownMenu from "../components/DropdownMenu";
import FilterDropdown from "../components/FilterDropdown";
import Plus from "../components/Icons/Plus";
import MoreVertical from "../components/Icons/MoreVertical";

// Modals
import AddProduct from "../modules/Modals/Product/AddProduct";
import EditProduct from "../modules/Modals/Product/EditProduct";
import DeleteModal from "../modules/Modals/DeleteModal";
import CreateInventory from "../modules/Modals/Inventory/CreateInventory";

// Modules
import { Pagination } from "../modules/Pagination";

// GraphQL & Store
import {
	Product,
	ProductItem,
	UserRole,
	useDeleteProductMutation,
	useProductsLazyQuery,
	useBrandsLazyQuery,
	useCategoriesLazyQuery,
	useStoresLazyQuery,
} from "../generated/graphql";
import { useUserStore } from "../store/userStore";

// Hooks
import { useDebounce } from "../hooks/useDebounce";

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
	const { user } = useUserStore();

	// State Management
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [page, setPage] = useState(1);
	const [data, setData] = useState<Product[]>([]);

	// Modal States
	const [open, setOpen] = useState(false);
	const [productItemOpen, setProductItemOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	// Filter States
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStore, setSelectedStore] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");

	// Debounced search term to prevent excessive API calls
	const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

	// GraphQL Queries
	const [getProducts, { data: products, loading, refetch }] =
		useProductsLazyQuery({
			fetchPolicy: "network-only",
		});
	const [deleteProduct, { loading: deleteLoading }] =
		useDeleteProductMutation();

	// Filter Data Queries
	const [getBrands, { data: brandsData }] = useBrandsLazyQuery();
	const [getCategories, { data: categoriesData }] = useCategoriesLazyQuery();
	const [getStores, { data: storesData }] = useStoresLazyQuery();

	// Memoized select options
	const storeOptions = useMemo((): SelectOption[] => {
		const options: SelectOption[] = [{ value: "", label: "All Stores" }];

		if (storesData?.stores?.edges) {
			storesData.stores.edges.forEach((edge) => {
				const store = edge.node;
				if (store.__typename === "Store" && store.uuid && store.name) {
					options.push({ value: store.uuid, label: store.name });
				}
			});
		}

		return options;
	}, [storesData?.stores?.edges]);

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
				accessorKey: "items",
				cell: (info) => {
					const items = info.getValue() as ProductItem[];
					return items?.length || 0;
				},
				header: () => <h4>Quantity</h4>,
			},
		];

		// Only add Actions column if user is not a reseller
		if (user?.role !== UserRole.Reseller) {
			baseColumns.push({
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu
						trigger={
							<div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
								<MoreVertical className="w-4 h-4" color="black" />
							</div>
						}
						items={[
							{
								label: "Edit",
								onClick: () => {
									setSelectedProduct(row.original);
									setEditOpen(true);
								},
							},
							{
								label: "Delete",
								onClick: () => {
									setDeleteOpen(true);
									setSelectedProduct(row.original);
								},
								className: "text-red-600 hover:bg-red-50",
							},
							{
								label: "View Details",
								onClick: () => {
									navigate(`/product/${row.original.uuid}`);
								},
							},
							{
								label: "Add Product Item",
								onClick: () => {
									setProductItemOpen(true);
									setSelectedProduct(row.original);
								},
							},
						]}
					/>
				),
			});
		}

		return baseColumns;
	}, [user?.role, navigate]);

	// Effects Section

	// Load filter data on component mount
	useEffect(() => {
		getBrands({ variables: { pagination: { first: 100 } } });
		getCategories({ variables: { pagination: { first: 100 } } });
		getStores({ variables: { pagination: { first: 100 } } });
	}, [getBrands, getCategories, getStores]);

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
		getCoreRowModel: getCoreRowModel(),
	});

	// Event Handlers

	// Clear all filters
	const handleClearFilters = useCallback(() => {
		setSearchTerm("");
		setSelectedStore("");
		setSelectedBrand("");
		setSelectedCategory("");
	}, []);

	// Apply filters (for the dropdown)
	const handleApplyFilters = useCallback(() => {
		// Filters are applied automatically through useEffect when state changes
		// This is just a placeholder for the FilterDropdown component
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
		[]
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

	// Delete product handler
	const handleDeleteProduct = useCallback(() => {
		if (selectedProduct) {
			deleteProduct({
				variables: { uuid: selectedProduct.uuid },
				onCompleted: () => {
					setDeleteOpen(false);
					refetch();
					toast("Product deleted successfully", { type: "success" });
				},
			});
		}
	}, [selectedProduct, deleteProduct, refetch]);

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Manage Products
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
						storeOptions={storeOptions}
						brandOptions={brandOptions}
						categoryOptions={categoryOptions}
						selectedStore={selectedStore}
						selectedBrand={selectedBrand}
						selectedCategory={selectedCategory}
						onStoreChange={handleStoreChange}
						onBrandChange={handleBrandChange}
						onCategoryChange={handleCategoryChange}
						onClearFilters={handleClearFilters}
						onApplyFilters={handleApplyFilters}
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
							description="You haven't added any products yet. Create your first product to get started."
							colSpan={columns.length}
							action={() => setOpen(true)}
							buttonCopy="Add Product"
						/>
					) : (
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="border-b-[1px] border-[#E3E3E3] cursor-pointer"
									// onClick={() => navigate(`/product/${row.original.uuid}`)}
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
				action={handleDeleteProduct}
				loading={deleteLoading}
			/>

			<CreateInventory
				open={productItemOpen}
				setOpen={setProductItemOpen}
				refetch={refetch}
				selectedProduct={selectedProduct}
			/>
		</>
	);
};

export default Products;
