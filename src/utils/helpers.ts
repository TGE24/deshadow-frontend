import { ProductItem } from "../modules/DirectSale/exports";

export const createNewProductItem = (): ProductItem => ({
	id: Date.now().toString(),
	product: null,
	unitPrice: 0,
	serialNumber: "",
	productName: "",
});

export const calculateSubtotal = (productItems: ProductItem[]): number => {
	return productItems.reduce((total, item) => total + (item.unitPrice || 0), 0);
};

export const calculateFinalTotal = (
	productItems: ProductItem[],
	discountAmount: number = 0
): number => {
	return calculateSubtotal(productItems) - discountAmount;
};

export const formatToISODateTime = (
	dateString: string,
	isEndOfDay = false
): string => {
	if (!dateString) return "";

	const date = new Date(dateString);

	if (isEndOfDay) {
		// For toDate, set to end of day (23:59:59.999Z) to include entire day
		date.setHours(23, 59, 59, 999);
	} else {
		// For fromDate, set to start of day (00:00:00.000Z) to include from beginning
		date.setHours(0, 0, 0, 0);
	}

	// Returns format like: 2025-11-04T14:32:30.939Z
	return date.toISOString();
};
