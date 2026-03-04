import { useEffect, useState, useMemo } from "react";
import {
	useCreditProfilesLazyQuery,
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
import { formatDateTime } from "../utils/formatters";
import { Pagination } from "../modules/Pagination";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import { useNavigate } from "react-router-dom";
import CreateCreditProfileModal from "../modules/Modals/CreditProfile/CreateCreditProfileModal";

const ResellersRecord = () => {
	const navigate = useNavigate();
	const [creditDeviceModalOpen, setCreditDeviceModalOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [getCreditProfiles, { data: creditProfiles, loading, refetch }] =
		useCreditProfilesLazyQuery({
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
			// {
			// 	accessorKey: "totalAmount",
			// 	cell: (info) => {
			// 		const value = info.getValue() as number;
			// 		return formatNaira(value);
			// 	},
			// 	header: () => <h4>Total Amount</h4>,
			// },
			{
				accessorKey: "createdAt",
				cell: (info) => {
					const value = info.getValue() as string;
					return formatDateTime(value);
				},
				header: () => <h4>Created At</h4>,
			},
			// {
			// 	accessorKey: "saleType",
			// 	cell: (info) => {
			// 		const saleType = info.getValue() as SaleType;
			// 		const getSaleTypeStyles = (type: SaleType) => {
			// 			switch (type) {
			// 				case SaleType.Direct:
			// 					return "bg-blue-100 text-blue-800";
			// 				case SaleType.Swap:
			// 					return "bg-green-100 text-green-800";
			// 				case SaleType.Credit:
			// 					return "bg-orange-100 text-orange-800";
			// 				default:
			// 					return "bg-gray-100 text-gray-800";
			// 			}
			// 		};

			// 		const getSaleTypeLabel = (type: SaleType) => {
			// 			switch (type) {
			// 				case SaleType.Direct:
			// 					return "Direct Sale";
			// 				case SaleType.Swap:
			// 					return "Swap Sale";
			// 				case SaleType.Credit:
			// 					return "Credit Sale";
			// 				default:
			// 					return type;
			// 			}
			// 		};

			// 		return (
			// 			<span
			// 				className={`px-2 py-1 rounded text-xs font-medium ${getSaleTypeStyles(
			// 					saleType,
			// 				)}`}
			// 			>
			// 				{getSaleTypeLabel(saleType)}
			// 			</span>
			// 		);
			// 	},
			// 	header: () => <h4>Sale Type</h4>,
			// },

			// {
			// 	accessorKey: "saleStatus",
			// 	cell: (info) => {
			// 		const status = info.getValue() as string;
			// 		const getStatusStyles = (status: string) => {
			// 			switch (status?.toLowerCase()) {
			// 				case "completed":
			// 					return "bg-green-100 text-green-800 border-green-200";
			// 				case "pending":
			// 					return "bg-yellow-100 text-yellow-800 border-yellow-200";
			// 				case "cancelled":
			// 					return "bg-red-100 text-red-800 border-red-200";
			// 				case "returned":
			// 					return "bg-gray-100 text-gray-800 border-gray-200";
			// 				default:
			// 					return "bg-gray-100 text-gray-800 border-gray-200";
			// 			}
			// 		};

			// 		return (
			// 			<span
			// 				className={`px-[8px] py-[4px] rounded-[4px] text-[12px] font-medium border capitalize ${getStatusStyles(
			// 					status,
			// 				)}`}
			// 			>
			// 				{status}
			// 			</span>
			// 		);
			// 	},
			// 	header: () => <h4>Sale Status</h4>,
			// },
		];

		return baseColumns;
	}, []);

	useEffect(() => {
		getCreditProfiles({
			variables: {
				pagination: { first: 10 },
			},
		});

		setPage(1);
	}, [getCreditProfiles]);

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

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (creditProfiles?.creditProfiles?.pageInfo?.hasNextPage) {
			getCreditProfiles({
				variables: {
					pagination: {
						first: 10,
						after: creditProfiles?.creditProfiles?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (creditProfiles?.creditProfiles?.pageInfo?.hasPreviousPage) {
			getCreditProfiles({
				variables: {
					pagination: {
						last: 10,
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
					) : data.length === 0 ? (
						<TableEmptyState
							title="No Credit Profiles Found"
							description="There are no credit profiles to display. Credit profiles will appear here once they are created."
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
					loading={loading}
					totalCount={creditProfiles?.creditProfiles.totalCount ?? 0}
					dataLength={data.length}
					hasNextPage={
						creditProfiles?.creditProfiles?.pageInfo?.hasNextPage ?? false
					}
					hasPreviousPage={
						creditProfiles?.creditProfiles?.pageInfo?.hasPreviousPage ?? false
					}
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
