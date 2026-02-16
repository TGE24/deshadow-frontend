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

export type Accessory = {
  __typename?: 'Accessory';
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Time']['output'];
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  sellingPrice?: Maybe<Scalars['Float']['output']>;
  store: Store;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type AccessoryFilter = {
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<AccessorySortField>;
  sortOrder?: InputMaybe<SortOrder>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export type AccessoryInput = {
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  sellingPrice?: InputMaybe<Scalars['Float']['input']>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export type AccessorySaleInput = {
  productUuid: Scalars['UUID']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export enum AccessorySortField {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  Quantity = 'QUANTITY',
  UpdatedAt = 'UPDATED_AT'
}

export type AccessoryUpdateInput = {
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  sellingPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type Attribute = {
  __typename?: 'Attribute';
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type AttributeInput = {
  name: Scalars['String']['input'];
};

export type AttributeUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  challengeToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
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

export type GivenProductAttributeValueInput = {
  attributeUuid: Scalars['UUID']['input'];
  valueText: Scalars['String']['input'];
};

export type InvitationPayload = {
  __typename?: 'InvitationPayload';
  challengeToken: Scalars['String']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  assignAttributesToProduct: Scalars['Boolean']['output'];
  assignResellerToStore: Scalars['Boolean']['output'];
  changePassword: PasswordResetResponse;
  completeInvitation: InvitationPayload;
  createAccessory: Accessory;
  createAttribute: Attribute;
  createBrand: Brand;
  createCategory: Category;
  createProduct: Product;
  createProductItem: ProductItem;
  createReturn: Return;
  createSale: Sale;
  createStore: Store;
  createUser: User;
  deleteAccessory: Scalars['Boolean']['output'];
  deleteAttribute: Scalars['Boolean']['output'];
  deleteBrand: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductItem: Scalars['Boolean']['output'];
  deleteProductItemAttributeValue: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthPayload;
  loginWith2FA: AuthPayload;
  processRefund: Refund;
  processReturn: Return;
  refreshToken: AuthPayload;
  requestPasswordReset: PasswordResetResponse;
  resendInvitation: PasswordResetResponse;
  resendOTP: PasswordResetResponse;
  resetPassword: PasswordResetResponse;
  setProductItemAttributeValues: ProductItemAttributeValue;
  unassignAttributeFromProduct: Scalars['Boolean']['output'];
  unassignResellerFromStore: Scalars['Boolean']['output'];
  updateAccessory: Accessory;
  updateAttribute: Attribute;
  updateBrand: Brand;
  updateCategory: Category;
  updateProduct: Product;
  updateProductItem: ProductItem;
  updateSaleItemFulfillmentStatus: SaleItem;
  updateSaleStatus: Sale;
  updateStore: Store;
  updateUser: User;
};


export type MutationAssignAttributesToProductArgs = {
  attributeUuids: Array<Scalars['UUID']['input']>;
  productUuid: Scalars['UUID']['input'];
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


export type MutationCreateAccessoryArgs = {
  input: AccessoryInput;
};


export type MutationCreateAttributeArgs = {
  input: AttributeInput;
};


export type MutationCreateBrandArgs = {
  input: BrandInput;
  storeUUID?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationCreateCategoryArgs = {
  input: CategoryInput;
  storeUUID?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationCreateProductItemArgs = {
  input: ProductItemInput;
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


export type MutationDeleteAccessoryArgs = {
  uuid: Scalars['UUID']['input'];
};


export type MutationDeleteAttributeArgs = {
  uuid: Scalars['UUID']['input'];
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


export type MutationDeleteProductItemArgs = {
  uuid: Scalars['UUID']['input'];
};


export type MutationDeleteProductItemAttributeValueArgs = {
  attributeUuid: Scalars['UUID']['input'];
  productItemUuid: Scalars['UUID']['input'];
};


export type MutationDeleteStoreArgs = {
  storeId: Scalars['UUID']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['UUID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLoginWith2FaArgs = {
  challengeToken: Scalars['String']['input'];
  code: Scalars['String']['input'];
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


export type MutationResendInvitationArgs = {
  userUuid: Scalars['UUID']['input'];
};


export type MutationResendOtpArgs = {
  challengeToken: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSetProductItemAttributeValuesArgs = {
  inputs: Array<ProductItemAttributeValueInput>;
};


export type MutationUnassignAttributeFromProductArgs = {
  attributeUuid: Scalars['UUID']['input'];
  productUuid: Scalars['UUID']['input'];
};


export type MutationUnassignResellerFromStoreArgs = {
  resellerUUID: Scalars['UUID']['input'];
};


export type MutationUpdateAccessoryArgs = {
  input: AccessoryUpdateInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateAttributeArgs = {
  input: AttributeUpdateInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateBrandArgs = {
  input: BrandInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateCategoryArgs = {
  input: CategoryInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateProductArgs = {
  input: ProductUpdateInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateProductItemArgs = {
  input: ProductItemUpdateInput;
  uuid: Scalars['UUID']['input'];
};


export type MutationUpdateSaleItemFulfillmentStatusArgs = {
  saleItemUuid: Scalars['UUID']['input'];
  status: SaleItemFulfillmentStatus;
};


export type MutationUpdateSaleStatusArgs = {
  paymentType?: InputMaybe<PaymentType>;
  status: SaleStatus;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
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

export type Node = Accessory | Attribute | Brand | Category | EarningsTransaction | Invoice | MarketplaceListing | PaymentTransaction | Product | ProductItem | Refund | Sale | Store | StoreEarnings | User;

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

export enum PaymentStatus {
  Paid = 'paid',
  Partial = 'partial',
  Pending = 'pending'
}

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['Float']['output'];
  channel?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  currency: Scalars['String']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerPhone?: Maybe<Scalars['String']['output']>;
  gatewayFees: Scalars['Float']['output'];
  gatewayResponse?: Maybe<Scalars['JSON']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  manualReference?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['Time']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  refunds: Array<Refund>;
  requestedAmount?: Maybe<Scalars['Float']['output']>;
  sale: Sale;
  status: PaymentTransactionStatus;
  updatedAt: Scalars['Time']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['UUID']['output'];
};

export enum PaymentTransactionStatus {
  Cancelled = 'cancelled',
  Failed = 'failed',
  Success = 'success'
}

export enum PaymentType {
  Cash = 'cash',
  CashTransfer = 'cash_transfer',
  Pos = 'pos',
  PosCash = 'pos_cash',
  PosTransfer = 'pos_transfer',
  Transfer = 'transfer'
}

export type Product = {
  __typename?: 'Product';
  attributes: Array<Attribute>;
  availableItemsCount: Scalars['Int']['output'];
  brand: Brand;
  category: Category;
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isOwned: Scalars['Boolean']['output'];
  items: Array<ProductItem>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  saleItems: Array<SaleItem>;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export enum ProductCondition {
  NewActive = 'new_active',
  NewLocked = 'new_locked',
  NewNonActive = 'new_non_active',
  NewSealedBox = 'new_sealed_box',
  NigeriaUsed = 'nigeria_used',
  UkUsed = 'uk_used',
  UsedLocked = 'used_locked'
}

export type ProductFilter = {
  brandUuid?: InputMaybe<Scalars['UUID']['input']>;
  categoryUuid?: InputMaybe<Scalars['UUID']['input']>;
  condition?: InputMaybe<ProductCondition>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<ProductSortField>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  imageUrl: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  productItem: ProductItem;
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type ProductInput = {
  brandUuid: Scalars['UUID']['input'];
  categoryUuid: Scalars['UUID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ProductItem = {
  __typename?: 'ProductItem';
  attributeValues: Array<ProductItemAttributeValue>;
  condition: ProductCondition;
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Time']['output'];
  externalStoreAddress?: Maybe<Scalars['String']['output']>;
  externalStoreContact?: Maybe<Scalars['String']['output']>;
  externalStoreName?: Maybe<Scalars['String']['output']>;
  images: Array<ProductImage>;
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  sellingPrice?: Maybe<Scalars['Float']['output']>;
  serialNumber: Scalars['String']['output'];
  status: ProductItemStatus;
  store: Store;
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type ProductItemAttributeValue = {
  __typename?: 'ProductItemAttributeValue';
  attribute: Attribute;
  valueText?: Maybe<Scalars['String']['output']>;
};

export type ProductItemAttributeValueInput = {
  attributeUuid: Scalars['UUID']['input'];
  productItemUuid: Scalars['UUID']['input'];
  valueText?: InputMaybe<Scalars['String']['input']>;
};

export type ProductItemFilter = {
  conditions?: InputMaybe<Array<ProductCondition>>;
  externalStoreOnly?: InputMaybe<Scalars['Boolean']['input']>;
  productUuid?: InputMaybe<Scalars['UUID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProductItemStatus>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export type ProductItemInput = {
  condition: ProductCondition;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  externalStoreAddress?: InputMaybe<Scalars['String']['input']>;
  externalStoreContact?: InputMaybe<Scalars['String']['input']>;
  externalStoreName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  productUuid: Scalars['UUID']['input'];
  sellingPrice?: InputMaybe<Scalars['Float']['input']>;
  serialNumber: Scalars['String']['input'];
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
};

export enum ProductItemStatus {
  Available = 'available',
  Damaged = 'damaged',
  Pending = 'pending',
  Reserved = 'reserved',
  Returned = 'returned',
  Sold = 'sold'
}

export type ProductItemUpdateInput = {
  condition?: InputMaybe<ProductCondition>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  externalStoreAddress?: InputMaybe<Scalars['String']['input']>;
  externalStoreContact?: InputMaybe<Scalars['String']['input']>;
  externalStoreName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  sellingPrice?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
};

export enum ProductSortField {
  CreatedAt = 'CREATED_AT',
  ItemsCount = 'ITEMS_COUNT',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT'
}

export type ProductUpdateInput = {
  brandUuid?: InputMaybe<Scalars['UUID']['input']>;
  categoryUuid?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  accessories: PaginatedResponse;
  accessory?: Maybe<Accessory>;
  attribute?: Maybe<Attribute>;
  attributes: PaginatedResponse;
  brand?: Maybe<Brand>;
  brands: PaginatedResponse;
  categories: PaginatedResponse;
  category?: Maybe<Category>;
  conditionSummary: Scalars['JSON']['output'];
  financialDashboard: Scalars['JSON']['output'];
  invoice?: Maybe<Invoice>;
  invoiceStats: Scalars['JSON']['output'];
  invoicesBySale: PaginatedResponse;
  marketplaceListing?: Maybe<MarketplaceListing>;
  marketplaceListings: PaginatedResponse;
  me: User;
  myEarningsTransactions: PaginatedResponse;
  myTotalEarnings: Scalars['Float']['output'];
  paymentStats: Scalars['JSON']['output'];
  paymentTransaction?: Maybe<PaymentTransaction>;
  paymentTransactionsBySale: PaginatedResponse;
  product?: Maybe<Product>;
  productItem?: Maybe<ProductItem>;
  productItems: PaginatedResponse;
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


export type QueryAccessoriesArgs = {
  filter?: InputMaybe<AccessoryFilter>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryAccessoryArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryAttributeArgs = {
  uuid: Scalars['UUID']['input'];
};


export type QueryAttributesArgs = {
  pagination?: InputMaybe<PaginationInput>;
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


export type QueryConditionSummaryArgs = {
  endDate?: InputMaybe<Scalars['Time']['input']>;
  startDate?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryFinancialDashboardArgs = {
  storeId?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryProductItemArgs = {
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryProductItemsArgs = {
  filter?: InputMaybe<ProductItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
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
  createdBy?: Maybe<User>;
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerName: Scalars['String']['output'];
  customerPhone?: Maybe<Scalars['String']['output']>;
  discountAmount: Scalars['Float']['output'];
  invoices: Array<Invoice>;
  items: Array<SaleItem>;
  notes?: Maybe<Scalars['String']['output']>;
  paymentStatus: PaymentStatus;
  paymentTransactions: Array<PaymentTransaction>;
  paymentType: PaymentType;
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
  saleTypes?: InputMaybe<Array<SaleType>>;
  search?: InputMaybe<Scalars['String']['input']>;
  storeUuid?: InputMaybe<Scalars['UUID']['input']>;
  toDate?: InputMaybe<Scalars['Time']['input']>;
};

export type SaleInput = {
  accessories?: InputMaybe<Array<AccessorySaleInput>>;
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  customerName: Scalars['String']['input'];
  customerPhone?: InputMaybe<Scalars['String']['input']>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  givenProductAttributeValues?: InputMaybe<Array<GivenProductAttributeValueInput>>;
  givenProductCondition?: InputMaybe<ProductCondition>;
  givenProductSerialNumber?: InputMaybe<Scalars['String']['input']>;
  givenProductUuid?: InputMaybe<Scalars['UUID']['input']>;
  givenProductValue?: InputMaybe<Scalars['Float']['input']>;
  items?: InputMaybe<Array<SaleItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentType?: InputMaybe<PaymentType>;
  saleType: SaleType;
  storeUuid: Scalars['UUID']['input'];
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type SaleItem = {
  __typename?: 'SaleItem';
  accessory?: Maybe<Accessory>;
  createdAt: Scalars['Time']['output'];
  fulfillmentStatus: SaleItemFulfillmentStatus;
  lineTotal: Scalars['Float']['output'];
  product?: Maybe<Product>;
  productItem?: Maybe<ProductItem>;
  quantity: Scalars['Int']['output'];
  sale: Sale;
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export enum SaleItemFulfillmentStatus {
  Delivered = 'delivered',
  Pending = 'pending',
  Returned = 'returned'
}

export type SaleItemInput = {
  serialNumber: Scalars['String']['input'];
  unitPrice: Scalars['Float']['input'];
};

export enum SaleStatus {
  Completed = 'completed',
  Pending = 'pending',
  Returned = 'returned'
}

export enum SaleType {
  Credit = 'credit',
  Direct = 'direct',
  Swap = 'swap'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Store = {
  __typename?: 'Store';
  address?: Maybe<Scalars['String']['output']>;
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
  store: Store;
  totalSalesAmount: Scalars['Float']['output'];
  totalWithdrawn: Scalars['Float']['output'];
  updatedAt: Scalars['Time']['output'];
  uuid: Scalars['UUID']['output'];
};

export type StoreInput = {
  address?: InputMaybe<Scalars['String']['input']>;
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
  businessName?: Maybe<Scalars['String']['output']>;
  businessRegistration?: Maybe<Scalars['String']['output']>;
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

export type UserInput = {
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessRegistration?: InputMaybe<Scalars['String']['input']>;
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

export type AssignAttributesToProductMutationVariables = Exact<{
  attributeUuids: Array<Scalars['UUID']['input']> | Scalars['UUID']['input'];
  productUuid: Scalars['UUID']['input'];
}>;


export type AssignAttributesToProductMutation = { __typename?: 'Mutation', assignAttributesToProduct: boolean };

export type AssignResellerToStoreMutationVariables = Exact<{
  resellerUUID: Scalars['UUID']['input'];
  storeUUID: Scalars['UUID']['input'];
}>;


export type AssignResellerToStoreMutation = { __typename?: 'Mutation', assignResellerToStore: boolean };

export type CompleteInvitationMutationVariables = Exact<{
  input: CompleteInvitationInput;
}>;


export type CompleteInvitationMutation = { __typename?: 'Mutation', completeInvitation: { __typename?: 'InvitationPayload', challengeToken: string, user: { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string } } };

export type CreateAccessoryMutationVariables = Exact<{
  input: AccessoryInput;
}>;


export type CreateAccessoryMutation = { __typename?: 'Mutation', createAccessory: { __typename?: 'Accessory', uuid: any } };

export type CreateAttributeMutationVariables = Exact<{
  input: AttributeInput;
}>;


export type CreateAttributeMutation = { __typename?: 'Mutation', createAttribute: { __typename?: 'Attribute', uuid: any, name: string } };

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


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', uuid: any, name: string } };

export type CreateProductItemMutationVariables = Exact<{
  input: ProductItemInput;
}>;


export type CreateProductItemMutation = { __typename?: 'Mutation', createProductItem: { __typename?: 'ProductItem', uuid: any, serialNumber: string, condition: ProductCondition } };

export type CreateSaleMutationVariables = Exact<{
  input: SaleInput;
}>;


export type CreateSaleMutation = { __typename?: 'Mutation', createSale: { __typename?: 'Sale', uuid: any, customerName: string, customerEmail?: string | null, customerPhone?: string | null, totalAmount: number, paymentStatus: PaymentStatus, saleDate: any, createdAt: any, updatedAt: any, saleStatus: SaleStatus, paymentTransactions: Array<{ __typename?: 'PaymentTransaction', amount: number, requestedAmount?: number | null, currency: string, status: PaymentTransactionStatus, manualReference?: string | null }>, invoices: Array<{ __typename?: 'Invoice', uuid: any, invoiceNumber: string }> } };

export type CreateStoreMutationVariables = Exact<{
  input: StoreInput;
}>;


export type CreateStoreMutation = { __typename?: 'Mutation', createStore: { __typename?: 'Store', uuid: any, name: string } };

export type CreateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', uuid: any, email: string, isActive: boolean, firstName: string, lastName: string } };

export type DeleteAccessoryMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type DeleteAccessoryMutation = { __typename?: 'Mutation', deleteAccessory: boolean };

export type DeleteAttributeMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type DeleteAttributeMutation = { __typename?: 'Mutation', deleteAttribute: boolean };

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

export type DeleteProductItemMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type DeleteProductItemMutation = { __typename?: 'Mutation', deleteProductItem: boolean };

export type DeleteStoreMutationVariables = Exact<{
  storeId: Scalars['UUID']['input'];
}>;


export type DeleteStoreMutation = { __typename?: 'Mutation', deleteStore: boolean };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

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

export type RequestPasswordResetMutationVariables = Exact<{
  input: RequestPasswordResetInput;
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'PasswordResetResponse', success: boolean } };

export type ResendInvitationMutationVariables = Exact<{
  userUuid: Scalars['UUID']['input'];
}>;


export type ResendInvitationMutation = { __typename?: 'Mutation', resendInvitation: { __typename?: 'PasswordResetResponse', success: boolean } };

export type ResendOtpMutationVariables = Exact<{
  challengeToken: Scalars['String']['input'];
}>;


export type ResendOtpMutation = { __typename?: 'Mutation', resendOTP: { __typename?: 'PasswordResetResponse', success: boolean, message: string } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'PasswordResetResponse', success: boolean, message: string } };

export type SetProductItemAttributeValuesMutationVariables = Exact<{
  inputs: Array<ProductItemAttributeValueInput> | ProductItemAttributeValueInput;
}>;


export type SetProductItemAttributeValuesMutation = { __typename?: 'Mutation', setProductItemAttributeValues: { __typename?: 'ProductItemAttributeValue', valueText?: string | null, attribute: { __typename?: 'Attribute', uuid: any, name: string } } };

export type UpdateAccessoryMutationVariables = Exact<{
  input: AccessoryUpdateInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateAccessoryMutation = { __typename?: 'Mutation', updateAccessory: { __typename?: 'Accessory', uuid: any } };

export type UpdateAttributeMutationVariables = Exact<{
  input: AttributeUpdateInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateAttributeMutation = { __typename?: 'Mutation', updateAttribute: { __typename?: 'Attribute', uuid: any, name: string } };

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

export type UpdateProductMutationVariables = Exact<{
  input: ProductUpdateInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', uuid: any, name: string } };

export type UpdateProductItemMutationVariables = Exact<{
  input: ProductItemUpdateInput;
  uuid: Scalars['UUID']['input'];
}>;


export type UpdateProductItemMutation = { __typename?: 'Mutation', updateProductItem: { __typename?: 'ProductItem', uuid: any } };

export type UpdateSaleItemFulfillmentStatusMutationVariables = Exact<{
  saleItemUuid: Scalars['UUID']['input'];
  status: SaleItemFulfillmentStatus;
}>;


export type UpdateSaleItemFulfillmentStatusMutation = { __typename?: 'Mutation', updateSaleItemFulfillmentStatus: { __typename?: 'SaleItem', uuid: any } };

export type UpdateSaleStatusMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
  status: SaleStatus;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentType?: InputMaybe<PaymentType>;
}>;


export type UpdateSaleStatusMutation = { __typename?: 'Mutation', updateSaleStatus: { __typename?: 'Sale', uuid: any } };

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

export type AccessoriesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<AccessoryFilter>;
}>;


export type AccessoriesQuery = { __typename?: 'Query', accessories: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory', uuid: any, name: string, quantity: number, costPrice?: number | null, sellingPrice?: number | null, createdAt: any, updatedAt: any, store: { __typename?: 'Store', uuid: any, name: string } } | { __typename?: 'Attribute' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'ProductItem' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type AttributesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type AttributesQuery = { __typename?: 'Query', attributes: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory' } | { __typename?: 'Attribute', uuid: any, name: string, description?: string | null, createdAt: any, updatedAt: any } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'ProductItem' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type BrandsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type BrandsQuery = { __typename?: 'Query', brands: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename: 'Accessory' } | { __typename: 'Attribute' } | { __typename: 'Brand', uuid: any, name: string, logoUrl?: string | null, isActive: boolean, isOwned: boolean, updatedAt: any, createdAt: any, description?: string | null, products: Array<{ __typename?: 'Product', uuid: any, name: string }> } | { __typename: 'Category' } | { __typename: 'EarningsTransaction' } | { __typename: 'Invoice' } | { __typename: 'MarketplaceListing' } | { __typename: 'PaymentTransaction' } | { __typename: 'Product' } | { __typename: 'ProductItem' } | { __typename: 'Refund' } | { __typename: 'Sale' } | { __typename: 'Store' } | { __typename: 'StoreEarnings' } | { __typename: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type CategoriesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename: 'Accessory' } | { __typename: 'Attribute' } | { __typename: 'Brand' } | { __typename: 'Category', uuid: any, name: string, description?: string | null, createdAt: any, status: CategoryStatus, isOwned: boolean, parent?: { __typename?: 'Category', name: string } | null } | { __typename: 'EarningsTransaction' } | { __typename: 'Invoice' } | { __typename: 'MarketplaceListing' } | { __typename: 'PaymentTransaction' } | { __typename: 'Product' } | { __typename: 'ProductItem' } | { __typename: 'Refund' } | { __typename: 'Sale' } | { __typename: 'Store' } | { __typename: 'StoreEarnings' } | { __typename: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type ConditionSummaryQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['Time']['input']>;
  endDate?: InputMaybe<Scalars['Time']['input']>;
}>;


export type ConditionSummaryQuery = { __typename?: 'Query', conditionSummary: any };

export type FinancialDashboardQueryVariables = Exact<{
  storeId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FinancialDashboardQuery = { __typename?: 'Query', financialDashboard: any };

export type InvoiceQueryVariables = Exact<{
  invoiceId: Scalars['UUID']['input'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice?: { __typename?: 'Invoice', uuid: any, filePath?: string | null, sale: { __typename?: 'Sale', customerName: string, customerEmail?: string | null, customerPhone?: string | null, saleType: SaleType, paymentType: PaymentType, totalAmount: number, discountAmount: number, paymentStatus: PaymentStatus, saleStatus: SaleStatus, saleDate: any, items: Array<{ __typename?: 'SaleItem', product?: { __typename?: 'Product', name: string, model?: string | null } | null }> } } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string, createdAt: any, updatedAt: any, createdByMe?: boolean | null, ownedStores: Array<{ __typename?: 'Store', uuid: any, name: string, phone?: string | null, description?: string | null, address?: string | null, isActive: boolean }>, assignedStore?: { __typename?: 'Store', uuid: any, name: string, address?: string | null, phone?: string | null, isActive: boolean, createdAt: any, updatedAt: any } | null } };

export type ProductQueryVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type ProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', uuid: any, name: string, model?: string | null, description?: string | null, brand: { __typename?: 'Brand', name: string, uuid: any }, category: { __typename?: 'Category', name: string, uuid: any }, items: Array<{ __typename?: 'ProductItem', uuid: any, serialNumber: string, condition: ProductCondition, status: ProductItemStatus }>, attributes: Array<{ __typename?: 'Attribute', uuid: any, name: string }> } | null };

export type ProductItemQueryVariables = Exact<{
  uuid?: InputMaybe<Scalars['UUID']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProductItemQuery = { __typename?: 'Query', productItem?: { __typename?: 'ProductItem', uuid: any, condition: ProductCondition, status: ProductItemStatus, costPrice?: number | null, sellingPrice?: number | null, serialNumber: string, notes?: string | null, product: { __typename?: 'Product', name: string }, store: { __typename?: 'Store', uuid: any, name: string, address?: string | null }, images: Array<{ __typename?: 'ProductImage', uuid: any, imageUrl: string, altText?: string | null, isPrimary: boolean, sortOrder: number, createdAt: any, updatedAt: any }>, attributeValues: Array<{ __typename?: 'ProductItemAttributeValue', valueText?: string | null, attribute: { __typename?: 'Attribute', name: string, uuid: any } }> } | null };

export type ProductItemsQueryVariables = Exact<{
  filter?: InputMaybe<ProductItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ProductItemsQuery = { __typename?: 'Query', productItems: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory' } | { __typename?: 'Attribute' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'ProductItem', uuid: any, serialNumber: string, condition: ProductCondition, status: ProductItemStatus, costPrice?: number | null, sellingPrice?: number | null, externalStoreName?: string | null, notes?: string | null, store: { __typename?: 'Store', name: string, uuid: any }, attributeValues: Array<{ __typename?: 'ProductItemAttributeValue', valueText?: string | null, attribute: { __typename?: 'Attribute', name: string, uuid: any } }>, images: Array<{ __typename?: 'ProductImage', uuid: any, imageUrl: string, altText?: string | null, isPrimary: boolean, sortOrder: number, createdAt: any, updatedAt: any }>, product: { __typename?: 'Product', availableItemsCount: number, createdAt: any, description?: string | null, isOwned: boolean, model?: string | null, name: string, updatedAt: any, uuid: any, brand: { __typename?: 'Brand', name: string, uuid: any }, category: { __typename?: 'Category', name: string, uuid: any } } } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type ProductsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<ProductFilter>;
}>;


export type ProductsQuery = { __typename?: 'Query', products: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory' } | { __typename?: 'Attribute' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product', uuid: any, name: string, availableItemsCount: number, model?: string | null, description?: string | null, brand: { __typename?: 'Brand', name: string, uuid: any }, category: { __typename?: 'Category', name: string, uuid: any }, items: Array<{ __typename?: 'ProductItem', uuid: any, serialNumber: string, condition: ProductCondition, status: ProductItemStatus }>, attributes: Array<{ __typename?: 'Attribute', uuid: any, name: string }> } | { __typename?: 'ProductItem' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type SalesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<SaleFilter>;
}>;


export type SalesQuery = { __typename?: 'Query', sales: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory' } | { __typename?: 'Attribute' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'ProductItem' } | { __typename?: 'Refund' } | { __typename?: 'Sale', uuid: any, saleType: SaleType, paymentType: PaymentType, discountAmount: number, saleDate: any, saleStatus: SaleStatus, createdAt: any, updatedAt: any, totalAmount: number, paymentStatus: PaymentStatus, customerName: string, customerEmail?: string | null, customerPhone?: string | null, invoices: Array<{ __typename?: 'Invoice', uuid: any, filePath?: string | null, invoiceNumber: string }>, store: { __typename?: 'Store', name: string }, items: Array<{ __typename?: 'SaleItem', uuid: any, quantity: number, unitPrice: number, lineTotal: number, accessory?: { __typename?: 'Accessory', uuid: any, name: string } | null, productItem?: { __typename?: 'ProductItem', status: ProductItemStatus, serialNumber: string, attributeValues: Array<{ __typename?: 'ProductItemAttributeValue', valueText?: string | null, attribute: { __typename?: 'Attribute', name: string, uuid: any } }> } | null, product?: { __typename?: 'Product', name: string } | null }>, createdBy?: { __typename?: 'User', role: UserRole, firstName: string, lastName: string, assignedStore?: { __typename?: 'Store', name: string } | null } | null } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type SalesReportQueryVariables = Exact<{
  storeId?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['Time']['input']>;
  endDate?: InputMaybe<Scalars['Time']['input']>;
}>;


export type SalesReportQuery = { __typename?: 'Query', salesReport: any };

export type StoresQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type StoresQuery = { __typename?: 'Query', stores: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory' } | { __typename?: 'Attribute' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'ProductItem' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store', uuid: any, name: string, isActive: boolean, address?: string | null, phone?: string | null } | { __typename?: 'StoreEarnings' } | { __typename?: 'User' } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type UsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  role?: InputMaybe<UserRole>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedResponse', totalCount: number, edges: Array<{ __typename?: 'Edge', node: { __typename?: 'Accessory' } | { __typename?: 'Attribute' } | { __typename?: 'Brand' } | { __typename?: 'Category' } | { __typename?: 'EarningsTransaction' } | { __typename?: 'Invoice' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'PaymentTransaction' } | { __typename?: 'Product' } | { __typename?: 'ProductItem' } | { __typename?: 'Refund' } | { __typename?: 'Sale' } | { __typename?: 'Store' } | { __typename?: 'StoreEarnings' } | { __typename?: 'User', uuid: any, role: UserRole, email: string, phone?: string | null, lastName: string, isActive: boolean, firstName: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };


export const AssignAttributesToProductDocument = gql`
    mutation AssignAttributesToProduct($attributeUuids: [UUID!]!, $productUuid: UUID!) {
  assignAttributesToProduct(
    attributeUuids: $attributeUuids
    productUuid: $productUuid
  )
}
    `;
export type AssignAttributesToProductMutationFn = Apollo.MutationFunction<AssignAttributesToProductMutation, AssignAttributesToProductMutationVariables>;

/**
 * __useAssignAttributesToProductMutation__
 *
 * To run a mutation, you first call `useAssignAttributesToProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignAttributesToProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignAttributesToProductMutation, { data, loading, error }] = useAssignAttributesToProductMutation({
 *   variables: {
 *      attributeUuids: // value for 'attributeUuids'
 *      productUuid: // value for 'productUuid'
 *   },
 * });
 */
export function useAssignAttributesToProductMutation(baseOptions?: Apollo.MutationHookOptions<AssignAttributesToProductMutation, AssignAttributesToProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignAttributesToProductMutation, AssignAttributesToProductMutationVariables>(AssignAttributesToProductDocument, options);
      }
export type AssignAttributesToProductMutationHookResult = ReturnType<typeof useAssignAttributesToProductMutation>;
export type AssignAttributesToProductMutationResult = Apollo.MutationResult<AssignAttributesToProductMutation>;
export type AssignAttributesToProductMutationOptions = Apollo.BaseMutationOptions<AssignAttributesToProductMutation, AssignAttributesToProductMutationVariables>;
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
export const CreateAccessoryDocument = gql`
    mutation CreateAccessory($input: AccessoryInput!) {
  createAccessory(input: $input) {
    uuid
  }
}
    `;
export type CreateAccessoryMutationFn = Apollo.MutationFunction<CreateAccessoryMutation, CreateAccessoryMutationVariables>;

/**
 * __useCreateAccessoryMutation__
 *
 * To run a mutation, you first call `useCreateAccessoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccessoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccessoryMutation, { data, loading, error }] = useCreateAccessoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccessoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccessoryMutation, CreateAccessoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccessoryMutation, CreateAccessoryMutationVariables>(CreateAccessoryDocument, options);
      }
export type CreateAccessoryMutationHookResult = ReturnType<typeof useCreateAccessoryMutation>;
export type CreateAccessoryMutationResult = Apollo.MutationResult<CreateAccessoryMutation>;
export type CreateAccessoryMutationOptions = Apollo.BaseMutationOptions<CreateAccessoryMutation, CreateAccessoryMutationVariables>;
export const CreateAttributeDocument = gql`
    mutation CreateAttribute($input: AttributeInput!) {
  createAttribute(input: $input) {
    uuid
    name
  }
}
    `;
export type CreateAttributeMutationFn = Apollo.MutationFunction<CreateAttributeMutation, CreateAttributeMutationVariables>;

/**
 * __useCreateAttributeMutation__
 *
 * To run a mutation, you first call `useCreateAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttributeMutation, { data, loading, error }] = useCreateAttributeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAttributeMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttributeMutation, CreateAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttributeMutation, CreateAttributeMutationVariables>(CreateAttributeDocument, options);
      }
export type CreateAttributeMutationHookResult = ReturnType<typeof useCreateAttributeMutation>;
export type CreateAttributeMutationResult = Apollo.MutationResult<CreateAttributeMutation>;
export type CreateAttributeMutationOptions = Apollo.BaseMutationOptions<CreateAttributeMutation, CreateAttributeMutationVariables>;
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
export const CreateProductItemDocument = gql`
    mutation CreateProductItem($input: ProductItemInput!) {
  createProductItem(input: $input) {
    uuid
    serialNumber
    condition
  }
}
    `;
export type CreateProductItemMutationFn = Apollo.MutationFunction<CreateProductItemMutation, CreateProductItemMutationVariables>;

/**
 * __useCreateProductItemMutation__
 *
 * To run a mutation, you first call `useCreateProductItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductItemMutation, { data, loading, error }] = useCreateProductItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductItemMutation, CreateProductItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductItemMutation, CreateProductItemMutationVariables>(CreateProductItemDocument, options);
      }
export type CreateProductItemMutationHookResult = ReturnType<typeof useCreateProductItemMutation>;
export type CreateProductItemMutationResult = Apollo.MutationResult<CreateProductItemMutation>;
export type CreateProductItemMutationOptions = Apollo.BaseMutationOptions<CreateProductItemMutation, CreateProductItemMutationVariables>;
export const CreateSaleDocument = gql`
    mutation CreateSale($input: SaleInput!) {
  createSale(input: $input) {
    uuid
    customerName
    customerEmail
    customerPhone
    totalAmount
    paymentTransactions {
      amount
      requestedAmount
      currency
      status
      manualReference
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
export const DeleteAccessoryDocument = gql`
    mutation DeleteAccessory($uuid: UUID!) {
  deleteAccessory(uuid: $uuid)
}
    `;
export type DeleteAccessoryMutationFn = Apollo.MutationFunction<DeleteAccessoryMutation, DeleteAccessoryMutationVariables>;

/**
 * __useDeleteAccessoryMutation__
 *
 * To run a mutation, you first call `useDeleteAccessoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccessoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccessoryMutation, { data, loading, error }] = useDeleteAccessoryMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteAccessoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccessoryMutation, DeleteAccessoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccessoryMutation, DeleteAccessoryMutationVariables>(DeleteAccessoryDocument, options);
      }
export type DeleteAccessoryMutationHookResult = ReturnType<typeof useDeleteAccessoryMutation>;
export type DeleteAccessoryMutationResult = Apollo.MutationResult<DeleteAccessoryMutation>;
export type DeleteAccessoryMutationOptions = Apollo.BaseMutationOptions<DeleteAccessoryMutation, DeleteAccessoryMutationVariables>;
export const DeleteAttributeDocument = gql`
    mutation DeleteAttribute($uuid: UUID!) {
  deleteAttribute(uuid: $uuid)
}
    `;
export type DeleteAttributeMutationFn = Apollo.MutationFunction<DeleteAttributeMutation, DeleteAttributeMutationVariables>;

/**
 * __useDeleteAttributeMutation__
 *
 * To run a mutation, you first call `useDeleteAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributeMutation, { data, loading, error }] = useDeleteAttributeMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteAttributeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributeMutation, DeleteAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributeMutation, DeleteAttributeMutationVariables>(DeleteAttributeDocument, options);
      }
export type DeleteAttributeMutationHookResult = ReturnType<typeof useDeleteAttributeMutation>;
export type DeleteAttributeMutationResult = Apollo.MutationResult<DeleteAttributeMutation>;
export type DeleteAttributeMutationOptions = Apollo.BaseMutationOptions<DeleteAttributeMutation, DeleteAttributeMutationVariables>;
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
export const DeleteProductItemDocument = gql`
    mutation DeleteProductItem($uuid: UUID!) {
  deleteProductItem(uuid: $uuid)
}
    `;
export type DeleteProductItemMutationFn = Apollo.MutationFunction<DeleteProductItemMutation, DeleteProductItemMutationVariables>;

/**
 * __useDeleteProductItemMutation__
 *
 * To run a mutation, you first call `useDeleteProductItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductItemMutation, { data, loading, error }] = useDeleteProductItemMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteProductItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductItemMutation, DeleteProductItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductItemMutation, DeleteProductItemMutationVariables>(DeleteProductItemDocument, options);
      }
export type DeleteProductItemMutationHookResult = ReturnType<typeof useDeleteProductItemMutation>;
export type DeleteProductItemMutationResult = Apollo.MutationResult<DeleteProductItemMutation>;
export type DeleteProductItemMutationOptions = Apollo.BaseMutationOptions<DeleteProductItemMutation, DeleteProductItemMutationVariables>;
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
export const RequestPasswordResetDocument = gql`
    mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
  requestPasswordReset(input: $input) {
    success
  }
}
    `;
export type RequestPasswordResetMutationFn = Apollo.MutationFunction<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;

/**
 * __useRequestPasswordResetMutation__
 *
 * To run a mutation, you first call `useRequestPasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestPasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestPasswordResetMutation, { data, loading, error }] = useRequestPasswordResetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestPasswordResetMutation(baseOptions?: Apollo.MutationHookOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(RequestPasswordResetDocument, options);
      }
export type RequestPasswordResetMutationHookResult = ReturnType<typeof useRequestPasswordResetMutation>;
export type RequestPasswordResetMutationResult = Apollo.MutationResult<RequestPasswordResetMutation>;
export type RequestPasswordResetMutationOptions = Apollo.BaseMutationOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResendInvitationDocument = gql`
    mutation ResendInvitation($userUuid: UUID!) {
  resendInvitation(userUuid: $userUuid) {
    success
  }
}
    `;
export type ResendInvitationMutationFn = Apollo.MutationFunction<ResendInvitationMutation, ResendInvitationMutationVariables>;

/**
 * __useResendInvitationMutation__
 *
 * To run a mutation, you first call `useResendInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendInvitationMutation, { data, loading, error }] = useResendInvitationMutation({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useResendInvitationMutation(baseOptions?: Apollo.MutationHookOptions<ResendInvitationMutation, ResendInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendInvitationMutation, ResendInvitationMutationVariables>(ResendInvitationDocument, options);
      }
export type ResendInvitationMutationHookResult = ReturnType<typeof useResendInvitationMutation>;
export type ResendInvitationMutationResult = Apollo.MutationResult<ResendInvitationMutation>;
export type ResendInvitationMutationOptions = Apollo.BaseMutationOptions<ResendInvitationMutation, ResendInvitationMutationVariables>;
export const ResendOtpDocument = gql`
    mutation ResendOTP($challengeToken: String!) {
  resendOTP(challengeToken: $challengeToken) {
    success
    message
  }
}
    `;
export type ResendOtpMutationFn = Apollo.MutationFunction<ResendOtpMutation, ResendOtpMutationVariables>;

/**
 * __useResendOtpMutation__
 *
 * To run a mutation, you first call `useResendOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendOtpMutation, { data, loading, error }] = useResendOtpMutation({
 *   variables: {
 *      challengeToken: // value for 'challengeToken'
 *   },
 * });
 */
export function useResendOtpMutation(baseOptions?: Apollo.MutationHookOptions<ResendOtpMutation, ResendOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendOtpMutation, ResendOtpMutationVariables>(ResendOtpDocument, options);
      }
export type ResendOtpMutationHookResult = ReturnType<typeof useResendOtpMutation>;
export type ResendOtpMutationResult = Apollo.MutationResult<ResendOtpMutation>;
export type ResendOtpMutationOptions = Apollo.BaseMutationOptions<ResendOtpMutation, ResendOtpMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    success
    message
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SetProductItemAttributeValuesDocument = gql`
    mutation SetProductItemAttributeValues($inputs: [ProductItemAttributeValueInput!]!) {
  setProductItemAttributeValues(inputs: $inputs) {
    attribute {
      uuid
      name
    }
    valueText
  }
}
    `;
export type SetProductItemAttributeValuesMutationFn = Apollo.MutationFunction<SetProductItemAttributeValuesMutation, SetProductItemAttributeValuesMutationVariables>;

/**
 * __useSetProductItemAttributeValuesMutation__
 *
 * To run a mutation, you first call `useSetProductItemAttributeValuesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetProductItemAttributeValuesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setProductItemAttributeValuesMutation, { data, loading, error }] = useSetProductItemAttributeValuesMutation({
 *   variables: {
 *      inputs: // value for 'inputs'
 *   },
 * });
 */
export function useSetProductItemAttributeValuesMutation(baseOptions?: Apollo.MutationHookOptions<SetProductItemAttributeValuesMutation, SetProductItemAttributeValuesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetProductItemAttributeValuesMutation, SetProductItemAttributeValuesMutationVariables>(SetProductItemAttributeValuesDocument, options);
      }
export type SetProductItemAttributeValuesMutationHookResult = ReturnType<typeof useSetProductItemAttributeValuesMutation>;
export type SetProductItemAttributeValuesMutationResult = Apollo.MutationResult<SetProductItemAttributeValuesMutation>;
export type SetProductItemAttributeValuesMutationOptions = Apollo.BaseMutationOptions<SetProductItemAttributeValuesMutation, SetProductItemAttributeValuesMutationVariables>;
export const UpdateAccessoryDocument = gql`
    mutation UpdateAccessory($input: AccessoryUpdateInput!, $uuid: UUID!) {
  updateAccessory(input: $input, uuid: $uuid) {
    uuid
  }
}
    `;
export type UpdateAccessoryMutationFn = Apollo.MutationFunction<UpdateAccessoryMutation, UpdateAccessoryMutationVariables>;

/**
 * __useUpdateAccessoryMutation__
 *
 * To run a mutation, you first call `useUpdateAccessoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccessoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccessoryMutation, { data, loading, error }] = useUpdateAccessoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateAccessoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccessoryMutation, UpdateAccessoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccessoryMutation, UpdateAccessoryMutationVariables>(UpdateAccessoryDocument, options);
      }
export type UpdateAccessoryMutationHookResult = ReturnType<typeof useUpdateAccessoryMutation>;
export type UpdateAccessoryMutationResult = Apollo.MutationResult<UpdateAccessoryMutation>;
export type UpdateAccessoryMutationOptions = Apollo.BaseMutationOptions<UpdateAccessoryMutation, UpdateAccessoryMutationVariables>;
export const UpdateAttributeDocument = gql`
    mutation UpdateAttribute($input: AttributeUpdateInput!, $uuid: UUID!) {
  updateAttribute(input: $input, uuid: $uuid) {
    uuid
    name
  }
}
    `;
export type UpdateAttributeMutationFn = Apollo.MutationFunction<UpdateAttributeMutation, UpdateAttributeMutationVariables>;

/**
 * __useUpdateAttributeMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeMutation, { data, loading, error }] = useUpdateAttributeMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeMutation, UpdateAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeMutation, UpdateAttributeMutationVariables>(UpdateAttributeDocument, options);
      }
export type UpdateAttributeMutationHookResult = ReturnType<typeof useUpdateAttributeMutation>;
export type UpdateAttributeMutationResult = Apollo.MutationResult<UpdateAttributeMutation>;
export type UpdateAttributeMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeMutation, UpdateAttributeMutationVariables>;
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
export const UpdateProductItemDocument = gql`
    mutation UpdateProductItem($input: ProductItemUpdateInput!, $uuid: UUID!) {
  updateProductItem(input: $input, uuid: $uuid) {
    uuid
  }
}
    `;
export type UpdateProductItemMutationFn = Apollo.MutationFunction<UpdateProductItemMutation, UpdateProductItemMutationVariables>;

/**
 * __useUpdateProductItemMutation__
 *
 * To run a mutation, you first call `useUpdateProductItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductItemMutation, { data, loading, error }] = useUpdateProductItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUpdateProductItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductItemMutation, UpdateProductItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductItemMutation, UpdateProductItemMutationVariables>(UpdateProductItemDocument, options);
      }
export type UpdateProductItemMutationHookResult = ReturnType<typeof useUpdateProductItemMutation>;
export type UpdateProductItemMutationResult = Apollo.MutationResult<UpdateProductItemMutation>;
export type UpdateProductItemMutationOptions = Apollo.BaseMutationOptions<UpdateProductItemMutation, UpdateProductItemMutationVariables>;
export const UpdateSaleItemFulfillmentStatusDocument = gql`
    mutation UpdateSaleItemFulfillmentStatus($saleItemUuid: UUID!, $status: SaleItemFulfillmentStatus!) {
  updateSaleItemFulfillmentStatus(saleItemUuid: $saleItemUuid, status: $status) {
    uuid
  }
}
    `;
export type UpdateSaleItemFulfillmentStatusMutationFn = Apollo.MutationFunction<UpdateSaleItemFulfillmentStatusMutation, UpdateSaleItemFulfillmentStatusMutationVariables>;

/**
 * __useUpdateSaleItemFulfillmentStatusMutation__
 *
 * To run a mutation, you first call `useUpdateSaleItemFulfillmentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSaleItemFulfillmentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSaleItemFulfillmentStatusMutation, { data, loading, error }] = useUpdateSaleItemFulfillmentStatusMutation({
 *   variables: {
 *      saleItemUuid: // value for 'saleItemUuid'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateSaleItemFulfillmentStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSaleItemFulfillmentStatusMutation, UpdateSaleItemFulfillmentStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSaleItemFulfillmentStatusMutation, UpdateSaleItemFulfillmentStatusMutationVariables>(UpdateSaleItemFulfillmentStatusDocument, options);
      }
export type UpdateSaleItemFulfillmentStatusMutationHookResult = ReturnType<typeof useUpdateSaleItemFulfillmentStatusMutation>;
export type UpdateSaleItemFulfillmentStatusMutationResult = Apollo.MutationResult<UpdateSaleItemFulfillmentStatusMutation>;
export type UpdateSaleItemFulfillmentStatusMutationOptions = Apollo.BaseMutationOptions<UpdateSaleItemFulfillmentStatusMutation, UpdateSaleItemFulfillmentStatusMutationVariables>;
export const UpdateSaleStatusDocument = gql`
    mutation UpdateSaleStatus($uuid: UUID!, $status: SaleStatus!, $totalAmount: Float, $paymentType: PaymentType) {
  updateSaleStatus(
    uuid: $uuid
    status: $status
    totalAmount: $totalAmount
    paymentType: $paymentType
  ) {
    uuid
  }
}
    `;
export type UpdateSaleStatusMutationFn = Apollo.MutationFunction<UpdateSaleStatusMutation, UpdateSaleStatusMutationVariables>;

/**
 * __useUpdateSaleStatusMutation__
 *
 * To run a mutation, you first call `useUpdateSaleStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSaleStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSaleStatusMutation, { data, loading, error }] = useUpdateSaleStatusMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *      status: // value for 'status'
 *      totalAmount: // value for 'totalAmount'
 *      paymentType: // value for 'paymentType'
 *   },
 * });
 */
export function useUpdateSaleStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSaleStatusMutation, UpdateSaleStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSaleStatusMutation, UpdateSaleStatusMutationVariables>(UpdateSaleStatusDocument, options);
      }
export type UpdateSaleStatusMutationHookResult = ReturnType<typeof useUpdateSaleStatusMutation>;
export type UpdateSaleStatusMutationResult = Apollo.MutationResult<UpdateSaleStatusMutation>;
export type UpdateSaleStatusMutationOptions = Apollo.BaseMutationOptions<UpdateSaleStatusMutation, UpdateSaleStatusMutationVariables>;
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
export const AccessoriesDocument = gql`
    query Accessories($pagination: PaginationInput, $filter: AccessoryFilter) {
  accessories(pagination: $pagination, filter: $filter) {
    edges {
      node {
        ... on Accessory {
          uuid
          store {
            uuid
            name
          }
          name
          quantity
          costPrice
          sellingPrice
          createdAt
          updatedAt
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
 * __useAccessoriesQuery__
 *
 * To run a query within a React component, call `useAccessoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccessoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccessoriesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAccessoriesQuery(baseOptions?: Apollo.QueryHookOptions<AccessoriesQuery, AccessoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccessoriesQuery, AccessoriesQueryVariables>(AccessoriesDocument, options);
      }
export function useAccessoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccessoriesQuery, AccessoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccessoriesQuery, AccessoriesQueryVariables>(AccessoriesDocument, options);
        }
export function useAccessoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccessoriesQuery, AccessoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccessoriesQuery, AccessoriesQueryVariables>(AccessoriesDocument, options);
        }
export type AccessoriesQueryHookResult = ReturnType<typeof useAccessoriesQuery>;
export type AccessoriesLazyQueryHookResult = ReturnType<typeof useAccessoriesLazyQuery>;
export type AccessoriesSuspenseQueryHookResult = ReturnType<typeof useAccessoriesSuspenseQuery>;
export type AccessoriesQueryResult = Apollo.QueryResult<AccessoriesQuery, AccessoriesQueryVariables>;
export const AttributesDocument = gql`
    query Attributes($pagination: PaginationInput) {
  attributes(pagination: $pagination) {
    edges {
      node {
        ... on Attribute {
          uuid
          name
          description
          createdAt
          updatedAt
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
 * __useAttributesQuery__
 *
 * To run a query within a React component, call `useAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttributesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useAttributesQuery(baseOptions?: Apollo.QueryHookOptions<AttributesQuery, AttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AttributesQuery, AttributesQueryVariables>(AttributesDocument, options);
      }
export function useAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AttributesQuery, AttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AttributesQuery, AttributesQueryVariables>(AttributesDocument, options);
        }
export function useAttributesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AttributesQuery, AttributesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AttributesQuery, AttributesQueryVariables>(AttributesDocument, options);
        }
export type AttributesQueryHookResult = ReturnType<typeof useAttributesQuery>;
export type AttributesLazyQueryHookResult = ReturnType<typeof useAttributesLazyQuery>;
export type AttributesSuspenseQueryHookResult = ReturnType<typeof useAttributesSuspenseQuery>;
export type AttributesQueryResult = Apollo.QueryResult<AttributesQuery, AttributesQueryVariables>;
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
export const ConditionSummaryDocument = gql`
    query ConditionSummary($startDate: Time, $endDate: Time) {
  conditionSummary(startDate: $startDate, endDate: $endDate)
}
    `;

/**
 * __useConditionSummaryQuery__
 *
 * To run a query within a React component, call `useConditionSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useConditionSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConditionSummaryQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useConditionSummaryQuery(baseOptions?: Apollo.QueryHookOptions<ConditionSummaryQuery, ConditionSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConditionSummaryQuery, ConditionSummaryQueryVariables>(ConditionSummaryDocument, options);
      }
export function useConditionSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConditionSummaryQuery, ConditionSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConditionSummaryQuery, ConditionSummaryQueryVariables>(ConditionSummaryDocument, options);
        }
export function useConditionSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConditionSummaryQuery, ConditionSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConditionSummaryQuery, ConditionSummaryQueryVariables>(ConditionSummaryDocument, options);
        }
export type ConditionSummaryQueryHookResult = ReturnType<typeof useConditionSummaryQuery>;
export type ConditionSummaryLazyQueryHookResult = ReturnType<typeof useConditionSummaryLazyQuery>;
export type ConditionSummarySuspenseQueryHookResult = ReturnType<typeof useConditionSummarySuspenseQuery>;
export type ConditionSummaryQueryResult = Apollo.QueryResult<ConditionSummaryQuery, ConditionSummaryQueryVariables>;
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
export const InvoiceDocument = gql`
    query Invoice($invoiceId: UUID!) {
  invoice(invoiceId: $invoiceId) {
    uuid
    filePath
    sale {
      customerName
      customerEmail
      customerPhone
      saleType
      paymentType
      totalAmount
      discountAmount
      paymentStatus
      saleStatus
      saleDate
      items {
        product {
          name
          model
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
    category {
      name
      uuid
    }
    description
    items {
      uuid
      serialNumber
      condition
      status
    }
    attributes {
      uuid
      name
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
export const ProductItemDocument = gql`
    query ProductItem($uuid: UUID, $serialNumber: String) {
  productItem(uuid: $uuid, serialNumber: $serialNumber) {
    uuid
    condition
    status
    costPrice
    sellingPrice
    serialNumber
    notes
    product {
      name
    }
    store {
      uuid
      name
      address
    }
    images {
      uuid
      imageUrl
      altText
      isPrimary
      sortOrder
      createdAt
      updatedAt
    }
    attributeValues {
      attribute {
        name
        uuid
      }
      valueText
    }
  }
}
    `;

/**
 * __useProductItemQuery__
 *
 * To run a query within a React component, call `useProductItemQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductItemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductItemQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *      serialNumber: // value for 'serialNumber'
 *   },
 * });
 */
export function useProductItemQuery(baseOptions?: Apollo.QueryHookOptions<ProductItemQuery, ProductItemQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductItemQuery, ProductItemQueryVariables>(ProductItemDocument, options);
      }
export function useProductItemLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductItemQuery, ProductItemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductItemQuery, ProductItemQueryVariables>(ProductItemDocument, options);
        }
export function useProductItemSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductItemQuery, ProductItemQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductItemQuery, ProductItemQueryVariables>(ProductItemDocument, options);
        }
export type ProductItemQueryHookResult = ReturnType<typeof useProductItemQuery>;
export type ProductItemLazyQueryHookResult = ReturnType<typeof useProductItemLazyQuery>;
export type ProductItemSuspenseQueryHookResult = ReturnType<typeof useProductItemSuspenseQuery>;
export type ProductItemQueryResult = Apollo.QueryResult<ProductItemQuery, ProductItemQueryVariables>;
export const ProductItemsDocument = gql`
    query ProductItems($filter: ProductItemFilter, $pagination: PaginationInput) {
  productItems(filter: $filter, pagination: $pagination) {
    edges {
      node {
        ... on ProductItem {
          uuid
          serialNumber
          condition
          status
          costPrice
          sellingPrice
          externalStoreName
          notes
          store {
            name
            uuid
          }
          attributeValues {
            attribute {
              name
              uuid
            }
            valueText
          }
          sellingPrice
          images {
            uuid
            imageUrl
            altText
            isPrimary
            sortOrder
            createdAt
            updatedAt
          }
          product {
            availableItemsCount
            createdAt
            description
            isOwned
            model
            name
            updatedAt
            uuid
            brand {
              name
              uuid
            }
            category {
              name
              uuid
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
 * __useProductItemsQuery__
 *
 * To run a query within a React component, call `useProductItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductItemsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useProductItemsQuery(baseOptions?: Apollo.QueryHookOptions<ProductItemsQuery, ProductItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductItemsQuery, ProductItemsQueryVariables>(ProductItemsDocument, options);
      }
export function useProductItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductItemsQuery, ProductItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductItemsQuery, ProductItemsQueryVariables>(ProductItemsDocument, options);
        }
export function useProductItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductItemsQuery, ProductItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductItemsQuery, ProductItemsQueryVariables>(ProductItemsDocument, options);
        }
export type ProductItemsQueryHookResult = ReturnType<typeof useProductItemsQuery>;
export type ProductItemsLazyQueryHookResult = ReturnType<typeof useProductItemsLazyQuery>;
export type ProductItemsSuspenseQueryHookResult = ReturnType<typeof useProductItemsSuspenseQuery>;
export type ProductItemsQueryResult = Apollo.QueryResult<ProductItemsQuery, ProductItemsQueryVariables>;
export const ProductsDocument = gql`
    query Products($pagination: PaginationInput, $filter: ProductFilter) {
  products(pagination: $pagination, filter: $filter) {
    edges {
      node {
        ... on Product {
          uuid
          name
          availableItemsCount
          brand {
            name
            uuid
          }
          model
          category {
            name
            uuid
          }
          description
          items {
            uuid
            serialNumber
            condition
            status
          }
          attributes {
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
          paymentType
          discountAmount
          invoices {
            uuid
            filePath
            invoiceNumber
          }
          store {
            name
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
            lineTotal
            accessory {
              uuid
              name
            }
            productItem {
              status
              serialNumber
              attributeValues {
                attribute {
                  name
                  uuid
                }
                valueText
              }
            }
            product {
              name
            }
          }
          createdBy {
            role
            firstName
            lastName
            assignedStore {
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
export const SalesReportDocument = gql`
    query SalesReport($storeId: Int, $startDate: Time, $endDate: Time) {
  salesReport(storeId: $storeId, startDate: $startDate, endDate: $endDate)
}
    `;

/**
 * __useSalesReportQuery__
 *
 * To run a query within a React component, call `useSalesReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useSalesReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSalesReportQuery({
 *   variables: {
 *      storeId: // value for 'storeId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useSalesReportQuery(baseOptions?: Apollo.QueryHookOptions<SalesReportQuery, SalesReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SalesReportQuery, SalesReportQueryVariables>(SalesReportDocument, options);
      }
export function useSalesReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SalesReportQuery, SalesReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SalesReportQuery, SalesReportQueryVariables>(SalesReportDocument, options);
        }
export function useSalesReportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SalesReportQuery, SalesReportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SalesReportQuery, SalesReportQueryVariables>(SalesReportDocument, options);
        }
export type SalesReportQueryHookResult = ReturnType<typeof useSalesReportQuery>;
export type SalesReportLazyQueryHookResult = ReturnType<typeof useSalesReportLazyQuery>;
export type SalesReportSuspenseQueryHookResult = ReturnType<typeof useSalesReportSuspenseQuery>;
export type SalesReportQueryResult = Apollo.QueryResult<SalesReportQuery, SalesReportQueryVariables>;
export const StoresDocument = gql`
    query Stores($pagination: PaginationInput) {
  stores(pagination: $pagination) {
    edges {
      node {
        ... on Store {
          uuid
          name
          isActive
          address
          phone
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