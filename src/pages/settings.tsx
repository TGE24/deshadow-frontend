import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import {
	PayoutBank,
	useDeletePayoutBankMutation,
	usePayoutBanksLazyQuery,
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
import EditBank from "../modules/Modals/PayoutBank/EditBank";
import AddBank from "../modules/Modals/PayoutBank/AddBank";

const Settings = () => {
	const [selectedAccount, setSelectedAccount] = useState<PayoutBank | null>(
		null,
	);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [getPayoutBanks, { data: banks, loading, refetch }] =
		usePayoutBanksLazyQuery({
			fetchPolicy: "network-only",
		});
	const [deleteBank, { loading: deleteLoading }] =
		useDeletePayoutBankMutation();
	const [data, setData] = useState<PayoutBank[]>([]);

	const columns = useMemo<ColumnDef<PayoutBank>[]>(
		() => [
			{
				accessorKey: "bankName",
				cell: (info) => info.getValue(),
				header: () => <h4>Bank Name</h4>,
			},
			{
				accessorKey: "accountNumber",
				cell: (info) => info.getValue(),
				header: () => <h4>Account Number</h4>,
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-[20px]">
						<button
							className={cn("font-medium cursor-pointer")}
							onClick={() => {
								setEditOpen(true);
								setSelectedAccount(row.original);
							}}
						>
							Edit
						</button>
						<button
							className={cn("font-medium cursor-pointer")}
							onClick={() => {
								setDeleteOpen(true);
								setSelectedAccount(row.original);
							}}
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[],
	);

	useEffect(() => {
		getPayoutBanks({ variables: { pagination: { first: 10 } } });
	}, [getPayoutBanks]);

	useEffect(() => {
		if (banks?.payoutBanks.edges) {
			setData(
				banks?.payoutBanks.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "PayoutBank") as PayoutBank[],
			);
		}
	}, [banks]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (banks?.payoutBanks.pageInfo?.hasNextPage) {
			getPayoutBanks({
				variables: {
					pagination: {
						first: 10,
						after: banks?.payoutBanks?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (banks?.payoutBanks?.pageInfo?.hasPreviousPage) {
			getPayoutBanks({
				variables: {
					pagination: {
						last: 10,
						before: banks?.payoutBanks?.pageInfo?.startCursor,
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
						Manage Bank Accounts
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Brand
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
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					{loading ? (
						<TableLoader columns={columns.length} />
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
												cell.getContext(),
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
						Showing 1 to {data.length} of {banks?.payoutBanks?.totalCount}{" "}
						entries
					</p>
					<div className="flex items-center gap-[15px]">
						<Button
							variant="tetriary"
							disabled={
								!banks?.payoutBanks?.pageInfo?.hasPreviousPage || loading
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
							disabled={!banks?.payoutBanks?.pageInfo?.hasNextPage || loading}
							onClick={nextPage}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
			<AddBank open={open} setOpen={setOpen} refetch={refetch} />
			<EditBank
				open={editOpen}
				setOpen={setEditOpen}
				refetch={refetch}
				selectedAccount={selectedAccount}
			/>
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Remove Brand"
				copy={`Are you sure you want to remove ${selectedAccount?.accountNumber}?`}
				action={() => {
					deleteBank({
						variables: { uuid: selectedAccount?.uuid },
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

export default Settings;
