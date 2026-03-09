import { useEffect, useMemo, useState } from "react";
import {
	useCreditProfileLazyQuery,
	SaleType,
	Sale,
	SaleItem,
	CreditProfilePendingSale,
	CreditProfile,
	usePaymentHistoryQuery,
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
import Modal from "react-responsive-modal";
import ResellersSale from "../modules/ResellersSale";
import Plus from "../components/Icons/Plus";
import RepaymentModal from "../modules/Modals/CreditProfile/RepaymentModal";
import ReturnItemModal from "../modules/Modals/CreditProfile/ReturnItemModal";
import ViewSaleItem from "../modules/Modals/SalesDetails/ViewSaleItem";
import RepayAllModal from "../modules/Modals/CreditProfile/RepayAllModal";

const CreditProfileDetails = () => {
	const [getCreditProfile, { data: creditProfile, loading, refetch }] =
		useCreditProfileLazyQuery({
			fetchPolicy: "network-only",
		});
	const { data: paymentHistory, refetch: refetchPaymentHistory } =
		usePaymentHistoryQuery({ variables: { pagination: { first: 100 } } });
	const { id } = useParams<{ id: string }>();
	const [open, setOpen] = useState(false);
	const [creditDeviceModalOpen, setCreditDeviceModalOpen] = useState(false);
	const [selectedSaleItem, setSelectedSaleItem] = useState<SaleItem>(
		{} as SaleItem,
	);
	const [data, setData] = useState<Sale[]>([]);
	const [returnModalOpen, setReturnModalOpen] = useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [payAllModalOpen, setPayAllModalOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [showPaymentHistory, setShowPaymentHistory] = useState(false);

	const profile = creditProfile?.creditProfile?.profile;

	const refetchPageData = () => {
		refetch();
		refetchPaymentHistory();
	};

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

	const selectedItemsData = useMemo(() => {
		if (!pendingSales[0]?.sale.items) return { items: [], total: 0 };

		const selected = pendingSales[0].sale.items.filter((item) =>
			selectedItems.has(item.uuid),
		);
		const total = selected.reduce(
			(sum, item) => sum + (item.lineTotal || 0),
			0,
		);

		return { items: selected, total };
	}, [selectedItems, pendingSales]);

	const paymentHistoryItems = useMemo(() => {
		const customerEmail = profile?.customerEmail?.trim().toLowerCase();

		if (!customerEmail) return [];

		return (paymentHistory?.paymentTransactions?.edges || [])
			.map((edge) => edge.node)
			.filter(
				(
					node,
				): node is Extract<typeof node, { __typename: "PaymentTransaction" }> =>
					node.__typename === "PaymentTransaction",
			)
			.filter(
				(transaction) =>
					transaction.customerEmail?.trim().toLowerCase() === customerEmail,
			)
			.sort(
				(a, b) =>
					new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime(),
			);
	}, [paymentHistory?.paymentTransactions?.edges, profile?.customerEmail]);

	const columns = useMemo<ColumnDef<SaleItem>[]>(() => {
		const baseColumns: ColumnDef<SaleItem>[] = [
			{
				id: "select",
				header: () => {
					const isAllSelected =
						selectedItems.size > 0 &&
						selectedItems.size === (pendingSales[0]?.sale.items?.length || 0);

					return (
						<input
							type="checkbox"
							checked={isAllSelected}
							onChange={(e) => {
								if (e.target.checked) {
									const newSelected = new Set<string>();
									pendingSales[0]?.sale.items?.forEach((item) => {
										newSelected.add(item.uuid);
									});
									setSelectedItems(newSelected);
								} else {
									setSelectedItems(new Set());
								}
							}}
							className="w-4 h-4 cursor-pointer"
						/>
					);
				},
				cell: ({ row }) => {
					const saleItem = row.original;
					return (
						<input
							type="checkbox"
							checked={selectedItems.has(saleItem.uuid)}
							onChange={() => {
								const newSelected = new Set(selectedItems);
								if (newSelected.has(saleItem.uuid)) {
									newSelected.delete(saleItem.uuid);
								} else {
									newSelected.add(saleItem.uuid);
								}
								setSelectedItems(newSelected);
							}}
							onClick={(e) => e.stopPropagation()}
							className="w-4 h-4 cursor-pointer"
						/>
					);
				},
			},
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
					return row.productItem?.serialNumber || row.quantity;
				},
				header: () => <h4>Serial Number / Quantity</h4>,
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
	}, [selectedItems, pendingSales]);

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
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setShowPaymentHistory(!showPaymentHistory)}
								className="text-sm font-medium text-[#278783] hover:text-[#1f6d69]"
							>
								{showPaymentHistory
									? "Hide Payment History"
									: "Show Payment History"}
							</button>
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
				</div>

				<div
					className={`grid grid-cols-1 gap-6 ${showPaymentHistory ? "lg:grid-cols-3" : ""}`}
				>
					<div
						className={showPaymentHistory ? "lg:col-span-2" : "lg:col-span-3"}
					>
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
								<h2 className="text-lg font-medium mb-2 text-red-900">
									Total Outstanding Balance
								</h2>
								<p className="text-4xl font-bold text-red-700">
									{formatNaira(
										creditProfile?.creditProfile?.totalPendingAmount,
									)}
								</p>
							</div>

							<div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
								<h2 className="text-lg font-medium mb-2 text-green-900">
									Total Amount Paid
								</h2>
								<p className="text-4xl font-bold text-green-700">
									{formatNaira(creditProfile?.creditProfile?.totalPaidAmount)}
								</p>
							</div>
						</div>

						{/* Pending Sales Table */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-gray-900">
									Pending Sales
								</h2>
								{pendingSales.length > 0 && (
									<div className="flex items-center gap-4">
										{selectedItems.size > 0 && (
											<div className="text-sm text-gray-600">
												<span className="font-medium">
													{selectedItems.size}
												</span>{" "}
												item
												{selectedItems.size !== 1 ? "s" : ""} selected •{" "}
												<span className="font-medium">
													{formatNaira(selectedItemsData.total)}
												</span>
											</div>
										)}
										<Button
											size="small"
											onClick={() => setPayAllModalOpen(true)}
											disabled={selectedItems.size === 0}
											className={`${
												selectedItems.size === 0
													? "bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed"
													: "bg-green-600 text-white border-green-600 hover:bg-green-700"
											}`}
										>
											Pay For{" "}
											{selectedItems.size > 0 ? selectedItems.size : "Selected"}{" "}
											Item
											{selectedItems.size !== 1 ? "s" : ""}
										</Button>
									</div>
								)}
							</div>
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

					{showPaymentHistory && (
						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-4">
									Payment History
								</h2>
								{!profile?.customerEmail ? (
									<p className="text-sm text-gray-500">
										No customer email available to match payment history.
									</p>
								) : paymentHistoryItems.length === 0 ? (
									<p className="text-sm text-gray-500">
										No payments recorded yet.
									</p>
								) : (
									<div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
										{paymentHistoryItems.map((transaction) => (
											<div
												key={transaction.uuid}
												className="border border-gray-200 rounded-md p-3"
											>
												<div className="flex items-center justify-between gap-3">
													<p className="text-sm font-semibold text-gray-900">
														{formatNaira(transaction.amount)}
													</p>
													{transaction.channel && (
														<span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">
															{transaction.channel}
														</span>
													)}
												</div>
												<p className="text-xs text-gray-500 mt-1">
													{transaction.paidAt
														? formatDateTime(transaction.paidAt)
														: "Payment date unavailable"}
												</p>
												{transaction.requestedAmount && (
													<p className="text-xs text-gray-500 mt-1">
														Requested:{" "}
														{formatNaira(transaction.requestedAmount)}
													</p>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
			<ViewSaleItem open={open} setOpen={setOpen} saleItem={selectedSaleItem} />

			<ReturnItemModal
				open={returnModalOpen}
				setOpen={setReturnModalOpen}
				refetch={refetchPageData}
				data={selectedSaleItem}
				profileId={id ?? ""}
			/>

			{/* Payment Modal */}
			<RepaymentModal
				open={paymentModalOpen}
				setOpen={setPaymentModalOpen}
				refetch={refetchPageData}
				data={selectedSaleItem}
				saleUuid={pendingSales[0]?.sale.uuid ?? ""}
			/>

			{/* Pay All Modal */}
			<RepayAllModal
				open={payAllModalOpen}
				setOpen={setPayAllModalOpen}
				refetch={refetchPageData}
				profile={profile as CreditProfile}
				pendingSales={pendingSales[0] as CreditProfilePendingSale}
				selectedItems={selectedItemsData.items as SaleItem[]}
				totalAmount={selectedItemsData.total}
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
					refetch={refetchPageData}
				/>
			</Modal>
		</>
	);
};

export default CreditProfileDetails;
