import { create } from "zustand";
import { Product } from "../generated/graphql";

export type ProductStore = {
	product: Partial<Product> | null;
	setProduct: (user: Partial<Product> | null) => void;
};

export const useProductStore = create<ProductStore>()((set) => {
	return {
		product: null,
		setProduct: (product) => set(() => ({ product })),
	};
});
