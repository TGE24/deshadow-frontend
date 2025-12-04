import { useEffect } from "react";
import {
	ProductItemStatus,
	SaleStatus,
	useProductItemsQuery,
	useSalesQuery,
} from "../generated/graphql";

const PendingItemsIndicator = () => {
	const { data, loading, error, refetch } = useProductItemsQuery({
		variables: {
			filter: { status: ProductItemStatus.Pending },
			pagination: { first: 1 },
		},
		fetchPolicy: "network-only",
	});

	const {
		data: salesData,
		loading: salesLoading,
		error: salesError,
		refetch: refetchSales,
	} = useSalesQuery({
		variables: {
			filter: { saleStatus: SaleStatus.Pending },
			pagination: { first: 1 },
		},
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		const onFocus = () => {
			refetch().catch(() => {});
			refetchSales().catch(() => {});
		};
		const onVisibility = () => {
			if (document.visibilityState === "visible") {
				refetch().catch(() => {});
				refetchSales().catch(() => {});
			}
		};

		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [refetch, refetchSales]);

	const hasPendingItems =
		!!data?.productItems?.totalCount && data.productItems.totalCount > 0;

	const hasPendingSales =
		!!salesData?.sales?.totalCount && salesData.sales.totalCount > 0;

	const hasPending = hasPendingItems || hasPendingSales;

	if (loading || salesLoading || error || salesError || !hasPending)
		return null;

	return (
		<span
			aria-label="You have pending items or sales"
			title="Pending items or sales"
			className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white"
		/>
	);
};

export default PendingItemsIndicator;
