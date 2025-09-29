import { ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Settings from "../../components/Icons/Settings";
import Home from "../../components/Icons/Home";
import Invoice from "../../components/Icons/Invoice";
import Sale from "../../components/Icons/Sale";
import Credit from "../../components/Icons/Credit";
import Products from "../../components/Icons/Products";
import { cn } from "../../utils/cn";
import Brands from "../../components/Icons/Brands";
import Category from "../../components/Icons/Category";
import Attribute from "../../components/Icons/Attribute";
import Menu from "../../components/Icons/Menu";

type Props = {
	children?: ReactNode;
	title?: string;
};

const Layout = ({ children }: Props) => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
				<div className="h-[87px] border-[#FFEBD099] border-b-[3px] flex items-center">
					<h1 className="text-[50px] text-[#FFEBD0]">LOGO</h1>
				</div>
				<p className="mt-[70px] mb-[11px] text-[#FFEBD0B2] text-[14px] font-medium">
					MAIN MENU
				</p>
				<ul className="flex flex-col gap-[10px]">
					{menu.map((item, index) => {
						const isActive = location.pathname === item.link;
						return (
							<NavLink
								to={item.link}
								key={index}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<li
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
								</li>
							</NavLink>
						);
					})}
				</ul>
				<p className="mt-[24px] mb-[11px] text-[#FFEBD0B2] text-[14px] font-medium">
					ADMIN
				</p>
				<ul className="flex flex-col gap-[10px] pb-[20px]">
					{adminMenu.map((item, index) => {
						const isActive = location.pathname === item.link;
						return (
							<NavLink
								to={item.link}
								key={index}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<li
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
								</li>
							</NavLink>
						);
					})}
				</ul>
			</section>

			{/* Desktop Sidebar */}
			<section className="bg-[#278783] w-[265px] px-[14px] hidden lg:block overflow-y-auto flex-shrink-0">
				<div className="h-[87px] border-[#FFEBD099] border-b-[3px] flex items-center">
					<h1 className="text-[50px] text-[#FFEBD0]">LOGO</h1>
				</div>
				<p className="mt-[70px] mb-[11px] text-[#FFEBD0B2] text-[14px] font-medium">
					MAIN MENU
				</p>
				<ul className="flex flex-col gap-[10px]">
					{menu.map((item, index) => {
						const isActive = location.pathname === item.link;
						return (
							<NavLink to={item.link} key={index}>
								<li
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
								</li>
							</NavLink>
						);
					})}
				</ul>
				<p className="mt-[24px] mb-[11px] text-[#FFEBD0B2] text-[14px] font-medium">
					ADMIN
				</p>
				<ul className="flex flex-col gap-[10px] pb-[20px]">
					{adminMenu.map((item, index) => {
						const isActive = location.pathname === item.link;
						return (
							<NavLink to={item.link} key={index}>
								<li
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
								</li>
							</NavLink>
						);
					})}
				</ul>
			</section>

			{/* Main content area */}
			<div className="flex-1 flex flex-col bg-[#FBFBFF] overflow-hidden">
				<nav className="w-full px-[20px] py-[18px] bg-white md:px-[40px] xl:px-[74px] flex-shrink-0">
					<div className="flex items-center justify-between lg:max-w-[70dvw]">
						<div className="hidden lg:block">
							<h1 className="text-[20px] font-bold">Good Morning, Samuel 👋🏽</h1>
							<p className="text-[#6A6A6A] text-[14px]">
								Real time insight on your store performance
							</p>
						</div>
						<button
							className="lg:hidden size-[38px] flex items-center justify-center"
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<Menu />
						</button>
						<div className="flex items-center gap-[8px]">
							<div className="border-[1px] border-[#F2F2FE] border-solid size-[48px] rounded-full cursor-pointer flex items-center justify-center">
								<Settings />
							</div>
							<div className="bg-[#278783] text-white size-[48px] rounded-full flex items-center justify-center cursor-pointer font-medium text-[20px]">
								SJ
							</div>
						</div>
					</div>
				</nav>
				<div className="flex-1 overflow-y-auto lg:p-[20px] xl:p-[34px_38px_38px_38px]">
					<main className="bg-white p-[20px] md:p-[40px] lg:p-[18px] xl:p-[36px] rounded-[15px] min-h-full lg:max-w-[75dvw]">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
};

export default Layout;

const menu = [
	{ name: "Dashboard", link: "/dashboard", icon: <Home /> },
	{ name: "Invoice", link: "/invoice", icon: <Invoice /> },
	{ name: "Customer Sale", link: "/sale", icon: <Sale /> },
	{ name: "Credit", link: "/credit", icon: <Credit /> },
	{ name: "Products", link: "/products", icon: <Products /> },
];

const adminMenu = [
	{ name: "Brands", link: "/brands", icon: <Brands /> },
	{ name: "Category", link: "/category", icon: <Category /> },
	{ name: "Attribute", link: "/attribute", icon: <Attribute /> },
	{ name: "Settings", link: "/settings", icon: <Settings color="#FFEBD0" /> },
];
