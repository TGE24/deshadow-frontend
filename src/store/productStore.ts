import { create } from "zustand";
import { Product, ProductItem } from "../generated/graphql";

export type ProductStore = {
	product: Partial<Product> | null;
	setProduct: (user: Partial<Product> | null) => void;
	productItem: Partial<ProductItem> | null;
	setProductItem: (productItem: Partial<ProductItem> | null) => void;
};

export const useProductStore = create<ProductStore>()((set) => {
	return {
		product: null,
		setProduct: (product) => set(() => ({ product })),
		productItem: null,
		setProductItem: (productItem) => set(() => ({ productItem })),
	};
});
