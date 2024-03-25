// pdfDetails.js

import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema({
  title: String,
  pdf: String
});

export default mongoose.model('PdfDetails', PdfSchema);
