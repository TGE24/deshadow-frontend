import { useEffect, useState, useMemo } from "react";
import {
	useCreditProfilesLazyQuery,
	useSearchCreditProfilesLazyQuery,
	CreditProfile,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import { formatDateTime, formatNaira } from "../utils/formatters";
import { Pagination } from "../modules/Pagination";
import Button from "../components/Button";
import Input from "../components/Input";
import Plus from "../components/Icons/Plus";
import { useNavigate } from "react-router-dom";
import CreateCreditProfileModal from "../modules/Modals/CreditProfile/CreateCreditProfileModal";
import { useDebounce } from "../hooks/useDebounce";

const PAGE_SIZE = 10;

const ResellersRecord = () => {
	const navigate = useNavigate();
	const [creditDeviceModalOpen, setCreditDeviceModalOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const isSearching = Boolean(debouncedSearchTerm.trim());
	const [getCreditProfiles, { data: creditProfiles, loading, refetch }] =
		useCreditProfilesLazyQuery({
			fetchPolicy: "network-only",
		});
	const [
		getSearchedCreditProfiles,
		{ data: searchedCreditProfiles, loading: searchLoading },
	] = useSearchCreditProfilesLazyQuery({
		fetchPolicy: "network-only",
	});

	const [data, setData] = useState<CreditProfile[]>([]);

	const columns = useMemo<ColumnDef<CreditProfile>[]>(() => {
		const baseColumns: ColumnDef<CreditProfile>[] = [
			{
				accessorKey: "customerName",
				cell: (info) => info.getValue(),
				header: () => <h4>Customer Name</h4>,
			},
			{
				accessorKey: "customerEmail",
				cell: (info) => info.getValue(),
				header: () => <h4>Customer Email</h4>,
			},
			{
				accessorKey: "totalPendingAmount",
				cell: (info) => {
					const value = info.getValue() as number;
					return formatNaira(value);
				},
				header: () => <h4>Total Pending Amount</h4>,
			},
			{
				accessorKey: "createdAt",
				cell: (info) => {
					const value = info.getValue() as string;
					return formatDateTime(value);
				},
				header: () => <h4>Created At</h4>,
			},
		];

		return baseColumns;
	}, []);

	useEffect(() => {
		setPage(1);

		if (isSearching) {
			getSearchedCreditProfiles({
				variables: {
					query: debouncedSearchTerm.trim(),
					limit: PAGE_SIZE,
					offset: 0,
				},
			});
			return;
		}

		getCreditProfiles({
			variables: {
				pagination: { first: PAGE_SIZE },
			},
		});
	}, [
		debouncedSearchTerm,
		getCreditProfiles,
		getSearchedCreditProfiles,
		isSearching,
	]);

	useEffect(() => {
		if (creditProfiles?.creditProfiles?.edges) {
			setData(
				creditProfiles.creditProfiles.edges
					.map((edge) => edge.node)
					.filter(
						(node) => node.__typename === "CreditProfile",
					) as CreditProfile[],
			);
		}
	}, [creditProfiles]);

	const tableData = useMemo<CreditProfile[]>(() => {
		if (isSearching) {
			return (
				(searchedCreditProfiles?.searchCreditProfiles
					?.profiles as CreditProfile[]) ?? []
			);
		}

		return data;
	}, [data, isSearching, searchedCreditProfiles]);

	const totalCount = isSearching
		? (searchedCreditProfiles?.searchCreditProfiles?.totalCount ?? 0)
		: (creditProfiles?.creditProfiles?.totalCount ?? 0);

	const hasNextPage = isSearching
		? page * PAGE_SIZE < totalCount
		: (creditProfiles?.creditProfiles?.pageInfo?.hasNextPage ?? false);

	const hasPreviousPage = isSearching
		? page > 1
		: (creditProfiles?.creditProfiles?.pageInfo?.hasPreviousPage ?? false);

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (isSearching) {
			if (!hasNextPage) return;

			const nextPageNumber = page + 1;
			const nextOffset = (nextPageNumber - 1) * PAGE_SIZE;

			getSearchedCreditProfiles({
				variables: {
					query: debouncedSearchTerm.trim(),
					limit: PAGE_SIZE,
					offset: nextOffset,
				},
			});
			setPage(nextPageNumber);
			return;
		}

		if (creditProfiles?.creditProfiles?.pageInfo?.hasNextPage) {
			getCreditProfiles({
				variables: {
					pagination: {
						first: PAGE_SIZE,
						after: creditProfiles?.creditProfiles?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (isSearching) {
			if (!hasPreviousPage) return;

			const previousPageNumber = page - 1;
			const previousOffset = (previousPageNumber - 1) * PAGE_SIZE;

			getSearchedCreditProfiles({
				variables: {
					query: debouncedSearchTerm.trim(),
					limit: PAGE_SIZE,
					offset: previousOffset,
				},
			});
			setPage(previousPageNumber);
			return;
		}

		if (creditProfiles?.creditProfiles?.pageInfo?.hasPreviousPage) {
			getCreditProfiles({
				variables: {
					pagination: {
						last: PAGE_SIZE,
						before: creditProfiles?.creditProfiles?.pageInfo?.startCursor,
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
						Resellers Record
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setCreditDeviceModalOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Credit Profile
				</Button>
			</div>

			<div className="mt-4 max-w-[400px]">
				<Input
					placeholder="Search by customer name or email"
					variant="search"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
				/>
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
					{loading || searchLoading ? (
						<TableLoader columns={columns.length} />
					) : tableData.length === 0 ? (
						<TableEmptyState
							title="No Credit Profiles Found"
							description={
								searchTerm.trim()
									? "No credit profiles match your search."
									: "There are no credit profiles to display. Credit profiles will appear here once they are created."
							}
							colSpan={columns.length}
						/>
					) : (
						<tbody>
							{table.getRowModel().rows.map((row) => {
								return (
									<tr
										key={row.id}
										className={`border-b-[1px] border-[#E3E3E3] cursor-pointer hover:bg-[#F9F9F9] `}
										onClick={() =>
											navigate(`/credit-profile/${row.original.uuid}`)
										}
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
								);
							})}
						</tbody>
					)}
				</table>

				<Pagination
					page={page}
					loading={loading || searchLoading}
					totalCount={totalCount}
					dataLength={tableData.length}
					hasNextPage={hasNextPage}
					hasPreviousPage={hasPreviousPage}
					onNextPage={nextPage}
					onPrevPage={prevPage}
				/>
			</div>
			<CreateCreditProfileModal
				open={creditDeviceModalOpen}
				setOpen={setCreditDeviceModalOpen}
				refetch={refetch}
			/>
		</>
	);
};

export default ResellersRecord;
