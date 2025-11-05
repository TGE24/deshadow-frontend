import { ProductItem, CreateSaleForm } from "./types";

export const canProceedToNextStep = (
	currentStep: number,
	productItems: ProductItem[],
	formData: CreateSaleForm
): boolean => {
	switch (currentStep) {
		case 1: // Product Information
			return productItems.every(
				(item) =>
					item.productName &&
					item.unitPrice > 0 &&
					(!item.sellingPrice || item.unitPrice >= item.sellingPrice)
			);
		case 2: // Customer Details
			return Boolean(
				formData.customerName &&
					formData.customerEmail &&
					formData.customerPhone
			);
		case 3: // Review
			return true; // Always can proceed from review
		case 4: // Payment
			return formData.totalAmount > 0;
		default:
			return false;
	}
};
