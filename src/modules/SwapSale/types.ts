import {
	PaymentType,
	SaleItemInput,
	SaleType,
	Product,
	ProductCondition,
} from "../../generated/graphql";

// Swap Phone Details
export type SwapPhoneDetails = {
	selectedProduct?: Product | null;
	serialNumber: string;
	brand: string; // Brand UUID from GraphQL
	model: string;
	color: string;
	storage: string;
	condition: ProductCondition | string;
	estimatedValue?: number;
	attributeValues: Record<string, string>;
};

// Product Item for Swap Sale (similar to DirectSale but simpler)
export type SwapProductItem = SaleItemInput & {
	id: string;
	productName?: string;
	product?: Product | null;
	// UUID of the store the selected product item belongs to (optional)
	storeUuid?: string | null;
	attributeValues?: Record<string, string>;
	isAccessory?: boolean;
	accessoryUuid?: string;
	quantity?: number;
};

export type CreateSwapSaleForm = {
	storeUuid: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	saleType: SaleType;
	paymentType: PaymentType | null;
	totalAmount: number;
	discountAmount: number;
	swapPhoneDetails: SwapPhoneDetails;
	items: SaleItemInput[];
};

export type Step = {
	id: number;
	title: string;
	description: string;
};

// Form data interface for react-hook-form
export type SwapSaleFormData = {
	// Product information
	productItems: SwapProductItem[];

	// Customer details
	customerName: string;
	customerEmail: string;
	customerPhone: string;

	// Swap phone details
	swapPhoneDetails: SwapPhoneDetails & {
		estimatedValue?: number;
	};

	// Pricing
	subtotal: number;
	totalAmount: number;
	swapDifference: number; // Positive if customer pays more, negative if gets money back
	discountAmount: number;

	// Payment
	paymentType: PaymentType | null;
};

export interface SwapSaleProps {
	setOverviewOpen: (open: boolean) => void;
	setOpen: (open: boolean) => void;
}
