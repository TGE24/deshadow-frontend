import React from "react";
import { cn } from "../../utils/cn";
import { Step } from "./constants";

interface StepNavigationProps {
	steps: Step[];
	currentStep: number;
	onStepClick: (stepId: number) => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
	steps,
	currentStep,
	onStepClick,
}) => {
	const isStepCompleted = (stepId: number) => stepId < currentStep;
	const isStepActive = (stepId: number) => stepId === currentStep;

	return (
		<div className="w-[30%] h-fit bg-white border-1 border-[#D9D9D9] rounded-[10px] p-[24px]">
			<div className="space-y-[16px]">
				{steps.map((step) => (
					<div
						key={step.id}
						className={cn(
							`p-[10px] rounded-[8px] cursor-pointer transition-all text-gray-400 hover:bg-gray-100`,
							{ "text-[#016630]": isStepActive(step.id) },
							{ "bg-[#d0f0ee7a] text-green-800": isStepCompleted(step.id) }
						)}
						onClick={() => onStepClick(step.id)}
					>
						<div className="flex items-center gap-[12px]">
							<div
								className={cn(
									`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[12px] font-semibold bg-white text-gray-500 border border-[#D1D5DB]`,
									{
										"text-black border-[#008139]": isStepActive(step.id),
									},
									{
										"bg-[#008139] text-white": isStepCompleted(step.id),
									}
								)}
							>
								{isStepCompleted(step.id) ? "✓" : ""}
							</div>
							<div>
								<h3 className="font-semibold text-[14px]">{step.title}</h3>
								<p className="text-[12px] opacity-80">{step.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default StepNavigation;
