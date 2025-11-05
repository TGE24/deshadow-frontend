import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
	useProductItemsLazyQuery,
	ProductItemStatus,
	Product,
} from "../generated/graphql";
import { useDebounce } from "../hooks/useDebounce";

interface ProductItemResult {
	__typename: "ProductItem";
	uuid: string;
	serialNumber: string;
	condition: string;
	status: ProductItemStatus;
	product: Partial<Product>;
	sellingPrice?: number;
}

interface SerialNumberAutoSuggestProps {
	value: string;
	onSelect: (item: ProductItemResult | null) => void;
	placeholder?: string;
	label?: string;
	className?: string;
}

const SerialNumberAutoSuggest: React.FC<SerialNumberAutoSuggestProps> = ({
	value,
	onSelect,
	placeholder = "Enter serial number...",
	label = "Serial Number",
	className = "",
}) => {
	const [inputValue, setInputValue] = useState(value);
	const [isOpen, setIsOpen] = useState(false);
	const [suggestions, setSuggestions] = useState<ProductItemResult[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [isItemSelected, setIsItemSelected] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const debouncedInputValue = useDebounce(inputValue, 300);

	// Handle clicks outside the component (custom logic needed for portal)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setSelectedIndex(-1);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen]);

	const containerRef = useRef<HTMLDivElement>(null);

	const [getProductItems] = useProductItemsLazyQuery();

	// Search for product items when debounced input changes
	useEffect(() => {
		const searchProductItems = async () => {
			if (!debouncedInputValue.trim() || debouncedInputValue.length < 2) {
				setSuggestions([]);
				setIsOpen(false);
				return;
			}

			// Don't search if an item was just selected
			if (isItemSelected) {
				return;
			}

			setLoading(true);
			try {
				const { data } = await getProductItems({
					variables: {
						filter: {
							serialNumber: debouncedInputValue,
							status: ProductItemStatus.Available,
						},
					},
				});

				if (data?.productItems?.edges) {
					// Map results directly since server-side filtering is now applied
					const results = data.productItems.edges
						.map((edge) => edge.node)
						.filter((node) => node.__typename === "ProductItem")
						.map((node) => node as ProductItemResult);

					setSuggestions(results);
					setIsOpen(results.length > 0);
				}
			} catch (error) {
				console.error("Error searching product items:", error);
				setSuggestions([]);
			} finally {
				setLoading(false);
			}
		};

		searchProductItems();
	}, [debouncedInputValue, getProductItems, isItemSelected]);

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen || suggestions.length === 0) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : 0
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : suggestions.length - 1
				);
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
					handleSelectItem(suggestions[selectedIndex]);
				}
				break;
			case "Escape":
				e.preventDefault();
				setIsOpen(false);
				setSelectedIndex(-1);
				break;
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		setSelectedIndex(-1);
		setIsItemSelected(false); // Reset selection state when user types

		if (!newValue.trim()) {
			onSelect(null);
		}
	};

	const handleSelectItem = (item: ProductItemResult) => {
		setInputValue(item.serialNumber);
		setIsOpen(false);
		setSelectedIndex(-1);
		setIsItemSelected(true);
		onSelect(item);
	};

	const getDropdownPosition = () => {
		if (!inputRef.current) return { top: 0, left: 0, width: 0 };

		const rect = inputRef.current.getBoundingClientRect();
		const dropdownHeight = Math.min(suggestions.length * 60, 240); // Max 4 items visible
		const viewportHeight = window.innerHeight;
		const spaceBelow = viewportHeight - rect.bottom;

		const top =
			spaceBelow >= dropdownHeight
				? rect.bottom + 4
				: rect.top - dropdownHeight - 4;
		const left = rect.left;
		const width = rect.width;

		return { top, left, width };
	};

	const dropdownPosition = getDropdownPosition();

	return (
		<div ref={containerRef} className="relative w-full">
			{label && (
				<label className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro">
					{label}
				</label>
			)}
			<div className="bg-[#F7F7F7] border border-[#E3E3E3] rounded-[10px] h-[44px] flex items-center transition-all duration-200 focus-within:border-[#3B82F6] hover:border-[#9CA3AF]">
				<input
					ref={inputRef}
					type="text"
					placeholder={placeholder}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (suggestions.length > 0) {
							setIsOpen(true);
						}
					}}
					className={`h-full rounded-[10px] w-full bg-transparent placeholder:text-[#A2A2A2] placeholder:text-[14px] font-sfpro outline-none transition-all duration-200 pl-[12px] ${className}`}
					autoComplete="off"
				/>
			</div>

			{loading && (
				<div className="absolute right-3 top-[38px] text-gray-400">
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
				</div>
			)}

			{isOpen &&
				suggestions.length > 0 &&
				createPortal(
					<div
						ref={dropdownRef}
						className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
						style={{
							top: `${dropdownPosition.top}px`,
							left: `${dropdownPosition.left}px`,
							width: `${dropdownPosition.width}px`,
						}}
					>
						{suggestions.map((item, index) => (
							<div
								key={item.uuid}
								className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
									index === selectedIndex ? "bg-blue-50 border-blue-200" : ""
								}`}
								onMouseDown={(e) => {
									// Prevent the click outside handler from firing
									e.preventDefault();
									handleSelectItem(item);
								}}
							>
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<p className="font-medium text-sm text-gray-900">
											{item.serialNumber}
										</p>
										<p className="text-sm text-gray-600">
											{item.product?.name}
										</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-gray-500 capitalize">
											{item.condition.toLowerCase()}
										</p>
										<p className="text-xs text-green-600 capitalize">
											{item.status.toLowerCase()}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>,
					document.body
				)}
		</div>
	);
};

export default SerialNumberAutoSuggest;
