import { useEffect, useState, useMemo, useCallback } from "react";

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
import Plus from "../components/Icons/Plus";

// Modules
import { Pagination } from "../modules/Pagination";

// GraphQL & Store
import {
	useAccessoriesLazyQuery,
	Accessory,
	useDeleteAccessoryMutation,
} from "../generated/graphql";

// Hooks
import { useDebounce } from "../hooks/useDebounce";
import Button from "../components/Button";
import { formatCurrency } from "../utils/formatters";
import AddAccessory from "../modules/Modals/Accessories/AddAccessory";
import DeleteModal from "../modules/Modals/DeleteModal";
import { toast } from "react-toastify";
import EditAccessory from "../modules/Modals/Accessories/EditAccessory";
import AccessorySale from "../modules/AccessorySale";
import { Modal } from "react-responsive-modal";

// Constants
const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_DELAY = 500;

const Accessories = () => {
	// State Management
	const [page, setPage] = useState(1);
	const [data, setData] = useState<Accessory[]>([]);
	const [open, setOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [sellOpen, setSellOpen] = useState(false);
	const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(
		null,
	);

	// Filter States
	const [searchTerm, setSearchTerm] = useState("");

	// Debounced search term to prevent excessive API calls
	const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

	// GraphQL Queries
	const [getAccessories, { data: accessories, loading, refetch }] =
		useAccessoriesLazyQuery();
	const [deleteAccessory, { loading: deleteLoading }] =
		useDeleteAccessoryMutation();

	const columns = useMemo<ColumnDef<Accessory>[]>(() => {
		const baseColumns: ColumnDef<Accessory>[] = [
			{
				accessorKey: "name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				accessorKey: "quantity",
				cell: (info) => info.getValue(),
				header: () => <h4>Quantity</h4>,
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
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-[20px]">
						<button
							className="font-medium cursor-pointer text-green-600 hover:text-green-800"
							onClick={() => {
								setSelectedAccessory(row.original);
								setSellOpen(true);
							}}
							disabled={row.original.quantity === 0}
						>
							Sell
						</button>
						<button>Edit</button>
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setSelectedAccessory(row.original);
								setDeleteOpen(true);
							}}
						>
							Delete
						</button>
					</div>
				),
			},
		];

		// Actions column removed - moved to product details page

		return baseColumns;
	}, []);

	// Effects Section

	// Load products with filters (using debounced search term)
	useEffect(() => {
		const buildFilters = () => {
			const filters: Record<string, unknown> = {};

			if (debouncedSearchTerm.trim()) {
				filters.search = debouncedSearchTerm.trim();
			}

			return Object.keys(filters).length > 0 ? filters : undefined;
		};

		getAccessories({
			variables: {
				pagination: { first: ITEMS_PER_PAGE },
				filter: buildFilters(),
			},
		});

		// Reset page when filters change
		setPage(1);
	}, [getAccessories, debouncedSearchTerm]);

	// Process products data
	useEffect(() => {
		if (accessories?.accessories?.edges) {
			const processedData = accessories.accessories.edges
				.map((edge) => edge.node)
				.filter((node) => node.__typename === "Accessory") as Accessory[];

			setData(processedData);
		}
	}, [accessories]);
	// Table Configuration
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Pagination handlers
	const handleNextPage = useCallback(() => {
		if (accessories?.accessories?.pageInfo?.hasNextPage) {
			getAccessories({
				variables: {
					pagination: {
						first: ITEMS_PER_PAGE,
						after: accessories?.accessories?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	}, [
		getAccessories,
		accessories?.accessories?.pageInfo?.hasNextPage,
		accessories?.accessories?.pageInfo?.endCursor,
		page,
	]);

	const handlePrevPage = useCallback(() => {
		if (accessories?.accessories?.pageInfo?.hasPreviousPage) {
			getAccessories({
				variables: {
					pagination: {
						last: ITEMS_PER_PAGE,
						before: accessories?.accessories?.pageInfo?.startCursor,
					},
				},
			});
			setPage(page - 1);
		}
	}, [
		getAccessories,
		accessories?.accessories?.pageInfo?.hasPreviousPage,
		accessories?.accessories?.pageInfo?.startCursor,
		page,
	]);

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Manage Accessories
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Accessory
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="mt-6 flex justify-between items-center">
				{/* Search Bar */}
				<div className="w-full md:w-96">
					<Input
						placeholder="Search accessories..."
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
							title="No accessories found"
							description="No accessories match your current filters."
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
					totalCount={accessories?.accessories.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={accessories?.accessories?.pageInfo?.hasNextPage ?? false}
					hasPreviousPage={
						accessories?.accessories?.pageInfo?.hasPreviousPage ?? false
					}
					onNextPage={handleNextPage}
					onPrevPage={handlePrevPage}
				/>
			</div>
			<AddAccessory open={open} setOpen={setOpen} refetch={refetch} />
			<EditAccessory
				open={openEdit}
				setOpen={setOpenEdit}
				refetch={refetch}
				selectedAccessory={selectedAccessory}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Delete Attribute"
				copy={`Are you sure you want to delete ${selectedAccessory?.name}?`}
				action={() => {
					deleteAccessory({
						variables: { uuid: selectedAccessory?.uuid },
						onCompleted: () => {
							setDeleteOpen(false);
							refetch();
							toast("User deleted successfully", { type: "success" });
						},
					});
				}}
				loading={deleteLoading}
			/>
			<Modal
				open={sellOpen}
				onClose={() => setSellOpen(false)}
				center
				classNames={{
					modal: "customModal max-w-4xl w-full",
				}}
			>
				{selectedAccessory && (
					<AccessorySale
						accessory={selectedAccessory}
						onClose={() => setSellOpen(false)}
						refetch={refetch}
					/>
				)}
			</Modal>
		</>
	);
};

export default Accessories;
