import { cn } from "../utils/cn";
import Chart from "./Icons/Chart";

interface StatCardProps {
	headline: string;
	stat1: {
		copy: string;
		value: number;
	};
	stat2: {
		copy: string;
		value: number;
	};
	bottomStat: string;
	bgColor?: string;
	className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
	headline,
	stat1,
	stat2,
	bottomStat,
	bgColor,
	className,
	...rest
}) => {
	return (
		<div
			className={cn("rounded-[15px] py-[22px] px-[16px]", className)}
			style={{ backgroundColor: bgColor }}
			{...rest}
		>
			<h3 className="text-[#278783] font-bold text-[14px] mb-[21px]">
				{headline}
			</h3>
			<p className="text-[#003D3A] text-[14px] mb-[14px]">
				{stat1.copy}:{" "}
				<span className="text-[16px] font-bold text-[#278783]">
					{stat1.value}
				</span>
			</p>
			<p className="text-[#003D3A] text-[14px]">
				{stat2.copy}:{" "}
				<span className="text-[16px] font-bold text-[#278783]">
					{stat2.value}
				</span>
			</p>
			{bottomStat && (
				<div className="mt-[30px] flex items-baseline justify-between">
					<div className="flex items-center gap-[6px]">
						<div className="bg-[#278783] text-white text-[12px] font-bold py-[2.5px] px-[5.5px] w-fit rounded-[10px]">
							+ {bottomStat}
						</div>
						<p className="text-[12px] font-bold text-[#278783]">high today</p>
					</div>
					<Chart />
				</div>
			)}
		</div>
	);
};

export default StatCard;
