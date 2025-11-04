import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { SwapSaleFormData, SwapProductItem } from "./types";
import { INITIAL_SWAP_SALE_FORM_DATA, SWAP_SALE_STEPS } from "./constants";
import {
	useCreateSaleMutation,
	useMeQuery,
	SaleType,
	SaleInput,
	ProductCondition,
} from "../../generated/graphql";
import { calculateSwapSubtotal } from "../../utils/swapHelpers";
import { canProceedToNextStep } from "./validation";
import { cn } from "../../utils/cn";
import Button from "../../components/Button";
import StepNavigation from "./StepNavigation";
import ProductInformation from "./ProductInformation";
import CustomerDetails from "./CustomerDetails";
import ReviewOrder from "./ReviewOrder";

const SwapSale: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [createSale, { loading: isCreatingSale }] = useCreateSaleMutation();
	const { data: meData } = useMeQuery();
	const [productItems, setProductItems] = useState<SwapProductItem[]>([
		{
			id: "1",
			productName: "",
			unitPrice: 0,
			productItemUuid: "",
			productUuid: "",
		},
	]);

	const form = useForm<SwapSaleFormData>({
		defaultValues: INITIAL_SWAP_SALE_FORM_DATA,
		mode: "onChange",
	});

	const { watch, setValue, handleSubmit } = form;
	const formData = watch();

	// Calculate totals whenever productItems change
	React.useEffect(() => {
		const subtotal = calculateSwapSubtotal(productItems);
		const swapPhoneValue = formData.swapPhoneDetails.estimatedValue || 0;
		const swapDifference = subtotal - swapPhoneValue;
		const totalAmount = Math.max(0, swapDifference);

		setValue("subtotal", subtotal);
		setValue("totalAmount", totalAmount);
		setValue("swapDifference", swapDifference);
	}, [productItems, formData.swapPhoneDetails.estimatedValue, setValue]);

	const handleNext = useCallback(() => {
		if (canProceedToNextStep(currentStep, formData, productItems)) {
			setCurrentStep((prev) => Math.min(prev + 1, SWAP_SALE_STEPS.length));
		}
	}, [currentStep, formData, productItems]);

	const handlePrevious = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	}, []);

	const handleStepClick = useCallback(
		(step: number) => {
			if (
				step <= currentStep ||
				canProceedToNextStep(currentStep, formData, productItems)
			) {
				setCurrentStep(step);
			}
		},
		[currentStep, formData, productItems]
	);

	const onSubmit = async (data: SwapSaleFormData) => {
		try {
			// Validate that we have a store UUID
			const storeUuid =
				meData?.me?.assignedStore?.uuid || meData?.me?.ownedStores[0]?.uuid;
			if (!storeUuid) {
				console.error("No store found for current user");
				return;
			}
			// Prepare the sale input data according to GraphQL SaleInput schema
			const saleInput: SaleInput = {
				// Customer information
				customerName: data.customerName,
				customerEmail: data.customerEmail || null,
				customerPhone: data.customerPhone || null,

				// Sale details
				saleType: SaleType.Swap,
				paymentType: data.paymentType,
				totalAmount: data.totalAmount,
				discountAmount: data.discountAmount || 0,

				// Store information from current user's assigned store
				storeUuid,

				// Swap phone details (given product information)
				givenProductUuid: data.swapPhoneDetails.selectedProduct?.uuid || null,
				givenProductSerialNumber: data.swapPhoneDetails.serialNumber || null,
				givenProductBrandUuid: data.swapPhoneDetails.brand || null,
				givenProductCondition:
					(data.swapPhoneDetails.condition as ProductCondition) || null,

				// Sale items (products being sold to customer)
				items: productItems
					.filter((item) => item.productUuid && item.productItemUuid)
					.map((item) => ({
						productUuid: item.productUuid,
						productItemUuid: item.productItemUuid,
						unitPrice: item.unitPrice,
					})),

				// Optional notes
				notes: null,
			};

			console.log("Creating sale with data:", saleInput);

			const result = await createSale({
				variables: { input: saleInput },
			});

			if (result.data?.createSale) {
				console.log("Sale created successfully:", result.data.createSale);
				// TODO: Handle success (redirect, show success message, etc.)
			}
		} catch (error) {
			console.error("Error creating sale:", error);
			// TODO: Handle error (show error message)
		}
	};

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<ProductInformation
						productItems={productItems}
						onUpdateProduct={(id, updates) => {
							setProductItems((prev) =>
								prev.map((item) =>
									item.id === id ? { ...item, ...updates } : item
								)
							);
						}}
						onViewProductDetails={() => {}}
						discountAmount={formData.discountAmount}
						onDiscountChange={(value) => form.setValue("discountAmount", value)}
						swapPhoneDetails={formData.swapPhoneDetails}
						onSwapPhoneDetailsChange={(details) => {
							if (details.selectedProduct !== undefined)
								form.setValue(
									"swapPhoneDetails.selectedProduct",
									details.selectedProduct
								);
							if (details.serialNumber !== undefined)
								form.setValue(
									"swapPhoneDetails.serialNumber",
									details.serialNumber
								);
							if (details.brand !== undefined)
								form.setValue("swapPhoneDetails.brand", details.brand);
							// if (details.model !== undefined)
							// 	form.setValue("swapPhoneDetails.model", details.model);
							// if (details.color !== undefined)
							// 	form.setValue("swapPhoneDetails.color", details.color);
							// if (details.storage !== undefined)
							// 	form.setValue("swapPhoneDetails.storage", details.storage);
							if (details.condition !== undefined)
								form.setValue("swapPhoneDetails.condition", details.condition);
							if (
								"estimatedValue" in details &&
								typeof details.estimatedValue === "number"
							) {
								form.setValue(
									"swapPhoneDetails.estimatedValue",
									details.estimatedValue
								);
							}
						}}
					/>
				);
			case 2:
				return (
					<CustomerDetails
						register={form.register}
						watch={form.watch}
						setValue={form.setValue}
					/>
				);
			case 3:
				return <ReviewOrder formData={formData} productItems={productItems} />;
			default:
				return null;
		}
	};

	return (
		<div className="py-[32px]">
			<div className="flex">
				<StepNavigation
					steps={SWAP_SALE_STEPS}
					currentStep={currentStep}
					onStepClick={handleStepClick}
				/>

				{/* Content - Right Side */}
				<div className="flex-1 bg-white rounded-r-[10px] p-[32px] pt-0">
					<form
						onSubmit={(e) => {
							// Only allow submission if it's the last step
							if (currentStep !== SWAP_SALE_STEPS.length) {
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
						<div className="flex-1">{renderCurrentStep()}</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-[32px] border-t border-gray-200">
							<Button
								type="button"
								variant="secondary"
								onClick={handlePrevious}
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
							{currentStep < SWAP_SALE_STEPS.length && (
								<Button
									type="button"
									onClick={handleNext}
									disabled={
										!canProceedToNextStep(currentStep, formData, productItems)
									}
									className={cn(
										"w-[50px] h-[50px] rounded-full flex items-center justify-center",
										{
											"opacity-50 cursor-not-allowed": !canProceedToNextStep(
												currentStep,
												formData,
												productItems
											),
										}
									)}
								>
									→
								</Button>
							)}
							{currentStep === SWAP_SALE_STEPS.length && (
								<Button
									type="submit"
									disabled={
										!canProceedToNextStep(
											currentStep,
											formData,
											productItems
										) || isCreatingSale
									}
									className={cn("w-[150px] px-[16px] h-[50px] rounded-full", {
										"opacity-50 cursor-not-allowed":
											!canProceedToNextStep(
												currentStep,
												formData,
												productItems
											) || isCreatingSale,
									})}
								>
									{isCreatingSale ? "Creating Sale..." : "Complete Sale"}
								</Button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SwapSale;
