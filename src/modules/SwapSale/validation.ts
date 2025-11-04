import { SwapProductItem, SwapSaleFormData } from "./types";

export const canProceedToNextStep = (
	currentStep: number,
	formData: SwapSaleFormData,
	productItems: SwapProductItem[]
): boolean => {
	switch (currentStep) {
		case 1: {
			// Product Information & Swap Details
			// Check if at least one product is selected and has unit price
			const hasValidProducts = productItems.every(
				(item) => item.productName && item.unitPrice > 0
			);

			// Check if swap phone details are filled
			const hasSwapDetails = Boolean(
				formData.swapPhoneDetails.serialNumber &&
					formData.swapPhoneDetails.brand
				// &&
				// formData.swapPhoneDetails.model &&
				// formData.swapPhoneDetails.condition
			);

			return hasValidProducts && hasSwapDetails;
		}

		case 2: // Customer Details
			return Boolean(
				formData.customerName &&
					formData.customerEmail &&
					formData.customerPhone
			);

		case 3: // Review
			return true; // Always can proceed from review (final step)

		default:
			return false;
	}
};
