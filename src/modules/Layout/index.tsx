import { ReactNode } from "react";
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

type Props = {
	children?: ReactNode;
	title?: string;
};

const Layout = ({ children }: Props) => {
	const location = useLocation();

	return (
		<div className="grid lg:grid-cols-[265px_1fr] min-h-screen bg-[#FBFBFF]">
			{/* Sidebar */}
			<div className="bg-[#278783] h-full px-[14px] hidden lg:block">
				<div className="h-[87px] border-[#FFEBD099] border-b-[3px]">
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
				<ul className="flex flex-col gap-[10px]">
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
			</div>

			{/* Main content area */}
			<div className="flex flex-col bg-[#FBFBFF] gap-[34px]">
				<header className="w-full py-[18px] bg-white px-[74px]">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-[20px] font-bold">Good Moring, Samuel 👋🏽</h1>
							<p className="text-[#6A6A6A] text-[14px]">
								Real time insight on your store performance
							</p>
						</div>
						<div className="flex items-center gap-[8px]">
							<div className="border-[1px] border-[#F2F2FE] border-solid size-[48px] rounded-full cursor-pointer flex items-center justify-center">
								<Settings />
							</div>
							<div className="bg-[#278783] text-white size-[48px] rounded-full flex items-center justify-center cursor-pointer font-medium text-[20px]">
								SJ
							</div>
						</div>
					</div>
				</header>
				<main className="flex-1 bg-white mx-[38px] p-[36px] rounded-[15px]">
					{children}
				</main>
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
