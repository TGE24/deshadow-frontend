import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client/react";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
	  };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	JSON: { input: any; output: any };
	Time: { input: any; output: any };
	UUID: { input: any; output: any };
};

export type AuthPayload = {
	__typename?: "AuthPayload";
	accessToken: Scalars["String"]["output"];
	refreshToken: Scalars["String"]["output"];
	user: User;
};

export type Brand = {
	__typename?: "Brand";
	createdAt: Scalars["Time"]["output"];
	description?: Maybe<Scalars["String"]["output"]>;
	isActive: Scalars["Boolean"]["output"];
	logoUrl?: Maybe<Scalars["String"]["output"]>;
	name: Scalars["String"]["output"];
	products: Array<Product>;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type BrandInput = {
	description?: InputMaybe<Scalars["String"]["input"]>;
	logoUrl?: InputMaybe<Scalars["String"]["input"]>;
	name: Scalars["String"]["input"];
};

export type Category = {
	__typename?: "Category";
	children: Array<Category>;
	createdAt: Scalars["Time"]["output"];
	description?: Maybe<Scalars["String"]["output"]>;
	name: Scalars["String"]["output"];
	parent?: Maybe<Category>;
	products: Array<Product>;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type CategoryInput = {
	description?: InputMaybe<Scalars["String"]["input"]>;
	name: Scalars["String"]["input"];
	parentUuid?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type Credit = {
	__typename?: "Credit";
	amount: Scalars["Float"]["output"];
	createdAt: Scalars["Time"]["output"];
	description?: Maybe<Scalars["String"]["output"]>;
	dueDate?: Maybe<Scalars["Time"]["output"]>;
	paidDate?: Maybe<Scalars["Time"]["output"]>;
	product: Product;
	reseller: User;
	status: CreditStatus;
	store: Store;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type CreditInput = {
	amount: Scalars["Float"]["input"];
	description?: InputMaybe<Scalars["String"]["input"]>;
	dueDate?: InputMaybe<Scalars["Time"]["input"]>;
	productUuid: Scalars["UUID"]["input"];
	resellerUuid: Scalars["UUID"]["input"];
	storeUuid: Scalars["UUID"]["input"];
};

export enum CreditStatus {
	Active = "active",
	Cancelled = "cancelled",
	Paid = "paid",
}

export type Edge = {
	__typename?: "Edge";
	cursor: Scalars["String"]["output"];
	node: Node;
};

export type Engineer = {
	__typename?: "Engineer";
	contactInfo?: Maybe<Scalars["String"]["output"]>;
	createdAt: Scalars["Time"]["output"];
	isAvailable: Scalars["Boolean"]["output"];
	location?: Maybe<Scalars["String"]["output"]>;
	rating?: Maybe<Scalars["Float"]["output"]>;
	specialization?: Maybe<Scalars["String"]["output"]>;
	totalRepairs: Scalars["Int"]["output"];
	updatedAt: Scalars["Time"]["output"];
	user: User;
	uuid: Scalars["UUID"]["output"];
};

export type Inventory = {
	__typename?: "Inventory";
	createdAt: Scalars["Time"]["output"];
	lastUpdated: Scalars["Time"]["output"];
	product: Product;
	quantityAvailable: Scalars["Int"]["output"];
	quantityReserved: Scalars["Int"]["output"];
	status: InventoryStatus;
	store: Store;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type InventoryInput = {
	productUuid: Scalars["UUID"]["input"];
	quantityAvailable: Scalars["Int"]["input"];
	quantityReserved?: InputMaybe<Scalars["Int"]["input"]>;
};

export type InventoryMovement = {
	__typename?: "InventoryMovement";
	createdAt: Scalars["Time"]["output"];
	movementDate: Scalars["Time"]["output"];
	movementType: MovementType;
	notes?: Maybe<Scalars["String"]["output"]>;
	product: Product;
	quantity: Scalars["Int"]["output"];
	referenceId?: Maybe<Scalars["Int"]["output"]>;
	referenceType?: Maybe<Scalars["String"]["output"]>;
	store: Store;
	uuid: Scalars["UUID"]["output"];
};

export enum InventoryStatus {
	InStock = "in_stock",
	LowStock = "low_stock",
	OutOfStock = "out_of_stock",
}

export type Invoice = {
	__typename?: "Invoice";
	createdAt: Scalars["Time"]["output"];
	filePath?: Maybe<Scalars["String"]["output"]>;
	generatedAt: Scalars["Time"]["output"];
	invoiceNumber: Scalars["String"]["output"];
	sale: Sale;
	uuid: Scalars["UUID"]["output"];
};

export enum ListingStatus {
	Active = "active",
	Expired = "expired",
	Removed = "removed",
	Sold = "sold",
}

export enum ListingVisibility {
	Private = "private",
	Public = "public",
	StoreOnly = "store_only",
}

export type LoginInput = {
	email: Scalars["String"]["input"];
	password: Scalars["String"]["input"];
};

export type MarketplaceListing = {
	__typename?: "MarketplaceListing";
	createdAt: Scalars["Time"]["output"];
	description?: Maybe<Scalars["String"]["output"]>;
	expiresAt?: Maybe<Scalars["Time"]["output"]>;
	isNegotiable: Scalars["Boolean"]["output"];
	listedPrice: Scalars["Float"]["output"];
	product: Product;
	status: ListingStatus;
	store: Store;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
	visibility: ListingVisibility;
};

export enum MovementType {
	Adjustment = "adjustment",
	In = "in",
	Out = "out",
	Transfer = "transfer",
}

export type Mutation = {
	__typename?: "Mutation";
	createBrand: Brand;
	createCategory: Category;
	createCredit: Credit;
	createProduct: Product;
	createReturn: Return;
	createSale: Sale;
	createStore: Store;
	createUser: User;
	deleteBrand: Scalars["Boolean"]["output"];
	deleteCategory: Scalars["Boolean"]["output"];
	deleteProduct: Scalars["Boolean"]["output"];
	deleteStore: Scalars["Boolean"]["output"];
	deleteUser: Scalars["Boolean"]["output"];
	generateInvoice: Invoice;
	initializePayment: PaymentTransaction;
	login: AuthPayload;
	markCreditPaid: Credit;
	processRefund: Refund;
	processReturn: Return;
	refreshToken: AuthPayload;
	register: AuthPayload;
	updateBrand: Brand;
	updateCategory: Category;
	updateInventory: Inventory;
	updateProduct: Product;
	updateSale: Sale;
	updateStore: Store;
	updateUser: User;
	verifyPayment: PaymentTransaction;
	verifyRefund: Refund;
};

export type MutationCreateBrandArgs = {
	input: BrandInput;
};

export type MutationCreateCategoryArgs = {
	input: CategoryInput;
};

export type MutationCreateCreditArgs = {
	input: CreditInput;
};

export type MutationCreateProductArgs = {
	input: ProductInput;
};

export type MutationCreateReturnArgs = {
	productUuid: Scalars["UUID"]["input"];
	reason: Scalars["String"]["input"];
	saleUuid: Scalars["UUID"]["input"];
};

export type MutationCreateSaleArgs = {
	input: SaleInput;
};

export type MutationCreateStoreArgs = {
	input: StoreInput;
};

export type MutationCreateUserArgs = {
	input: UserInput;
};

export type MutationDeleteBrandArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type MutationDeleteCategoryArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type MutationDeleteProductArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type MutationDeleteStoreArgs = {
	storeId: Scalars["UUID"]["input"];
};

export type MutationDeleteUserArgs = {
	userId: Scalars["UUID"]["input"];
};

export type MutationGenerateInvoiceArgs = {
	saleUuid: Scalars["UUID"]["input"];
};

export type MutationInitializePaymentArgs = {
	input: PaymentInitializeInput;
};

export type MutationLoginArgs = {
	input: LoginInput;
};

export type MutationMarkCreditPaidArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type MutationProcessRefundArgs = {
	input: RefundProcessInput;
};

export type MutationProcessReturnArgs = {
	refundAmount?: InputMaybe<Scalars["Float"]["input"]>;
	status: ReturnStatus;
	uuid: Scalars["UUID"]["input"];
};

export type MutationRefreshTokenArgs = {
	refreshToken: Scalars["String"]["input"];
};

export type MutationRegisterArgs = {
	input: UserInput;
};

export type MutationUpdateBrandArgs = {
	input: BrandInput;
	uuid: Scalars["UUID"]["input"];
};

export type MutationUpdateCategoryArgs = {
	input: CategoryInput;
	uuid: Scalars["UUID"]["input"];
};

export type MutationUpdateInventoryArgs = {
	input: InventoryInput;
	uuid: Scalars["UUID"]["input"];
};

export type MutationUpdateProductArgs = {
	input: ProductUpdateInput;
	uuid: Scalars["UUID"]["input"];
};

export type MutationUpdateSaleArgs = {
	input: SaleInput;
	uuid: Scalars["UUID"]["input"];
};

export type MutationUpdateStoreArgs = {
	input: StoreInput;
	storeId: Scalars["UUID"]["input"];
};

export type MutationUpdateUserArgs = {
	input: UserInput;
	userId: Scalars["UUID"]["input"];
};

export type MutationVerifyPaymentArgs = {
	input: PaymentVerifyInput;
};

export type MutationVerifyRefundArgs = {
	input: RefundVerifyInput;
};

export type Node =
	| Brand
	| Category
	| Credit
	| Engineer
	| Inventory
	| Invoice
	| MarketplaceListing
	| PaymentTransaction
	| Product
	| Refund
	| Sale
	| Store
	| User;

export type PageInfo = {
	__typename?: "PageInfo";
	endCursor?: Maybe<Scalars["String"]["output"]>;
	hasNextPage: Scalars["Boolean"]["output"];
	hasPreviousPage: Scalars["Boolean"]["output"];
	startCursor?: Maybe<Scalars["String"]["output"]>;
};

export type PaginatedResponse = {
	__typename?: "PaginatedResponse";
	edges: Array<Edge>;
	pageInfo: PageInfo;
	totalCount: Scalars["Int"]["output"];
};

export type PaginationInput = {
	after?: InputMaybe<Scalars["String"]["input"]>;
	before?: InputMaybe<Scalars["String"]["input"]>;
	first?: InputMaybe<Scalars["Int"]["input"]>;
	last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PaymentInitializeInput = {
	amount: Scalars["Float"]["input"];
	customerEmail: Scalars["String"]["input"];
	customerPhone?: InputMaybe<Scalars["String"]["input"]>;
	saleUuid: Scalars["UUID"]["input"];
};

export enum PaymentStatus {
	Paid = "paid",
	Partial = "partial",
	Pending = "pending",
}

export type PaymentTransaction = {
	__typename?: "PaymentTransaction";
	amount: Scalars["Float"]["output"];
	authorizationUrl?: Maybe<Scalars["String"]["output"]>;
	channel?: Maybe<Scalars["String"]["output"]>;
	createdAt: Scalars["Time"]["output"];
	currency: Scalars["String"]["output"];
	customerEmail?: Maybe<Scalars["String"]["output"]>;
	customerPhone?: Maybe<Scalars["String"]["output"]>;
	gatewayFees: Scalars["Float"]["output"];
	gatewayResponse?: Maybe<Scalars["JSON"]["output"]>;
	ipAddress?: Maybe<Scalars["String"]["output"]>;
	paidAt?: Maybe<Scalars["Time"]["output"]>;
	paymentMethod?: Maybe<Scalars["String"]["output"]>;
	paystackAccessCode?: Maybe<Scalars["String"]["output"]>;
	paystackReference: Scalars["String"]["output"];
	paystackTransactionId?: Maybe<Scalars["String"]["output"]>;
	refunds: Array<Refund>;
	requestedAmount?: Maybe<Scalars["Float"]["output"]>;
	sale: Sale;
	status: PaymentTransactionStatus;
	updatedAt: Scalars["Time"]["output"];
	userAgent?: Maybe<Scalars["String"]["output"]>;
	uuid: Scalars["UUID"]["output"];
};

export enum PaymentTransactionStatus {
	Abandoned = "abandoned",
	Cancelled = "cancelled",
	Failed = "failed",
	Pending = "pending",
	Success = "success",
}

export type PaymentVerifyInput = {
	reference: Scalars["String"]["input"];
};

export type Product = {
	__typename?: "Product";
	brand: Brand;
	category: Category;
	condition: ProductCondition;
	costPrice?: Maybe<Scalars["Float"]["output"]>;
	createdAt: Scalars["Time"]["output"];
	description?: Maybe<Scalars["String"]["output"]>;
	images: Array<ProductImage>;
	inventory?: Maybe<Inventory>;
	model?: Maybe<Scalars["String"]["output"]>;
	name: Scalars["String"]["output"];
	saleItems: Array<SaleItem>;
	sellingPrice?: Maybe<Scalars["Float"]["output"]>;
	serialNumber?: Maybe<Scalars["String"]["output"]>;
	specifications?: Maybe<Scalars["JSON"]["output"]>;
	store: Store;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export enum ProductCondition {
	Damaged = "damaged",
	FairlyUsed = "fairly_used",
	New = "new",
	Refurbished = "refurbished",
}

export type ProductFilter = {
	brandUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	categoryUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	condition?: InputMaybe<ProductCondition>;
	maxPrice?: InputMaybe<Scalars["Float"]["input"]>;
	minPrice?: InputMaybe<Scalars["Float"]["input"]>;
	search?: InputMaybe<Scalars["String"]["input"]>;
	storeUuid?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type ProductImage = {
	__typename?: "ProductImage";
	altText?: Maybe<Scalars["String"]["output"]>;
	createdAt: Scalars["Time"]["output"];
	imageUrl: Scalars["String"]["output"];
	isPrimary: Scalars["Boolean"]["output"];
	product: Product;
	sortOrder: Scalars["Int"]["output"];
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type ProductInput = {
	brandUuid: Scalars["UUID"]["input"];
	categoryUuid: Scalars["UUID"]["input"];
	condition: ProductCondition;
	costPrice?: InputMaybe<Scalars["Float"]["input"]>;
	description?: InputMaybe<Scalars["String"]["input"]>;
	model?: InputMaybe<Scalars["String"]["input"]>;
	name: Scalars["String"]["input"];
	sellingPrice?: InputMaybe<Scalars["Float"]["input"]>;
	serialNumber?: InputMaybe<Scalars["String"]["input"]>;
	specifications?: InputMaybe<Scalars["JSON"]["input"]>;
	storeUuid: Scalars["UUID"]["input"];
};

export type ProductUpdateInput = {
	brandUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	categoryUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	condition?: InputMaybe<ProductCondition>;
	costPrice?: InputMaybe<Scalars["Float"]["input"]>;
	description?: InputMaybe<Scalars["String"]["input"]>;
	model?: InputMaybe<Scalars["String"]["input"]>;
	name?: InputMaybe<Scalars["String"]["input"]>;
	sellingPrice?: InputMaybe<Scalars["Float"]["input"]>;
	serialNumber?: InputMaybe<Scalars["String"]["input"]>;
	specifications?: InputMaybe<Scalars["JSON"]["input"]>;
	storeUuid?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type Query = {
	__typename?: "Query";
	brand?: Maybe<Brand>;
	brands: PaginatedResponse;
	categories: PaginatedResponse;
	category?: Maybe<Category>;
	credit?: Maybe<Credit>;
	credits: PaginatedResponse;
	engineer?: Maybe<Engineer>;
	engineers: PaginatedResponse;
	financialDashboard: Scalars["JSON"]["output"];
	inventory: PaginatedResponse;
	invoice?: Maybe<Invoice>;
	invoiceStats: Scalars["JSON"]["output"];
	invoicesBySale: PaginatedResponse;
	marketplaceListing?: Maybe<MarketplaceListing>;
	marketplaceListings: PaginatedResponse;
	me: User;
	myStores: PaginatedResponse;
	paymentStats: Scalars["JSON"]["output"];
	paymentTransaction?: Maybe<PaymentTransaction>;
	paymentTransactionsBySale: PaginatedResponse;
	product?: Maybe<Product>;
	products: PaginatedResponse;
	profitLossReport: Scalars["JSON"]["output"];
	refund?: Maybe<Refund>;
	refundStats: Scalars["JSON"]["output"];
	refundsByReturn: PaginatedResponse;
	sale?: Maybe<Sale>;
	sales: PaginatedResponse;
	salesReport: Scalars["JSON"]["output"];
	store?: Maybe<Store>;
	stores: PaginatedResponse;
	user?: Maybe<User>;
	users: PaginatedResponse;
};

export type QueryBrandArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryBrandsArgs = {
	pagination?: InputMaybe<PaginationInput>;
};

export type QueryCategoriesArgs = {
	pagination?: InputMaybe<PaginationInput>;
};

export type QueryCategoryArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryCreditArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryCreditsArgs = {
	pagination?: InputMaybe<PaginationInput>;
	resellerUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	status?: InputMaybe<CreditStatus>;
	storeUuid?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type QueryEngineerArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryEngineersArgs = {
	available?: InputMaybe<Scalars["Boolean"]["input"]>;
	pagination?: InputMaybe<PaginationInput>;
};

export type QueryFinancialDashboardArgs = {
	storeId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryInventoryArgs = {
	pagination?: InputMaybe<PaginationInput>;
	storeUuid: Scalars["UUID"]["input"];
};

export type QueryInvoiceArgs = {
	invoiceId: Scalars["UUID"]["input"];
};

export type QueryInvoicesBySaleArgs = {
	pagination?: InputMaybe<PaginationInput>;
	saleUuid: Scalars["UUID"]["input"];
};

export type QueryMarketplaceListingArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryMarketplaceListingsArgs = {
	pagination?: InputMaybe<PaginationInput>;
	status?: InputMaybe<ListingStatus>;
	visibility?: InputMaybe<ListingVisibility>;
};

export type QueryMyStoresArgs = {
	pagination?: InputMaybe<PaginationInput>;
};

export type QueryPaymentTransactionArgs = {
	paymentId: Scalars["UUID"]["input"];
};

export type QueryPaymentTransactionsBySaleArgs = {
	pagination?: InputMaybe<PaginationInput>;
	saleUuid: Scalars["UUID"]["input"];
};

export type QueryProductArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryProductsArgs = {
	filter?: InputMaybe<ProductFilter>;
	pagination?: InputMaybe<PaginationInput>;
};

export type QueryProfitLossReportArgs = {
	endDate?: InputMaybe<Scalars["Time"]["input"]>;
	startDate?: InputMaybe<Scalars["Time"]["input"]>;
	storeId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryRefundArgs = {
	refundId: Scalars["UUID"]["input"];
};

export type QueryRefundsByReturnArgs = {
	pagination?: InputMaybe<PaginationInput>;
	returnUuid: Scalars["UUID"]["input"];
};

export type QuerySaleArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QuerySalesArgs = {
	filter?: InputMaybe<SaleFilter>;
	pagination?: InputMaybe<PaginationInput>;
};

export type QuerySalesReportArgs = {
	endDate?: InputMaybe<Scalars["Time"]["input"]>;
	startDate?: InputMaybe<Scalars["Time"]["input"]>;
	storeId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryStoreArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryStoresArgs = {
	pagination?: InputMaybe<PaginationInput>;
};

export type QueryUserArgs = {
	uuid: Scalars["UUID"]["input"];
};

export type QueryUsersArgs = {
	pagination?: InputMaybe<PaginationInput>;
	role?: InputMaybe<UserRole>;
};

export type Refund = {
	__typename?: "Refund";
	amount: Scalars["Float"]["output"];
	createdAt: Scalars["Time"]["output"];
	currency: Scalars["String"]["output"];
	gatewayFees: Scalars["Float"]["output"];
	gatewayResponse?: Maybe<Scalars["JSON"]["output"]>;
	paymentTransaction: PaymentTransaction;
	paystackRefundId?: Maybe<Scalars["String"]["output"]>;
	processedAt?: Maybe<Scalars["Time"]["output"]>;
	reason: Scalars["String"]["output"];
	return: Return;
	status: RefundStatus;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type RefundProcessInput = {
	amount: Scalars["Float"]["input"];
	reason: Scalars["String"]["input"];
	returnUuid: Scalars["UUID"]["input"];
};

export enum RefundStatus {
	Cancelled = "cancelled",
	Failed = "failed",
	Pending = "pending",
	Success = "success",
}

export type RefundVerifyInput = {
	paystackRefundId: Scalars["String"]["input"];
};

export type Return = {
	__typename?: "Return";
	createdAt: Scalars["Time"]["output"];
	notes?: Maybe<Scalars["String"]["output"]>;
	processedDate?: Maybe<Scalars["Time"]["output"]>;
	product: Product;
	reason: Scalars["String"]["output"];
	refundAmount?: Maybe<Scalars["Float"]["output"]>;
	refunds: Array<Refund>;
	returnDate: Scalars["Time"]["output"];
	sale: Sale;
	status: ReturnStatus;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export enum ReturnStatus {
	Approved = "approved",
	Completed = "completed",
	Pending = "pending",
	Rejected = "rejected",
}

export type Sale = {
	__typename?: "Sale";
	createdAt: Scalars["Time"]["output"];
	customer: User;
	discountAmount: Scalars["Float"]["output"];
	invoices: Array<Invoice>;
	items: Array<SaleItem>;
	notes?: Maybe<Scalars["String"]["output"]>;
	paymentStatus: PaymentStatus;
	paymentTransactions: Array<PaymentTransaction>;
	returns: Array<Return>;
	saleDate: Scalars["Time"]["output"];
	saleStatus: SaleStatus;
	saleType: SaleType;
	store: Store;
	swapTransactions: Array<SwapTransaction>;
	totalAmount: Scalars["Float"]["output"];
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type SaleFilter = {
	customerUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	fromDate?: InputMaybe<Scalars["Time"]["input"]>;
	paymentStatus?: InputMaybe<PaymentStatus>;
	saleStatus?: InputMaybe<SaleStatus>;
	saleType?: InputMaybe<SaleType>;
	storeUuid?: InputMaybe<Scalars["UUID"]["input"]>;
	toDate?: InputMaybe<Scalars["Time"]["input"]>;
};

export type SaleInput = {
	customerUuid: Scalars["UUID"]["input"];
	discountAmount?: InputMaybe<Scalars["Float"]["input"]>;
	items: Array<SaleItemInput>;
	notes?: InputMaybe<Scalars["String"]["input"]>;
	paymentStatus: PaymentStatus;
	saleType: SaleType;
	storeUuid: Scalars["UUID"]["input"];
	totalAmount: Scalars["Float"]["input"];
};

export type SaleItem = {
	__typename?: "SaleItem";
	createdAt: Scalars["Time"]["output"];
	lineTotal: Scalars["Float"]["output"];
	product: Product;
	quantity: Scalars["Int"]["output"];
	sale: Sale;
	unitPrice: Scalars["Float"]["output"];
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type SaleItemInput = {
	productUuid: Scalars["UUID"]["input"];
	quantity: Scalars["Int"]["input"];
	unitPrice: Scalars["Float"]["input"];
};

export enum SaleStatus {
	Cancelled = "cancelled",
	Completed = "completed",
	Pending = "pending",
	Returned = "returned",
}

export enum SaleType {
	Credit = "credit",
	Direct = "direct",
	Swap = "swap",
}

export type Store = {
	__typename?: "Store";
	address?: Maybe<Scalars["String"]["output"]>;
	businessRegistration?: Maybe<Scalars["String"]["output"]>;
	createdAt: Scalars["Time"]["output"];
	description?: Maybe<Scalars["String"]["output"]>;
	isActive: Scalars["Boolean"]["output"];
	name: Scalars["String"]["output"];
	owner: User;
	phone?: Maybe<Scalars["String"]["output"]>;
	products: Array<Product>;
	sales: Array<Sale>;
	updatedAt: Scalars["Time"]["output"];
	users: Array<StoreUser>;
	uuid: Scalars["UUID"]["output"];
};

export type StoreInput = {
	address?: InputMaybe<Scalars["String"]["input"]>;
	businessRegistration?: InputMaybe<Scalars["String"]["input"]>;
	description?: InputMaybe<Scalars["String"]["input"]>;
	name: Scalars["String"]["input"];
	phone?: InputMaybe<Scalars["String"]["input"]>;
};

export type StoreUser = {
	__typename?: "StoreUser";
	createdAt: Scalars["Time"]["output"];
	isActive: Scalars["Boolean"]["output"];
	role: StoreUserRole;
	store: Store;
	updatedAt: Scalars["Time"]["output"];
	user: User;
};

export enum StoreUserRole {
	Manager = "manager",
	Owner = "owner",
	Staff = "staff",
}

export type SwapTransaction = {
	__typename?: "SwapTransaction";
	createdAt: Scalars["Time"]["output"];
	givenProduct: Product;
	notes?: Maybe<Scalars["String"]["output"]>;
	priceDifference?: Maybe<Scalars["Float"]["output"]>;
	receivedProduct: Product;
	sale: Sale;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type User = {
	__typename?: "User";
	createdAt: Scalars["Time"]["output"];
	email: Scalars["String"]["output"];
	engineerProfile?: Maybe<Engineer>;
	firstName: Scalars["String"]["output"];
	isActive: Scalars["Boolean"]["output"];
	lastName: Scalars["String"]["output"];
	ownedStores: Array<Store>;
	phone?: Maybe<Scalars["String"]["output"]>;
	role: UserRole;
	updatedAt: Scalars["Time"]["output"];
	uuid: Scalars["UUID"]["output"];
};

export type UserInput = {
	email: Scalars["String"]["input"];
	firstName: Scalars["String"]["input"];
	lastName: Scalars["String"]["input"];
	password: Scalars["String"]["input"];
	phone?: InputMaybe<Scalars["String"]["input"]>;
	role: UserRole;
};

export enum UserRole {
	Admin = "admin",
	Engineer = "engineer",
	Reseller = "reseller",
	StoreOwner = "store_owner",
	SuperAdmin = "super_admin",
}

export type LoginMutationVariables = Exact<{
	input: LoginInput;
}>;

export type LoginMutation = {
	__typename?: "Mutation";
	login: {
		__typename?: "AuthPayload";
		accessToken: string;
		refreshToken: string;
		user: {
			__typename?: "User";
			uuid: any;
			role: UserRole;
			email: string;
			phone?: string | null;
			lastName: string;
			isActive: boolean;
			firstName: string;
			createdAt: any;
			updatedAt: any;
			ownedStores: Array<{ __typename?: "Store"; name: string }>;
			engineerProfile?: {
				__typename?: "Engineer";
				uuid: any;
				rating?: number | null;
			} | null;
		};
	};
};

export type RefreshTokenMutationVariables = Exact<{
	refreshToken: Scalars["String"]["input"];
}>;

export type RefreshTokenMutation = {
	__typename?: "Mutation";
	refreshToken: {
		__typename?: "AuthPayload";
		accessToken: string;
		refreshToken: string;
		user: {
			__typename?: "User";
			uuid: any;
			role: UserRole;
			email: string;
			phone?: string | null;
			lastName: string;
			isActive: boolean;
			firstName: string;
			ownedStores: Array<{ __typename?: "Store"; name: string }>;
			engineerProfile?: {
				__typename?: "Engineer";
				uuid: any;
				rating?: number | null;
			} | null;
		};
	};
};

export const LoginDocument = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			accessToken
			refreshToken
			user {
				uuid
				role
				email
				phone
				lastName
				isActive
				firstName
				createdAt
				updatedAt
				ownedStores {
					name
				}
				engineerProfile {
					uuid
					rating
				}
			}
		}
	}
`;
export type LoginMutationFn = Apollo.MutationFunction<
	LoginMutation,
	LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(
	baseOptions?: Apollo.MutationHookOptions<
		LoginMutation,
		LoginMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
		LoginDocument,
		options
	);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
	LoginMutation,
	LoginMutationVariables
>;
export const RefreshTokenDocument = gql`
	mutation RefreshToken($refreshToken: String!) {
		refreshToken(refreshToken: $refreshToken) {
			accessToken
			refreshToken
			user {
				uuid
				role
				email
				phone
				lastName
				isActive
				firstName
				ownedStores {
					name
				}
				engineerProfile {
					uuid
					rating
				}
			}
		}
	}
`;
export type RefreshTokenMutationFn = Apollo.MutationFunction<
	RefreshTokenMutation,
	RefreshTokenMutationVariables
>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(
	baseOptions?: Apollo.MutationHookOptions<
		RefreshTokenMutation,
		RefreshTokenMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<
		RefreshTokenMutation,
		RefreshTokenMutationVariables
	>(RefreshTokenDocument, options);
}
export type RefreshTokenMutationHookResult = ReturnType<
	typeof useRefreshTokenMutation
>;
export type RefreshTokenMutationResult =
	Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<
	RefreshTokenMutation,
	RefreshTokenMutationVariables
>;
