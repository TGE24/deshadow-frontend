import { ReactNode, useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { cn } from "../../utils/cn";
import { useUserStore } from "../../store/userStore";
import AvatarDropdown from "../../components/AvatarDropdown";
import { UserRole } from "../../generated/graphql";
import PendingItemsBanner from "../../components/PendingItemsBanner";
import {
	useProductItemsQuery,
	ProductItemStatus,
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
];

const ADMIN_MENU: MenuItem[] = [
	{ name: "Users", link: "/users", icon: <Attribute /> },
	{ name: "Brands", link: "/brands", icon: <Brands /> },
	{ name: "Category", link: "/category", icon: <Category /> },
	{ name: "Products", link: "/products", icon: <Products /> },
];

// Common components
const Logo = () => (
	<div className="h-[87px] border-[#FFEBD099] border-b-[3px] flex items-center">
		<h1 className="text-[50px] text-[#FFEBD0]">LOGO</h1>
	</div>
);

const SectionLabel = ({ children }: { children: ReactNode }) => (
	<p className="mt-[70px] mb-[11px] text-[#FFEBD0B2] text-[14px] font-medium first:mt-[70px]">
		{children}
	</p>
);

const MenuList = ({
	items,
	onItemClick,
}: {
	items: MenuItem[];
	onItemClick?: () => void;
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
							<>
								<div
									className={cn(
										{ "bg-[#FFEBD04D]": isAnySubItemActive },
										"flex gap-[8px] items-center justify-between px-[16px] py-[12px] rounded-[8px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10"
									)}
									onClick={() => setOpenDropdown(isDropdownOpen ? null : index)}
								>
									<div className="flex gap-[8px] items-center">
										<div
											className={cn(
												{ "text-[#FFEBD0]": isAnySubItemActive },
												"size-[18px] text-[#FFEBD099]"
											)}
										>
											{item.icon}
										</div>
										<p
											className={cn(
												{ "font-bold": isAnySubItemActive },
												"text-[#FFEBD0]"
											)}
										>
											{item.name}
										</p>
									</div>
									<svg
										className={cn(
											"w-4 h-4 text-[#FFEBD099] transition-transform duration-200",
											{ "rotate-180": isDropdownOpen }
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
															"px-[16px] py-[10px] rounded-[6px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10"
														)}
													>
														<p
															className={cn(
																{ "font-bold": isSubActive },
																"text-[#FFEBD0] text-[14px]"
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
						) : (
							<NavLink to={item.link || "#"} onClick={onItemClick}>
								<div
									className={cn(
										{ "bg-[#FFEBD04D]": isActive },
										"flex gap-[8px] items-center px-[16px] py-[12px] rounded-[8px] cursor-pointer transition-all duration-200 hover:bg-[#FFEBD0] hover:bg-opacity-10"
									)}
								>
									<div
										className={cn(
											{ "text-[#FFEBD0]": isActive },
											"size-[18px] text-[#FFEBD099]"
										)}
									>
										{item.icon}
									</div>
									<p
										className={cn({ "font-bold": isActive }, "text-[#FFEBD0]")}
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
}: {
	user: { firstName?: string } | null;
	onMenuClick: () => void;
	topOffset?: string;
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
			<div className="flex items-center justify-between lg:max-w-[70dvw]">
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
						<PendingItemsIndicator />
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

const Layout = ({ children }: LayoutProps) => {
	const { user } = useUserStore();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { data: pendingData } = useProductItemsQuery({
		variables: {
			filter: { status: ProductItemStatus.Pending },
			pagination: { first: 1 },
		},
		fetchPolicy: "network-only",
	});

	const hasPending =
		!!pendingData?.productItems?.totalCount &&
		pendingData.productItems.totalCount > 0;

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
					"bg-[#278783] w-[265px] px-[14px] overflow-y-auto flex-shrink-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
					{
						"translate-x-0": isMobileMenuOpen,
						"-translate-x-full": !isMobileMenuOpen,
					}
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
			</section>

			{/* Desktop Sidebar */}
			<section className="bg-[#278783] w-[265px] px-[14px] hidden lg:block overflow-y-auto flex-shrink-0">
				<Logo />
				{user?.role === UserRole.StoreOwner && (
					<>
						<SectionLabel>MAIN MENU</SectionLabel>
						<MenuList items={STORE_OWNER_MENU} />
					</>
				)}
				{user?.role === UserRole.Reseller && (
					<>
						<SectionLabel>MAIN MENU</SectionLabel>
						<MenuList items={RESELLER_MENU} />
					</>
				)}
				{(user?.role === UserRole.Admin ||
					user?.role === UserRole.SuperAdmin) && (
					<div className="mt-[70px] pb-[20px]">
						<MenuList items={ADMIN_MENU} />
					</div>
				)}
			</section>

			{/* Main content area */}
			<div className="flex-1 flex flex-col bg-[#FBFBFF] overflow-hidden">
				<PendingItemsBanner visible={hasPending} />
				<Header
					user={user}
					onMenuClick={() => setIsMobileMenuOpen(true)}
					topOffset={hasPending ? "56px" : "0px"}
				/>
				<div className="flex-1 overflow-y-auto lg:p-[20px] xl:p-[34px_38px_38px_38px]">
					<main className="bg-white px-[20px] pt-[20px] pb-[100px] md:p-[40px] lg:p-[18px] xl:p-[36px] rounded-[15px] min-h-full lg:max-w-[75dvw]">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
};

export default Layout;
