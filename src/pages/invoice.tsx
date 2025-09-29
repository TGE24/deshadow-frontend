import { useState } from "react";
import { cn } from "../utils/cn";
import PurchaseOverview from "../modules/Modals/PurchaseOverview";
import ViewProduct from "../modules/Modals/ViewProduct";
import DirectSale from "../modules/DirectSale";
import SwapSale from "../modules/SwapSale";

type TabType = "direct-sale" | "swap-sale" | "credit-sale" | "return-sale";

const Invoice = () => {
	const [open, setOpen] = useState(false);
	const [overviewOpen, setOverviewOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("direct-sale");

	const tabs = [
		{ id: "direct-sale" as TabType, label: "Direct Sale" },
		{ id: "swap-sale" as TabType, label: "Swap Sale" },
		{ id: "credit-sale" as TabType, label: "Credit Sale" },
		{ id: "return-sale" as TabType, label: "Return Sale" },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "direct-sale":
				return (
					<DirectSale setOpen={setOpen} setOverviewOpen={setOverviewOpen} />
				);
			case "swap-sale":
				return <SwapSale setOpen={setOpen} setOverviewOpen={setOverviewOpen} />;
			case "credit-sale":
				return (
					<div className="p-[24px]">
						<h3 className="text-[18px] font-semibold mb-[16px]">Credit Sale</h3>
						<p className="text-[#6A6A6A]">Credit sale content goes here...</p>
						{/* Add your credit sale components here */}
					</div>
				);
			case "return-sale":
				return (
					<div className="p-[24px]">
						<h3 className="text-[18px] font-semibold mb-[16px]">Return Sale</h3>
						<p className="text-[#6A6A6A]">Return sale content goes here...</p>
						{/* Add your return sale components here */}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<h2 className="text-[16px] md:text-[20px] font-bold mb-[24px]">
				Invoice
			</h2>

			{/* Tab Navigation */}
			<div className="bg-white rounded-[15px] overflow-hidden">
				<div className="border-b border-[#E3E3E3]">
					<div className="flex">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"flex-1 px-[16px] py-[16px] text-[16px] font-medium transition-all duration-200 border-b-2 hover:bg-[#F8F8F8]",
									{
										"bg-[#68A59A] text-white border-[#68A59A]":
											activeTab === tab.id,
										"bg-white text-[#6A6A6A] border-transparent hover:text-[#68A59A]":
											activeTab !== tab.id,
									}
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				<div className="min-h-[400px]">{renderTabContent()}</div>
			</div>
			<ViewProduct open={open} setOpen={setOpen} />
			<PurchaseOverview open={overviewOpen} setOpen={setOverviewOpen} />
		</>
	);
};

export default Invoice;
