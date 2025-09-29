import React, { useState } from "react";
import { cn } from "../utils/cn";
import Search from "./Icons/Search";

const Input: React.FC<{
	label?: string;
	placeholder: string;
	name: string;
	id: string;
	type?: string;
	variant?: "primary" | "search" | "secondary";
}> = ({ label, placeholder, name, id, type, variant = "primary" }) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div>
			{label && (
				<label
					className="text-[14px] text-black font-normal mb-[6px] block font-sfpro"
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
						"h-full rounded-[10px] w-full bg-white pl-[16px] placeholder:text-[#A2A2A2] placeholder:text-[14px] font-sfpro outline-none",
						{ "pl-[8px]": variant === "search" }
					)}
					placeholder={placeholder}
					name={name}
					id={id}
					type={type}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
			</div>
		</div>
	);
};

export default Input;
