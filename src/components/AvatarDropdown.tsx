import React, { useState } from "react";
import { User } from "../generated/graphql";
import MapPin from "./Icons/MapPin";
import Credit from "./Icons/Credit";
import Settings from "./Icons/Settings";
import Logout from "./Icons/Logout";
import { useAuth } from "../hooks/useAuth";
import { useClickOutside } from "../hooks/useClickOutside";
import { Link } from "react-router-dom";

const AvatarDropdown: React.FC<User> = ({ firstName, lastName, email }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { logout } = useAuth();

	// Use the reusable click outside hook
	const dropdownRef = useClickOutside<HTMLDivElement>(
		() => setIsOpen(false),
		isOpen
	);

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				className="bg-[#278783] text-white size-[48px] rounded-full flex items-center justify-center cursor-pointer font-medium text-[20px]"
				onClick={() => setIsOpen(!isOpen)}
			>
				{firstName.charAt(0).toUpperCase()}
				{lastName.charAt(0).toUpperCase()}
			</div>
			{isOpen && (
				<div
					className="border-[1px] border-[#FBFBFB] p-[12px] rounded-[12px] absolute right-0 mt-[8px] z-10 bg-white w-[278px]"
					style={{ boxShadow: "2px 0px 24px 0px #00000029" }}
				>
					<div className="flex gap-[12px]">
						<div className="bg-[#278783] text-white size-[39px] rounded-full flex items-center justify-center cursor-pointer font-medium text-[16px]">
							{firstName.charAt(0).toUpperCase()}
							{lastName.charAt(0).toUpperCase()}
						</div>
						<div>
							<p className="text-[16px] font-semibold">
								{firstName} {lastName}
							</p>
							<p className="text-[#5C5C5C] text-[12px] font-semibold">
								{email}
							</p>
						</div>
					</div>
					<div className="bg-[#EFEFF0] p-[10px] mt-[16px] w-full rounded-[4px]">
						<div className="flex gap-[8px] items-center">
							<div className="size-[24px]">
								<MapPin />
							</div>
							<div className="text-[12px] text-[#38414A]">
								<p className="font-semibold">Banex Plaza</p>
								<p>3A, opposite Dr Adewale Oshin str...</p>
							</div>
						</div>
					</div>
					<ul className="mt-[16px] flex flex-col gap-[17px]">
						<Link to="/profile">
							<li className="flex gap-[6px] items-center text-[#8C8C8C] text-[16px]">
								<Credit color={"#8C8C8C"} />
								<p>Your Profile</p>
							</li>
						</Link>
						<Link to="/settings">
							<li className="flex gap-[6px] items-center text-[#8C8C8C] text-[16px]">
								<Settings color={"#8C8C8C"} />
								<p>Account Settings</p>
							</li>
						</Link>
					</ul>
					<hr className="border-[#EFEFF0] mt-[18px]" />
					<button
						className="flex gap-[6px] items-center text-[#B30600] text-[16px] mt-[15px] cursor-pointer"
						onClick={logout}
					>
						<Logout />
						<p>Logout</p>
					</button>
				</div>
			)}
		</div>
	);
};

export default AvatarDropdown;
