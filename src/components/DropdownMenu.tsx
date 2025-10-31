import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuItem {
	label: string;
	onClick: () => void;
	className?: string;
}

interface DropdownMenuProps {
	trigger: React.ReactNode;
	items: DropdownMenuItem[];
	className?: string;
}

const DropdownMenu = ({
	trigger,
	items,
	className = "",
}: DropdownMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const updatePosition = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			const dropdownHeight = 80 + items.length * 40; // Estimated dropdown height
			const spaceBelow = window.innerHeight - rect.bottom;
			const spaceAbove = rect.top;

			let top = rect.bottom + window.scrollY;
			let left = rect.right + window.scrollX - 120; // Align to right edge

			// If not enough space below and more space above, show above
			if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
				top = rect.top + window.scrollY - dropdownHeight;
			}

			// Ensure dropdown doesn't go off the right edge
			if (left + 120 > window.innerWidth) {
				left = window.innerWidth - 120 - 10;
			}

			// Ensure dropdown doesn't go off the left edge
			if (left < 10) {
				left = 10;
			}

			setPosition({ top, left });
		}
	};

	const handleItemClick = (item: DropdownMenuItem) => {
		item.onClick();
		setIsOpen(false);
	};

	return (
		<>
			<div className={className} ref={triggerRef}>
				<div
					onClick={(e) => {
						e.stopPropagation();
						updatePosition();
						setIsOpen(!isOpen);
					}}
					className="cursor-pointer"
				>
					{trigger}
				</div>
			</div>

			{isOpen &&
				createPortal(
					<div
						ref={dropdownRef}
						className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-[9999] flex flex-col min-w-[160px]"
						style={{
							top: position.top,
							left: position.left,
						}}
					>
						{items.map((item, index) => (
							<button
								key={index}
								onClick={(e) => {
									e.stopPropagation();
									handleItemClick(item);
								}}
								className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors ${
									item.className || ""
								}`}
							>
								{item.label}
							</button>
						))}
					</div>,
					document.body
				)}
		</>
	);
};

export default DropdownMenu;
