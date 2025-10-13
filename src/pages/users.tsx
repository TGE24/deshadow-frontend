import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	useDeleteUserMutation,
	User,
	UserRole,
	useUsersLazyQuery,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import CategoryLoading from "../components/CategoryLoading";
import AddUser from "../modules/Modals/User/AddUser";
import { cn } from "../utils/cn";
import EditUser from "../modules/Modals/User/EditUser";
import DeleteModal from "../modules/Modals/DeleteModal";
import { toast } from "react-toastify";

const Users = () => {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [openEdit, setOpenEdit] = useState(false);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [getUsers, { data: users, loading, refetch }] = useUsersLazyQuery({
		fetchPolicy: "network-only",
	});
	const [deleteUser, { loading: deleteLoading }] = useDeleteUserMutation();
	const [data, setData] = useState<User[]>([]);

	const columns = useMemo<ColumnDef<User>[]>(
		() => [
			{
				accessorFn: (row) => `${row.firstName} ${row.lastName}`,
				id: "fullName",
				cell: (info) => info.getValue(),
				header: () => <h4>Name</h4>,
			},
			{
				accessorKey: "role",
				cell: (info) => {
					const value = info.getValue() as string;
					return <>{value.replace("_", " ").toUpperCase()}</>;
				},
				header: () => <h4>Role</h4>,
			},
			{
				accessorKey: "email",
				cell: (info) => info.getValue(),
				header: () => <h4>Email</h4>,
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
								setSelectedUser(row.original);
								setOpenEdit(true);
							}}
						>
							Edit
						</button>
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setSelectedUser(row.original);
								setDeleteOpen(true);
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
		getUsers({
			variables: { pagination: { first: 10 }, role: "store_owner" as UserRole },
		});
	}, [getUsers]);

	useEffect(() => {
		if (users?.users?.edges) {
			setData(
				users.users.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "User") as User[]
			);
		}
	}, [users]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (users?.users?.pageInfo?.hasNextPage) {
			getUsers({
				variables: {
					pagination: {
						first: 10,
						after: users?.users?.pageInfo?.endCursor,
					},
					role: "store_owner" as UserRole,
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (users?.users?.pageInfo?.hasPreviousPage) {
			getUsers({
				variables: {
					pagination: {
						last: 10,
						before: users?.users?.pageInfo?.startCursor,
					},
					role: "store_owner" as UserRole,
				},
			});
			setPage(page - 1);
		}
	};

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">Manage Users</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add User
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
						<CategoryLoading />
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
				<div className="flex items-center justify-between mt-[30px]">
					<p>
						Showing 1 to {data.length} of {users?.users?.totalCount} entries
					</p>
					<div className="flex items-center gap-[15px]">
						<Button
							variant="tetriary"
							disabled={!users?.users?.pageInfo?.hasPreviousPage || loading}
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
							disabled={!users?.users?.pageInfo?.hasNextPage || loading}
							onClick={nextPage}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
			<AddUser open={open} setOpen={setOpen} refetch={refetch} />
			<EditUser
				open={openEdit}
				setOpen={setOpenEdit}
				refetch={refetch}
				selectedUser={selectedUser}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Delete User"
				copy={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
				action={() => {
					deleteUser({
						variables: { userId: selectedUser?.uuid },
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

export default Users;
