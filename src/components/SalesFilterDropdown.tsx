import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Select, { SingleValue } from "react-select";
import DatePicker from "react-datepicker";
import Button from "./Button";
import Calendar from "./Icons/Calendar";
import { useUserStore } from "../store/userStore";
import { UserRole } from "../generated/graphql";

interface SelectOption {
	value: string;
	label: string;
}

interface SalesFilterDropdownProps {
	saleTypeOptions: SelectOption[];
	storeOptions: SelectOption[];
	selectedSaleTypes: string[];
	selectedStore: string;
	dateRange: { fromDate: string; toDate: string };
	onSaleTypeChange: (selectedOptions: SelectOption[]) => void;
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
	menuPortal: (base: Record<string, unknown>) => ({
		...base,
		zIndex: 60, // Higher than the dropdown z-index (50)
	}),
};

// Helper functions to convert between Date objects and string format
const stringToDate = (dateString: string): Date | null => {
	if (!dateString) return null;
	// Parse date in local timezone to avoid timezone offset issues
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day); // month is 0-indexed
};

const dateToString = (date: Date | null): string => {
	if (!date) return "";
	// Format date in local timezone to avoid shifting
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const SalesFilterDropdown: React.FC<SalesFilterDropdownProps> = ({
	saleTypeOptions,
	storeOptions,
	selectedSaleTypes,
	selectedStore,
	dateRange,
	onSaleTypeChange,
	onStoreChange,
	onDateRangeChange,
	onClearFilters,
	onApplyFilters,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [tempSaleTypes, setTempSaleTypes] = useState(selectedSaleTypes);
	const [tempStore, setTempStore] = useState(selectedStore);
	const [tempDateRange, setTempDateRange] = useState<
		[Date | null, Date | null]
	>([stringToDate(dateRange.fromDate), stringToDate(dateRange.toDate)]);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { user } = useUserStore();

	// Update temp values when props change
	useEffect(() => {
		setTempSaleTypes(selectedSaleTypes);
		setTempStore(selectedStore);
		setTempDateRange([
			stringToDate(dateRange.fromDate),
			stringToDate(dateRange.toDate),
		]);
	}, [selectedSaleTypes, selectedStore, dateRange]);

	// Handle clicks outside the dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// Check if click is outside the dropdown
			const isOutsideDropdown =
				dropdownRef.current && !dropdownRef.current.contains(target);
			const isOutsideTrigger =
				triggerRef.current && !triggerRef.current.contains(target);

			// Check if click is on react-select elements (they render in portals)
			const isReactSelectElement = (target as Element)?.closest?.(
				'.css-1s2u09g-control, .css-1pahdxg-control, .css-1hwfws3, .css-26l3qy-menu, [class*="react-select"]'
			);

			if (isOutsideDropdown && isOutsideTrigger && !isReactSelectElement) {
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
		const selectedOptions = saleTypeOptions.filter((option) =>
			tempSaleTypes.includes(option.value)
		);
		onSaleTypeChange(selectedOptions);
		onStoreChange(
			storeOptions.find((option) => option.value === tempStore) || null
		);
		onDateRangeChange({
			fromDate: dateToString(tempDateRange[0]),
			toDate: dateToString(tempDateRange[1]),
		});
		onApplyFilters();
		setIsOpen(false);
	};

	const handleClear = () => {
		setTempSaleTypes([]);
		setTempStore("");
		setTempDateRange([null, null]);
		onClearFilters();
		setIsOpen(false);
	};

	const hasActiveFilters =
		selectedSaleTypes.length > 0 ||
		selectedStore ||
		dateRange.fromDate ||
		dateRange.toDate;

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
						{[
							selectedSaleTypes.length > 0 ? 1 : 0,
							selectedStore ? 1 : 0,
							dateRange.fromDate ? 1 : 0,
							dateRange.toDate ? 1 : 0,
						].reduce((a, b) => a + b, 0)}
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
									isMulti
									options={saleTypeOptions}
									value={saleTypeOptions.filter((option) =>
										tempSaleTypes.includes(option.value)
									)}
									onChange={(selectedOptions) => {
										// Prevent the clear action from closing the modal
										const values = selectedOptions
											? selectedOptions.map((option) => option.value)
											: [];
										setTempSaleTypes(values);
									}}
									onMenuClose={() => {
										// Prevent menu close from closing the entire dropdown
									}}
									placeholder="Select Sale Types"
									isClearable
									isSearchable
									styles={selectStyles}
									menuPortalTarget={document.body}
									menuPosition="fixed"
								/>
							</div>

							{/* Store Filter */}
							{user?.role !== UserRole.Reseller && (
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
										menuPortalTarget={document.body}
										menuPosition="fixed"
									/>
								</div>
							)}

							{/* Date Range Filter */}
							<div className="w-full">
								<label className="block text-xs font-medium text-gray-700 mb-1">
									Date Range
								</label>
								<DatePicker
									selected={tempDateRange[0]}
									onChange={(dates) =>
										setTempDateRange(dates as [Date | null, Date | null])
									}
									startDate={tempDateRange[0]}
									endDate={tempDateRange[1]}
									selectsRange
									placeholderText="Select date range"
									dateFormat="yyyy-MM-dd"
									rangeSeparator=" - "
									icon={<Calendar />}
									showIcon
									isClearable
									className="px-3 pl-[6px]! border-none border-gray-300 rounded-md text-sm focus:outline-none focus:ring-0  focus:border-none w-full"
								/>
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
