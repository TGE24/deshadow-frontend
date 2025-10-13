import React, { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { cn } from "../utils/cn";
import Search from "./Icons/Search";

interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
	/** The label text to display above the input */
	label?: string;
	/** The placeholder text for the input */
	placeholder: string;
	/** React Hook Form register function */
	register?: UseFormRegisterReturn;
	/** Form validation errors from React Hook Form */
	errors?: FieldError;
	/** Whether the field is optional (displays "(optional)" text) */
	optional?: boolean;
	/** Visual variant of the input */
	variant?: "primary" | "search" | "secondary";
}

/**
 * A reusable input component with built-in form validation support
 * Supports different visual variants and integrates with React Hook Form
 */

const Input: React.FC<InputProps> = ({
	label,
	placeholder,
	name,
	id,
	type = "text",
	variant = "primary",
	register,
	errors,
	optional = false,
	className,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputId =
		id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

	const getContainerStyles = () => {
		const baseStyles =
			"rounded-[10px] flex items-center h-[48px] transition-colors duration-200 bg-white";

		const borderStyles = errors
			? "border border-red-300 focus-within:border-red-500"
			: "border border-gray-300 hover:border-[#278783] focus-within:border-[#278783]";

		switch (variant) {
			case "search":
				return cn(
					baseStyles,
					"border border-[#E4E4E4]",
					!errors && "hover:border-[#278783] focus-within:border-[#278783]"
				);
			case "secondary":
				return cn(
					baseStyles,
					"border border-[#F0F0FF]",
					!errors && "hover:border-[#278783] focus-within:border-[#278783]"
				);
			default:
				return cn(baseStyles, borderStyles);
		}
	};

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<label
					className={cn(
						"text-[14px] text-black font-semibold mb-[6px] block font-sfpro"
					)}
					htmlFor={inputId}
				>
					{label}
					{optional && (
						<span className="text-[#6A6A6A] text-[12px] ml-1">(optional)</span>
					)}
				</label>
			)}
			<div className={getContainerStyles()}>
				{variant === "search" && !isFocused && (
					<div className="mr-2 text-[#A2A2A2]">
						<Search />
					</div>
				)}
				<input
					className={cn(
						"h-full rounded-[10px] w-full bg-transparent placeholder:text-[#A2A2A2] placeholder:text-[14px] font-sfpro outline-none transition-all duration-200",
						variant === "search" ? "pl-[8px]" : "pl-[12px]"
					)}
					placeholder={placeholder}
					name={name}
					id={inputId}
					type={type}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					aria-invalid={errors ? "true" : "false"}
					aria-describedby={errors ? `${inputId}-error` : undefined}
					{...register}
					{...props}
				/>
			</div>
			{errors && (
				<p
					id={`${inputId}-error`}
					className="text-red-500 text-[12px] mt-[6px] pl-[20px] font-medium"
					role="alert"
				>
					{errors.message}
				</p>
			)}
		</div>
	);
};

export default Input;
