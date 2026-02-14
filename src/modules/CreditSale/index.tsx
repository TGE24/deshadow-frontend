import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreditSaleFormData } from "./types";
import { INITIAL_CREDIT_SALE_FORM_DATA, CREDIT_SALE_STEPS } from "./constants";
import { canProceedToNextStep } from "./validation";
import ProductDetails from "./ProductDetails";
import CustomerDetails from "./CustomerDetails";
import ReviewOrder from "./ReviewOrder";
import CreditSaleSuccess from "./CreditSaleSuccess";
import Button from "../../components/Button";
import { cn } from "../../utils/cn";
import {
	useCreateSaleMutation,
	useCreateProductItemMutation,
	useSetProductItemAttributeValuesMutation,
	useCreateAccessoryMutation,
	SaleType,
	useMeQuery,
	UserRole,
	PaymentType,
	ProductCondition,
	SaleInput,
} from "../../generated/graphql";
import StepNavigation from "./StepNavigation";

const CreditSale: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [showSuccess, setShowSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [saleResultState, setSaleResultState] = useState<{
		saleId: string;
		customerName: string;
		totalAmount: number;
		saleType: SaleType;
		paymentType: PaymentType | "" | null;
		createdAt: string;
	} | null>(null);

	const { register, setValue, watch, reset } = useForm<CreditSaleFormData>({
		defaultValues: INITIAL_CREDIT_SALE_FORM_DATA,
	});

	const [createSale] = useCreateSaleMutation();
	const [createProductItem] = useCreateProductItemMutation();
	const [setProductItemAttributeValues] =
		useSetProductItemAttributeValuesMutation();
	const [createAccessory] = useCreateAccessoryMutation();
	const { data: userData } = useMeQuery();

	const formData = watch();

	// Get store UUID from user profile
	const storeUuid =
		userData?.me?.role === UserRole.Reseller
			? userData?.me?.assignedStore?.uuid || ""
			: userData?.me?.ownedStores?.[0]?.uuid || "";

	const handleClose = () => {
		reset(INITIAL_CREDIT_SALE_FORM_DATA);
		setCurrentStep(1);
		setShowSuccess(false);
		setIsSubmitting(false);
	};

	const handleNewSale = () => {
		reset(INITIAL_CREDIT_SALE_FORM_DATA);
		setCurrentStep(1);
		setShowSuccess(false);
		setIsSubmitting(false);
	};

	const handleNext = () => {
		if (!canProceedToNextStep(currentStep, formData)) {
			toast.error("Please fill in all required fields");
			return;
		}
		setCurrentStep((prev) => Math.min(prev + 1, CREDIT_SALE_STEPS.length));
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleStepClick = (stepId: number) => {
		// Allow clicking on completed steps or current step
		if (stepId <= currentStep) {
			setCurrentStep(stepId);
		}
	};

	const handleSubmit = async () => {
		if (!canProceedToNextStep(currentStep, formData)) {
			toast.error("Please review all fields");
			return;
		}

		setIsSubmitting(true);

		try {
			// Prepare data based on isAccessory flag
			let productItemUuid: string | null = null;

			if (!formData.isAccessory) {
				// Product Mode: Create product item
				const attributeInputs = Object.entries(formData.attributeValues)
					.filter(([, value]) => value.trim() !== "")
					.map(([attributeUuid, valueText]) => ({
						attributeUuid,
						valueText,
						productItemUuid: "", // Will be filled after product item creation
					}));

				// Step 1: Create the product item with external store details
				const productItemResponse = await createProductItem({
					variables: {
						input: {
							productUuid: formData.productUuid!,
							serialNumber: formData.serialNumber,
							condition: formData.condition as ProductCondition,
							costPrice: formData.costPrice,
							sellingPrice: formData.sellingPrice,
							externalStoreName: formData.externalStoreName,
							externalStoreContact: formData.externalStoreContact,
							externalStoreAddress: formData.externalStoreAddress,
						},
					},
				});

				if (!productItemResponse.data?.createProductItem) {
					throw new Error("Failed to create product item");
				}

				productItemUuid = productItemResponse.data.createProductItem.uuid;

				// Step 2: Save attribute values if any
				if (attributeInputs.length > 0) {
					const attributeInputsWithUuid = attributeInputs.map((input) => ({
						...input,
						productItemUuid,
					}));

					await setProductItemAttributeValues({
						variables: { inputs: attributeInputsWithUuid },
					});
				}
			}

			// Step 3: Create the sale with or without swap details
			// Determine sale type based on creditSaleType selection
			const saleType =
				formData.creditSaleType === "swap" ? SaleType.Swap : SaleType.Direct;

			const saleInput: Partial<SaleInput> = {
				saleType: saleType,
				customerName: formData.customerName,
				customerEmail: formData.customerEmail,
				customerPhone: formData.customerPhone,
				paymentType: formData.paymentType as PaymentType,
				totalAmount: formData.totalAmount,
				discountAmount: formData.discountAmount || 0,
				storeUuid,
			};

			// Add items or accessories based on mode
			if (formData.isAccessory) {
				// Accessory mode - create accessory first
				const accessoryResult = await createAccessory({
					variables: {
						input: {
							name: formData.accessoryName!,
							quantity: formData.accessoryQuantity!,
							sellingPrice: formData.sellingPrice,
							storeUuid,
						},
					},
				});

				const accessoryUuid = accessoryResult.data?.createAccessory.uuid;

				if (!accessoryUuid) {
					throw new Error("Failed to create accessory");
				}

				saleInput.items = [];
				saleInput.accessories = [
					{
						productUuid: accessoryUuid,
						quantity: formData.accessoryQuantity!,
						unitPrice: formData.sellingPrice,
					},
				];
			} else {
				// Product mode
				saleInput.items = [
					{
						serialNumber: formData.serialNumber,
						unitPrice: formData.saleAmount,
					},
				];
				saleInput.accessories = [];
			}

			// Add swap details if it's a swap sale (just reference details, don't create product item)
			if (
				formData.creditSaleType === "swap" &&
				formData.swapPhoneDetails.selectedProduct
			) {
				saleInput.givenProductUuid =
					formData.swapPhoneDetails.selectedProduct.uuid;
				saleInput.givenProductSerialNumber =
					formData.swapPhoneDetails.serialNumber;
				saleInput.givenProductCondition = formData.swapPhoneDetails
					.condition as ProductCondition;
				saleInput.givenProductValue = formData.swapPhoneDetails.estimatedValue;

				// Include given product attribute values if provided
				if (
					formData.swapPhoneDetails.attributeValues &&
					Object.keys(formData.swapPhoneDetails.attributeValues).length > 0
				) {
					saleInput.givenProductAttributeValues = Object.entries(
						formData.swapPhoneDetails.attributeValues,
					)
						.filter(
							([, v]) =>
								v !== undefined && v !== null && String(v).trim() !== "",
						)
						.map(([attributeUuid, value]) => ({
							attributeUuid,
							valueText: String(value),
						}));
				}
			}

			const createSaleResp = await createSale({
				variables: {
					input: saleInput as SaleInput,
				},
			});

			const created = createSaleResp.data?.createSale;
			setSaleResultState(
				created
					? {
							saleId: created.uuid,
							customerName: formData.customerName,
							totalAmount: formData.totalAmount,
							saleType:
								formData.creditSaleType === "swap"
									? SaleType.Swap
									: SaleType.Direct,
							paymentType: formData.paymentType,
							createdAt: created.createdAt,
						}
					: null,
			);

			setShowSuccess(true);
			setIsSubmitting(false);
			toast.success(
				formData.creditSaleType === "swap"
					? "Swap sale created successfully!"
					: "Direct sale created successfully!",
			);
		} catch (error) {
			console.error("Error creating credit sale:", error);
			toast.error("Failed to create credit sale. Please try again.");
			setIsSubmitting(false);
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<ProductDetails
						register={register}
						setValue={setValue}
						watch={watch}
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
				return <ReviewOrder formData={formData} />;
			default:
				return null;
		}
	};

	// Show success screen if sale is completed
	if (showSuccess) {
		// Build a minimal productItems array for the success screen
		const soldItems = [
			{
				id: "1",
				productName: "",
				serialNumber: formData.serialNumber,
				unitPrice: formData.saleAmount,
				attributeValues: {},
			},
		];

		return (
			<div className="py-[32px]">
				<div className="bg-white rounded-[10px] w-full">
					<CreditSaleSuccess
						saleData={
							saleResultState || {
								saleId: "",
								customerName: formData.customerName,
								totalAmount: formData.totalAmount,
								saleType:
									formData.creditSaleType === "swap"
										? SaleType.Swap
										: SaleType.Direct,
								paymentType: formData.paymentType,
								createdAt: new Date().toISOString(),
							}
						}
						productItems={soldItems}
						formData={formData}
						onNewSale={handleNewSale}
						onClose={handleClose}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="py-[32px]">
			<div className="flex">
				<StepNavigation
					steps={CREDIT_SALE_STEPS}
					currentStep={currentStep}
					onStepClick={handleStepClick}
				/>
				<div className="flex-1 pl-[24px]">
					<div className="bg-white rounded-[10px]">
						{renderStepContent()}

						<div className="flex gap-[12px] pt-[24px] mt-[24px] border-t-[2px] border-gray-200">
							<Button
								variant="secondary"
								onClick={handlePrevious}
								disabled={currentStep === 1}
								className={cn(
									"w-[50px] h-[50px] rounded-full flex items-center justify-center",
									{
										"opacity-50 cursor-not-allowed": currentStep === 1,
									},
								)}
							>
								←
							</Button>
							{currentStep < CREDIT_SALE_STEPS.length && (
								<Button
									type="button"
									onClick={handleNext}
									disabled={!canProceedToNextStep(currentStep, formData)}
									className={cn(
										"w-[50px] h-[50px] rounded-full flex items-center justify-center",
										{
											"opacity-50 cursor-not-allowed": !canProceedToNextStep(
												currentStep,
												formData,
											),
										},
									)}
								>
									→
								</Button>
							)}
							{currentStep === CREDIT_SALE_STEPS.length && (
								<Button
									type="button"
									onClick={handleSubmit}
									disabled={
										!canProceedToNextStep(currentStep, formData) || isSubmitting
									}
									className={cn("w-[150px] px-[16px] h-[50px] rounded-full", {
										"opacity-50 cursor-not-allowed":
											!canProceedToNextStep(currentStep, formData) ||
											isSubmitting,
									})}
								>
									{isSubmitting ? "Creating Sale..." : "Complete Sale"}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreditSale;
