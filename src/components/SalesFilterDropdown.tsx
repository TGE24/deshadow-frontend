import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Select, { SingleValue } from "react-select";
import Button from "./Button";

interface SelectOption {
	value: string;
	label: string;
}

interface SalesFilterDropdownProps {
	saleTypeOptions: SelectOption[];
	storeOptions: SelectOption[];
	selectedSaleType: string;
	selectedStore: string;
	dateRange: { fromDate: string; toDate: string };
	onSaleTypeChange: (option: SingleValue<SelectOption>) => void;
	onStoreChange: (option: SingleValue<SelectOption>) => void;
	onDateRangeChange: (dateRange: { fromDate: string; toDate: string }) => void;
	onClearFilters: () => void;
	onApplyFilters: () => void;
}

const selectStyles = {
	control: (base: Record<string, unknown>) => ({
		...base,
		minHeight: "40px",
		fontSize: "14px",
		borderColor: "#d1d5db",
		"&:hover": {
			borderColor: "#d1d5db",
		},
		"&:focus-within": {
			borderColor: "#3b82f6",
			boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
		},
	}),
	option: (
		base: Record<string, unknown>,
		state: { isSelected: boolean; isFocused: boolean }
	) => ({
		...base,
		fontSize: "14px",
		backgroundColor: state.isSelected
			? "#3b82f6"
			: state.isFocused
			? "#f3f4f6"
			: "white",
	}),
};

const SalesFilterDropdown: React.FC<SalesFilterDropdownProps> = ({
	saleTypeOptions,
	storeOptions,
	selectedSaleType,
	selectedStore,
	dateRange,
	onSaleTypeChange,
	onStoreChange,
	onDateRangeChange,
	onClearFilters,
	onApplyFilters,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [tempSaleType, setTempSaleType] = useState(selectedSaleType);
	const [tempStore, setTempStore] = useState(selectedStore);
	const [tempDateRange, setTempDateRange] = useState(dateRange);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Update temp values when props change
	useEffect(() => {
		setTempSaleType(selectedSaleType);
		setTempStore(selectedStore);
		setTempDateRange(dateRange);
	}, [selectedSaleType, selectedStore, dateRange]);

	// Handle clicks outside the dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen]);

	const handleApply = () => {
		onSaleTypeChange(
			saleTypeOptions.find((option) => option.value === tempSaleType) || null
		);
		onStoreChange(
			storeOptions.find((option) => option.value === tempStore) || null
		);
		onDateRangeChange(tempDateRange);
		onApplyFilters();
		setIsOpen(false);
	};

	const handleClear = () => {
		setTempSaleType("");
		setTempStore("");
		setTempDateRange({ fromDate: "", toDate: "" });
		onClearFilters();
		setIsOpen(false);
	};

	const hasActiveFilters =
		selectedSaleType || selectedStore || dateRange.fromDate || dateRange.toDate;

	const getDropdownPosition = () => {
		if (!triggerRef.current) return { top: 0, left: 0 };

		const rect = triggerRef.current.getBoundingClientRect();
		const dropdownHeight = 400; // Approximate height
		const dropdownWidth = 320; // Min width from CSS
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;
		const spaceBelow = viewportHeight - rect.bottom;

		// Position dropdown below trigger if there's enough space, otherwise above
		const top =
			spaceBelow >= dropdownHeight
				? rect.bottom + 8
				: rect.top - dropdownHeight - 8;

		// Ensure dropdown stays within viewport horizontally
		let left = rect.left;
		const spaceRight = viewportWidth - rect.left;

		// If dropdown would go off-screen to the right, align it to the right edge of trigger
		if (spaceRight < dropdownWidth) {
			left = rect.right - dropdownWidth;
		}

		// Ensure it doesn't go off-screen to the left
		if (left < 8) {
			left = 8;
		}

		return { top, left };
	};

	const dropdownPosition = getDropdownPosition();

	const FilterIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
		</svg>
	);

	return (
		<div className="relative">
			<button
				ref={triggerRef}
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-md transition-colors ${
					hasActiveFilters
						? "bg-blue-50 border-blue-300 text-blue-700"
						: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
				}`}
			>
				<FilterIcon />
				Filters
				{hasActiveFilters && (
					<span className="ml-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
						{
							[
								selectedSaleType,
								selectedStore,
								dateRange.fromDate,
								dateRange.toDate,
							].filter(Boolean).length
						}
					</span>
				)}
			</button>

			{isOpen &&
				createPortal(
					<div
						ref={dropdownRef}
						className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[320px]"
						style={{
							top: `${dropdownPosition.top}px`,
							left: `${dropdownPosition.left}px`,
						}}
					>
						<div className="p-4 space-y-4">
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								Filter Sales
							</h3>

							{/* Sale Type Filter */}
							<div>
								<label className="block text-xs font-medium text-gray-700 mb-1">
									Sale Type
								</label>
								<Select
									options={saleTypeOptions}
									value={saleTypeOptions.find(
										(option) => option.value === tempSaleType
									)}
									onChange={(option) => setTempSaleType(option?.value || "")}
									placeholder="All Sale Types"
									isClearable
									isSearchable
									styles={selectStyles}
								/>
							</div>

							{/* Store Filter */}
							<div>
								<label className="block text-xs font-medium text-gray-700 mb-1">
									Store
								</label>
								<Select
									options={storeOptions}
									value={storeOptions.find(
										(option) => option.value === tempStore
									)}
									onChange={(option) => setTempStore(option?.value || "")}
									placeholder="All Stores"
									isClearable
									isSearchable
									styles={selectStyles}
								/>
							</div>

							{/* Date Range Filter */}
							<div>
								<label className="block text-xs font-medium text-gray-700 mb-1">
									Date Range
								</label>
								<div className="grid grid-cols-2 gap-2">
									<input
										type="date"
										value={tempDateRange.fromDate}
										onChange={(e) =>
											setTempDateRange({
												...tempDateRange,
												fromDate: e.target.value,
											})
										}
										className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Start Date"
									/>
									<input
										type="date"
										value={tempDateRange.toDate}
										onChange={(e) =>
											setTempDateRange({
												...tempDateRange,
												toDate: e.target.value,
											})
										}
										className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="End Date"
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-between pt-3 border-t border-gray-200">
								<Button
									variant="outline"
									size="small"
									onClick={handleClear}
									className="text-gray-600 hover:text-gray-800 border-gray-300"
								>
									Clear All
								</Button>
								<Button
									variant="primary"
									size="small"
									onClick={handleApply}
									className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
								>
									Apply Filters
								</Button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
};

export default SalesFilterDropdown;
