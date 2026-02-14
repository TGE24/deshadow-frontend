import {
	PaymentType,
	ProductCondition,
	Product,
	SaleType,
} from "../../generated/graphql";

export type CreditSaleType = SaleType.Direct | SaleType.Swap;

export interface SwapPhoneDetails {
	selectedProduct?: Product | null;
	serialNumber: string;
	brand: string;
	condition: ProductCondition | "";
	estimatedValue: number;
	attributeValues?: Record<string, string>;
}

export interface AccessoryItem {
	id: string;
	accessoryUuid: string;
	quantity: number;
	unitPrice: number;
}

export interface CreditSaleFormData {
	// Sale Type
	creditSaleType: SaleType.Direct | SaleType.Swap;

	// Item type flag
	isAccessory: boolean;

	// Product Details (sold on credit) - required if not accessory
	productUuid?: string;
	serialNumber: string;
	condition: ProductCondition | "";
	costPrice?: number | undefined;
	sellingPrice: number;

	// Accessory Details - required if isAccessory is true
	accessoryName?: string;
	accessoryQuantity?: number;

	// External Store Details
	externalStoreName: string;
	externalStoreContact: string;
	externalStoreAddress: string;

	// Customer Details
	customerName: string;
	customerEmail: string;
	customerPhone: string;

	// Swap Phone Details (only for swap sale)
	swapPhoneDetails: SwapPhoneDetails;

	// Payment Details
	paymentType: PaymentType | "";
	saleAmount: number;
	discountAmount: number;
	totalAmount: number;

	// Attributes
	attributeValues: Record<string, string>;
}
