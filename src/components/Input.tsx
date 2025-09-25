import React from "react";

const Input: React.FC<{
	label: string;
	placeholder: string;
	name: string;
	id: string;
	type?: string;
}> = ({ label, placeholder, name, id, type }) => {
	return (
		<div>
			<label
				className="text-[14px] text-black font-normal mb-[6px] block font-sfpro"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				className="h-[48px] rounded-[10px] w-full bg-white pl-[16px] placeholder:text-[#A2A2A2] placeholder:text-[14px] font-sfpro"
				placeholder={placeholder}
				name={name}
				id={id}
				type={type}
			/>
		</div>
	);
};

export default Input;
