import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	Store,
	useDeleteStoreMutation,
	useMyStoresLazyQuery,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { cn } from "../utils/cn";
import TableLoader from "../components/TableLoader";
import DeleteModal from "../modules/Modals/DeleteModal";
import CreateStore from "../modules/Modals/Store/CreateStore";
import EditStore from "../modules/Modals/Store/EditStore";

const Stores = () => {
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [getStores, { data: stores, loading, refetch }] = useMyStoresLazyQuery({
		fetchPolicy: "network-only",
	});
	const [deleteBrand, { loading: deleteLoading }] = useDeleteStoreMutation();
	const [data, setData] = useState<Store[]>([]);

	const columns = useMemo<ColumnDef<Store>[]>(
		() => [
			{
				accessorKey: "name",
				cell: (info) => info.getValue(),
				header: () => <h4>Store Name</h4>,
			},
			{
				accessorKey: "phone",
				cell: (info) => info.getValue(),
				header: () => <h4>Phone</h4>,
			},
			{
				accessorKey: "address",
				cell: (info) => info.getValue(),
				header: () => <h4>Address</h4>,
			},
			{
				accessorKey: "isActive",
				cell: (info) => (
					<div
						className={cn(
							{ "bg-[#ecfdf3] text-[#027a48]": info.getValue() },
							{ "bg-[#fef3f2] text-[#b42318]": !info.getValue() },
							"w-[70px] h-[24px] flex items-center justify-center rounded-[10px] text-[12px] font-medium capitalize"
						)}
					>
						{String(info.getValue() ? "active" : "inactive")}
					</div>
				),
				header: () => <h4>Status</h4>,
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-[20px]">
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setEditOpen(true);
								setSelectedStore(row.original);
							}}
						>
							Edit
						</button>
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setDeleteOpen(true);
								setSelectedStore(row.original);
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
		getStores({ variables: { pagination: { first: 10 } } });
	}, [getStores]);

	useEffect(() => {
		if (stores?.myStores?.edges) {
			setData(
				stores.myStores.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Store") as Store[]
			);
		}
	}, [stores]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (stores?.myStores?.pageInfo?.hasNextPage) {
			getStores({
				variables: {
					pagination: {
						first: 10,
						after: stores?.myStores?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (stores?.myStores?.pageInfo?.hasPreviousPage) {
			getStores({
				variables: {
					pagination: {
						last: 10,
						before: stores?.myStores?.pageInfo?.startCursor,
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
						Manage Stores
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Store
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
					) : data.length === 0 ? (
						<tbody>
							<tr>
								<td colSpan={columns.length} className="py-[60px] text-center">
									<div className="flex flex-col items-center justify-center border-[1px] border-[#E3E3E3] rounded-[8px] p-[40px]">
										<div className="w-[100px] h-[100px] bg-[#F8F9FA] rounded-full flex items-center justify-center mb-[16px]">
											<svg
												width="48"
												height="48"
												viewBox="0 0 24 24"
												fill="none"
												className="text-[#6C757D]"
											>
												<path
													d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M8 12H16"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M8 16H12"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
										<h3 className="text-[18px] font-semibold text-[#495057] mb-[8px]">
											No stores found
										</h3>
										<p className="text-[14px] text-[#6C757D] mb-[24px] max-w-[300px]">
											You haven't added any stores yet. Create your first store
											to get started.
										</p>
										<Button
											size="small"
											icon={<Plus color="#060606" />}
											onClick={() => setOpen(true)}
											className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
										>
											Add Store
										</Button>
									</div>
								</td>
							</tr>
						</tbody>
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
				{(stores?.myStores?.totalCount ?? 0) > 10 && (
					<div className="flex items-center justify-between mt-[30px]">
						<p>
							Showing 1 to {data.length} of {stores?.myStores?.totalCount ?? 0}{" "}
							entries
						</p>
						<div className="flex items-center gap-[15px]">
							<Button
								variant="tetriary"
								disabled={
									!stores?.myStores?.pageInfo?.hasPreviousPage || loading
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
								disabled={!stores?.myStores?.pageInfo?.hasNextPage || loading}
								onClick={nextPage}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
			<CreateStore open={open} setOpen={setOpen} refetch={refetch} />
			<EditStore
				open={editOpen}
				setOpen={setEditOpen}
				refetch={refetch}
				selectedStore={selectedStore}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Remove Store"
				copy={`Are you sure you want to remove ${selectedStore?.name}?`}
				action={() => {
					deleteBrand({
						variables: { storeId: selectedStore?.uuid },
						onCompleted: () => {
							setDeleteOpen(false);
							refetch();
						},
					});
				}}
				loading={deleteLoading}
			/>
		</>
	);
};

export default Stores;
