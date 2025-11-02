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

// Import utilities
import { canProceedToNextStep } from "./validation";
import { calculateSubtotal, createNewProductItem } from "../../utils/helpers";
import { useProductStore } from "../../store/productStore";
import { useUserStore } from "../../store/userStore";

const DirectSale = ({ setOpen }: DirectSaleProps) => {
	const { setProduct } = useProductStore();
	const { user } = useUserStore();
	const [createSale, { loading }] = useCreateSaleMutation();
	const [currentStep, setCurrentStep] = useState(1);
	const [productItems, setProductItems] = useState<ProductItem[]>([
		createNewProductItem(),
	]);

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
			saleType: SaleType.Direct,
			paymentType: PaymentType.Cash,
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
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};
	// console.log(productItems);
	const onSubmit = async (data: CreateSaleForm) => {
		const assignedStoreUuid = user?.assignedStore?.uuid ?? "";
		const ownedStoreUuid =
			user?.ownedStores && user.ownedStores.length > 0
				? user.ownedStores[0].uuid
				: "";
		const storeUuid = assignedStoreUuid || ownedStoreUuid || "";

		console.log({
			...data,
			totalAmount: calculateSubtotal(productItems),
			items: productItems.map((item) => ({
				productUuid: item.productUuid || "",
				productItemUuid: item.productItemUuid || "",
				unitPrice: item.unitPrice,
			})),
			storeUuid,
		});
		await createSale({
			variables: {
				input: {
					...data,
					totalAmount: calculateSubtotal(productItems),
					items: productItems.map((item) => ({
						productUuid: item.productUuid || "",
						productItemUuid: item.productItemUuid || "",
						unitPrice: item.unitPrice,
					})),
					storeUuid,
				},
			},
			onCompleted: async (data) => {
				if (data) console.log(data);
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
