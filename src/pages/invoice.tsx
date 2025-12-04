import { useState } from "react";
import { cn } from "../utils/cn";
import PurchaseOverview from "../modules/Modals/PurchaseOverview";
import ViewProduct from "../modules/Modals/ViewProduct";
import DirectSale from "../modules/DirectSale";
import SwapSale from "../modules/SwapSale";

type TabType = "direct-sale" | "swap-sale";

const Invoice = () => {
	const [open, setOpen] = useState(false);
	const [overviewOpen, setOverviewOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("direct-sale");

	const tabs = [
		{ id: "direct-sale" as TabType, label: "Direct Sale" },
		{ id: "swap-sale" as TabType, label: "Swap Sale" },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "direct-sale":
				return (
					<DirectSale setOpen={setOpen} setOverviewOpen={setOverviewOpen} />
				);
			case "swap-sale":
				return <SwapSale setOpen={setOpen} />;
			default:
				return null;
		}
	};

	return (
		<>
			{/* Tab Navigation */}
			<div className="bg-white rounded-[15px] overflow-hidden">
				<div className="border-b border-[#E5E7EB]">
					<div className="flex gap-4">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"cursor-pointer px-[46px] py-[10px] text-[16px] font-medium text-[#6D7E95]",
									{
										"text-[#000000] border-b-2 border-[#278783]":
											activeTab === tab.id,
									}
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				<div className="min-h-[400px] max-w-[1000px]">{renderTabContent()}</div>
			</div>
			<ViewProduct open={open} setOpen={setOpen} />
			<PurchaseOverview open={overviewOpen} setOpen={setOverviewOpen} />
		</>
	);
};

export default Invoice;
