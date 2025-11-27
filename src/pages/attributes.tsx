import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	Attribute,
	useAttributesLazyQuery,
	useDeleteAttributeMutation,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import DeleteModal from "../modules/Modals/DeleteModal";
import { toast } from "react-toastify";
import TableEmptyState from "../components/TableEmptyState";
import AddAttribute from "../modules/Modals/Attributes/AddAttributes";
import EditAttribute from "../modules/Modals/Attributes/EditAttribute";

const Attributes = () => {
	const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
		null
	);
	const [openEdit, setOpenEdit] = useState(false);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [getAttributes, { data: attributes, loading, refetch }] =
		useAttributesLazyQuery({
			fetchPolicy: "network-only",
		});
	const [deleteAttribute, { loading: deleteLoading }] =
		useDeleteAttributeMutation();
	const [data, setData] = useState<Attribute[]>([]);

	const columns = useMemo<ColumnDef<Attribute>[]>(
		() => [
			{
				id: "index",
				cell: ({ row }) => {
					const currentPageStartIndex = (page - 1) * 10;
					return currentPageStartIndex + row.index + 1;
				},
				header: () => <h4>S/N</h4>,
			},
			{
				accessorKey: "name",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-[20px]">
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setSelectedAttribute(row.original);
								setOpenEdit(true);
							}}
						>
							Edit
						</button>
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setSelectedAttribute(row.original);
								setDeleteOpen(true);
							}}
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[page]
	);

	useEffect(() => {
		getAttributes({
			variables: {
				pagination: { first: 10 },
			},
		});
	}, [getAttributes]);

	useEffect(() => {
		if (attributes?.attributes?.edges) {
			setData(
				attributes.attributes.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Attribute") as Attribute[]
			);
		}
	}, [attributes]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (attributes?.attributes?.pageInfo?.hasNextPage) {
			getAttributes({
				variables: {
					pagination: {
						first: 10,
						after: attributes?.attributes?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (attributes?.attributes?.pageInfo?.hasPreviousPage) {
			getAttributes({
				variables: {
					pagination: {
						last: 10,
						before: attributes?.attributes?.pageInfo?.startCursor,
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
						Manage Atributes
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Attributes
				</Button>
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
							title="No attributes  found"
							description="You haven't added any users yet. Create your first user to get started."
							colSpan={columns.length}
							action={() => setOpen(true)}
							buttonCopy="Add Attribute"
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
				{(attributes?.attributes.totalCount ?? 0) > 10 && (
					<div className="flex items-center justify-between mt-[30px]">
						<p>
							Showing 1 to {data.length} of {attributes?.attributes?.totalCount}{" "}
							entries
						</p>
						<div className="flex items-center gap-[15px]">
							<Button
								variant="tetriary"
								disabled={
									!attributes?.attributes?.pageInfo?.hasPreviousPage || loading
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
								disabled={
									!attributes?.attributes?.pageInfo?.hasNextPage || loading
								}
								onClick={nextPage}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
			<AddAttribute open={open} setOpen={setOpen} refetch={refetch} />
			<EditAttribute
				open={openEdit}
				setOpen={setOpenEdit}
				refetch={refetch}
				selectedAttribute={selectedAttribute}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Delete Attribute"
				copy={`Are you sure you want to delete ${selectedAttribute?.name}?`}
				action={() => {
					deleteAttribute({
						variables: { uuid: selectedAttribute?.uuid },
						onCompleted: () => {
							setDeleteOpen(false);
							refetch();
							toast("User deleted successfully", { type: "success" });
						},
					});
				}}
				loading={deleteLoading}
			/>
		</>
	);
};

export default Attributes;
