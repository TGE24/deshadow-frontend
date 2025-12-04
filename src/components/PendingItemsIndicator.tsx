import { useEffect } from "react";
import { ProductItemStatus, useProductItemsQuery } from "../generated/graphql";

const PendingItemsIndicator = () => {
	const { data, loading, error, refetch } = useProductItemsQuery({
		variables: {
			filter: { status: ProductItemStatus.Pending },
			pagination: { first: 1 },
		},
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		const onFocus = () => refetch().catch(() => {});
		const onVisibility = () => {
			if (document.visibilityState === "visible") refetch().catch(() => {});
		};

		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [refetch]);

	const hasPending =
		!!data?.productItems?.totalCount && data.productItems.totalCount > 0;

	if (loading || error || !hasPending) return null;

	return (
		<span
			aria-label="You have pending product items"
			title="Pending product items"
			className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white"
		/>
	);
};

export default PendingItemsIndicator;
