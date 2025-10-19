import React, { useState, ReactNode } from "react";

interface AccordionProps {
	title: string;
	children: ReactNode;
	defaultOpen?: boolean;
	className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
	title,
	children,
	defaultOpen = false,
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const toggleAccordion = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={`border border-gray-200 rounded-md ${className}`}>
			<button
				type="button"
				onClick={toggleAccordion}
				className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
			>
				<span className="text-[14px] uppercase font-semibold text-gray-600">
					{title}
				</span>
				<svg
					className={`w-5 h-5 transition-transform duration-200 ${
						isOpen ? "transform rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
			<div
				className={`overflow-hidden transition-all duration-200 ${
					isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
};

export default Accordion;
