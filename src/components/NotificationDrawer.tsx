import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
	ProductItem,
	ProductItemStatus,
	useProductItemsQuery,
} from "../generated/graphql";

const NotificationDrawer = ({ onClose }: { onClose: () => void }) => {
	const { data, loading, error, refetch } = useProductItemsQuery({
		variables: {
			filter: { status: ProductItemStatus.Pending },
			pagination: { first: 20 },
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

	const items =
		data?.productItems?.edges
			?.map((e) => e?.node as ProductItem)
			.filter(Boolean) ?? [];

	return (
		<div className="w-[360px] max-h-[60vh] overflow-auto bg-white border border-gray-200 rounded shadow-lg p-3 z-[9999]">
			<div className="flex items-center justify-between mb-2">
				<h4 className="font-semibold">Notifications</h4>
				<button
					onClick={onClose}
					aria-label="Close notifications"
					className="text-gray-500 hover:text-gray-700"
				>
					✕
				</button>
			</div>

			{loading && <p className="text-sm text-gray-500">Loading…</p>}
			{error && (
				<p className="text-sm text-red-500">Failed to load notifications</p>
			)}

			{!loading && items.length === 0 && (
				<p className="text-sm text-gray-600">No pending notifications</p>
			)}

			<ul className="space-y-2">
				{items.map((item) => (
					<li key={item.uuid} className="p-2 rounded hover:bg-slate-50">
						<Link to={`/inventory`} onClick={onClose} className="block">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">
										{item.product?.name || "Product"}
									</p>
									<p className="text-xs text-gray-500">
										SN: {item.serialNumber}
									</p>
								</div>
								<div className="text-right text-xs text-gray-500">
									<p>{item.store?.name ?? item.externalStoreName ?? ""}</p>
									<p className="mt-1">
										<span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
											{item.status}
										</span>
									</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default NotificationDrawer;
