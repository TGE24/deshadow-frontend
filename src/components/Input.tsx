import React, { useState } from "react";
import { cn } from "../utils/cn";
import Search from "./Icons/Search";

type InputType = React.InputHTMLAttributes<HTMLInputElement> & {
	register?: any;
	errors?: any;
	optional?: boolean;
	label?: string;
	placeholder: string;
	type?: string;
	variant?: "primary" | "search" | "secondary";
};

const Input: React.FC<InputType> = ({
	label,
	placeholder,
	name,
	id,
	type,
	variant = "primary",
	register,
	errors,
}) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div>
			{label && (
				<label
					className="text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
					htmlFor={id}
				>
					{label}
				</label>
			)}
			<div
				className={cn(
					"rounded-[10px] flex items-center px-[8px] h-[48px]",
					{
						"border-[#E4E4E4] border-[1px]": variant === "search",
					},
					{
						"border-[#F0F0FF] border-[1px]": variant === "secondary",
					}
				)}
			>
				{variant === "search" && !isFocused && <Search />}
				<input
					className={cn(
						"h-full rounded-[10px] w-full bg-white placeholder:text-[#A2A2A2] placeholder:text-[14px] font-sfpro outline-none",
						{ "pl-[8px]": variant === "search" }
					)}
					placeholder={placeholder}
					name={name}
					id={id}
					type={type}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					{...register}
				/>
			</div>
			{errors && (
				<p className="text-coral-punch text-[12px] mt-1">{errors.message}</p>
			)}
		</div>
	);
};

export default Input;
