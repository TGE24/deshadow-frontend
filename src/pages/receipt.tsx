import Button from "../components/Button";
import Share from "../components/Icons/Share";
import MapMarker from "../components/Icons/MapMarker";
import Phone from "../components/Icons/Phone";
import Mail from "../components/Icons/Mail";
import Calendar from "../components/Icons/Calendar";
import Card from "../components/Icons/Card";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

type Product = {
	name: string;
	color: string;
	storage: number;
	imei: number;
	price: string;
	status: string;
};

const ProductDetails = [
	{
		imei: 237890456189046,
		name: "Iphone 14 Pro Max",
		storage: 256,
		price: "N 780,000",
		status: "UK Used",
		color: "Deep Purple",
	},
];

const columnHelper = createColumnHelper<Product>();

const columns = [
	columnHelper.accessor("imei", {
		cell: (info) => info.getValue(),
		header: () => <h4>IMEI No.</h4>,
	}),
	columnHelper.accessor((row) => row.name, {
		id: "name",
		cell: (info) => info.getValue(),
		header: () => <h4>Product Name</h4>,
	}),
	columnHelper.accessor("storage", {
		header: () => <h4>Storage</h4>,
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("color", {
		header: () => <h4>Color</h4>,
	}),
	columnHelper.accessor("status", {
		header: () => <h4>Status</h4>,
	}),
];

const Receipt = () => {
	const [data, _setData] = useState(() => [...ProductDetails]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<section>
			<div className="flex items-center justify-between mb-[24px]">
				<h2 className="text-[16px] md:text-[20px] font-bold mb-[24px]">
					Invoice
				</h2>
				<Button
					size="small"
					className="border-[#E4E4E4]"
					variant="tetriary"
					icon={<Share />}
				>
					Share
				</Button>
			</div>
			<div className="bg-[#F9FCFC] rounded-[6px] p-[45px] max-w-[826px] mx-auto flex flex-col items-center relative">
				<h2 className="text-[20px] text-[#282828] font-semibold">
					GREATFAITH COMMUNICATION SYNERGY LINK LIMITED
				</h2>
				<ul className="text-left mt-[12px] text-[12px] text-[#8B8B8B] flex flex-col gap-[12px]">
					<li className="flex gap-[16px] items-center">
						<MapMarker /> <span>Shop GC17 Old Banex Plaza Wuse II, Abuja</span>
					</li>
					<li className="flex gap-[16px] items-center">
						<Phone /> <span>08168684043, 08184377751</span>
					</li>
					<li className="flex gap-[16px] items-center">
						<Mail /> <span>davidgodstime55@gmail.com</span>
					</li>
				</ul>
				<img
					src="/sold-stamp.png"
					className="absolute right-[18%] top-[124px] w-[78px] h-[61px]"
				/>
				<div className="mt-[65px] flex justify-between w-full gap-[67px]">
					<div className="bg-[#F4F9FA80] border-[#E5E5E5] border-[1px] py-[28px] px-[24px] rounded-[10px] w-full">
						<h3 className="text-[16px] text-[#585656] mb-[21px] font-semibold">
							Bill To
						</h3>
						<p className="text-[18px] text-[#585656]">Chukwuebuka Ekenedo</p>
						<ul className="flex flex-col gap-[16px] mt-[16px] text-[12px] text-[#585656]">
							<li className="flex gap-[14px] items-center">
								<Phone /> <span>09034366168</span>
							</li>
							<li className="flex gap-[14px] items-center">
								<Calendar /> <span>24/05/2025</span>
							</li>
						</ul>
					</div>

					<div className="bg-[#F4F9FA80] border-[#E5E5E5] border-[1px] py-[28px] px-[24px] rounded-[10px] w-full">
						<h3 className="text-[16px] text-[#585656] mb-[21px] font-semibold">
							Payment Details
						</h3>
						<div className="flex flex-col gap-[16px] border-b-[1px] border-[#EBEBEB] pb-[22.5px]">
							<div className="flex justify-between text-[#282828] text-[12px]">
								<p>Subtotal:</p>
								<p>N 780,000</p>
							</div>
							<div className="flex justify-between text-[#282828] text-[12px]">
								<p>Revaluation:</p>
								<p>N 0.00</p>
							</div>
						</div>

						<div className="flex justify-between text-[#282828] text-[12px] mt-[22.5px]">
							<p>Total:</p>
							<p>N 780,000</p>
						</div>
						<div className="flex gap-[14px] items-center text-[#282828] text-[12px] mt-[16px]">
							<Card />
							<p className="text-[#585656] text-[12px]">Transfer & POS</p>
						</div>
					</div>
				</div>
				<h3 className="text-[#000000] text-[20px] font-semibold mt-[48px] self-start">
					Details of sold phone
				</h3>
				<div className="w-full mt-[26px] overflow-x-auto">
					<table className="w-full rounded-[10px]">
						<thead className="bg-[#F4F9FA] h-[56px] rounded-[10px]">
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
			</div>
		</section>
	);
};

export default Receipt;
