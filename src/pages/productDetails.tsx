import { useEffect } from "react";
import { useProductLazyQuery } from "../generated/graphql";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
	const [getProduct, { data, loading }] = useProductLazyQuery();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id) {
			getProduct({ variables: { uuid: id } });
		}
	}, [id, getProduct]);

	const product = data?.product;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-600 mb-2">
						Product Not Found
					</h2>
					<p className="text-gray-500">
						The product you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	// Get the first image if available
	const primaryImage = product.images?.[0]?.imageUrl;

	// Get the first item's condition for status display
	const firstItem = product.items?.[0];

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<div className="mb-6">
				<nav className="text-sm">
					<span className="text-gray-500">Products</span>
					<span className="text-gray-400 mx-2">/</span>
					<span className="text-gray-900 font-medium">{product.name}</span>
				</nav>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
				{/* Image Section */}
				<div className="space-y-4">
					<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
						{primaryImage ? (
							<img
								src={primaryImage}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<div className="text-center text-gray-400">
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
									<span className="text-lg">No Image Available</span>
								</div>
							</div>
						)}
					</div>

					{/* Additional Images Thumbnails */}
					{product.images && product.images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto">
							{product.images.slice(1, 5).map((image, index) => (
								<div
									key={index}
									className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border overflow-hidden"
								>
									<img
										src={image.imageUrl}
										alt={`${product.name} ${index + 2}`}
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Product Details Section */}
				<div className="space-y-6">
					{/* Title and Brand */}
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{product.name}
						</h1>
						{product.brand && (
							<p className="text-lg text-gray-600">{product.brand.name}</p>
						)}
					</div>

					{/* Availability Status */}
					{product.items && product.items.length > 0 && (
						<div className="flex items-center gap-4">
							<span className="text-sm font-medium text-gray-600">
								Available Items: {product.items.length}
							</span>
							{firstItem && (
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium ${
										firstItem.condition === "new"
											? "bg-green-100 text-green-800"
											: firstItem.condition === "fairly_used"
											? "bg-yellow-100 text-yellow-800"
											: firstItem.condition === "refurbished"
											? "bg-blue-100 text-blue-800"
											: "bg-gray-100 text-gray-800"
									}`}
								>
									{firstItem.condition?.replace("_", " ")}
								</span>
							)}
						</div>
					)}

					{/* Description */}
					{product.description && (
						<div className="space-y-2">
							<h3 className="text-lg font-semibold text-gray-900">
								Description
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{product.description}
							</p>
						</div>
					)}

					{/* Product Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Product Information
						</h3>
						<div className="bg-gray-50 rounded-lg p-4 space-y-3">
							{product.model && (
								<div className="flex justify-between">
									<span className="text-gray-600">Model:</span>
									<span className="font-medium">{product.model}</span>
								</div>
							)}
							{product.category && (
								<div className="flex justify-between">
									<span className="text-gray-600">Category:</span>
									<span className="font-medium">{product.category.name}</span>
								</div>
							)}
							{firstItem?.serialNumber && (
								<div className="flex justify-between">
									<span className="text-gray-600">Serial Number:</span>
									<span className="font-medium">{firstItem.serialNumber}</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="text-gray-600">Total Items:</span>
								<span className="font-medium">
									{product.items?.length || 0}
								</span>
							</div>
						</div>
					</div>

					{/* Items List */}
					{product.items && product.items.length > 0 && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Available Items
							</h3>
							<div className="space-y-2 max-h-48 overflow-y-auto">
								{product.items.map((item, index) => (
									<div
										key={item.uuid}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div>
											<span className="text-sm font-medium">
												Item #{index + 1}
											</span>
											{item.serialNumber && (
												<p className="text-xs text-gray-600">
													S/N: {item.serialNumber}
												</p>
											)}
										</div>
										<div className="flex gap-2">
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													item.condition === "new"
														? "bg-green-100 text-green-800"
														: item.condition === "fairly_used"
														? "bg-yellow-100 text-yellow-800"
														: item.condition === "refurbished"
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{item.condition?.replace("_", " ")}
											</span>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													item.status === "available"
														? "bg-green-100 text-green-800"
														: item.status === "sold"
														? "bg-red-100 text-red-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{item.status}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Store Information */}
					{product.store && (
						<div className="border-t pt-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Store Information
							</h3>
							<div className="bg-blue-50 rounded-lg p-4">
								<p className="font-medium text-blue-900">
									{product.store.name}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
