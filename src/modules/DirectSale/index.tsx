import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
	SaleType,
	useProductsQuery,
	Product,
	useCreateSaleMutation,
	useInitializePaymentMutation,
	useProductLazyQuery,
	UserRole,
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

// Import utilities
import { canProceedToNextStep } from "./validation";
import { calculateSubtotal, createNewProductItem } from "../../utils/helpers";
import { useUserStore } from "../../store/userStore";
import { useProductStore } from "../../store/productStore";

const DirectSale = ({ setOpen }: DirectSaleProps) => {
	const { setProduct } = useProductStore();
	const { user } = useUserStore();
	const [createSale, { loading }] = useCreateSaleMutation();
	const [initializePayment] = useInitializePaymentMutation();
	const [currentStep, setCurrentStep] = useState(1);
	const [productItems, setProductItems] = useState<ProductItem[]>([
		createNewProductItem(),
	]);

	const { data: products } = useProductsQuery({
		variables: {
			pagination: { first: 100 },
			...(user?.role === UserRole.Reseller && {
				filter: { storeUuid: user?.assignedStore?.uuid || "" },
			}),
		},
	});

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

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<CreateSaleForm>({
		defaultValues: {
			storeUuid: "",
			customerName: "",
			customerEmail: "",
			customerPhone: "",
			saleType: SaleType.Direct,
			totalAmount: 0,
			discountAmount: 0,
			notes: "",
			items: [],
		},
		mode: "onChange",
	});

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
		setProductItems(
			productItems.map((item) =>
				item.id === id ? { ...item, ...updates } : item
			)
		);
	};

	const canProceed = () =>
		canProceedToNextStep(currentStep, productItems, formData);

	const nextStep = () => {
		if (currentStep < steps.length && canProceed()) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: CreateSaleForm) => {
		await createSale({
			variables: {
				input: {
					...data,
					totalAmount: calculateSubtotal(productItems),
					items: productItems.map((item) => ({
						productUuid: item.product?.uuid || "",
						quantity: item.quantity,
						unitPrice: item.unitPrice,
					})),
					storeUuid: user?.assignedStore?.uuid || "",
				},
			},
			onCompleted: async (data) => {
				if (data)
					await initializePayment({
						variables: {
							input: {
								saleUuid: data.createSale.uuid,
								customerEmail: data.createSale.customerEmail ?? "",
								amount: data.createSale.totalAmount || 0,
								customerPhone: data.createSale.customerPhone ?? "",
							},
						},
						onCompleted: (paymentData) => {
							window.open(
								paymentData.initializePayment.authorizationUrl || "",
								"_blank"
							);
						},
					});
			},
		});
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<ProductInformation
						productItems={productItems}
						products={
							products?.products?.edges?.map((edge) => edge.node as Product) ||
							[]
						}
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
				return <CustomerDetails register={register} />;
			case 3:
				return <ReviewOrder productItems={productItems} formData={formData} />;
			case 4:
				return (
					<PaymentDetails
						register={register}
						setValue={setValue}
						errors={errors}
						productItems={productItems}
					/>
				);
			default:
				return (
					<ProductInformation
						productItems={productItems}
						products={
							products?.products?.edges?.map((edge) => edge.node as Product) ||
							[]
						}
						onAddProduct={addProductItem}
						onRemoveProduct={removeProductItem}
						onUpdateProduct={updateProductItem}
						onViewProductDetails={() => setOpen(true)}
						discountAmount={formData.discountAmount}
						onDiscountChange={(value) => setValue("discountAmount", value)}
					/>
				);
		}
	};

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
