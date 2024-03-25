import React, { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from 'react-pdf';

import PDFSplitter from "./PDFSplitter";

// Remove the duplicate import of pdfjs
// import pdfjs from 'pdfjs-dist/build/pdf';
// import 'pdfjs-dist/build/pdf.worker.min';



function App() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:8000/get-files");
      console.log(result.data.data);
      setAllImage(result.data.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    try {
      const result = await axios.post(
        "http://localhost:8000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result);
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF. Please try again.');
    }
  };

  const showPdf = (pdf) => {
    window.open(`http://localhost:8000/files/${pdf}`,"_blank","noreferrer")
    // setPdfFile(`http://localhost:8000/files/${pdf}`);
  };

  return (
    <div className="App">
    <div class="flex justify-center items-end bg-gray-100 py-0">
<div class="w-11/12 max-w-3xl mb-16">
  <form class="formStyle bg-white shadow-md rounded-lg px-10 py-8 mb-4 mt-5" onSubmit={submitImage}>
    <h2 class="text-3xl font-bold mb-6 text-center text-blue-500">PDF Editor</h2>
    <h4 class="text-xl font-bold mb-4">Please Upload the PDF</h4>
    <div class="mb-6">
      <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Title:</label>
      <input
        id="title"
        type="text"
        class="form-control w-full border border-gray-300 rounded p-2"
        placeholder="Enter title"
        required
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div class="mb-6">
      <label for="pdfFile" class="block text-gray-700 text-sm font-bold mb-2">Select PDF:</label>
      <input
        id="pdfFile"
        type="file"
        class="form-control w-full border border-gray-300 rounded p-2"
        accept="application/pdf"
        required
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
    <div class="flex justify-center">
      <button class="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
        Submit
      </button>
    </div>
  </form>
</div>
</div>
  
    <PDFSplitter />
  </div>
  );
}

export default App;
