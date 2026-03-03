import { useEffect, useMemo, useState } from "react";
import {
	useCreditProfileLazyQuery,
	Sale,
	SaleType,
	SaleStatus,
} from "../generated/graphql";
import { useParams, Link } from "react-router-dom";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { formatNaira, formatDateTime } from "../utils/formatters";
import TableLoader from "../components/TableLoader";
import TableEmptyState from "../components/TableEmptyState";
import Button from "../components/Button";
import ViewSale from "../modules/Modals/SalesDetails/ViewSale";

const CreditProfileDetails = () => {
	const [getCreditProfile, { data: creditProfile, loading, refetch }] =
		useCreditProfileLazyQuery({
			fetchPolicy: "network-only",
		});
	const { id } = useParams<{ id: string }>();
	const [open, setOpen] = useState(false);
	const [selectedSale, setSelectedSale] = useState<Sale>({} as Sale);

	useEffect(() => {
		if (id) {
			getCreditProfile({
				variables: { profileUUID: id },
			});
		}
	}, [getCreditProfile, id]);

	const profile = creditProfile?.creditProfile?.profile;
	const pendingSales = useMemo(
		() => creditProfile?.creditProfile?.pendingSales || [],
		[creditProfile?.creditProfile?.pendingSales],
	);

	// Calculate total outstanding amount
	const totalOutstanding = useMemo(() => {
		return pendingSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
	}, [pendingSales]);

	const columns = useMemo<ColumnDef<Sale>[]>(() => {
		const baseColumns: ColumnDef<Sale>[] = [
			{
				accessorKey: "customerName",
				cell: (info) => info.getValue(),
				header: () => <h4>Customer Name</h4>,
			},
			{
				accessorKey: "totalAmount",
				cell: (info) => {
					const value = info.getValue() as number;
					return formatNaira(value);
				},
				header: () => <h4>Total Amount</h4>,
			},
			{
				header: "Created By",
				cell: ({ row }) => {
					const value = row.original.createdBy;
					return `${value?.firstName} ${value?.lastName} (${
						value?.role.replace("_", " ") ?? ""
					})`;
				},
			},
			{
				accessorKey: "createdAt",
				cell: (info) => {
					const value = info.getValue() as string;
					return formatDateTime(value);
				},
				header: () => <h4>Created At</h4>,
			},
			{
				accessorKey: "saleType",
				cell: (info) => {
					const saleType = info.getValue() as SaleType;
					const getSaleTypeStyles = (type: SaleType) => {
						switch (type) {
							case SaleType.Direct:
								return "bg-blue-100 text-blue-800";
							case SaleType.Swap:
								return "bg-green-100 text-green-800";
							case SaleType.Credit:
								return "bg-orange-100 text-orange-800";
							default:
								return "bg-gray-100 text-gray-800";
						}
					};

					const getSaleTypeLabel = (type: SaleType) => {
						switch (type) {
							case SaleType.Direct:
								return "Direct Sale";
							case SaleType.Swap:
								return "Swap Sale";
							case SaleType.Credit:
								return "Credit Sale";
							default:
								return type;
						}
					};

					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${getSaleTypeStyles(
								saleType,
							)}`}
						>
							{getSaleTypeLabel(saleType)}
						</span>
					);
				},
				header: () => <h4>Sale Type</h4>,
			},

			{
				accessorKey: "saleStatus",
				cell: (info) => {
					const status = info.getValue() as string;
					const getStatusStyles = (status: string) => {
						switch (status?.toLowerCase()) {
							case "completed":
								return "bg-green-100 text-green-800 border-green-200";
							case "pending":
								return "bg-yellow-100 text-yellow-800 border-yellow-200";
							case "cancelled":
								return "bg-red-100 text-red-800 border-red-200";
							case "returned":
								return "bg-gray-100 text-gray-800 border-gray-200";
							default:
								return "bg-gray-100 text-gray-800 border-gray-200";
						}
					};

					return (
						<span
							className={`px-[8px] py-[4px] rounded-[4px] text-[12px] font-medium border capitalize ${getStatusStyles(
								status,
							)}`}
						>
							{status}
						</span>
					);
				},
				header: () => <h4>Sale Status</h4>,
			},
		];

		return baseColumns;
	}, []);

	const table = useReactTable({
		data: pendingSales,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">
						Profile Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						The credit profile you're looking for doesn't exist.
					</p>
					<Link to="/resellers-record">
						<Button variant="primary">Back to Credit Profiles</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto p-6">
				{/* Header Section */}
				<div className="mb-6">
					<div className="flex items-center justify-between">
						<div>
							<Link
								to="/resellers-record"
								className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
							>
								← Back to Credit Profiles
							</Link>
							<h1 className="text-3xl font-bold text-gray-900">
								Credit Profile Details
							</h1>
						</div>
					</div>
				</div>

				{/* Customer Information Card */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Customer Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<p className="text-sm text-gray-600 mb-1">Name</p>
							<p className="text-base font-medium text-gray-900">
								{profile.customerName}
							</p>
						</div>
						{profile.customerEmail && (
							<div>
								<p className="text-sm text-gray-600 mb-1">Email</p>
								<p className="text-base font-medium text-gray-900">
									{profile.customerEmail}
								</p>
							</div>
						)}
						{profile.customerPhone && (
							<div>
								<p className="text-sm text-gray-600 mb-1">Phone</p>
								<p className="text-base font-medium text-gray-900">
									{profile.customerPhone}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Outstanding Balance Card */}
				<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md p-6 mb-6 text-white">
					<h2 className="text-lg font-medium mb-2">
						Total Outstanding Balance
					</h2>
					<p className="text-4xl font-bold">{formatNaira(totalOutstanding)}</p>
					<p className="text-sm mt-2 opacity-90">
						{pendingSales.length} pending{" "}
						{pendingSales.length === 1 ? "sale" : "sales"}
					</p>
				</div>

				{/* Pending Sales Table */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Pending Sales
					</h2>
					<div className="w-full mt-[48px] overflow-x-auto">
						<table className="w-full min-w-[800px]">
							<thead className="bg-[#D4E7E6] h-[41px]">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr
										key={headerGroup.id}
										className="text-[14px] font-semibold"
									>
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
							) : pendingSales.length === 0 ? (
								<TableEmptyState
									title="No Sales Found"
									description="There are no sales records to display. Sales will appear here once they are created."
									colSpan={columns.length}
								/>
							) : (
								<tbody>
									{table.getRowModel().rows.map((row) => {
										const sale = row.original;
										const isCreditPending =
											sale.saleType === SaleType.Credit &&
											sale.saleStatus === SaleStatus.Pending;

										return (
											<tr
												key={row.id}
												className={`border-b-[1px] border-[#E3E3E3] cursor-pointer hover:bg-[#F9F9F9] ${
													isCreditPending
														? "bg-orange-50 hover:bg-orange-100 border-orange-200"
														: ""
												}`}
												onClick={() => {
													setSelectedSale(sale);
													setOpen(true);
												}}
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
					</div>
				</div>
			</div>
			<ViewSale
				open={open}
				setOpen={setOpen}
				sale={selectedSale}
				refetch={refetch}
			/>
		</>
	);
};

export default CreditProfileDetails;
