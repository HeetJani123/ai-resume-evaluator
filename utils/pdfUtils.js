import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const extractTextFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    const cleanedText = fullText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ') 
      .replace(/\s+/g, ' ') 
      .trim();
    if (cleanedText.length < 50) {
      throw new Error('Could not extract meaningful text from PDF. The file might be image-based or corrupted.');
    }
    return cleanedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF with selectable text.');
  }
}; 