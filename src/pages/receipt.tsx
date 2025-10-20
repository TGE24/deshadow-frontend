import Button from "../components/Button";
import Share from "../components/Icons/Share";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
	PaymentTransactionStatus,
	useInvoiceLazyQuery,
	useVerifyPaymentMutation,
} from "../generated/graphql";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

const Receipt = () => {
	const { id } = useParams<{ id: string }>();
	const [searchParams] = useSearchParams();
	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState<number>(1);

	const [fetchInvoice] = useInvoiceLazyQuery();
	const [verifyPayment] = useVerifyPaymentMutation();

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	};

	useEffect(() => {
		const reference = searchParams.get("reference");
		if (reference) {
			verifyPayment({
				variables: {
					input: {
						reference,
					},
				},
				onCompleted(data) {
					if (data.verifyPayment.status === PaymentTransactionStatus.Success) {
						fetchInvoice({
							variables: {
								invoiceId: id || "",
							},
						});
					}
				},
			});
		}
	}, [fetchInvoice, id, searchParams, verifyPayment]);

	return (
		<section>
			<div className="flex items-center justify-between mb-[24px]">
				<h2 className="text-[16px] md:text-[20px] font-bold mb-[24px]">
					Invoice
				</h2>
				<Button
					size="small"
					className="border-[#E4E4E4] font-bold"
					variant="tetriary"
					icon={<Share />}
				>
					PRINT
				</Button>
			</div>

			{/* PDF Display using react-pdf */}
			{/* <div className="w-full bg-gray-50 rounded-lg p-4"> */}
			<Document
				file={
					"https://api.staging.de-shadow.com/invoices/2025-10-17_INV-002026_Technical_Catalyst.pdf"
				}
				onLoadSuccess={onDocumentLoadSuccess}
				onLoadError={(error) => {
					console.error("Error loading PDF:", error);
				}}
				loading={
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading Invoice...</p>
					</div>
				}
				error={
					<div className="text-center py-8">
						<p className="text-red-600 mb-4">Failed to load PDF</p>
						<a
							href={
								"https://api.staging.de-shadow.com/invoices/2025-10-17_INV-002026_Technical_Catalyst.pdf"
							}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
						>
							Open PDF in New Tab
						</a>
					</div>
				}
				className="w-full flex justify-center"
			>
				<Page
					pageNumber={pageNumber}
					width={800}
					className="mx-auto shadow-lg rounded-lg"
				/>
			</Document>

			{/* Page navigation if multiple pages */}
			{numPages && numPages > 1 && (
				<div className="flex justify-center items-center mt-4 space-x-4">
					<button
						onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
						disabled={pageNumber <= 1}
						className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
					>
						Previous
					</button>
					<span className="text-gray-600">
						Page {pageNumber} of {numPages}
					</span>
					<button
						onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
						disabled={pageNumber >= numPages}
						className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
					>
						Next
					</button>
				</div>
			)}
			{/* </div> */}
		</section>
	);
};

export default Receipt;
