import { ReactNode, useState, useRef, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { cn } from "../../utils/cn";
import { useUserStore } from "../../store/userStore";
import AvatarDropdown from "../../components/AvatarDropdown";
import { UserRole } from "../../generated/graphql";
import PendingItemsBanner from "../../components/PendingItemsBanner";
import {
	useProductItemsQuery,
	ProductItemStatus,
	useSalesQuery,
	SaleStatus,
	useStoresQuery,
} from "../../generated/graphql";
import PendingItemsIndicator from "../../components/PendingItemsIndicator";
import NotificationDrawer from "../../components/NotificationDrawer";

// Icons
import Home from "../../components/Icons/Home";
import Invoice from "../../components/Icons/Invoice";
import Sale from "../../components/Icons/Sale";
import Credit from "../../components/Icons/Credit";
import Products from "../../components/Icons/Products";
import Brands from "../../components/Icons/Brands";
import Category from "../../components/Icons/Category";
import Attribute from "../../components/Icons/Attribute";
import Menu from "../../components/Icons/Menu";
import Notifications from "../../components/Icons/Notifications";

interface LayoutProps {
	children?: ReactNode;
	title?: string;
}

interface MenuItem {
	name: string;
	link?: string;
	icon: ReactNode;
	subItems?: { name: string; link: string }[];
}

// Menu configurations
const STORE_OWNER_MENU: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: <Home /> },
	{ name: "Invoice", link: "/invoice", icon: <Invoice /> },
	{ name: "Customer Sale", link: "/sale", icon: <Sale /> },
	{
		name: "Resellers",
		icon: <Credit />,
		subItems: [
			{ name: "Resellers Sale", link: "/resellers-sale" },
			{ name: "Resellers Record", link: "/resellers-record" },
		],
	},
	{ name: "Inventory", link: "/inventory", icon: <Products /> },
	{ name: "Products", link: "/products", icon: <Products /> },
	{ name: "Accessories", link: "/accessories", icon: <Products /> },
	{ name: "Attributes", link: "/attributes", icon: <Attribute /> },
	{ name: "Users", link: "/users", icon: <Attribute /> },
	{ name: "Brands", link: "/brands", icon: <Brands /> },
	{ name: "Category", link: "/category", icon: <Category /> },
	{ name: "Stores", link: "/stores", icon: <Products /> },
];

const RESELLER_MENU: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: <Home /> },
	{ name: "Invoice", link: "/invoice", icon: <Invoice /> },
	{ name: "Customer Sale", link: "/sale", icon: <Sale /> },
	{
		name: "Resellers",
		icon: <Credit />,
		subItems: [
			{ name: "Resellers Sale", link: "/resellers-sale" },
			{ name: "Resellers Record", link: "/resellers-record" },
		],
	},
	{ name: "Products", link: "/products", icon: <Products /> },
	{ name: "Attributes", link: "/attributes", icon: <Attribute /> },
	{ name: "Inventory", link: "/inventory", icon: <Products /> },
	{ name: "Accessories", link: "/accessories", icon: <Products /> },
];

const ADMIN_MENU: MenuItem[] = [
	{ name: "Users", link: "/users", icon: <Attribute /> },
	{ name: "Brands", link: "/brands", icon: <Brands /> },
	{ name: "Category", link: "/category", icon: <Category /> },
	{ name: "Products", link: "/products", icon: <Products /> },
	{ name: "Attributes", link: "/attributes", icon: <Attribute /> },
];

// Common components
const Logo = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
	<div
		className={cn(
			"h-[87px] border-[#FFEBD099] border-b-[3px] flex items-center",
			isCollapsed ? "justify-center" : "justify-start",
		)}
	>
		<h1
			className={cn(
				"text-[#FFEBD0]",
				isCollapsed ? "text-[20px]" : "text-[40px]",
			)}
		>
			{isCollapsed ? "DS" : "DeShadow"}
		</h1>
	</div>
);

