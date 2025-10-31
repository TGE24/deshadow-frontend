import { useState, useEffect } from "react";
import {
	Store,
	useProductItemsLazyQuery,
	UserRole,
	useStoresLazyQuery,
} from "../../generated/graphql";
import { DEFAULT_PAGINATION_SIZE } from "../../utils/constants";
import { useUserStore } from "../../store/userStore";
import { ProductItem } from "../DirectSale/types";

interface UseInventoryDataProps {
	filterStore: string;
	setFilterStore: (store: string) => void;
}

export const useInventoryData = ({
	filterStore,
	setFilterStore,
}: UseInventoryDataProps) => {
	const { user } = useUserStore();
	const [data, setData] = useState<ProductItem[]>([]);
	const [page, setPage] = useState(1);

	const [getInventory, { data: products, loading, refetch }] =
		useProductItemsLazyQuery();
	const [getStores, { data: stores, loading: storesLoading }] =
		useStoresLazyQuery();

	// Set default store when stores load
	useEffect(() => {
		if (user?.role === UserRole.StoreOwner) {
			if (stores?.stores.edges.length && !storesLoading) {
				setFilterStore((stores?.stores.edges[0]?.node as Store)?.uuid || "");
			}
		} else {
			setFilterStore(user?.assignedStore?.uuid || "");
		}
	}, [
		stores,
		storesLoading,
		setFilterStore,
		user?.assignedStore?.uuid,
		user?.role,
	]);

	// Load stores on component mount
	useEffect(() => {
		getStores({ variables: { pagination: { first: 100 } } });
	}, [getStores]);

	// Load inventory when filter store changes
	useEffect(() => {
		if (filterStore) {
			getInventory({
				variables: {
					pagination: { first: DEFAULT_PAGINATION_SIZE },
				},
			});
		}
	}, [getInventory, filterStore]);

	// Update data when products change
	useEffect(() => {
		if (products?.productItems?.edges) {
			setData(
				products.productItems.edges.map((edge) => edge.node as ProductItem)
			);
		}
	}, [products]);

	const nextPage = () => {
		if (products?.productItems?.pageInfo?.hasNextPage) {
			getInventory({
				variables: {
					pagination: {
						first: DEFAULT_PAGINATION_SIZE,
						after: products?.productItems?.pageInfo?.endCursor,
					},
					// storeUuid: filterStore,
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (products?.productItems?.pageInfo?.hasPreviousPage) {
			getInventory({
				variables: {
					pagination: {
						last: DEFAULT_PAGINATION_SIZE,
						before: products?.productItems?.pageInfo?.startCursor,
					},
					// storeUuid: filterStore,
				},
			});
			setPage(page - 1);
		}
	};

	return {
		data,
		page,
		loading,
		stores,
		storesLoading,
		products,
		nextPage,
		prevPage,
		refetch,
	};
};
