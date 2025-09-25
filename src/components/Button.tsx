import React, { ReactNode } from "react";
import { cn } from "../utils/cn";
import { Link, To } from "react-router-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "transparent" | "outline";
	as?: "button" | "link" | "download";
	to?: To;
	icon?: ReactNode;
	children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	className,
	variant = "primary",
	as = "button",
	to,
	children,
	icon,
	...rest
}) => {
	switch (as) {
		case "button":
			return (
				<button
					className={cn(
						{
							"bg-[#278783] text-[#FFEBD0]": variant === "primary",
						},
						{
							"bg-[#ffffff] text-[#1A1A1A] border-[#ffffff]":
								variant === "secondary",
						},
						{
							"bg-transparent text-white hover:bg-white hover:text-[#a9a8a8] border-[#ffffff]":
								variant === "transparent",
						},
						"text-[16px] transition-all duration-200 ease-in-out cursor-pointer border-[1px] rounded-[10px] h-[48px] flex items-center justify-center gap-[8px] font-normal",
						className
					)}
					{...rest}
				>
					{icon}
					{children}
				</button>
			);
		case "link":
			return (
				<Link
					to={to ?? ""}
					className={cn(
						{
							"bg-[#1A1A1A] text-white hover:bg-white hover:text-[#1A1A1A] border-[#1A1A1A]":
								variant === "primary",
						},
						{
							"bg-[#ffffff] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#ffffff] border-[#ffffff]":
								variant === "secondary",
						},
						{
							"text-black border-none underline cursor-pointer font-normal underline-offset-2":
								variant === "outline",
						},
						"text-[16px] transition-all py-[16px] duration-200 ease-in-out cursor-pointer border-[1px] flex items-center justify-center",
						className
					)}
				>
					{children}
				</Link>
			);
	}
};

export default Button;
