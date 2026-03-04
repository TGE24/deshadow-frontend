import { ProductItem, CreateSaleForm } from "./types";
import { SaleType } from "../../generated/graphql";

export const canProceedToNextStep = (
	currentStep: number,
	productItems: ProductItem[],
	formData: CreateSaleForm,
): boolean => {
	switch (currentStep) {
		case 1: // Product Information
			return productItems.every((item) => {
				// Product name is always required
				if (!item.productName) return false;

				// For accessories, quantity is required
				if (item.isAccessory) {
					return item.quantity && item.quantity > 0;
				}

				// Unit price is required for all sale types
				return (
					item.unitPrice > 0 &&
					(!item.sellingPrice || item.unitPrice >= item.sellingPrice)
				);
			});
		case 2: // Review
			return true; // Always can proceed from review
		case 3: // Payment
			return formData.totalAmount > 0;
		default:
			return false;
	}
};
