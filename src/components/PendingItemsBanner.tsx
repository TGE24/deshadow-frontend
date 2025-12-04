import { Link } from "react-router-dom";

const PendingItemsBanner = ({
	visible,
	hasPendingItems = false,
	hasPendingSales = false,
}: {
	visible: boolean;
	hasPendingItems?: boolean;
	hasPendingSales?: boolean;
}) => {
	if (!visible) return null;

	let message = "You have pending items";
	if (hasPendingItems && hasPendingSales) {
		message =
			"You have pending product items and credit sales — click to review";
	} else if (hasPendingItems) {
		message = "You have pending product items — click to review";
	} else if (hasPendingSales) {
		message = "You have pending credit sales — click to review";
	}

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
