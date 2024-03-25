import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

function PDFSplitter() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [pageNumbers, setPageNumbers] = useState('');
  const [splitPdfUrl, setSplitPdfUrl] = useState('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState('');

  useEffect(() => {
    fetchPdfFromDatabase();
  }, []);

  const fetchPdfFromDatabase = async () => {
    try {
      const result = await axios.get("http://localhost:8000/get-files");
      if (result.data && result.data.data) {
        setPdfFiles(result.data.data);
      } else {
        console.error('Error: Unable to fetch PDF files from database.');
      }
    } catch (error) {
      console.error('Error fetching PDF files from database:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedPdf = e.target.value;
    setSelectedFile(selectedPdf);
    const pdfUrl = `http://localhost:8000/files/${selectedPdf}`;
    setPreviewPdfUrl(pdfUrl);
  };

  const splitPDF = async () => {
    if (!selectedFile || !pageNumbers || !previewPdfUrl) {
      alert('Please select a PDF file and enter page numbers to split.');
      return;
    }

    try {
      const result = await axios.get(previewPdfUrl, {
        responseType: 'arraybuffer'
      });

      const pdfBytes = result.data;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdfDoc = await PDFDocument.create();
      const pageNumberArray = pageNumbers.split(',').map(Number);

      for (const pageNumber of pageNumberArray) {
        if (pageNumber <= 0 || pageNumber > pdfDoc.getPageCount()) {
          alert('Invalid page number: ' + pageNumber);
          return;
        }
        const copiedPage = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
        newPdfDoc.addPage(copiedPage[0]);
      }

      const pdfBytesResult = await newPdfDoc.save();
      const pdfBlob = new Blob([pdfBytesResult], { type: 'application/pdf' });
      const splitPdfUrl = URL.createObjectURL(pdfBlob);
      setSplitPdfUrl(splitPdfUrl);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('Error splitting PDF. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-start h-auto bg-gray-100 py-0">
    <div className="w-3/4 mt-8 h-auto">
      {/* <h1 className="text-3xl font-bold mb-4 text-center">PDF Splitter</h1> */}
  
      <label htmlFor="selectPdf" className="block text-gray-700 text-sm font-bold mb-2">Select PDF file:</label>
      <select id="selectPdf" onChange={handleFileChange} className="w-full border border-gray-300 rounded p-2 mb-4">
        <option value="">Select a PDF</option>
        {pdfFiles.map((pdf, index) => (
        <option key={index} value={pdf.pdf}>{pdf.title}</option>
        ))}
      </select>
  
      {previewPdfUrl && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">PDF Preview:</h2>
        <div className="border border-gray-300">
          <iframe title="PDF Preview" src={previewPdfUrl} width="100%" height="800px"></iframe>
        </div>
      </div>
      )}
  
  
  <div className='flex flex-col lg:flex-row'>
    <div className='max-w-md lg:mr-8 mb-4 lg:mb-0'>
      <label htmlFor="pageNumbers" className="block text-gray-700 text-sm font-bold mb-2">Enter page numbers to split (comma-separated) and click on download Button :</label>
      <input type="text" id="pageNumbers" value={pageNumbers} onChange={(e) => setPageNumbers(e.target.value)} className="w-full border border-gray-300 rounded p-2 mb-4" />
  
      <button onClick={splitPDF} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4 w-full">Split PDF</button>
    </div>
  
    <div className='max-w-md'>
      {splitPdfUrl && (
        <div class="flex justify-center items-center h-full">
          <div class="max-w-md w-full rounded">
            <h2 class="text-xl font-bold mb-4">Download Split PDF:</h2>
            <a href={splitPdfUrl} target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 mb-4 w-full text-center">Download Split PDF</a>
          </div>
        </div>
      )}
    </div>
  </div>
  
    </div>
  </div>
  
  );
}

export default PDFSplitter;
