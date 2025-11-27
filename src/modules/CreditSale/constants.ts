import { ProductCondition, PaymentType } from "../../generated/graphql";
import { CreditSaleFormData } from "./types";

export interface Step {
	id: number;
	title: string;
	description: string;
}

export const INITIAL_CREDIT_SALE_FORM_DATA: CreditSaleFormData = {
	creditSaleType: "",
	productUuid: "",
	serialNumber: "",
	condition: "" as ProductCondition | "",
	costPrice: 0,
	sellingPrice: 0,
	externalStoreName: "",
	externalStoreContact: "",
	externalStoreAddress: "",
	customerName: "",
	customerEmail: "",
	customerPhone: "",
	swapPhoneDetails: {
		selectedProduct: null,
		serialNumber: "",
		brand: "",
		condition: "" as ProductCondition | "",
		estimatedValue: 0,
	},
	paymentType: "" as PaymentType | "",
	saleAmount: 0,
	discountAmount: 0,
	totalAmount: 0,
	attributeValues: {},
};

export const CREDIT_SALE_STEPS: Step[] = [
	{
		id: 1,
		title: "Product Details",
		description: "Product & external store info",
	},
	{
		id: 2,
		title: "Customer Details",
		description: "Customer & payment information",
	},
	{
		id: 3,
		title: "Review & Complete",
		description: "Review your credit sale details",
	},
];
