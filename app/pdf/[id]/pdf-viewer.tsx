"use client"

import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface PdfViewerProps {
  fileUrl: string;
  initialPage?: number;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl, initialPage = 1 }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= (numPages ?? 0)) {
      setPageNumber(pageNum);
    }
  };

  return (
    <div className="pdf-viewer max-w-4xl mx-auto my-6 p-4 bg-white rounded shadow-lg text-black" ref={viewerRef}>
      <div className="controls flex items-center justify-between mb-4">
        <button
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-lg">
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() => goToPage(pageNumber + 1)}
          disabled={pageNumber === numPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      <Document file={fileUrl} onLoadSuccess={onLoadSuccess} className="mx-auto">
        <Page
          pageNumber={pageNumber}
          className="mx-auto"
        />
      </Document>
    </div>
  );
};

export default PdfViewer;
