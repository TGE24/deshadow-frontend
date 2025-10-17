import {
	PaymentStatus,
	Product,
	SaleItemInput,
	SaleType,
} from "../../generated/graphql";

export type ProductItem = SaleItemInput & {
	id: string;
	product: Product | null;
};

export type CreateSaleForm = {
	storeUuid: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	saleType: SaleType;
	totalAmount: number;
	discountAmount: number;
	paymentStatus: PaymentStatus;
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
}
