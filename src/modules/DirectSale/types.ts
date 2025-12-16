import {
	PaymentType,
	Product,
	SaleItemInput,
	SaleType,
} from "../../generated/graphql";

export type ProductItem = SaleItemInput & {
	id: string;
	product: Partial<Product> | null;
	serialNumber?: string;
	productName?: string;
	sellingPrice?: number;
	// UUID of the store the selected product item belongs to (optional)
	storeUuid?: string | null;
	// Flag to indicate if this is an accessory
	isAccessory?: boolean;
	// Accessory UUID if isAccessory is true
	accessoryUuid?: string;
	quantity?: number;
};

export type CreateSaleForm = {
	storeUuid: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	saleType: SaleType;
	paymentType: PaymentType;
	totalAmount: number;
	discountAmount: number;
	notes: string;
	items: SaleItemInput[];
};

export type Step = {
	id: number;
	title: string;
	description: string;
};

export interface DirectSaleProps {
	setOverviewOpen: (open: boolean) => void;
	setOpen: (open: boolean) => void;
	saleType?: SaleType;
	showSteps?: boolean;
	refetch?: () => void;
}
