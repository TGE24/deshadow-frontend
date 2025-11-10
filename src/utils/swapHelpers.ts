import { SwapProductItem } from "../modules/SwapSale/types";

export const createNewSwapProductItem = (): SwapProductItem => ({
	id: Date.now().toString(),
	serialNumber: "",
	unitPrice: 0,
	productName: "",
});

export const calculateSwapSubtotal = (
	productItems: SwapProductItem[]
): number => {
	return productItems.reduce((total, item) => total + item.unitPrice, 0);
};

export const calculateSwapFinalTotal = (
	productItems: SwapProductItem[],
	discountAmount: number = 0
): number => {
	return calculateSwapSubtotal(productItems) - discountAmount;
};
