import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import {
	SaleType,
	PaymentType,
	UserRole,
	useCreateSaleMutation,
	useProductItemLazyQuery,
	useStoresQuery,
	ProductItem as ProductItemType,
} from "../../generated/graphql";
import { cn } from "../../utils/cn";
import { toast } from "react-toastify";

// Import types and constants
import { DirectSaleProps, CreateSaleForm, ProductItem } from "./types";
import { steps } from "./constants";

// Import components
import StepNavigation from "./StepNavigation";
import ProductInformation from "./ProductInformation";
import CustomerDetails from "./CustomerDetails";
import ReviewOrder from "./ReviewOrder";
import PaymentDetails from "./PaymentDetails";
import SaleSuccess from "./SaleSuccess";

// Import utilities
import { canProceedToNextStep } from "./validation";
import { calculateSubtotal, createNewProductItem } from "../../utils/helpers";
import { useProductStore } from "../../store/productStore";
import { useUserStore } from "../../store/userStore";

const DirectSale = ({
	setOpen,
	saleType = SaleType.Direct,
	showSteps = true,
	refetch,
}: DirectSaleProps) => {
	const { setProductItem } = useProductStore();
	const { user } = useUserStore();
	const isStoreOwner = user?.role === UserRole.StoreOwner;
	const [createSale, { loading }] = useCreateSaleMutation();
	const [selectedStoreUuid, setSelectedStoreUuid] = useState("");
	const [currentStep, setCurrentStep] = useState(1);
	const [stepsVisible, setStepsVisible] = useState(false);
	const [productItems, setProductItems] = useState<ProductItem[]>([
		createNewProductItem(),
	]);
	const [saleCompleted, setSaleCompleted] = useState(false);
	const [completedSaleData, setCompletedSaleData] = useState<{
		saleId: string;
		customerName: string;
		totalAmount: number;
		saleType: SaleType;
		paymentType: PaymentType;
		createdAt: string;
		invoices?: Array<{
			uuid: string;
			filePath?: string | null;
			invoiceNumber: string;
		}>;
	} | null>(null);

	const [getProductItem, { data }] = useProductItemLazyQuery();
	const { data: storesData } = useStoresQuery({
		variables: { pagination: { first: 100 } },
		skip: !isStoreOwner,
		fetchPolicy: "network-only",
	});

	type StoreOption = { uuid: string; name: string };

	const stores = useMemo<StoreOption[]>(() => {
		if (!storesData?.stores?.edges) {
			return [];
		}

		return storesData.stores.edges
			.map((edge) => edge.node)
			.filter(
				(
					node,
				): node is {
					__typename?: "Store";
					uuid: string;
					name: string;
					isActive: boolean;
					address?: string | null;
					phone?: string | null;
				} => node.__typename === "Store",
			)
			.map((store) => ({ uuid: store.uuid, name: store.name }));
	}, [storesData]);

	useEffect(() => {
		if (isStoreOwner && !selectedStoreUuid && stores.length > 0) {
			setSelectedStoreUuid(stores[0].uuid);
		}
	}, [isStoreOwner, selectedStoreUuid, stores]);

	const handleViewProductDetails = (productUuid: string) => {
		getProductItem({
			variables: {
				serialNumber: productUuid,
			},
		});
	};

	useEffect(() => {
		if (data && data.productItem) {
			setProductItem(data.productItem as ProductItemType);
		}
	}, [data, setProductItem]);

	const { register, handleSubmit, setValue, watch } = useForm<CreateSaleForm>({
		defaultValues: {
			storeUuid: "",
			customerName: "",
			customerEmail: "",
			customerPhone: "",
			saleType: saleType,
			paymentType: PaymentType.Cash,
			totalAmount: 0,
			discountAmount: 0,
			notes: "",
			items: [],
		},
		mode: "onChange",
	});

	// Update form saleType when prop changes
	useEffect(() => {
		setValue("saleType", saleType);
	}, [saleType, setValue]);

	const formData = watch();

	const addProductItem = () => {
		setProductItems([...productItems, createNewProductItem()]);
	};

	const removeProductItem = (id: string) => {
		if (productItems.length > 1) {
			setProductItems(productItems.filter((item) => item.id !== id));
		}
	};

	const updateProductItem = (id: string, updates: Partial<ProductItem>) => {
		const updatedItems = productItems.map((item) =>
			item.id === id ? { ...item, ...updates } : item,
		);
		setProductItems(updatedItems);
	};

	const canProceed = () =>
		canProceedToNextStep(currentStep, productItems, formData);

	const nextStep = () => {
		if (currentStep < steps.length && canProceed()) {
			setCurrentStep(currentStep + 1);
		} else if (currentStep === 1) {
			// Check for specific validation issues on step 1
			// Skip price validation for credit sales
			if (formData.saleType !== SaleType.Credit) {
				const hasInvalidPrice = productItems.some(
					(item) =>
						item.sellingPrice &&
						item.unitPrice &&
						item.unitPrice < item.sellingPrice,
				);

				if (hasInvalidPrice) {
					toast.error(
						"Please ensure all unit prices meet or exceed the minimum selling price before proceeding.",
					);
				}
			}
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	// Success screen handlers
	const handleNewSale = () => {
		// Reset form and state for a new sale
		setSaleCompleted(false);
		setCompletedSaleData(null);
		setCurrentStep(1);
		setProductItems([createNewProductItem()]);
		// Reset form values to defaults
		setValue("customerName", "");
		setValue("customerEmail", "");
		setValue("customerPhone", "");
		setValue("totalAmount", 0);
		setValue("discountAmount", 0);
		setValue("notes", "");
	};

	const handleCloseSale = () => {
		// Close the entire DirectSale component
		setOpen(false);
	};

	const onSubmit = async (data: CreateSaleForm) => {
		// Validate that no product has a unit price lower than selling price
		// Skip this validation for credit sales
		if (data.saleType !== SaleType.Credit) {
			const hasInvalidPrice = productItems.some(
				(item) =>
					item.sellingPrice &&
					item.unitPrice &&
					item.unitPrice < item.sellingPrice,
			);

			if (hasInvalidPrice) {
				toast.error(
					"Cannot complete sale: Some products have unit prices lower than their selling prices.",
				);
				return;
			}
		}

		const assignedStoreUuid = user?.assignedStore?.uuid ?? "";

		if (isStoreOwner && !selectedStoreUuid) {
			toast.error("Please select a store");
			return;
		}

		// Prefer storeUuid from a selected product item when available
		const productItemStoreUuid = productItems.find(
			(it) => it.storeUuid,
		)?.storeUuid;
		const storeUuid = isStoreOwner
			? selectedStoreUuid
			: productItemStoreUuid || assignedStoreUuid || "";

		const subtotal = calculateSubtotal(productItems);
		const totalAmountAfterDiscount = subtotal - (data.discountAmount || 0);

		// Separate gadgets and accessories into distinct arrays
		const gadgets = productItems.filter((item) => !item.isAccessory);
		const accessories = productItems.filter((item) => item.isAccessory);

		await createSale({
			variables: {
				input: {
					...data,
					totalAmount: totalAmountAfterDiscount,
					items: gadgets.map((item) => ({
						serialNumber: item.serialNumber || "",
						unitPrice: item.unitPrice,
					})),
					accessories: accessories.map((item) => ({
						productUuid: item.accessoryUuid || "",
						quantity: item.quantity || 0,
						unitPrice: item.unitPrice,
					})),
					storeUuid,
				},
			},
			onCompleted: async (response) => {
				if (response?.createSale) {
					const sale = response.createSale;
					setCompletedSaleData({
						saleId: sale.uuid,
						customerName: sale.customerName,
						totalAmount: sale.totalAmount,
						saleType: data.saleType,
						paymentType: data.paymentType,
						createdAt: sale.createdAt,
						invoices: sale.invoices || [],
					});
					setSaleCompleted(true);
					refetch?.();
				}
			},
			onError(error) {
				toast.error(
					error.message || "Failed to complete sale. Please try again.",
				);
			},
		});
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<ProductInformation
						productItems={productItems}
						onAddProduct={addProductItem}
						onRemoveProduct={removeProductItem}
						onUpdateProduct={updateProductItem}
						onViewProductDetails={(id) => {
							setOpen(true);
							handleViewProductDetails(id);
						}}
						discountAmount={formData.discountAmount}
						onDiscountChange={(value) => setValue("discountAmount", value)}
						saleType={saleType}
					/>
				);
			case 2:
				return (
					<CustomerDetails
						register={register}
						setValue={setValue}
						watch={watch}
					/>
				);
			case 3:
				return <ReviewOrder productItems={productItems} formData={formData} />;
			case 4:
				return (
					<PaymentDetails register={register} productItems={productItems} />
				);
			default:
				return (
					<ProductInformation
						productItems={productItems}
						onAddProduct={addProductItem}
						onRemoveProduct={removeProductItem}
						onUpdateProduct={updateProductItem}
						onViewProductDetails={(id) => {
							setOpen(true);
							handleViewProductDetails(id);
						}}
						discountAmount={formData.discountAmount}
						onDiscountChange={(value) => setValue("discountAmount", value)}
						saleType={saleType}
					/>
				);
		}
	};

	// Show success screen if sale is completed
	if (saleCompleted && completedSaleData) {
		return (
			<div className="py-4 sm:py-6 md:py-[32px]">
				<div className="bg-white rounded-[10px] w-full">
					<SaleSuccess
						saleData={completedSaleData}
						productItems={productItems}
						formData={formData}
						onNewSale={handleNewSale}
						onClose={handleCloseSale}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="py-4 sm:py-6 md:py-[32px]">
			<div className="flex flex-col lg:flex-row relative">
				{showSteps && stepsVisible && (
					<div className="hidden lg:block">
						<StepNavigation
							steps={steps}
							currentStep={currentStep}
							onStepClick={setCurrentStep}
						/>
					</div>
				)}

				{/* Toggle Button */}
				{showSteps && (
					<button
						type="button"
						onClick={() => setStepsVisible(!stepsVisible)}
						className="hidden lg:flex absolute top-0 left-0 z-10 items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-all"
						style={{ left: stepsVisible ? "calc(280px + 0.5rem)" : "0.5rem" }}
					>
						<svg
							className="w-4 h-4 text-gray-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style={{
								transform: stepsVisible ? "rotate(0deg)" : "rotate(180deg)",
							}}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				)}

				{/* Content - Right Side */}
				<div className="flex-1 bg-white rounded-[10px] lg:rounded-r-[10px] p-4 sm:p-6 md:p-[32px] md:pt-0">
					<form
						onSubmit={(e) => {
							// Only allow submission if it's the last step
							if (currentStep !== steps.length) {
								e.preventDefault();
								return;
							}
							handleSubmit(onSubmit)(e);
						}}
						onKeyDown={(e) => {
							// Prevent Enter key from submitting the form
							if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
								e.preventDefault();
							}
						}}
						className="h-full flex flex-col"
					>
						{isStoreOwner && (
							<div className="pt-4 sm:pt-6 md:pt-[24px]">
								<label className="text-[14px] text-[#1F2937] font-bold mb-[8px] block">
									Store <span className="text-red-500">*</span>
								</label>
								<select
									value={selectedStoreUuid}
									onChange={(event) => setSelectedStoreUuid(event.target.value)}
									className="w-full h-[50px] rounded-[10px] border-[#E5E7EB] bg-white border-[2px] px-[14px] outline-none focus:border-[#278783] focus:ring-2 focus:ring-[#278783]/20 text-[14px] transition-all"
								>
									{stores.length === 0 ? (
										<option value="">No stores available</option>
									) : (
										stores.map((store) => (
											<option key={store.uuid} value={store.uuid}>
												{store.name}
											</option>
										))
									)}
								</select>
							</div>
						)}

						<div className="flex-1">{renderStepContent()}</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-4 sm:pt-6 md:pt-[32px] border-t border-gray-200 gap-2">
							<Button
								type="button"
								variant="secondary"
								onClick={prevStep}
								disabled={currentStep === 1}
								className={cn(
									"w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center text-sm sm:text-base",
									{
										"opacity-50 cursor-not-allowed": currentStep === 1,
									},
								)}
							>
								←
							</Button>
							{currentStep < steps.length && (
								<Button
									type="button"
									onClick={nextStep}
									disabled={!canProceed()}
									className={cn(
										"w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center text-sm sm:text-base",
										{
											"opacity-50 cursor-not-allowed": !canProceed(),
										},
									)}
								>
									→
								</Button>
							)}
							{currentStep === steps.length && (
								<Button
									type="submit"
									disabled={!canProceed()}
									className={cn(
										"w-auto min-w-[120px] sm:w-[150px] px-3 sm:px-[16px] h-[40px] sm:h-[50px] rounded-full text-sm sm:text-base",
										{
											"opacity-50 cursor-not-allowed": !canProceed(),
										},
									)}
								>
									{loading ? "Processing..." : "Complete Sale"}
								</Button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default DirectSale;
