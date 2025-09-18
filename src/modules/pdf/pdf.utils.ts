import PDFParser, { type Output } from "pdf2json";

const loadPdfStructure = (pdfBuffer: ArrayBufferLike): Promise<Output> =>
  new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError),
    );
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfData);
    });
    pdfParser.parseBuffer(Buffer.from(pdfBuffer));
  });

export const pdfUtils = {
  loadPdfStructure,
};
