import { useEffect, useMemo, useState } from "react";
import {
	useCreditProfileLazyQuery,
	SaleType,
	Sale,
	SaleItem,
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
// import ViewSale from "../modules/Modals/SalesDetails/ViewSale";
import Modal from "react-responsive-modal";
import ResellersSale from "../modules/ResellersSale";
import Plus from "../components/Icons/Plus";
import RepaymentModal from "../modules/Modals/CreditProfile/RepaymentModal";
import ReturnItemModal from "../modules/Modals/CreditProfile/ReturnItemModal";
import ViewSaleItem from "../modules/Modals/SalesDetails/ViewSaleItem";

const CreditProfileDetails = () => {
	const [getCreditProfile, { data: creditProfile, loading, refetch }] =
		useCreditProfileLazyQuery({
			fetchPolicy: "network-only",
		});
	const { id } = useParams<{ id: string }>();
	const [open, setOpen] = useState(false);
	const [creditDeviceModalOpen, setCreditDeviceModalOpen] = useState(false);
	const [selectedSaleItem, setSelectedSaleItem] = useState<SaleItem>(
		{} as SaleItem,
	);
	const [data, setData] = useState<Sale[]>([]);
	const [returnModalOpen, setReturnModalOpen] = useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);

	const profile = creditProfile?.creditProfile?.profile;

	useEffect(() => {
		if (id) {
			getCreditProfile({
				variables: { profileUUID: id },
			});
		}
	}, [getCreditProfile, id]);

	useEffect(() => {
		if (creditProfile?.creditProfile?.pendingSales) {
			setData(
				creditProfile?.creditProfile?.pendingSales.map(
					(item) => item.sale,
				) as Sale[],
			);
		}
	}, [creditProfile]);

	const pendingSales = useMemo(
		() => creditProfile?.creditProfile?.pendingSales || [],
		[creditProfile?.creditProfile?.pendingSales],
	);

	const columns = useMemo<ColumnDef<SaleItem>[]>(() => {
		const baseColumns: ColumnDef<SaleItem>[] = [
			{
				accessorKey: "product.name",
				cell: (info) => {
					const row = info.row.original;
					return row.product?.name || row.accessory?.name || "N/A";
				},
				header: () => <h4>Product Name</h4>,
			},
			{
				accessorKey: "productItem.serialNumber",
				cell: (info) => {
					const row = info.row.original;
					return row.productItem?.serialNumber || "N/A";
				},
				header: () => <h4>Serial Number</h4>,
			},
			{
				accessorKey: "lineTotal",
				cell: (info) => {
					const value = info.getValue() as number;
					return formatNaira(value);
				},
				header: () => <h4>Total Amount</h4>,
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
				accessorKey: "fulfillmentStatus",
				cell: (info) => {
					const status = info.getValue() as string;
					const getStatusStyles = (status: string) => {
						switch (status?.toLowerCase()) {
							case "delivered":
								return "bg-green-100 text-green-800 border-green-200";
							case "pending":
								return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
			{
				accessorKey: "actions",
				header: () => <h4>Actions</h4>,
				cell: ({ row }) => {
					const saleItem = row.original;
					return (
						<div className="flex gap-2">
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedSaleItem(saleItem);
									setReturnModalOpen(true);
								}}
								className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
							>
								Return
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedSaleItem(saleItem);
									setPaymentModalOpen(true);
								}}
								className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
							>
								Pay
							</button>
						</div>
					);
				},
			},
		];

		return baseColumns;
	}, []);

	const table = useReactTable({
		data: pendingSales[0]?.sale.items as SaleItem[],
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

	return (
		<>
			<div className="container mx-auto p-6">
				{/* Header Section */}
				<div className="mb-6">
					<div className="flex items-center justify-between w-full">
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
						<Button
							size="small"
							icon={<Plus color="#060606" />}
							onClick={() => setCreditDeviceModalOpen(true)}
							className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
						>
							Add Credit Device
						</Button>
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
								{profile?.customerName}
							</p>
						</div>
						{profile?.customerEmail && (
							<div>
								<p className="text-sm text-gray-600 mb-1">Email</p>
								<p className="text-base font-medium text-gray-900">
									{profile.customerEmail}
								</p>
							</div>
						)}
						{profile?.customerPhone && (
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
					<p className="text-4xl font-bold">
						{formatNaira(creditProfile?.creditProfile?.totalPendingAmount)}
					</p>
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
							) : data.length === 0 ? (
								<TableEmptyState
									title="No Sales Found"
									description="There are no sales records to display. Sales will appear here once they are created."
									colSpan={columns.length}
								/>
							) : (
								<tbody>
									{table.getRowModel().rows.map((row) => {
										const sale = row.original;

										return (
											<tr
												key={row.id}
												className={`border-b-[1px] border-[#E3E3E3] cursor-pointer hover:bg-[#F9F9F9]`}
												onClick={() => {
													setSelectedSaleItem(sale);
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
			<ViewSaleItem open={open} setOpen={setOpen} saleItem={selectedSaleItem} />

			<ReturnItemModal
				open={returnModalOpen}
				setOpen={setReturnModalOpen}
				refetch={refetch}
				data={selectedSaleItem}
				profileId={id ?? ""}
			/>

			{/* Payment Modal */}
			<RepaymentModal
				open={paymentModalOpen}
				setOpen={setPaymentModalOpen}
				refetch={refetch}
				data={selectedSaleItem}
				profileId={id ?? ""}
			/>

			<Modal
				open={creditDeviceModalOpen}
				onClose={() => setCreditDeviceModalOpen(false)}
				center
				classNames={{
					modal: "customModal w-[90vw] max-w-[1200px]",
				}}
			>
				<ResellersSale
					saleType={SaleType.Credit}
					showSteps={false}
					refetch={refetch}
				/>
			</Modal>
		</>
	);
};

export default CreditProfileDetails;
