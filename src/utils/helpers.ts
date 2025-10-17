import { ProductItem } from "../modules/DirectSale/exports";

export const createNewProductItem = (): ProductItem => ({
	id: Date.now().toString(),
	product: null,
	productUuid: "",
	quantity: 1,
	unitPrice: 0,
});

export const calculateSubtotal = (productItems: ProductItem[]): number => {
	return productItems.reduce(
		(total, item) => total + item.quantity * item.unitPrice,
		0
	);
};

export const calculateTotalQuantity = (productItems: ProductItem[]): number => {
	return productItems.reduce((total, item) => total + item.quantity, 0);
};

export const calculateFinalTotal = (
	productItems: ProductItem[],
	discountAmount: number = 0
): number => {
	return calculateSubtotal(productItems) - discountAmount;
};