const SectionLabel = ({
	children,
	isCollapsed = false,
}: {
	children: ReactNode;
	isCollapsed?: boolean;
}) => (
	<p className="mt-[70px] mb-[11px] text-[#FFEBD0B2] text-[14px] font-medium first:mt-[70px]">
		{isCollapsed ? "" : children}
	</p>
);

const MenuList = ({
	items,
	onItemClick,
	isCollapsed = false,
}: {
	items: MenuItem[];
	onItemClick?: () => void;
	isCollapsed?: boolean;
}) => {
	const location = useLocation();
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);

	return (
		<ul className="flex flex-col gap-[10px]">
			{items.map((item, index) => {
				const isActive = item.link ? location.pathname === item.link : false;
				const hasSubItems = item.subItems && item.subItems.length > 0;
				const isDropdownOpen = openDropdown === index;
				const isAnySubItemActive =
					hasSubItems &&
					item.subItems?.some((sub) => location.pathname === sub.link);

				return (
					<li key={index}>
						{hasSubItems ? (
							isCollapsed ? (
								<NavLink
									to={item.subItems?.[0]?.link || "#"}
									onClick={onItemClick}
								>
									<div
										className={cn(
											{ "bg-[#FFEBD04D]": isAnySubItemActive },
											"flex items-center justify-center px-[16px] py-[12px] rounded-[8px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10",
										)}
									>
										<div
											className={cn(
												{ "text-[#FFEBD0]": isAnySubItemActive },
												"size-[18px] text-[#FFEBD099]",
											)}
										>
											{item.icon}
										</div>
									</div>
								</NavLink>
							) : (
								<>
									<div
										className={cn(
											{ "bg-[#FFEBD04D]": isAnySubItemActive },
											"flex gap-[8px] items-center justify-between px-[16px] py-[12px] rounded-[8px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10",
										)}
										onClick={() =>
											setOpenDropdown(isDropdownOpen ? null : index)
										}
									>
										<div className="flex gap-[8px] items-center">
											<div
												className={cn(
													{ "text-[#FFEBD0]": isAnySubItemActive },
													"size-[18px] text-[#FFEBD099]",
												)}
											>
												{item.icon}
											</div>
											<p
												className={cn(
													{ "font-bold": isAnySubItemActive },
													"text-[#FFEBD0]",
												)}
											>
												{item.name}
											</p>
										</div>
										<svg
											className={cn(
												"w-4 h-4 text-[#FFEBD099] transition-transform duration-200",
												{ "rotate-180": isDropdownOpen },
											)}
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
									</div>
									{isDropdownOpen && (
										<ul className="mt-[8px] ml-[26px] flex flex-col gap-[6px]">
											{item.subItems?.map((subItem, subIndex) => {
												const isSubActive = location.pathname === subItem.link;
												return (
													<NavLink
														to={subItem.link}
														key={subIndex}
														onClick={onItemClick}
													>
														<li
															className={cn(
																{ "bg-[#FFEBD04D]": isSubActive },
																"px-[16px] py-[10px] rounded-[6px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10",
															)}
														>
															<p
																className={cn(
																	{ "font-bold": isSubActive },
																	"text-[#FFEBD0] text-[14px]",
																)}
															>
																{subItem.name}
															</p>
														</li>
													</NavLink>
												);
											})}
										</ul>
									)}
								</>
							)
						) : (
							<NavLink to={item.link || "#"} onClick={onItemClick}>
								<div
									className={cn(
										{ "bg-[#FFEBD04D]": isActive },
										"flex items-center px-[16px] py-[12px] rounded-[8px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10",
										isCollapsed ? "justify-center" : "gap-[8px]",
									)}
								>
									<div
										className={cn(
											{ "text-[#FFEBD0]": isActive },
											"size-[18px] text-[#FFEBD099]",
										)}
									>
										{item.icon}
									</div>
									<p
										className={cn(
											{ "font-bold": isActive },
											"text-[#FFEBD0]",
											isCollapsed ? "hidden" : "block",
										)}
									>
										{item.name}
									</p>
								</div>
							</NavLink>
						)}
					</li>
				);
			})}
		</ul>
	);
};

