import { delay } from "../state/requestState";

export async function processPage(_documentId, _pageNumber) {
  await delay(100);
  return {
    status: "not-implemented",
    message: "OCR processing requires a backend service.",
    documentId: _documentId,
    pageNumber: _pageNumber,
    regions: [],
  };
}

export async function extractTextRegions(_documentId, _pageNumber) {
  await delay(100);
  return {
    status: "not-implemented",
    message: "Text region extraction requires an OCR backend.",
    documentId: _documentId,
    pageNumber: _pageNumber,
    regions: [
      {
        id: `ocr-region-mock-1`,
        text: "[Placeholder OCR text]",
        boundingBox: { x: 0, y: 0, width: 100, height: 20 },
        confidence: 0,
      },
    ],
  };
}
