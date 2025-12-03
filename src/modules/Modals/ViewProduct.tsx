import Modal from "react-responsive-modal";
import { useProductStore } from "../../store/productStore";
import { useState } from "react";

interface ViewProductProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ViewProduct = ({ open, setOpen }: ViewProductProps) => {
	const { productItem } = useProductStore();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	// Get primary image or first image
	const images = productItem?.images || [];
	const primaryImage = images.find((img) => img.isPrimary) || images[0];
	const selectedImage = images[selectedImageIndex] || primaryImage;

	// Format condition
	const formatCondition = (condition?: string) => {
		if (!condition) return "N/A";
		return condition.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
	};

	// Format status
	const formatStatus = (status?: string) => {
		if (!status) return "N/A";
		return status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
	};

	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			center
			classNames={{
				modal: "rounded-[16px] !px-0 !py-0 w-full !max-w-[750px] !m-0",
				overlay: "backdrop-blur-[6px]",
			}}
			closeIcon={<></>}
		>
			<div className="bg-white rounded-[16px] overflow-hidden max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="px-8 py-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-900">
							{productItem?.product?.name || "Product Details"}
						</h2>
						<button
							onClick={() => setOpen(false)}
							className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					{productItem?.product?.brand && (
						<p className="text-gray-500 mt-1">
							{productItem.product.brand.name}
						</p>
					)}
				</div>

				{/* Content - Scrollable */}
				<div className="overflow-y-auto flex-1">
					<div className="p-8">
						{/* Product Information Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							{/* Basic Information Card */}
							<div className="bg-gray-50 rounded-xl p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Basic Information
								</h3>
								<div className="space-y-3">
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
											Serial Number
										</p>
										<p className="text-sm font-medium text-gray-900">
											{productItem?.serialNumber || "N/A"}
										</p>
									</div>

									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
											Category
										</p>
										<p className="text-sm font-medium text-gray-900">
											{productItem?.product?.category?.name || "N/A"}
										</p>
									</div>

									{productItem?.product?.model && (
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
												Model
											</p>
											<p className="text-sm font-medium text-gray-900">
												{productItem.product.model}
											</p>
										</div>
									)}

									{productItem?.store && (
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
												Store
											</p>
											<p className="text-sm font-medium text-gray-900">
												{productItem.store.name}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Status & Condition Card */}
							<div className="bg-gray-50 rounded-xl p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Status & Condition
								</h3>
								<div className="space-y-3">
									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
											Condition
										</p>
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
												productItem?.condition === "new"
													? "bg-green-100 text-green-800"
													: productItem?.condition === "fairly_used"
													? "bg-yellow-100 text-yellow-800"
													: productItem?.condition === "refurbished"
													? "bg-blue-100 text-blue-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{formatCondition(productItem?.condition)}
										</span>
									</div>

									<div>
										<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
											Status
										</p>
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
												productItem?.status === "available"
													? "bg-green-100 text-green-800"
													: productItem?.status === "sold"
													? "bg-red-100 text-red-800"
													: productItem?.status === "reserved"
													? "bg-blue-100 text-blue-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{formatStatus(productItem?.status)}
										</span>
									</div>

									{/* {productItem?.sellingPrice && (
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
												Cost Price
											</p>
											<p className="text-sm font-medium text-gray-900">
												{formatPrice(productItem.sellingPrice)}
											</p>
										</div>
									)} */}
								</div>
							</div>
						</div>

						{/* Product Attributes */}
						{productItem?.attributeValues &&
							productItem.attributeValues.length > 0 && (
								<div className="bg-gray-50 rounded-xl p-6 mb-8">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										Product Attributes
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{productItem.attributeValues.map((attrValue) => (
											<div key={attrValue.attribute?.uuid}>
												<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
													{attrValue.attribute?.name || "Unknown"}
												</p>
												<p className="text-sm font-medium text-gray-900">
													{attrValue.valueText || "N/A"}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

						{/* Image Gallery */}
						<div className="mb-8">
							<div className="flex gap-6">
								{/* Thumbnail Gallery - Left Side */}
								{images.length > 0 && (
									<div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
										{images.map((image, index) => (
											<button
												key={image.uuid}
												onClick={() => setSelectedImageIndex(index)}
												className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
													selectedImageIndex === index
														? "border-gray-900 shadow-md"
														: "border-gray-200 hover:border-gray-400"
												}`}
											>
												<img
													src={`${
														import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL
													}${image.imageUrl}`}
													alt={image.altText || `Thumbnail ${index + 1}`}
													className="w-full h-full object-cover"
												/>
											</button>
										))}
									</div>
								)}

								{/* Main Image - Right Side */}
								<div className="flex-1 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center h-[300px]">
									{selectedImage ? (
										<img
											src={`${import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL}${
												selectedImage.imageUrl
											}`}
											alt={selectedImage.altText || "Product image"}
											className="w-full h-full object-contain p-4"
										/>
									) : (
										<div className="text-center text-gray-400 p-8">
											<svg
												className="mx-auto h-24 w-24 mb-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1}
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											<span className="text-sm">No Image Available</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Notes Section */}
						{productItem?.notes && (
							<div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
								<h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
									<svg
										className="w-5 h-5 mr-2 text-amber-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
										/>
									</svg>
									Notes
								</h3>
								<p className="text-sm text-gray-700 leading-relaxed">
									{productItem.notes}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ViewProduct;
