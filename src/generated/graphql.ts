import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  challengeToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Bank = {
  __typename?: 'Bank';
  code: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type BankAccountInput = {
  accountNumber: Scalars['String']['input'];
  bankCode: Scalars['String']['input'];
};

export type BankAccountVerificationResult = {
  __typename?: 'BankAccountVerificationResult';
  accountName: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
};

export type Brand = {
  __typename?: 'Brand';
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isOwned: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  products: Array<Product>;
  store?: Maybe<Store>;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type BrandInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type Category = {
  __typename?: 'Category';
  children: Array<Category>;
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isOwned: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Category>;
  products: Array<Product>;
  status: CategoryStatus;
  store?: Maybe<Store>;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type CategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentUuid?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<CategoryStatus>;
};

export enum CategoryStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type CompleteInvitationInput = {
  invitationToken: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Credit = {
  __typename?: 'Credit';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Time']['output']>;
  paidDate?: Maybe<Scalars['Time']['output']>;
  product: Product;
  reseller: User;
  status: CreditStatus;
  store: Store;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type CreditInput = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['Time']['input']>;
  productUuid: Scalars['UUID']['input'];
  resellerUuid: Scalars['UUID']['input'];
  storeUuid: Scalars['UUID']['input'];
};

export enum CreditStatus {
  Active = 'active',
  Cancelled = 'cancelled',
  Paid = 'paid'
}

export type EarningsTransaction = {
  __typename?: 'EarningsTransaction';
  amount: Scalars['Float']['output'];
  balanceAfter: Scalars['Float']['output'];
  balanceBefore: Scalars['Float']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  store: Store;
  transactionType: Scalars['String']['output'];
  uuid: Scalars['UUID']['output'];
};

export type Edge = {
  __typename?: 'Edge';
  cursor: Scalars['String']['output'];
  node: Node;
};

export type Inventory = {
  __typename?: 'Inventory';
  createdAt: Scalars['Time']['output'];
  lastUpdated: Scalars['Time']['output'];
  product: Product;
  quantityAvailable: Scalars['Int']['output'];
  quantityReserved: Scalars['Int']['output'];
  status: InventoryStatus;
  store: Store;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type InventoryInput = {
  productUuid: Scalars['UUID']['input'];
  quantityAvailable: Scalars['Int']['input'];
  quantityReserved?: InputMaybe<Scalars['Int']['input']>;
};

export type InventoryMovement = {
  __typename?: 'InventoryMovement';
  createdAt: Scalars['Time']['output'];
  movementDate: Scalars['Time']['output'];
  movementType: MovementType;
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  quantity: Scalars['Int']['output'];
  referenceId?: Maybe<Scalars['Int']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  store: Store;
  uuid: Scalars['UUID']['output'];
};

export enum InventoryStatus {
  InStock = 'in_stock',
  LowStock = 'low_stock',
  OutOfStock = 'out_of_stock'
}

export type InvitationPayload = {
  __typename?: 'InvitationPayload';
  challengeToken: Scalars['String']['output'];
  twoFactorQRCodeURL: Scalars['String']['output'];
  twoFactorSecret: Scalars['String']['output'];
  user: User;
};

export type Invoice = {
  __typename?: 'Invoice';
  createdAt: Scalars['Time']['output'];
  filePath?: Maybe<Scalars['String']['output']>;
  generatedAt: Scalars['Time']['output'];
  invoiceNumber: Scalars['String']['output'];
  sale: Sale;
  uuid: Scalars['UUID']['output'];
};

export enum ListingStatus {
  Active = 'active',
  Expired = 'expired',
  Removed = 'removed',
  Sold = 'sold'
}

export enum ListingVisibility {
  Private = 'private',
  Public = 'public',
  StoreOnly = 'store_only'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  verificationCode?: InputMaybe<Scalars['String']['input']>;
};

export type MarketplaceListing = {
  __typename?: 'MarketplaceListing';
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['Time']['output']>;
  isNegotiable: Scalars['Boolean']['output'];
  listedPrice: Scalars['Float']['output'];
  product: Product;
  status: ListingStatus;
  store: Store;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
  visibility: ListingVisibility;
};

export enum MovementType {
  Adjustment = 'adjustment',
  In = 'in',
  Out = 'out',
  Transfer = 'transfer'
}

export type Mutation = {
  __typename?: 'Mutation';
  assignResellerToStore: Scalars['Boolean']['output'];
  changePassword: PasswordResetResponse;
  completeInvitation: InvitationPayload;
  createBrand: Brand;
  createCategory: Category;
  createCredit: Credit;
  createProduct: Product;
  createReturn: Return;
  createSale: Sale;
  createStore: Store;
  createUser: User;
  deleteBrand: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  initializePayment: PaymentTransaction;
  login: AuthPayload;
  loginWith2FA: AuthPayload;
  markCreditPaid: Credit;
  processRefund: Refund;
  processReturn: Return;
  refreshToken: AuthPayload;
  requestPasswordReset: PasswordResetResponse;
  requestWithdrawal: WithdrawalTransaction;
  resetPassword: PasswordResetResponse;
  saveBankAccount: UserBankAccount;
  setPrimaryBankAccount: Scalars['Boolean']['output'];
  unassignResellerFromStore: Scalars['Boolean']['output'];
  updateBrand: Brand;
  updateCategory: Category;
  updateInventory: Inventory;
  updateProduct: Product;
  updateSale: Sale;
  updateStore: Store;
  updateUser: User;
  verifyBankAccount: BankAccountVerificationResult;
  verifyPayment: PaymentTransaction;
  verifyRefund: Refund;
};


export type MutationAssignResellerToStoreArgs = {
  resellerUUID: Scalars['UUID']['input'];
  storeUUID: Scalars['UUID']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCompleteInvitationArgs = {
  input: CompleteInvitationInput;
};


export type MutationCreateBrandArgs = {
  input: BrandInput;
  storeUUID?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationCreateCategoryArgs = {
  input: CategoryInput;
  storeUUID?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationCreateCreditArgs = {
  input: CreditInput;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationCreateReturnArgs = {
  productUuid: Scalars['UUID']['input'];
  reason: Scalars['String']['input'];
  saleUuid: Scalars['UUID']['input'];
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
  uuid: Scalars['UUID']['input'];
};


export type MutationDeleteCategoryArgs = {
  uuid: Scalars['UUID']['input'];
};


export type MutationDeleteProductArgs = {
  uuid: Scalars['UUID']['input'];
};


export type MutationDeleteStoreArgs = {
  storeId: Scalars['UUID']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['UUID']['input'];
};


export type MutationInitializePaymentArgs = {
  input: PaymentInitializeInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLoginWith2FaArgs = {
  challengeToken: Scalars['String']['input'];
  code: Scalars['String']['input'];
};


export type MutationMarkCreditPaidArgs = {
  uuid: Scalars['UUID']['input'];
};


export type MutationProcessRefundArgs = {
  input: RefundProcessInput;
};


export type MutationProcessReturnArgs = {
  refundAmount?: InputMaybe<Scalars['Float']['input']>;
  status: ReturnStatus;
  uuid: Scalars['UUID']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


export type MutationRequestWithdrawalArgs = {
  input: WithdrawalRequestInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSaveBankAccountArgs = {
  input: BankAccountInput;
};


export type MutationSetPrimaryBankAccountArgs = {
  accountUuid: Scalars['UUID']['input'];
};


export type MutationUnassignResellerFromStoreArgs = {
  resellerUUID: Scalars['UUID']['input'];
};


export type MutationUpdateBrandArgs = {
  input: BrandInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateCategoryArgs = {
  input: CategoryInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateInventoryArgs = {
  input: InventoryInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateProductArgs = {
  input: ProductUpdateInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateSaleArgs = {
  input: SaleInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateStoreArgs = {
  input: StoreInput;
  storeId: Scalars['UUID']['input'];
};


export type MutationUpdateUserArgs = {
  input: UserInput;
  userId: Scalars['UUID']['input'];
};


export type MutationVerifyBankAccountArgs = {
  input: BankAccountInput;
};


export type MutationVerifyPaymentArgs = {
  input: PaymentVerifyInput;
};


export type MutationVerifyRefundArgs = {
  input: RefundVerifyInput;
};

export type Node = Bank | Brand | Category | Credit | EarningsTransaction | Inventory | Invoice | MarketplaceListing | PaymentTransaction | Product | Refund | Sale | Store | StoreEarnings | User | UserBankAccount | WithdrawalTransaction;

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedResponse = {
  __typename?: 'PaginatedResponse';
  edges: Array<Edge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type PasswordResetResponse = {
  __typename?: 'PasswordResetResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PaymentInitializeInput = {
  amount: Scalars['Float']['input'];
  customerEmail: Scalars['String']['input'];
  customerPhone?: InputMaybe<Scalars['String']['input']>;
  saleUuid: Scalars['UUID']['input'];
};

export enum PaymentStatus {
  Paid = 'paid',
  Partial = 'partial',
  Pending = 'pending'
}

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['Float']['output'];
  authorizationUrl?: Maybe<Scalars['String']['output']>;
  channel?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  currency: Scalars['String']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerPhone?: Maybe<Scalars['String']['output']>;
  gatewayFees: Scalars['Float']['output'];
  gatewayResponse?: Maybe<Scalars['JSON']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['Time']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paystackAccessCode?: Maybe<Scalars['String']['output']>;
  paystackReference: Scalars['String']['output'];
  paystackTransactionId?: Maybe<Scalars['String']['output']>;
  refunds: Array<Refund>;
  requestedAmount?: Maybe<Scalars['Float']['output']>;
  sale: Sale;
  status: PaymentTransactionStatus;
  updatedAt: Scalars['Time']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['UUID']['output'];
};

export enum PaymentTransactionStatus {
  Abandoned = 'abandoned',
  Cancelled = 'cancelled',
  Failed = 'failed',
  Pending = 'pending',
  Success = 'success'
}

export type PaymentVerifyInput = {
  reference: Scalars['String']['input'];
};

export type Product = {
  __typename?: 'Product';
  brand: Brand;
  category: Category;
  condition: ProductCondition;
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  images: Array<ProductImage>;
  inventory?: Maybe<Inventory>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  saleItems: Array<SaleItem>;
  sellingPrice?: Maybe<Scalars['Float']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  specifications?: Maybe<Scalars['JSON']['output']>;
  store: Store;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export enum ProductCondition {
  Damaged = 'damaged',
  FairlyUsed = 'fairly_used',
  New = 'new',
  Refurbished = 'refurbished'
}

export type ProductFilter = {
  brandUuid?: InputMaybe<Scalars['UUID']['input']>;
  categoryUuid?: InputMaybe<Scalars['UUID']['input']>;
  condition?: InputMaybe<ProductCondition>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  imageUrl: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  product: Product;
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type ProductInput = {
  brandUuid: Scalars['UUID']['input'];
  categoryUuid: Scalars['UUID']['input'];
  condition: ProductCondition;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sellingPrice?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  specifications?: InputMaybe<Scalars['JSON']['input']>;
  storeUuid: Scalars['UUID']['input'];
};

export type ProductUpdateInput = {
  brandUuid?: InputMaybe<Scalars['UUID']['input']>;
  categoryUuid?: InputMaybe<Scalars['UUID']['input']>;
  condition?: InputMaybe<ProductCondition>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sellingPrice?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  specifications?: InputMaybe<Scalars['JSON']['input']>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  bank?: Maybe<Bank>;
  banks: Array<Bank>;
  brand?: Maybe<Brand>;
  brands: PaginatedResponse;
  categories: PaginatedResponse;
  category?: Maybe<Category>;
  credit?: Maybe<Credit>;
  credits: PaginatedResponse;
  financialDashboard: Scalars['JSON']['output'];
  inventory: PaginatedResponse;
  invoice?: Maybe<Invoice>;
  invoiceStats: Scalars['JSON']['output'];
  invoicesBySale: PaginatedResponse;
  marketplaceListing?: Maybe<MarketplaceListing>;
  marketplaceListings: PaginatedResponse;
  me: User;
  myBankAccounts: Array<UserBankAccount>;
  myEarningsTransactions: PaginatedResponse;
  myStores: PaginatedResponse;
  myTotalEarnings: Scalars['Float']['output'];
  myWithdrawalHistory: PaginatedResponse;
  paymentStats: Scalars['JSON']['output'];
  paymentTransaction?: Maybe<PaymentTransaction>;
  paymentTransactionsBySale: PaginatedResponse;
  product?: Maybe<Product>;
  products: PaginatedResponse;
  profitLossReport: Scalars['JSON']['output'];
  refund?: Maybe<Refund>;
  refundStats: Scalars['JSON']['output'];
  refundsByReturn: PaginatedResponse;
  sale?: Maybe<Sale>;
  sales: PaginatedResponse;
  salesReport: Scalars['JSON']['output'];
  store?: Maybe<Store>;
  storeEarnings?: Maybe<StoreEarnings>;
  stores: PaginatedResponse;
  user?: Maybe<User>;
  users: PaginatedResponse;
};


export type QueryBankArgs = {
  code: Scalars['String']['input'];
};


export type QueryBrandArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryBrandsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryCategoriesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryCategoryArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryCreditArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryCreditsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  resellerUuid?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<CreditStatus>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryFinancialDashboardArgs = {
  storeId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInventoryArgs = {
  pagination?: InputMaybe<PaginationInput>;
  storeUuid: Scalars['UUID']['input'];
};


export type QueryInvoiceArgs = {
  invoiceId: Scalars['UUID']['input'];
};


export type QueryInvoicesBySaleArgs = {
  pagination?: InputMaybe<PaginationInput>;
  saleUuid: Scalars['UUID']['input'];
};


export type QueryMarketplaceListingArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryMarketplaceListingsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  status?: InputMaybe<ListingStatus>;
  visibility?: InputMaybe<ListingVisibility>;
};


export type QueryMyEarningsTransactionsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryMyStoresArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMyWithdrawalHistoryArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryPaymentTransactionArgs = {
  paymentId: Scalars['UUID']['input'];
};


export type QueryPaymentTransactionsBySaleArgs = {
  pagination?: InputMaybe<PaginationInput>;
  saleUuid: Scalars['UUID']['input'];
};


export type QueryProductArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryProductsArgs = {
  filter?: InputMaybe<ProductFilter>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProfitLossReportArgs = {
  endDate?: InputMaybe<Scalars['Time']['input']>;
  startDate?: InputMaybe<Scalars['Time']['input']>;
  storeId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRefundArgs = {
  refundId: Scalars['UUID']['input'];
};


export type QueryRefundsByReturnArgs = {
  pagination?: InputMaybe<PaginationInput>;
  returnUuid: Scalars['UUID']['input'];
};


export type QuerySaleArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QuerySalesArgs = {
  filter?: InputMaybe<SaleFilter>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QuerySalesReportArgs = {
  endDate?: InputMaybe<Scalars['Time']['input']>;
  startDate?: InputMaybe<Scalars['Time']['input']>;
  storeId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStoreArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryStoreEarningsArgs = {
  storeUuid: Scalars['UUID']['input'];
};


export type QueryStoresArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryUserArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  role?: InputMaybe<UserRole>;
};

export type Refund = {
  __typename?: 'Refund';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Time']['output'];
  currency: Scalars['String']['output'];
  gatewayFees: Scalars['Float']['output'];
  gatewayResponse?: Maybe<Scalars['JSON']['output']>;
  paymentTransaction: PaymentTransaction;
  paystackRefundId?: Maybe<Scalars['String']['output']>;
  processedAt?: Maybe<Scalars['Time']['output']>;
  reason: Scalars['String']['output'];
  return: Return;
  status: RefundStatus;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type RefundProcessInput = {
  amount: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
  returnUuid: Scalars['UUID']['input'];
};

export enum RefundStatus {
  Cancelled = 'cancelled',
  Failed = 'failed',
  Pending = 'pending',
  Success = 'success'
}

export type RefundVerifyInput = {
  paystackRefundId: Scalars['String']['input'];
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Return = {
  __typename?: 'Return';
  createdAt: Scalars['Time']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  processedDate?: Maybe<Scalars['Time']['output']>;
  product: Product;
  reason: Scalars['String']['output'];
  refundAmount?: Maybe<Scalars['Float']['output']>;
  refunds: Array<Refund>;
  returnDate: Scalars['Time']['output'];
  sale: Sale;
  status: ReturnStatus;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export enum ReturnStatus {
  Approved = 'approved',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type Sale = {
  __typename?: 'Sale';
  createdAt: Scalars['Time']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerName: Scalars['String']['output'];
  customerPhone?: Maybe<Scalars['String']['output']>;
  discountAmount: Scalars['Float']['output'];
  invoices: Array<Invoice>;
  items: Array<SaleItem>;
  notes?: Maybe<Scalars['String']['output']>;
  paymentStatus: PaymentStatus;
  paymentTransactions: Array<PaymentTransaction>;
  returns: Array<Return>;
  saleDate: Scalars['Time']['output'];
  saleStatus: SaleStatus;
  saleType: SaleType;
  store: Store;
  swapTransactions: Array<SwapTransaction>;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type SaleFilter = {
  fromDate?: InputMaybe<Scalars['Time']['input']>;
  paymentStatus?: InputMaybe<PaymentStatus>;
  saleStatus?: InputMaybe<SaleStatus>;
  saleType?: InputMaybe<SaleType>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
  toDate?: InputMaybe<Scalars['Time']['input']>;
};

export type SaleInput = {
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  customerName: Scalars['String']['input'];
  customerPhone: Scalars['String']['input'];
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  items: Array<SaleItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  saleType: SaleType;
  storeUuid: Scalars['UUID']['input'];
  totalAmount: Scalars['Float']['input'];
};

export type SaleItem = {
  __typename?: 'SaleItem';
  createdAt: Scalars['Time']['output'];
  lineTotal: Scalars['Float']['output'];
  product: Product;
  quantity: Scalars['Int']['output'];
  sale: Sale;
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type SaleItemInput = {
  productUuid: Scalars['UUID']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
};

export enum SaleStatus {
  Cancelled = 'cancelled',
  Completed = 'completed',
  Pending = 'pending',
  Returned = 'returned'
}

export enum SaleType {
  Credit = 'credit',
  Direct = 'direct',
  Swap = 'swap'
}

export type Store = {
  __typename?: 'Store';
  address?: Maybe<Scalars['String']['output']>;
  businessRegistration?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  owner: User;
  phone?: Maybe<Scalars['String']['output']>;
  products: Array<Product>;
  resellers: Array<User>;
  sales: Array<Sale>;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type StoreEarnings = {
  __typename?: 'StoreEarnings';
  availableBalance: Scalars['Float']['output'];
  createdAt: Scalars['Time']['output'];
  pendingWithdrawals: Scalars['Float']['output'];
  store: Store;
  totalSalesAmount: Scalars['Float']['output'];
  totalWithdrawn: Scalars['Float']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type StoreInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  businessRegistration?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type SwapTransaction = {
  __typename?: 'SwapTransaction';
  createdAt: Scalars['Time']['output'];
  givenProduct: Product;
  notes?: Maybe<Scalars['String']['output']>;
  priceDifference?: Maybe<Scalars['Float']['output']>;
  receivedProduct: Product;
  sale: Sale;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type User = {
  __typename?: 'User';
  assignedStore?: Maybe<Store>;
  createdAt: Scalars['Time']['output'];
  createdByMe?: Maybe<Scalars['Boolean']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  ownedStores: Array<Store>;
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type UserBankAccount = {
  __typename?: 'UserBankAccount';
  accountName: Scalars['String']['output'];
  bankCode: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  isPrimary: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
  verifiedAt?: Maybe<Scalars['Time']['output']>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export enum UserRole {
  Admin = 'admin',
  Reseller = 'reseller',
  StoreOwner = 'store_owner',
  SuperAdmin = 'super_admin'
}

export type WithdrawalRequestInput = {
  amount: Scalars['Float']['input'];
  storeUuid: Scalars['UUID']['input'];
  twoFaCode: Scalars['String']['input'];
};

export type WithdrawalTransaction = {
  __typename?: 'WithdrawalTransaction';
  accountName: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  bankName: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  failedReason?: Maybe<Scalars['String']['output']>;
  netAmount: Scalars['Float']['output'];
  processedAt?: Maybe<Scalars['Time']['output']>;
  processingFee: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  store: Store;
  twoFaVerifiedAt?: Maybe<Scalars['Time']['output']>;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type AssignResellerToStoreMutationVariables = Exact<{
  resellerUUID: Scalars['UUID']['input'];
  storeUUID: Scalars['UUID']['input'];
}>;


export type AssignResellerToStoreMutation = { __typename?: 'Mutation', assignResellerToStore: boolean };

export type CompleteInvitationMutationVariables = Exact<{
  input: CompleteInvitationInput;
}>;


export type CompleteInvitationMutation = { __typename?: 'Mutation', completeInvitation: { __typename?: 'InvitationPayload', twoFactorSecret: string, twoFactorQRCodeURL: string, challengeToken: string, user: { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string } } };

export type CreateBrandMutationVariables = Exact<{
  input: BrandInput;
}>;


export type CreateBrandMutation = { __typename?: 'Mutation', createBrand: { __typename?: 'Brand', uuid: any, name: string, logoUrl?: string | null, isActive: boolean, updatedAt: any, createdAt: any, description?: string | null } };

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', uuid: any, name: string, parent?: { __typename?: 'Category', name: string } | null, products: Array<{ __typename?: 'Product', name: string }> } };

export type CreateProductMutationVariables = Exact<{
  input: ProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', uuid: any, name: string, inventory?: { __typename?: 'Inventory', uuid: any } | null } };

export type CreateSaleMutationVariables = Exact<{
  input: SaleInput;
}>;


export type CreateSaleMutation = { __typename?: 'Mutation', createSale: { __typename?: 'Sale', uuid: any, customerName: string, customerEmail?: string | null, customerPhone?: string | null, totalAmount: number, paymentStatus: PaymentStatus, saleDate: any, createdAt: any, updatedAt: any, saleStatus: SaleStatus, paymentTransactions: Array<{ __typename?: 'PaymentTransaction', paystackReference: string, paystackTransactionId?: string | null, paystackAccessCode?: string | null, authorizationUrl?: string | null, amount: number, requestedAmount?: number | null, currency: string, status: PaymentTransactionStatus }>, invoices: Array<{ __typename?: 'Invoice', uuid: any, invoiceNumber: string }> } };

export type CreateStoreMutationVariables = Exact<{
  input: StoreInput;
}>;


export type CreateStoreMutation = { __typename?: 'Mutation', createStore: { __typename?: 'Store', uuid: any, name: string } };

export type CreateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', uuid: any, email: string, isActive: boolean, firstName: string, lastName: string } };

export type DeleteBrandMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type DeleteBrandMutation = { __typename?: 'Mutation', deleteBrand: boolean };

export type DeleteCategoryMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: boolean };

export type DeleteProductMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type DeleteStoreMutationVariables = Exact<{
  storeId: Scalars['UUID']['input'];
}>;


export type DeleteStoreMutation = { __typename?: 'Mutation', deleteStore: boolean };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type InitializePaymentMutationVariables = Exact<{
  input: PaymentInitializeInput;
}>;


export type InitializePaymentMutation = { __typename?: 'Mutation', initializePayment: { __typename?: 'PaymentTransaction', uuid: any, authorizationUrl?: string | null, paystackReference: string, paystackTransactionId?: string | null, paystackAccessCode?: string | null, gatewayResponse?: any | null, gatewayFees: number } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken?: string | null, refreshToken?: string | null, challengeToken?: string | null, user?: { __typename?: 'User', uuid: any, role: UserRole } | null } };

export type LoginWith2FaMutationVariables = Exact<{
  challengeToken: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type LoginWith2FaMutation = { __typename?: 'Mutation', loginWith2FA: { __typename?: 'AuthPayload', accessToken?: string | null, refreshToken?: string | null, challengeToken?: string | null } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayload', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string, ownedStores: Array<{ __typename?: 'Store', name: string }> } | null } };

export type UpdateBrandMutationVariables = Exact<{
  input: BrandInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateBrandMutation = { __typename?: 'Mutation', updateBrand: { __typename?: 'Brand', uuid: any, name: string, logoUrl?: string | null, description?: string | null } };

export type UpdateCategoryMutationVariables = Exact<{
  input: CategoryInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', uuid: any, status: CategoryStatus } };

export type UpdateInventoryMutationVariables = Exact<{
  input: InventoryInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateInventoryMutation = { __typename?: 'Mutation', updateInventory: { __typename?: 'Inventory', uuid: any, status: InventoryStatus } };

export type UpdateProductMutationVariables = Exact<{
  input: ProductUpdateInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', uuid: any, name: string } };

export type UpdateStoreMutationVariables = Exact<{
  input: StoreInput;
  storeId: Scalars['UUID']['input'];
}>;


export type UpdateStoreMutation = { __typename?: 'Mutation', updateStore: { __typename?: 'Store', uuid: any, name: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UserInput;
  userId: Scalars['UUID']['input'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', uuid: any, email: string, isActive: boolean, firstName: string, lastName: string } };

export type VerifyPaymentMutationVariables = Exact<{
  input: PaymentVerifyInput;
}>;


export type VerifyPaymentMutation = { __typename?: 'Mutation', verifyPayment: { __typename?: 'PaymentTransaction', uuid: any, status: PaymentTransactionStatus, createdAt: any, updatedAt: any } };

export type BrandsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type BrandsQuery = { __typename?: 'Query', brands: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename: 'Bank' } | { __typename: 'Brand', uuid: any, name: string, logoUrl?: string | null, isActive: boolean, isOwned: boolean, updatedAt: any, createdAt: any, description?: string | null, products: Array<{ __typename?: 'Product', uuid: any, name: string }> } | { __typename: 'Category' } | { __typename: 'Credit' } | { __typename: 'EarningsTransaction' } | { __typename: 'Inventory' } | { __typename: 'Invoice' } | { __typename: 'MarketplaceListing' } | { __typename: 'PaymentTransaction' } | { __typename: 'Product' } | { __typename: 'Refund' } | { __typename: 'Sale' } | { __typename: 'Store' } | { __typename: 'StoreEarnings' } | { __typename: 'User' } | { __typename: 'UserBankAccount' } | { __typename: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type CategoriesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename: 'Bank' } | { __typename: 'Brand' } | { __typename: 'Category', uuid: any, name: string, description?: string | null, createdAt: any, status: CategoryStatus, isOwned: boolean, parent?: { __typename?: 'Category', name: string } | null } | { __typename: 'Credit' } | { __typename: 'EarningsTransaction' } | { __typename: 'Inventory' } | { __typename: 'Invoice' } | { __typename: 'MarketplaceListing' } | { __typename: 'PaymentTransaction' } | { __typename: 'Product' } | { __typename: 'Refund' } | { __typename: 'Sale' } | { __typename: 'Store' } | { __typename: 'StoreEarnings' } | { __typename: 'User' } | { __typename: 'UserBankAccount' } | { __typename: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type FinancialDashboardQueryVariables = Exact<{
  storeId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FinancialDashboardQuery = { __typename?: 'Query', financialDashboard: any };

export type InventoryQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  storeUuid: Scalars['UUID']['input'];
}>;


export type InventoryQuery = { __typename?: 'Query', inventory: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Bank' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'Credit' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Inventory', uuid: any, quantityAvailable: number, quantityReserved: number, status: InventoryStatus, lastUpdated: any, createdAt: any, updatedAt: any, product: { __typename?: 'Product', uuid: any, name: string, model?: string | null, condition: ProductCondition, costPrice?: number | null, sellingPrice?: number | null, serialNumber?: string | null, description?: string | null, specifications?: any | null, brand: { __typename?: 'Brand', name: string, uuid: any } } } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } | { __typename?: 'UserBankAccount' } | { __typename?: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type InvoiceQueryVariables = Exact<{
  invoiceId: Scalars['UUID']['input'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice?: { __typename?: 'Invoice', uuid: any, filePath?: string | null, sale: { __typename?: 'Sale', items: Array<{ __typename?: 'SaleItem', product: { __typename?: 'Product', name: string, model?: string | null, condition: ProductCondition, specifications?: any | null } }> } } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string, createdAt: any, updatedAt: any, createdByMe?: boolean | null, ownedStores: Array<{ __typename?: 'Store', uuid: any, name: string, phone?: string | null, businessRegistration?: string | null, description?: string | null, address?: string | null, isActive: boolean }>, assignedStore?: { __typename?: 'Store', uuid: any, name: string, address?: string | null, phone?: string | null, isActive: boolean, createdAt: any, updatedAt: any } | null } };

export type MyStoresQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MyStoresQuery = { __typename?: 'Query', myStores: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename: 'Bank' } | { __typename: 'Brand' } | { __typename: 'Category' } | { __typename: 'Credit' } | { __typename: 'EarningsTransaction' } | { __typename: 'Inventory' } | { __typename: 'Invoice' } | { __typename: 'MarketplaceListing' } | { __typename: 'PaymentTransaction' } | { __typename: 'Product' } | { __typename: 'Refund' } | { __typename: 'Sale' } | { __typename: 'Store', uuid: any, name: string, phone?: string | null, address?: string | null, isActive: boolean, description?: string | null, businessRegistration?: string | null } | { __typename: 'StoreEarnings' } | { __typename: 'User' } | { __typename: 'UserBankAccount' } | { __typename: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type ProductQueryVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type ProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', uuid: any, name: string, model?: string | null, condition: ProductCondition, costPrice?: number | null, sellingPrice?: number | null, serialNumber?: string | null, description?: string | null, specifications?: any | null, brand: { __typename?: 'Brand', name: string, uuid: any }, images: Array<{ __typename?: 'ProductImage', imageUrl: string }>, category: { __typename?: 'Category', name: string, uuid: any }, store: { __typename?: 'Store', name: string, uuid: any }, inventory?: { __typename?: 'Inventory', quantityAvailable: number, quantityReserved: number, status: InventoryStatus } | null } | null };

export type ProductsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<ProductFilter>;
}>;


export type ProductsQuery = { __typename?: 'Query', products: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Bank' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'Credit' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Inventory' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product', uuid: any, name: string, model?: string | null, condition: ProductCondition, costPrice?: number | null, sellingPrice?: number | null, serialNumber?: string | null, description?: string | null, specifications?: any | null, brand: { __typename?: 'Brand', name: string, uuid: any }, images: Array<{ __typename?: 'ProductImage', imageUrl: string }>, category: { __typename?: 'Category', name: string, uuid: any }, store: { __typename?: 'Store', name: string, uuid: any }, inventory?: { __typename?: 'Inventory', quantityAvailable: number, quantityReserved: number, status: InventoryStatus } | null } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } | { __typename?: 'UserBankAccount' } | { __typename?: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type SalesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<SaleFilter>;
}>;


export type SalesQuery = { __typename?: 'Query', sales: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Bank' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'Credit' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Inventory' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'Refund' } | { __typename?: 'Sale', uuid: any, saleType: SaleType, saleDate: any, saleStatus: SaleStatus, createdAt: any, updatedAt: any, totalAmount: number, paymentStatus: PaymentStatus, customerName: string, customerEmail?: string | null, customerPhone?: string | null, invoices: Array<{ __typename?: 'Invoice', uuid: any, filePath?: string | null }>, items: Array<{ __typename?: 'SaleItem', uuid: any, quantity: number, unitPrice: number, product: { __typename?: 'Product', name: string } }> } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } | { __typename?: 'UserBankAccount' } | { __typename?: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type StoresQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type StoresQuery = { __typename?: 'Query', stores: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Bank' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'Credit' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Inventory' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store', uuid: any, name: string, isActive: boolean } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } | { __typename?: 'UserBankAccount' } | { __typename?: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type UsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  role?: InputMaybe<UserRole>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Bank' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'Credit' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Inventory' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string, assignedStore?: { __typename?: 'Store', uuid: any, name: string } | null } | { __typename?: 'UserBankAccount' } | { __typename?: 'WithdrawalTransaction' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };


export const AssignResellerToStoreDocument = gql`
    mutation AssignResellerToStore($resellerUUID: UUID!, $storeUUID: UUID!) {
  assignResellerToStore(resellerUUID: $resellerUUID, storeUUID: $storeUUID)
}
    `;
export type AssignResellerToStoreMutationFn = Apollo.MutationFunction<AssignResellerToStoreMutation, AssignResellerToStoreMutationVariables>;

/**
 * __useAssignResellerToStoreMutation__
 *
 * To run a mutation, you first call `useAssignResellerToStoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignResellerToStoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignResellerToStoreMutation, { data, loading, error }] = useAssignResellerToStoreMutation({
 *   variables: {
 *      resellerUUID: // value for 'resellerUUID'
 *      storeUUID: // value for 'storeUUID'
 *   },
 * });
 */
export function useAssignResellerToStoreMutation(baseOptions?: Apollo.MutationHookOptions<AssignResellerToStoreMutation, AssignResellerToStoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignResellerToStoreMutation, AssignResellerToStoreMutationVariables>(AssignResellerToStoreDocument, options);
      }
export type AssignResellerToStoreMutationHookResult = ReturnType<typeof useAssignResellerToStoreMutation>;
export type AssignResellerToStoreMutationResult = Apollo.MutationResult<AssignResellerToStoreMutation>;
export type AssignResellerToStoreMutationOptions = Apollo.BaseMutationOptions<AssignResellerToStoreMutation, AssignResellerToStoreMutationVariables>;
export const CompleteInvitationDocument = gql`
    mutation CompleteInvitation($input: CompleteInvitationInput!) {
  completeInvitation(input: $input) {
    twoFactorSecret
    twoFactorQRCodeURL
    challengeToken
    user {
      uuid
      role
      email
      phone
      lastName
      isActive
      firstName
    }
  }
}
    `;
export type CompleteInvitationMutationFn = Apollo.MutationFunction<CompleteInvitationMutation, CompleteInvitationMutationVariables>;

/**
 * __useCompleteInvitationMutation__
 *
 * To run a mutation, you first call `useCompleteInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeInvitationMutation, { data, loading, error }] = useCompleteInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompleteInvitationMutation(baseOptions?: Apollo.MutationHookOptions<CompleteInvitationMutation, CompleteInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteInvitationMutation, CompleteInvitationMutationVariables>(CompleteInvitationDocument, options);
      }
export type CompleteInvitationMutationHookResult = ReturnType<typeof useCompleteInvitationMutation>;
export type CompleteInvitationMutationResult = Apollo.MutationResult<CompleteInvitationMutation>;
export type CompleteInvitationMutationOptions = Apollo.BaseMutationOptions<CompleteInvitationMutation, CompleteInvitationMutationVariables>;
export const CreateBrandDocument = gql`
    mutation CreateBrand($input: BrandInput!) {
  createBrand(input: $input) {
    uuid
    name
    logoUrl
    isActive
    updatedAt
    createdAt
    description
  }
}
    `;
export type CreateBrandMutationFn = Apollo.MutationFunction<CreateBrandMutation, CreateBrandMutationVariables>;

/**
 * __useCreateBrandMutation__
 *
 * To run a mutation, you first call `useCreateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBrandMutation, { data, loading, error }] = useCreateBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBrandMutation(baseOptions?: Apollo.MutationHookOptions<CreateBrandMutation, CreateBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBrandMutation, CreateBrandMutationVariables>(CreateBrandDocument, options);
      }
export type CreateBrandMutationHookResult = ReturnType<typeof useCreateBrandMutation>;
export type CreateBrandMutationResult = Apollo.MutationResult<CreateBrandMutation>;
export type CreateBrandMutationOptions = Apollo.BaseMutationOptions<CreateBrandMutation, CreateBrandMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    uuid
    name
    parent {
      name
    }
    products {
      name
    }
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    uuid
    name
    inventory {
      uuid
    }
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const CreateSaleDocument = gql`
    mutation CreateSale($input: SaleInput!) {
  createSale(input: $input) {
    uuid
    customerName
    customerEmail
    customerPhone
    totalAmount
    paymentTransactions {
      paystackReference
      paystackTransactionId
      paystackAccessCode
      authorizationUrl
      amount
      requestedAmount
      currency
      status
    }
    invoices {
      uuid
      invoiceNumber
    }
    paymentStatus
    saleDate
    createdAt
    updatedAt
    saleStatus
  }
}
    `;
export type CreateSaleMutationFn = Apollo.MutationFunction<CreateSaleMutation, CreateSaleMutationVariables>;

/**
 * __useCreateSaleMutation__
 *
 * To run a mutation, you first call `useCreateSaleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSaleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSaleMutation, { data, loading, error }] = useCreateSaleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSaleMutation(baseOptions?: Apollo.MutationHookOptions<CreateSaleMutation, CreateSaleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSaleMutation, CreateSaleMutationVariables>(CreateSaleDocument, options);
      }
export type CreateSaleMutationHookResult = ReturnType<typeof useCreateSaleMutation>;
export type CreateSaleMutationResult = Apollo.MutationResult<CreateSaleMutation>;
export type CreateSaleMutationOptions = Apollo.BaseMutationOptions<CreateSaleMutation, CreateSaleMutationVariables>;
export const CreateStoreDocument = gql`
    mutation CreateStore($input: StoreInput!) {
  createStore(input: $input) {
    uuid
    name
  }
}
    `;
export type CreateStoreMutationFn = Apollo.MutationFunction<CreateStoreMutation, CreateStoreMutationVariables>;

/**
 * __useCreateStoreMutation__
 *
 * To run a mutation, you first call `useCreateStoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStoreMutation, { data, loading, error }] = useCreateStoreMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStoreMutation(baseOptions?: Apollo.MutationHookOptions<CreateStoreMutation, CreateStoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStoreMutation, CreateStoreMutationVariables>(CreateStoreDocument, options);
      }
export type CreateStoreMutationHookResult = ReturnType<typeof useCreateStoreMutation>;
export type CreateStoreMutationResult = Apollo.MutationResult<CreateStoreMutation>;
export type CreateStoreMutationOptions = Apollo.BaseMutationOptions<CreateStoreMutation, CreateStoreMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    uuid
    email
    isActive
    firstName
    lastName
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteBrandDocument = gql`
    mutation DeleteBrand($uuid: UUID!) {
  deleteBrand(uuid: $uuid)
}
    `;
export type DeleteBrandMutationFn = Apollo.MutationFunction<DeleteBrandMutation, DeleteBrandMutationVariables>;

/**
 * __useDeleteBrandMutation__
 *
 * To run a mutation, you first call `useDeleteBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBrandMutation, { data, loading, error }] = useDeleteBrandMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteBrandMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBrandMutation, DeleteBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBrandMutation, DeleteBrandMutationVariables>(DeleteBrandDocument, options);
      }
export type DeleteBrandMutationHookResult = ReturnType<typeof useDeleteBrandMutation>;
export type DeleteBrandMutationResult = Apollo.MutationResult<DeleteBrandMutation>;
export type DeleteBrandMutationOptions = Apollo.BaseMutationOptions<DeleteBrandMutation, DeleteBrandMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($uuid: UUID!) {
  deleteCategory(uuid: $uuid)
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($uuid: UUID!) {
  deleteProduct(uuid: $uuid)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const DeleteStoreDocument = gql`
    mutation DeleteStore($storeId: UUID!) {
  deleteStore(storeId: $storeId)
}
    `;
export type DeleteStoreMutationFn = Apollo.MutationFunction<DeleteStoreMutation, DeleteStoreMutationVariables>;

/**
 * __useDeleteStoreMutation__
 *
 * To run a mutation, you first call `useDeleteStoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStoreMutation, { data, loading, error }] = useDeleteStoreMutation({
 *   variables: {
 *      storeId: // value for 'storeId'
 *   },
 * });
 */
export function useDeleteStoreMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStoreMutation, DeleteStoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStoreMutation, DeleteStoreMutationVariables>(DeleteStoreDocument, options);
      }
export type DeleteStoreMutationHookResult = ReturnType<typeof useDeleteStoreMutation>;
export type DeleteStoreMutationResult = Apollo.MutationResult<DeleteStoreMutation>;
export type DeleteStoreMutationOptions = Apollo.BaseMutationOptions<DeleteStoreMutation, DeleteStoreMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: UUID!) {
  deleteUser(userId: $userId)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const InitializePaymentDocument = gql`
    mutation InitializePayment($input: PaymentInitializeInput!) {
  initializePayment(input: $input) {
    uuid
    authorizationUrl
    paystackReference
    paystackTransactionId
    paystackAccessCode
    gatewayResponse
    gatewayFees
  }
}
    `;
export type InitializePaymentMutationFn = Apollo.MutationFunction<InitializePaymentMutation, InitializePaymentMutationVariables>;

/**
 * __useInitializePaymentMutation__
 *
 * To run a mutation, you first call `useInitializePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitializePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initializePaymentMutation, { data, loading, error }] = useInitializePaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInitializePaymentMutation(baseOptions?: Apollo.MutationHookOptions<InitializePaymentMutation, InitializePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InitializePaymentMutation, InitializePaymentMutationVariables>(InitializePaymentDocument, options);
      }
export type InitializePaymentMutationHookResult = ReturnType<typeof useInitializePaymentMutation>;
export type InitializePaymentMutationResult = Apollo.MutationResult<InitializePaymentMutation>;
export type InitializePaymentMutationOptions = Apollo.BaseMutationOptions<InitializePaymentMutation, InitializePaymentMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    challengeToken
    user {
      uuid
      role
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

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
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LoginWith2FaDocument = gql`
    mutation LoginWith2FA($challengeToken: String!, $code: String!) {
  loginWith2FA(challengeToken: $challengeToken, code: $code) {
    accessToken
    refreshToken
    challengeToken
  }
}
    `;
export type LoginWith2FaMutationFn = Apollo.MutationFunction<LoginWith2FaMutation, LoginWith2FaMutationVariables>;

/**
 * __useLoginWith2FaMutation__
 *
 * To run a mutation, you first call `useLoginWith2FaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWith2FaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWith2FaMutation, { data, loading, error }] = useLoginWith2FaMutation({
 *   variables: {
 *      challengeToken: // value for 'challengeToken'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginWith2FaMutation(baseOptions?: Apollo.MutationHookOptions<LoginWith2FaMutation, LoginWith2FaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginWith2FaMutation, LoginWith2FaMutationVariables>(LoginWith2FaDocument, options);
      }
export type LoginWith2FaMutationHookResult = ReturnType<typeof useLoginWith2FaMutation>;
export type LoginWith2FaMutationResult = Apollo.MutationResult<LoginWith2FaMutation>;
export type LoginWith2FaMutationOptions = Apollo.BaseMutationOptions<LoginWith2FaMutation, LoginWith2FaMutationVariables>;
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
    }
  }
}
    `;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

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
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const UpdateBrandDocument = gql`
    mutation UpdateBrand($input: BrandInput!, $uuid: UUID!) {
  updateBrand(input: $input, uuid: $uuid) {
    uuid
    name
    logoUrl
    description
  }
}
    `;
export type UpdateBrandMutationFn = Apollo.MutationFunction<UpdateBrandMutation, UpdateBrandMutationVariables>;

/**
 * __useUpdateBrandMutation__
 *
 * To run a mutation, you first call `useUpdateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBrandMutation, { data, loading, error }] = useUpdateBrandMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateBrandMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBrandMutation, UpdateBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBrandMutation, UpdateBrandMutationVariables>(UpdateBrandDocument, options);
      }
export type UpdateBrandMutationHookResult = ReturnType<typeof useUpdateBrandMutation>;
export type UpdateBrandMutationResult = Apollo.MutationResult<UpdateBrandMutation>;
export type UpdateBrandMutationOptions = Apollo.BaseMutationOptions<UpdateBrandMutation, UpdateBrandMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($input: CategoryInput!, $uuid: UUID!) {
  updateCategory(input: $input, uuid: $uuid) {
    uuid
    status
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const UpdateInventoryDocument = gql`
    mutation UpdateInventory($input: InventoryInput!, $uuid: UUID!) {
  updateInventory(input: $input, uuid: $uuid) {
    uuid
    status
  }
}
    `;
export type UpdateInventoryMutationFn = Apollo.MutationFunction<UpdateInventoryMutation, UpdateInventoryMutationVariables>;

/**
 * __useUpdateInventoryMutation__
 *
 * To run a mutation, you first call `useUpdateInventoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInventoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInventoryMutation, { data, loading, error }] = useUpdateInventoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateInventoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInventoryMutation, UpdateInventoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInventoryMutation, UpdateInventoryMutationVariables>(UpdateInventoryDocument, options);
      }
export type UpdateInventoryMutationHookResult = ReturnType<typeof useUpdateInventoryMutation>;
export type UpdateInventoryMutationResult = Apollo.MutationResult<UpdateInventoryMutation>;
export type UpdateInventoryMutationOptions = Apollo.BaseMutationOptions<UpdateInventoryMutation, UpdateInventoryMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: ProductUpdateInput!, $uuid: UUID!) {
  updateProduct(input: $input, uuid: $uuid) {
    uuid
    name
  }
}
    `;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const UpdateStoreDocument = gql`
    mutation UpdateStore($input: StoreInput!, $storeId: UUID!) {
  updateStore(input: $input, storeId: $storeId) {
    uuid
    name
  }
}
    `;
export type UpdateStoreMutationFn = Apollo.MutationFunction<UpdateStoreMutation, UpdateStoreMutationVariables>;

/**
 * __useUpdateStoreMutation__
 *
 * To run a mutation, you first call `useUpdateStoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStoreMutation, { data, loading, error }] = useUpdateStoreMutation({
 *   variables: {
 *      input: // value for 'input'
 *      storeId: // value for 'storeId'
 *   },
 * });
 */
export function useUpdateStoreMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStoreMutation, UpdateStoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStoreMutation, UpdateStoreMutationVariables>(UpdateStoreDocument, options);
      }
export type UpdateStoreMutationHookResult = ReturnType<typeof useUpdateStoreMutation>;
export type UpdateStoreMutationResult = Apollo.MutationResult<UpdateStoreMutation>;
export type UpdateStoreMutationOptions = Apollo.BaseMutationOptions<UpdateStoreMutation, UpdateStoreMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UserInput!, $userId: UUID!) {
  updateUser(input: $input, userId: $userId) {
    uuid
    email
    isActive
    firstName
    lastName
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const VerifyPaymentDocument = gql`
    mutation VerifyPayment($input: PaymentVerifyInput!) {
  verifyPayment(input: $input) {
    uuid
    status
    createdAt
    updatedAt
  }
}
    `;
export type VerifyPaymentMutationFn = Apollo.MutationFunction<VerifyPaymentMutation, VerifyPaymentMutationVariables>;

/**
 * __useVerifyPaymentMutation__
 *
 * To run a mutation, you first call `useVerifyPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyPaymentMutation, { data, loading, error }] = useVerifyPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyPaymentMutation(baseOptions?: Apollo.MutationHookOptions<VerifyPaymentMutation, VerifyPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyPaymentMutation, VerifyPaymentMutationVariables>(VerifyPaymentDocument, options);
      }
export type VerifyPaymentMutationHookResult = ReturnType<typeof useVerifyPaymentMutation>;
export type VerifyPaymentMutationResult = Apollo.MutationResult<VerifyPaymentMutation>;
export type VerifyPaymentMutationOptions = Apollo.BaseMutationOptions<VerifyPaymentMutation, VerifyPaymentMutationVariables>;
export const BrandsDocument = gql`
    query Brands($pagination: PaginationInput) {
  brands(pagination: $pagination) {
    edges {
      node {
        __typename
        ... on Brand {
          uuid
          name
          logoUrl
          isActive
          isOwned
          products {
            uuid
            name
          }
          updatedAt
          createdAt
          description
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useBrandsQuery__
 *
 * To run a query within a React component, call `useBrandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBrandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBrandsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useBrandsQuery(baseOptions?: Apollo.QueryHookOptions<BrandsQuery, BrandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BrandsQuery, BrandsQueryVariables>(BrandsDocument, options);
      }
export function useBrandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BrandsQuery, BrandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BrandsQuery, BrandsQueryVariables>(BrandsDocument, options);
        }
export function useBrandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BrandsQuery, BrandsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BrandsQuery, BrandsQueryVariables>(BrandsDocument, options);
        }
export type BrandsQueryHookResult = ReturnType<typeof useBrandsQuery>;
export type BrandsLazyQueryHookResult = ReturnType<typeof useBrandsLazyQuery>;
export type BrandsSuspenseQueryHookResult = ReturnType<typeof useBrandsSuspenseQuery>;
export type BrandsQueryResult = Apollo.QueryResult<BrandsQuery, BrandsQueryVariables>;
export const CategoriesDocument = gql`
    query Categories($pagination: PaginationInput) {
  categories(pagination: $pagination) {
    edges {
      node {
        __typename
        ... on Category {
          uuid
          name
          description
          createdAt
          status
          isOwned
          parent {
            name
          }
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesSuspenseQueryHookResult = ReturnType<typeof useCategoriesSuspenseQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const FinancialDashboardDocument = gql`
    query FinancialDashboard($storeId: Int) {
  financialDashboard(storeId: $storeId)
}
    `;

/**
 * __useFinancialDashboardQuery__
 *
 * To run a query within a React component, call `useFinancialDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useFinancialDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFinancialDashboardQuery({
 *   variables: {
 *      storeId: // value for 'storeId'
 *   },
 * });
 */
export function useFinancialDashboardQuery(baseOptions?: Apollo.QueryHookOptions<FinancialDashboardQuery, FinancialDashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FinancialDashboardQuery, FinancialDashboardQueryVariables>(FinancialDashboardDocument, options);
      }
export function useFinancialDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FinancialDashboardQuery, FinancialDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FinancialDashboardQuery, FinancialDashboardQueryVariables>(FinancialDashboardDocument, options);
        }
export function useFinancialDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FinancialDashboardQuery, FinancialDashboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FinancialDashboardQuery, FinancialDashboardQueryVariables>(FinancialDashboardDocument, options);
        }
export type FinancialDashboardQueryHookResult = ReturnType<typeof useFinancialDashboardQuery>;
export type FinancialDashboardLazyQueryHookResult = ReturnType<typeof useFinancialDashboardLazyQuery>;
export type FinancialDashboardSuspenseQueryHookResult = ReturnType<typeof useFinancialDashboardSuspenseQuery>;
export type FinancialDashboardQueryResult = Apollo.QueryResult<FinancialDashboardQuery, FinancialDashboardQueryVariables>;
export const InventoryDocument = gql`
    query Inventory($pagination: PaginationInput, $storeUuid: UUID!) {
  inventory(pagination: $pagination, storeUuid: $storeUuid) {
    edges {
      node {
        ... on Inventory {
          uuid
          quantityAvailable
          quantityReserved
          status
          lastUpdated
          createdAt
          updatedAt
          product {
            uuid
            name
            brand {
              name
              uuid
            }
            model
            condition
            costPrice
            sellingPrice
            serialNumber
            description
            specifications
          }
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useInventoryQuery__
 *
 * To run a query within a React component, call `useInventoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useInventoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInventoryQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      storeUuid: // value for 'storeUuid'
 *   },
 * });
 */
export function useInventoryQuery(baseOptions: Apollo.QueryHookOptions<InventoryQuery, InventoryQueryVariables> & ({ variables: InventoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryQuery, InventoryQueryVariables>(InventoryDocument, options);
      }
export function useInventoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryQuery, InventoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryQuery, InventoryQueryVariables>(InventoryDocument, options);
        }
export function useInventorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InventoryQuery, InventoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InventoryQuery, InventoryQueryVariables>(InventoryDocument, options);
        }
export type InventoryQueryHookResult = ReturnType<typeof useInventoryQuery>;
export type InventoryLazyQueryHookResult = ReturnType<typeof useInventoryLazyQuery>;
export type InventorySuspenseQueryHookResult = ReturnType<typeof useInventorySuspenseQuery>;
export type InventoryQueryResult = Apollo.QueryResult<InventoryQuery, InventoryQueryVariables>;
export const InvoiceDocument = gql`
    query Invoice($invoiceId: UUID!) {
  invoice(invoiceId: $invoiceId) {
    uuid
    filePath
    sale {
      items {
        product {
          name
          model
          condition
          specifications
        }
      }
    }
  }
}
    `;

/**
 * __useInvoiceQuery__
 *
 * To run a query within a React component, call `useInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvoiceQuery({
 *   variables: {
 *      invoiceId: // value for 'invoiceId'
 *   },
 * });
 */
export function useInvoiceQuery(baseOptions: Apollo.QueryHookOptions<InvoiceQuery, InvoiceQueryVariables> & ({ variables: InvoiceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvoiceQuery, InvoiceQueryVariables>(InvoiceDocument, options);
      }
export function useInvoiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvoiceQuery, InvoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvoiceQuery, InvoiceQueryVariables>(InvoiceDocument, options);
        }
export function useInvoiceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InvoiceQuery, InvoiceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InvoiceQuery, InvoiceQueryVariables>(InvoiceDocument, options);
        }
export type InvoiceQueryHookResult = ReturnType<typeof useInvoiceQuery>;
export type InvoiceLazyQueryHookResult = ReturnType<typeof useInvoiceLazyQuery>;
export type InvoiceSuspenseQueryHookResult = ReturnType<typeof useInvoiceSuspenseQuery>;
export type InvoiceQueryResult = Apollo.QueryResult<InvoiceQuery, InvoiceQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
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
      uuid
      name
      phone
      businessRegistration
      description
      address
      isActive
    }
    createdByMe
    assignedStore {
      uuid
      name
      address
      phone
      isActive
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MyStoresDocument = gql`
    query MyStores($pagination: PaginationInput) {
  myStores(pagination: $pagination) {
    edges {
      node {
        __typename
        ... on Store {
          uuid
          name
          phone
          address
          isActive
          description
          businessRegistration
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useMyStoresQuery__
 *
 * To run a query within a React component, call `useMyStoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyStoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyStoresQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useMyStoresQuery(baseOptions?: Apollo.QueryHookOptions<MyStoresQuery, MyStoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyStoresQuery, MyStoresQueryVariables>(MyStoresDocument, options);
      }
export function useMyStoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyStoresQuery, MyStoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyStoresQuery, MyStoresQueryVariables>(MyStoresDocument, options);
        }
export function useMyStoresSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyStoresQuery, MyStoresQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyStoresQuery, MyStoresQueryVariables>(MyStoresDocument, options);
        }
export type MyStoresQueryHookResult = ReturnType<typeof useMyStoresQuery>;
export type MyStoresLazyQueryHookResult = ReturnType<typeof useMyStoresLazyQuery>;
export type MyStoresSuspenseQueryHookResult = ReturnType<typeof useMyStoresSuspenseQuery>;
export type MyStoresQueryResult = Apollo.QueryResult<MyStoresQuery, MyStoresQueryVariables>;
export const ProductDocument = gql`
    query Product($uuid: UUID!) {
  product(uuid: $uuid) {
    uuid
    name
    brand {
      name
      uuid
    }
    model
    images {
      imageUrl
    }
    category {
      name
      uuid
    }
    store {
      name
      uuid
    }
    condition
    costPrice
    sellingPrice
    serialNumber
    description
    specifications
    inventory {
      quantityAvailable
      quantityReserved
      status
    }
  }
}
    `;

/**
 * __useProductQuery__
 *
 * To run a query within a React component, call `useProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useProductQuery(baseOptions: Apollo.QueryHookOptions<ProductQuery, ProductQueryVariables> & ({ variables: ProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
      }
export function useProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
        }
export function useProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
        }
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductSuspenseQueryHookResult = ReturnType<typeof useProductSuspenseQuery>;
export type ProductQueryResult = Apollo.QueryResult<ProductQuery, ProductQueryVariables>;
export const ProductsDocument = gql`
    query Products($pagination: PaginationInput, $filter: ProductFilter) {
  products(pagination: $pagination, filter: $filter) {
    edges {
      node {
        ... on Product {
          uuid
          name
          brand {
            name
            uuid
          }
          model
          images {
            imageUrl
          }
          category {
            name
            uuid
          }
          store {
            name
            uuid
          }
          condition
          costPrice
          sellingPrice
          serialNumber
          description
          specifications
          inventory {
            quantityAvailable
            quantityReserved
            status
          }
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useProductsQuery(baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export function useProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsSuspenseQueryHookResult = ReturnType<typeof useProductsSuspenseQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const SalesDocument = gql`
    query Sales($pagination: PaginationInput, $filter: SaleFilter) {
  sales(pagination: $pagination, filter: $filter) {
    edges {
      node {
        ... on Sale {
          uuid
          saleType
          invoices {
            uuid
            filePath
          }
          saleDate
          saleStatus
          createdAt
          updatedAt
          totalAmount
          paymentStatus
          customerName
          customerEmail
          customerPhone
          items {
            uuid
            quantity
            unitPrice
            product {
              name
            }
          }
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useSalesQuery__
 *
 * To run a query within a React component, call `useSalesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSalesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSalesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useSalesQuery(baseOptions?: Apollo.QueryHookOptions<SalesQuery, SalesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SalesQuery, SalesQueryVariables>(SalesDocument, options);
      }
export function useSalesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SalesQuery, SalesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SalesQuery, SalesQueryVariables>(SalesDocument, options);
        }
export function useSalesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SalesQuery, SalesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SalesQuery, SalesQueryVariables>(SalesDocument, options);
        }
export type SalesQueryHookResult = ReturnType<typeof useSalesQuery>;
export type SalesLazyQueryHookResult = ReturnType<typeof useSalesLazyQuery>;
export type SalesSuspenseQueryHookResult = ReturnType<typeof useSalesSuspenseQuery>;
export type SalesQueryResult = Apollo.QueryResult<SalesQuery, SalesQueryVariables>;
export const StoresDocument = gql`
    query Stores($pagination: PaginationInput) {
  stores(pagination: $pagination) {
    edges {
      node {
        ... on Store {
          uuid
          name
          isActive
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useStoresQuery__
 *
 * To run a query within a React component, call `useStoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoresQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useStoresQuery(baseOptions?: Apollo.QueryHookOptions<StoresQuery, StoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StoresQuery, StoresQueryVariables>(StoresDocument, options);
      }
export function useStoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StoresQuery, StoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StoresQuery, StoresQueryVariables>(StoresDocument, options);
        }
export function useStoresSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StoresQuery, StoresQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StoresQuery, StoresQueryVariables>(StoresDocument, options);
        }
export type StoresQueryHookResult = ReturnType<typeof useStoresQuery>;
export type StoresLazyQueryHookResult = ReturnType<typeof useStoresLazyQuery>;
export type StoresSuspenseQueryHookResult = ReturnType<typeof useStoresSuspenseQuery>;
export type StoresQueryResult = Apollo.QueryResult<StoresQuery, StoresQueryVariables>;
export const UsersDocument = gql`
    query Users($pagination: PaginationInput, $role: UserRole) {
  users(pagination: $pagination, role: $role) {
    edges {
      node {
        ... on User {
          uuid
          role
          email
          phone
          lastName
          isActive
          firstName
          assignedStore {
            uuid
            name
          }
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;