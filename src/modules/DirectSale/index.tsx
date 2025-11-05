import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
	SaleType,
	PaymentType,
	Product,
	useCreateSaleMutation,
	useProductLazyQuery,
} from "../../generated/graphql";
import { cn } from "../../utils/cn";

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
}: DirectSaleProps) => {
	const { setProduct } = useProductStore();
	const { user } = useUserStore();
	const [createSale, { loading }] = useCreateSaleMutation();
	const [currentStep, setCurrentStep] = useState(1);
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

	const [getProduct, { data }] = useProductLazyQuery();

	const handleViewProductDetails = (productUuid: string) => {
		getProduct({
			variables: {
				uuid: productUuid,
			},
		});
	};

	useEffect(() => {
		if (data && data.product) {
			setProduct(data.product as Product);
		}
	}, [data, setProduct]);

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
			item.id === id ? { ...item, ...updates } : item
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
			const hasInvalidPrice = productItems.some(
				(item) =>
					item.sellingPrice &&
					item.unitPrice &&
					item.unitPrice < item.sellingPrice
			);

			if (hasInvalidPrice) {
				alert(
					"Please ensure all unit prices meet or exceed the minimum selling price before proceeding."
				);
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
		const hasInvalidPrice = productItems.some(
			(item) => item.sellingPrice && item.unitPrice < item.sellingPrice
		);

		if (hasInvalidPrice) {
			alert(
				"Cannot complete sale: Some products have unit prices lower than their selling prices."
			);
			return;
		}

		const assignedStoreUuid = user?.assignedStore?.uuid ?? "";
		const ownedStoreUuid =
			user?.ownedStores && user.ownedStores.length > 0
				? user.ownedStores[0].uuid
				: "";
		const storeUuid = assignedStoreUuid || ownedStoreUuid || "";

		const subtotal = calculateSubtotal(productItems);
		const totalAmountAfterDiscount = subtotal - (data.discountAmount || 0);

		await createSale({
			variables: {
				input: {
					...data,
					totalAmount: totalAmountAfterDiscount,
					items: productItems.map((item) => ({
						productUuid: item.productUuid || "",
						productItemUuid: item.productItemUuid || "",
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
				}
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
					/>
				);
		}
	};

	// Show success screen if sale is completed
	if (saleCompleted && completedSaleData) {
		return (
			<div className="py-[32px]">
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
		<div className="py-[32px]">
			<div className="flex">
				<StepNavigation
					steps={steps}
					currentStep={currentStep}
					onStepClick={setCurrentStep}
				/>

				{/* Content - Right Side */}
				<div className="flex-1 bg-white rounded-r-[10px] p-[32px] pt-0">
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
						<div className="flex-1">{renderStepContent()}</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-[32px] border-t border-gray-200">
							<Button
								type="button"
								variant="secondary"
								onClick={prevStep}
								disabled={currentStep === 1}
								className={cn(
									"w-[50px] h-[50px] rounded-full flex items-center justify-center",
									{
										"opacity-50 cursor-not-allowed": currentStep === 1,
									}
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
										"w-[50px] h-[50px] rounded-full flex items-center justify-center",
										{
											"opacity-50 cursor-not-allowed": !canProceed(),
										}
									)}
								>
									→
								</Button>
							)}
							{currentStep === steps.length && (
								<Button
									type="submit"
									disabled={!canProceed()}
									className={cn("w-[150px] px-[16px] h-[50px] rounded-full", {
										"opacity-50 cursor-not-allowed": !canProceed(),
									})}
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
