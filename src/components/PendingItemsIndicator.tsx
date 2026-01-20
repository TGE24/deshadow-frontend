import { useEffect } from "react";

const PendingItemsIndicator = ({
	hasPendingItems = false,
	hasPendingSales = false,
	refetch,
	refetchSales,
}: {
	hasPendingItems: boolean;
	hasPendingSales: boolean;
	refetch: () => void;
	refetchSales: () => void;
}) => {
	useEffect(() => {
		const onFocus = () => {
			refetch();
			refetchSales();
		};
		const onVisibility = () => {
			if (document.visibilityState === "visible") {
				refetch();
				refetchSales();
			}
		};

		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [refetch, refetchSales]);

	const hasPending = hasPendingItems || hasPendingSales;

	if (!hasPending) return null;

	return (
		<span
			aria-label="You have pending items or sales"
			title="Pending items or sales"
			className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white"
		/>
	);
};

export default PendingItemsIndicator;
