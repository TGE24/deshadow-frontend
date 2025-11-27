import { CreditSaleFormData } from "./types";

export const canProceedToNextStep = (
	step: number,
	formData: CreditSaleFormData
): boolean => {
	switch (step) {
		case 1:
			// Product Details validation
			return !!(
				formData.productUuid &&
				formData.serialNumber &&
				formData.condition &&
				formData.costPrice > 0 &&
				formData.sellingPrice > 0 &&
				formData.externalStoreName &&
				formData.externalStoreContact &&
				formData.externalStoreAddress
			);
		case 2:
			// Customer Details validation
			// Base validation
			const baseValid = !!(
				formData.creditSaleType &&
				formData.customerName &&
				formData.customerPhone &&
				formData.paymentType &&
				formData.saleAmount > 0
			);

			// If swap sale, also validate swap phone details
			if (formData.creditSaleType === "swap") {
				return (
					baseValid &&
					!!(
						formData.swapPhoneDetails.selectedProduct &&
						formData.swapPhoneDetails.serialNumber &&
						formData.swapPhoneDetails.condition &&
						formData.swapPhoneDetails.estimatedValue > 0
					)
				);
			}

			return baseValid;
		case 3:
			// Review step - always allow to proceed
			return true;
		default:
			return false;
	}
};
