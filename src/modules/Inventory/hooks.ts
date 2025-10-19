import { useState, useEffect } from "react";
import { Inventory, Store, UserRole } from "../../generated/graphql";
import {
	useInventoryLazyQuery,
	useMyStoresLazyQuery,
} from "../../generated/graphql";
import { DEFAULT_PAGINATION_SIZE } from "../../utils/constants";
import { useUserStore } from "../../store/userStore";

interface UseInventoryDataProps {
	filterStore: string;
	setFilterStore: (store: string) => void;
}

export const useInventoryData = ({
	filterStore,
	setFilterStore,
}: UseInventoryDataProps) => {
	const { user } = useUserStore();
	const [data, setData] = useState<Inventory[]>([]);
	const [page, setPage] = useState(1);

	const [getInventory, { data: products, loading, refetch }] =
		useInventoryLazyQuery();
	const [getStores, { data: stores, loading: storesLoading }] =
		useMyStoresLazyQuery();

	// Set default store when stores load
	useEffect(() => {
		if (user?.role === UserRole.StoreOwner) {
			if (stores?.myStores.edges.length && !storesLoading) {
				setFilterStore((stores?.myStores.edges[0]?.node as Store)?.uuid || "");
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
					storeUuid: filterStore,
				},
			});
		}
	}, [getInventory, filterStore]);

	// Update data when products change
	useEffect(() => {
		if (products?.inventory?.edges) {
			setData(products.inventory.edges.map((edge) => edge.node as Inventory));
		}
	}, [products]);

	const nextPage = () => {
		if (products?.inventory?.pageInfo?.hasNextPage) {
			getInventory({
				variables: {
					pagination: {
						first: DEFAULT_PAGINATION_SIZE,
						after: products?.inventory?.pageInfo?.endCursor,
					},
					storeUuid: filterStore,
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (products?.inventory?.pageInfo?.hasPreviousPage) {
			getInventory({
				variables: {
					pagination: {
						last: DEFAULT_PAGINATION_SIZE,
						before: products?.inventory?.pageInfo?.startCursor,
					},
					storeUuid: filterStore,
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
