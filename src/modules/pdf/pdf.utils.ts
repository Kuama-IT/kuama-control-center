import { PDFDocument } from "pdf-lib";
import PDFParser, { type Output } from "pdf2json";

const loadPdfStructure = (pdfBuffer: ArrayBufferLike): Promise<Output> =>
    new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData) => {
            if (errData instanceof Error) {
                reject(errData);
                return;
            }
            reject(errData.parserError);
        });
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            resolve(pdfData);
        });
        pdfParser.parseBuffer(Buffer.from(pdfBuffer));
    });

const extractPageAsPdf = async (
    originalPdfBuffer: ArrayBufferLike,
    pageIndex: number,
): Promise<Uint8Array> => {
    // Convert ArrayBufferLike to ArrayBuffer if needed
    const arrayBuffer =
        originalPdfBuffer instanceof ArrayBuffer
            ? originalPdfBuffer
            : new ArrayBuffer(originalPdfBuffer.byteLength);

    if (!(originalPdfBuffer instanceof ArrayBuffer)) {
        const view = new Uint8Array(arrayBuffer);
        const sourceView = new Uint8Array(originalPdfBuffer);
        view.set(sourceView);
    }

    // Load the original PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Copy the specific page to the new document
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
    newPdfDoc.addPage(copiedPage);

    // Save the new PDF as bytes
    return await newPdfDoc.save();
};
export const pdfUtils = {
    loadPdfStructure,
    extractPageAsPdf,
};