const Header = ({
	user,
	onMenuClick,
	topOffset = "0px",
	refetch,
	refetchSales,
	hasPendingItems,
	hasPendingSales,
}: {
	user: { firstName?: string } | null;
	onMenuClick: () => void;
	topOffset?: string;
	refetch: () => void;
	refetchSales: () => void;
	hasPendingItems: boolean;
	hasPendingSales: boolean;
}) => {
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const notifRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!notifRef.current) return;
			if (!notifRef.current.contains(e.target as Node)) {
				setIsNotifOpen(false);
			}
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsNotifOpen(false);
		};

		document.addEventListener("click", onDocClick);
		document.addEventListener("keydown", onEsc);
		return () => {
			document.removeEventListener("click", onDocClick);
			document.removeEventListener("keydown", onEsc);
		};
	}, []);

	return (
		<nav
			style={{ top: topOffset }}
			className="w-full px-[20px] py-[18px] bg-white md:px-[40px] xl:px-[74px] flex-shrink-0 sticky"
		>
			<div className="flex items-center justify-between lg:max-w-[85dvw]">
				<div className="hidden lg:block">
					<h1 className="text-[20px] font-bold">
						Good Morning, {user?.firstName} 👋🏽
					</h1>
					<p className="text-[#6A6A6A] text-[14px]">
						Real time insight on your store performance
					</p>
				</div>
				<button
					className="lg:hidden size-[38px] flex items-center justify-center"
					onClick={onMenuClick}
				>
					<Menu />
				</button>
				<div className="flex items-center gap-[8px]">
					<div
						ref={notifRef}
						className="relative border-[1px] border-[#F2F2FE] border-solid size-[48px] rounded-full cursor-pointer flex items-center justify-center"
						onClick={() => setIsNotifOpen((s) => !s)}
					>
						<Notifications />
						<PendingItemsIndicator
							refetch={refetch}
							refetchSales={refetchSales}
							hasPendingItems={hasPendingItems}
							hasPendingSales={hasPendingSales}
						/>
						{isNotifOpen && (
							<div className="absolute right-0 mt-2 z-[9999] top-[36px]">
								<div>
									{/* offset to avoid banner overlap */}
									<NotificationDrawer onClose={() => setIsNotifOpen(false)} />
								</div>
							</div>
						)}
					</div>
					<AvatarDropdown {...user} />
				</div>
			</div>
		</nav>
	);
};

