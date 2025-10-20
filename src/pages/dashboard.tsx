import { useState } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import StatCard from "../components/StatCard";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Input from "../components/Input";
import DatePicker from "react-datepicker";
import Calendar from "../components/Icons/Calendar";
import AddProduct from "../modules/Modals/Product/AddProduct";
import { useSalesQuery } from "../generated/graphql";

type Product = {
	productName: string;
	color: string;
	storage: number;
	amount: number;
	imei: number;
	customerName: string;
	phoneNumber: string;
	status: string;
};

const defaultData: Product[] = [
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
	{
		productName: "Iphone 13 pro max",
		color: "Blue",
		storage: 256,
		amount: 1000,
		imei: 123456789012345,
		customerName: "John Doe",
		phoneNumber: "123-456-7890",
		status: "Available",
	},
];

const columnHelper = createColumnHelper<Product>();

const columns = [
	columnHelper.accessor("productName", {
		cell: (info) => info.getValue(),
		header: () => <h4>Product Name</h4>,
	}),
	columnHelper.accessor((row) => row.color, {
		id: "color",
		cell: (info) => <i>{info.getValue()}</i>,
		header: () => <h4>Color</h4>,
	}),
	columnHelper.accessor("storage", {
		header: () => <h4>Storage</h4>,
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("amount", {
		header: () => <h4>Amount</h4>,
	}),
	columnHelper.accessor("imei", {
		header: () => <h4>IMEI No.</h4>,
	}),
	columnHelper.accessor("customerName", {
		header: () => <h4>Customer Name</h4>,
	}),
	columnHelper.accessor("phoneNumber", {
		header: () => <h4>Phone Number</h4>,
	}),
	columnHelper.accessor("status", {
		header: () => <h4>Status</h4>,
	}),
];

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const [startDate] = useState(new Date());
	const [endDate] = useState(addDays(new Date(), 3));

	const { data: sales } = useSalesQuery({
		variables: { pagination: { first: 10 } },
	});

	console.log(sales);
	// const onChange = (dates) => {
	// 	const [start, end] = dates;
	// 	setStartDate(start);
	// 	setEndDate(end);
	// };
	const [data] = useState(() => [...defaultData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Daily Activity Report
					</h2>
					<p className="text-[14px] text-[#6A6A6A]">
						View your analytic store performance from the reports
					</p>
				</div>
				<Button
					variant="primary"
					size="small"
					icon={<Plus />}
					onClick={() => setOpen(true)}
				>
					Add New Stock
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px] mt-[24px]">
				<StatCard
					bgColor="#FFEBD0"
					headline={"Total Sales"}
					stat1={{ copy: "Total Uk Used Phones Sold", value: 63 }}
					stat2={{ copy: "Total Brand New Phones Sold", value: 43 }}
					bottomStat={"25%"}
				/>
				<StatCard
					bgColor="rgba(39,135,131,0.2)"
					headline={"New Stocks"}
					stat1={{ copy: "Total Uk Used Stock", value: 63 }}
					stat2={{ copy: "Total Brand New Stock", value: 43 }}
					bottomStat={""}
				/>
				<StatCard
					bgColor="#FFEBD0"
					headline={"Total Returns"}
					stat1={{ copy: "Total Uk Used Stock", value: 2 }}
					stat2={{ copy: "Total (pbeg)", value: 0 }}
					bottomStat={"30%"}
				/>
			</div>
			<div className="mt-[48px]">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-[20px]">
					<h3 className="font-semibold text-[16px]">Sales History</h3>
					<div className="flex items-center gap-[16px]">
						<DatePicker
							selected={startDate}
							// onChange={onChange}
							startDate={startDate}
							endDate={endDate}
							selectsRange
							rangeSeparator=" - "
							icon={<Calendar />}
							showIcon
							className="outline-none border-none w-full !pl-[8px] text-[14px] font-sfpro"
						/>
						<Input
							placeholder="Search sales history"
							name="search"
							id="search"
							variant="search"
						/>
					</div>
				</div>

				<div className="w-full mt-[26px] overflow-x-auto">
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
					</table>
				</div>
				<div className="flex items-center justify-between mt-[30px]">
					<p>Showing 1 to 4 of 4 entries</p>
					<div className="flex items-center gap-[15px]">
						<Button variant="tetriary" size="small" className="">
							Previous
						</Button>
						<div className="px-[18px] py-[11px] bg-[#278783] rounded-[6px] text-white">
							1
						</div>
						<Button variant="tetriary" size="small">
							Next
						</Button>
					</div>
				</div>
			</div>
			<AddProduct open={open} setOpen={setOpen} refetch={() => {}} />
		</>
	);
};

export default Dashboard;
function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}
