import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
	Accessory,
	PaymentType,
	SaleType,
	useCreateSaleMutation,
	useAccessoriesLazyQuery,
} from "../../generated/graphql";
import { formatNaira } from "../../utils/formatters";
import { useUserStore } from "../../store/userStore";
import { cn } from "../../utils/cn";

interface AccessorySaleProps {
	accessory: Accessory;
	onClose: () => void;
	refetch?: () => void;
}

interface AccessoryItem {
	id: string;
	accessory: Accessory | null;
	quantity: number;
	unitPrice: number;
	store?: { uuid: string; name: string } | null;
}

interface AccessorySaleForm {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	paymentType: PaymentType;
	discountAmount: number;
	notes: string;
}

const steps = [
	{ id: 1, title: "Accessories", description: "Select items to sell" },
	{ id: 2, title: "Customer", description: "Customer information" },
	{ id: 3, title: "Payment", description: "Payment & review" },
];

const AccessorySale = ({ accessory, onClose, refetch }: AccessorySaleProps) => {
	const { user } = useUserStore();
	const [createSale, { loading }] = useCreateSaleMutation();
	const [saleCompleted, setSaleCompleted] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);

	// Initialize with the pre-selected accessory
	const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>([
		{
			id: crypto.randomUUID(),
			accessory: accessory,
			quantity: 1,
			unitPrice: accessory.sellingPrice || 0,
		},
	]);

	const [getAccessories, { data: accessoriesData }] = useAccessoriesLazyQuery({
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		getAccessories({ variables: { pagination: { first: 100 } } });
	}, [getAccessories]);

	const accessoriesOptions =
		accessoriesData?.accessories?.edges?.map((edge) => {
			const node = edge.node as Accessory;
			return {
				value: node.uuid,
				label: `${node.name} (Available: ${node.quantity})`,
				accessory: node,
			};
		}) || [];

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<AccessorySaleForm>({
		defaultValues: {
			customerName: "N/A",
			customerEmail: "",
			customerPhone: "",
			paymentType: PaymentType.Cash,
			discountAmount: 0,
			notes: "",
		},
	});

	const formData = watch();

	const addAccessoryItem = () => {
		setAccessoryItems([
			...accessoryItems,
			{
				id: crypto.randomUUID(),
				accessory: null,
				quantity: 1,
				unitPrice: 0,
			},
		]);
	};

	const removeAccessoryItem = (id: string) => {
		if (accessoryItems.length > 1) {
			setAccessoryItems(accessoryItems.filter((item) => item.id !== id));
		}
	};

	const updateAccessoryItem = (id: string, updates: Partial<AccessoryItem>) => {
		setAccessoryItems(
			accessoryItems.map((item) =>
				item.id === id ? { ...item, ...updates } : item,
			),
		);
	};

	const subtotal = accessoryItems.reduce((total, item) => {
		return total + (item.quantity || 0) * (item.unitPrice || 0);
	}, 0);

	const totalAmount = subtotal - (formData.discountAmount || 0);

	const canProceedToNextStep = () => {
		if (currentStep === 1) {
			// Check if all accessories are selected and have valid quantities
			return accessoryItems.every(
				(item) =>
					item.accessory &&
					item.quantity > 0 &&
					item.quantity <= item.accessory.quantity,
			);
		}
		if (currentStep === 2) {
			return formData.customerPhone.trim().length > 0;
		}
		return true;
	};

	const nextStep = () => {
		if (currentStep < steps.length && canProceedToNextStep()) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: AccessorySaleForm) => {
		const assignedStoreUuid =
			user?.assignedStore?.uuid || user?.ownedStores?.[0]?.uuid;

		// Get store UUID from the first accessory that has a store
		const accessoryStoreUuid = accessoryItems.find(
			(item) => item.accessory?.store?.uuid,
		)?.accessory?.store?.uuid;

		const storeUuid = assignedStoreUuid || accessoryStoreUuid || "";

		try {
			await createSale({
				variables: {
					input: {
						customerName: data.customerName,
						customerEmail: data.customerEmail || undefined,
						customerPhone: data.customerPhone,
						saleType: SaleType.Direct,
						paymentType: data.paymentType,
						totalAmount,
						discountAmount: data.discountAmount,
						notes: data.notes || undefined,
						storeUuid: storeUuid,
						accessories: accessoryItems.map((item) => ({
							productUuid: item.accessory!.uuid,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
						})),
					},
				},
				onCompleted: (response) => {
					if (response?.createSale) {
						setSaleCompleted(true);
						toast.success("Sale completed successfully!");
						refetch?.();
					}
				},
				onError: (error) => {
					toast.error(
						error.message || "Failed to complete sale. Please try again.",
					);
				},
			});
		} catch (error) {
			console.error("Sale error:", error);
		}
	};

	if (saleCompleted) {
		return (
			<div className="p-8 text-center">
				<div className="mb-6">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Sale Completed!
					</h2>
					<p className="text-gray-600">
						{accessoryItems.length} accessory item(s) sold successfully
					</p>
				</div>

				<div className="bg-gray-50 rounded-lg p-6 mb-6">
					<div className="space-y-3 text-left">
						<div className="flex justify-between">
							<span className="text-gray-600">Customer:</span>
							<span className="font-medium">{formData.customerName}</span>
						</div>
						{accessoryItems.map((item) => (
							<div key={item.id} className="flex justify-between text-sm">
								<span className="text-gray-600">
									{item.quantity}x {item.accessory?.name}:
								</span>
								<span className="font-medium">
									{formatNaira(item.quantity * item.unitPrice)}
								</span>
							</div>
						))}
						{formData.discountAmount > 0 && (
							<div className="flex justify-between">
								<span className="text-gray-600">Discount:</span>
								<span className="font-medium text-red-600">
									-{formatNaira(formData.discountAmount)}
								</span>
							</div>
						)}
						<div className="flex justify-between pt-3 border-t border-gray-300">
							<span className="text-gray-900 font-semibold">Total Amount:</span>
							<span className="font-bold text-lg">
								{formatNaira(totalAmount)}
							</span>
						</div>
					</div>
				</div>

				<div className="flex gap-4">
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						className="flex-1"
					>
						Close
					</Button>
					<Button
						type="button"
						onClick={() => {
							setSaleCompleted(false);
							setCurrentStep(1);
						}}
						className="flex-1"
						size="large"
					>
						New Sale
					</Button>
				</div>
			</div>
		);
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Select Accessories</h3>
							<Button
								type="button"
								onClick={addAccessoryItem}
								size="small"
								variant="secondary"
							>
								+ Add Another
							</Button>
						</div>

						{accessoryItems.map((item, index) => (
							<div
								key={item.id}
								className="bg-gray-50 border border-gray-200 rounded-lg p-4"
							>
								<div className="flex justify-between items-start mb-4">
									<span className="text-sm font-medium text-gray-700">
										Item {index + 1}
									</span>
									{accessoryItems.length > 1 && (
										<button
											type="button"
											onClick={() => removeAccessoryItem(item.id)}
											className="text-red-500 hover:text-red-700 text-sm font-medium"
										>
											Remove
										</button>
									)}
								</div>

								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Select Accessory *
										</label>
										<Select
											options={accessoriesOptions}
											value={
												item.accessory
													? accessoriesOptions.find(
															(opt) => opt.value === item.accessory?.uuid,
														)
													: null
											}
											onChange={(option) => {
												if (option) {
													updateAccessoryItem(item.id, {
														accessory: option.accessory,
														unitPrice: option.accessory.sellingPrice || 0,
													});
												}
											}}
											placeholder="Select an accessory..."
											styles={{
												control: (base) => ({
													...base,
													minHeight: "50px",
													borderRadius: "10px",
													borderColor: "#E5E7EB",
													borderWidth: "2px",
												}),
											}}
										/>
									</div>

									{item.accessory && (
										<>
											<div className="bg-blue-50 border border-blue-200 rounded p-3">
												<p className="text-sm text-gray-700">
													Available: {item.accessory.quantity} units | Price:{" "}
													{formatNaira(item.accessory.sellingPrice)}
												</p>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Quantity *
													</label>
													<input
														type="number"
														value={item.quantity}
														onChange={(e) =>
															updateAccessoryItem(item.id, {
																quantity: parseInt(e.target.value) || 0,
															})
														}
														min="1"
														max={item.accessory.quantity}
														className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Unit Price *
													</label>
													<input
														type="text"
														value={formatNaira(item.unitPrice)}
														onChange={(e) => {
															const numericValue = e.target.value
																.replace(/₦|,/g, "")
																.replace(/[^0-9.]/g, "");
															updateAccessoryItem(item.id, {
																unitPrice: parseFloat(numericValue) || 0,
															});
														}}
														className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
													/>
												</div>
											</div>

											<div className="text-right text-sm font-medium">
												Line Total:{" "}
												{formatNaira(item.quantity * item.unitPrice)}
											</div>
										</>
									)}
								</div>
							</div>
						))}

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex justify-between items-center">
								<span className="font-semibold">Subtotal:</span>
								<span className="text-lg font-bold">
									{formatNaira(subtotal)}
								</span>
							</div>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-4">Customer Information</h3>

						<Input
							label="Customer Phone *"
							type="tel"
							placeholder="+234..."
							{...register("customerPhone", {
								required: "Customer number is required",
							})}
						/>
						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Email"
								type="email"
								placeholder="customer@example.com"
								{...register("customerEmail")}
							/>
							<Input
								label="Customer Name"
								placeholder="Enter customer name"
								{...register("customerName")}
								errors={errors.customerName}
							/>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-4">Payment Details</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Payment Type *
									</label>
									<select
										{...register("paymentType")}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value={PaymentType.Cash}>Cash</option>
										<option value={PaymentType.Transfer}>Transfer</option>
										<option value={PaymentType.Pos}>POS</option>
										<option value={PaymentType.CashTransfer}>
											Cash + Transfer
										</option>
										<option value={PaymentType.PosCash}>POS + Cash</option>
										<option value={PaymentType.PosTransfer}>
											POS + Transfer
										</option>
									</select>
								</div>
								<Input
									label="Discount Amount"
									type="text"
									placeholder="₦0.00"
									value={
										formData.discountAmount
											? formatNaira(formData.discountAmount)
											: ""
									}
									onChange={(e) => {
										const numericValue = e.target.value
											.replace(/₦|,/g, "")
											.replace(/[^0-9.]/g, "");
										const parsedValue = parseFloat(numericValue) || 0;
										setValue("discountAmount", parsedValue);
									}}
								/>
								<Input
									label="Notes"
									placeholder="Additional notes (optional)"
									{...register("notes")}
								/>
							</div>
						</div>

						<div className="border-t pt-6">
							<h3 className="text-lg font-semibold mb-4">Order Summary</h3>
							<div className="bg-gray-50 rounded-lg p-4 space-y-2">
								<div className="flex justify-between text-sm font-medium">
									<span>Customer:</span>
									<span>{formData.customerName}</span>
								</div>
								{accessoryItems.map((item) => (
									<div key={item.id} className="flex justify-between text-sm">
										<span className="text-gray-600">
											{item.quantity}x {item.accessory?.name}
										</span>
										<span>{formatNaira(item.quantity * item.unitPrice)}</span>
									</div>
								))}
								<div className="flex justify-between text-sm pt-2 border-t">
									<span className="text-gray-600">Subtotal:</span>
									<span className="font-medium">{formatNaira(subtotal)}</span>
								</div>
								{formData.discountAmount > 0 && (
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Discount:</span>
										<span className="font-medium text-red-600">
											-{formatNaira(formData.discountAmount)}
										</span>
									</div>
								)}
								<div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
									<span>Total Amount:</span>
									<span className="text-green-600">
										{formatNaira(totalAmount)}
									</span>
								</div>
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="p-6 w-full">
			<h2 className="text-2xl font-bold mb-6">Sell Accessories</h2>

			{/* Step Navigation */}
			<div className="flex justify-between mb-8">
				{steps.map((step) => (
					<div
						key={step.id}
						className={cn("flex-1 relative", {
							"after:content-[''] after:absolute after:top-5 after:left-[60%] after:w-[80%] after:h-[2px] after:bg-gray-300":
								step.id < steps.length,
						})}
					>
						<div className="flex flex-col items-center relative z-10">
							<div
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
									{
										"bg-[#278783] text-white": currentStep >= step.id,
										"bg-gray-200 text-gray-600": currentStep < step.id,
									},
								)}
							>
								{step.id}
							</div>
							<div className="text-center mt-2">
								<p className="text-sm font-medium">{step.title}</p>
								<p className="text-xs text-gray-500">{step.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
				className="space-y-6"
			>
				{renderStepContent()}

				{/* Navigation Buttons */}
				<div className="flex justify-between pt-6 border-t">
					<Button
						type="button"
						variant="secondary"
						onClick={currentStep === 1 ? onClose : prevStep}
						className="px-6"
					>
						{currentStep === 1 ? "Cancel" : "← Back"}
					</Button>

					{currentStep < steps.length ? (
						<Button
							type="button"
							onClick={nextStep}
							disabled={!canProceedToNextStep()}
							className={cn("px-6", {
								"opacity-50 cursor-not-allowed": !canProceedToNextStep(),
							})}
							size="large"
						>
							Next →
						</Button>
					) : (
						<Button
							type="button"
							onClick={handleSubmit(onSubmit)}
							disabled={loading || !canProceedToNextStep()}
							className={cn("px-6", {
								"opacity-50 cursor-not-allowed":
									loading || !canProceedToNextStep(),
							})}
							size="large"
						>
							{loading ? "Processing..." : "Complete Sale"}
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};

export default AccessorySale;
