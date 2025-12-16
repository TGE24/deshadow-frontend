import { ProductItem, CreateSaleForm } from "./types";
import { SaleType } from "../../generated/graphql";

export const canProceedToNextStep = (
	currentStep: number,
	productItems: ProductItem[],
	formData: CreateSaleForm
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

				// For credit sales, unit price is optional
				if (formData.saleType === SaleType.Credit) {
					// If unit price is provided, it must be valid and >= selling price
					if (item.unitPrice && item.unitPrice > 0) {
						return !item.sellingPrice || item.unitPrice >= item.sellingPrice;
					}
					// If no unit price provided for credit sale, that's okay
					return true;
				}

				// For non-credit sales, unit price is required
				return (
					item.unitPrice > 0 &&
					(!item.sellingPrice || item.unitPrice >= item.sellingPrice)
				);
			});
		case 2: // Customer Details
			// For credit sales, customerEmail is optional
			if (formData.saleType === SaleType.Credit) {
				return Boolean(formData.customerName && formData.customerPhone);
			}

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