const StoreDropdown = () => {
	const { selectedStore, setSelectedStore } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const { data: storesData, loading } = useStoresQuery({
		variables: {
			pagination: { first: 100 },
		},
		fetchPolicy: "network-only",
	});

	const stores = useMemo(() => {
		if (!storesData?.stores?.edges) return [];
		return storesData.stores.edges
			.map((edge) => edge.node)
			.filter(
				(node): node is Extract<typeof node, { __typename?: "Store" }> =>
					node.__typename === "Store",
			);
	}, [storesData]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, []);

	// Set "All Stores" as default if none selected
	useEffect(() => {
		if (!selectedStore && stores.length > 0) {
			setSelectedStore({ uuid: "all", name: "All Stores" });
		}
	}, [stores, selectedStore, setSelectedStore]);

	const handleStoreSelect = (store: { uuid: string; name: string }) => {
		setSelectedStore(store);
		setIsOpen(false);
	};

	if (loading) {
		return (
			<div className="mt-auto mb-4 px-[16px]">
				<div className="h-[48px] bg-[#FFEBD01A] rounded-[8px] animate-pulse" />
			</div>
		);
	}

	if (!stores || stores.length === 0) return null;

	return (
		<div ref={dropdownRef} className="mt-auto mb-4 px-[16px] relative">
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="bg-[#FFEBD01A] rounded-[8px] px-[16px] py-[12px] cursor-pointer hover:bg-[#FFEBD033] transition-all duration-200 border border-[#FFEBD033]"
			>
				<div className="flex items-center justify-between">
					<div className="flex-1 min-w-0">
						<p className="text-[#FFEBD099] text-[12px] font-medium mb-1">
							Current Store
						</p>
						<p className="text-[#FFEBD0] text-[14px] font-semibold truncate">
							{selectedStore?.name || "All Stores"}
						</p>
					</div>
					<svg
						className={cn(
							"w-4 h-4 text-[#FFEBD099] transition-transform duration-200 flex-shrink-0 ml-2",
							{ "rotate-180": isOpen },
						)}
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
				</div>
			</div>

			{isOpen && (
				<div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[8px] shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto z-50">
					{/* All Stores Option */}
					<div
						onClick={() =>
							handleStoreSelect({ uuid: "all", name: "All Stores" })
						}
						className={cn(
							"px-[16px] py-[12px] cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200",
							{
								"bg-[#2787831A]":
									selectedStore?.uuid === "all" || !selectedStore,
							},
						)}
					>
						<p className="text-[#278783] text-[14px] font-bold truncate">
							All Stores
						</p>
						<p className="text-[#6A6A6A] text-[12px] truncate mt-1">
							View data from all stores
						</p>
					</div>

					{stores.map((store) => (
						<div
							key={store.uuid}
							onClick={() =>
								handleStoreSelect({ uuid: store.uuid, name: store.name })
							}
							className={cn(
								"px-[16px] py-[12px] cursor-pointer hover:bg-gray-50 transition-colors duration-150",
								{
									"bg-[#2787831A]": selectedStore?.uuid === store.uuid,
								},
							)}
						>
							<p className="text-[#278783] text-[14px] font-medium truncate">
								{store.name}
							</p>
							{store.address && (
								<p className="text-[#6A6A6A] text-[12px] truncate mt-1">
									{store.address}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const Layout = ({ children }: LayoutProps) => {
	const { user } = useUserStore();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
		useState(false);

	const isAdmin =
		user?.role === UserRole.Admin || user?.role === UserRole.SuperAdmin;

	const { data: pendingData, refetch } = useProductItemsQuery({
		variables: {
			filter: { status: ProductItemStatus.Pending },
			pagination: { first: 1 },
		},
		fetchPolicy: "network-only",
		skip: isAdmin,
	});

	const { data: pendingSalesData, refetch: refetchSales } = useSalesQuery({
		variables: {
			filter: { saleStatus: SaleStatus.Pending },
			pagination: { first: 1 },
		},
		fetchPolicy: "network-only",
		skip: isAdmin,
	});

	const hasPendingItems =
		!!pendingData?.productItems?.totalCount &&
		pendingData.productItems.totalCount > 0;

	const hasPendingSales =
		!!pendingSalesData?.sales?.totalCount &&
		pendingSalesData.sales.totalCount > 0;

	const hasPending = hasPendingItems || hasPendingSales;

	return (
		<div className="h-screen overflow-hidden bg-[#FBFBFF] flex">
			{/* Mobile Drawer Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-[#00000029] z-40 lg:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Mobile Drawer */}
			<section
				className={cn(
					"bg-[#278783] w-[265px] px-[14px] overflow-y-auto flex-shrink-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
					{
						"translate-x-0": isMobileMenuOpen,
						"-translate-x-full": !isMobileMenuOpen,
					},
				)}
			>
				<Logo />

				{user?.role === UserRole.StoreOwner && (
					<>
						<SectionLabel>MAIN MENU</SectionLabel>
						<MenuList
							items={STORE_OWNER_MENU}
							onItemClick={() => setIsMobileMenuOpen(false)}
						/>
					</>
				)}
				{user?.role === UserRole.Reseller && (
					<>
						<SectionLabel>MAIN MENU</SectionLabel>
						<MenuList
							items={RESELLER_MENU}
							onItemClick={() => setIsMobileMenuOpen(false)}
						/>
					</>
				)}

				{user?.role === UserRole.Admin && (
					<div className="mt-[70px] pb-[20px]">
						<MenuList
							items={ADMIN_MENU}
							onItemClick={() => setIsMobileMenuOpen(false)}
						/>
					</div>
				)}

				{user?.role === UserRole.StoreOwner && <StoreDropdown />}
			</section>

			{/* Desktop Sidebar */}
			<section
				className={cn(
					"bg-[#278783] hidden lg:flex lg:flex-col overflow-y-auto flex-shrink-0 transition-all duration-200 relative",
					isDesktopSidebarCollapsed
						? "w-[88px] px-[10px]"
						: "w-[265px] px-[14px]",
				)}
			>
				<Logo isCollapsed={isDesktopSidebarCollapsed} />
				<div
					className={cn(
						"absolute top-[100px] z-10",
						isDesktopSidebarCollapsed
							? "left-1/2 -translate-x-1/2"
							: "right-[14px]",
					)}
				>
					<button
						type="button"
						onClick={() =>
							setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
						}
						className="size-[32px] rounded-[8px] border border-[#FFEBD066] text-[#FFEBD0] flex items-center justify-center hover:bg-[#FFEBD01A] transition-all duration-200"
					>
						<svg
							className={cn("w-4 h-4 transition-transform duration-200", {
								"rotate-180": isDesktopSidebarCollapsed,
							})}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				</div>
				{user?.role === UserRole.StoreOwner && (
					<>
						<SectionLabel isCollapsed={isDesktopSidebarCollapsed}>
							MAIN MENU
						</SectionLabel>
						<MenuList
							items={STORE_OWNER_MENU}
							isCollapsed={isDesktopSidebarCollapsed}
						/>
					</>
				)}
				{user?.role === UserRole.Reseller && (
					<>
						<SectionLabel isCollapsed={isDesktopSidebarCollapsed}>
							MAIN MENU
						</SectionLabel>
						<MenuList
							items={RESELLER_MENU}
							isCollapsed={isDesktopSidebarCollapsed}
						/>
					</>
				)}
				{(user?.role === UserRole.Admin ||
					user?.role === UserRole.SuperAdmin) && (
					<div className="mt-[70px] pb-[20px]">
						<MenuList
							items={ADMIN_MENU}
							isCollapsed={isDesktopSidebarCollapsed}
						/>
					</div>
				)}

				{user?.role === UserRole.StoreOwner && !isDesktopSidebarCollapsed && (
					<StoreDropdown />
				)}
			</section>

			{/* Main content area */}
			<div className="flex-1 flex flex-col bg-[#FBFBFF] overflow-hidden">
				{!isAdmin && (
					<PendingItemsBanner
						visible={hasPending}
						hasPendingItems={hasPendingItems}
						hasPendingSales={hasPendingSales}
					/>
				)}
				<Header
					user={user}
					onMenuClick={() => setIsMobileMenuOpen(true)}
					topOffset={!isAdmin && hasPending ? "56px" : "0px"}
					refetch={refetch}
					refetchSales={refetchSales}
					hasPendingItems={!isAdmin && hasPendingItems}
					hasPendingSales={!isAdmin && hasPendingSales}
				/>
				<div className="flex-1 overflow-y-auto lg:p-[20px] xl:p-[34px_38px_38px_38px]">
					<main className="bg-white px-[20px] pt-[20px] pb-[100px] md:p-[40px] lg:p-[18px] xl:p-[36px] rounded-[15px] min-h-full lg:max-w-[85dvw]">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
};

export default Layout;
