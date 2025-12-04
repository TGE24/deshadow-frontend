import { Link } from "react-router-dom";

const PendingItemsBanner = ({
	visible,
	message = "You have pending product items — click to review",
}: {
	visible: boolean;
	message?: string;
}) => {
	if (!visible) return null;

	return (
		<div className="w-full flex justify-center">
			<Link to="/pending-items" className="w-full">
				<div className="bg-[#FFFAE6] border text-center text-[#7A5800] px-4 py-2 border-none w-full font-semibold">
					{message}
				</div>
			</Link>
		</div>
	);
};

export default PendingItemsBanner;
