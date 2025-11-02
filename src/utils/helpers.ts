import { ProductItem } from "../modules/DirectSale/exports";

export const createNewProductItem = (): ProductItem => ({
	id: Date.now().toString(),
	product: null,
	productUuid: "",
	productItemUuid: "",
	unitPrice: 0,
	serialNumber: "",
	productName: "",
});

export const calculateSubtotal = (productItems: ProductItem[]): number => {
	return productItems.reduce((total, item) => total + item.unitPrice, 0);
};

export const calculateFinalTotal = (
	productItems: ProductItem[],
	discountAmount: number = 0
): number => {
	return calculateSubtotal(productItems) - discountAmount;
};
