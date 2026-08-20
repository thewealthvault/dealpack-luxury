'use client';

import { useState } from 'react';

export function usePdfGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async (elementId: string, fileName: string = 'Deal-Memo.pdf') => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Preview element not found');

      const html2pdf = (await import('html2pdf.js')).default;
      
      const options = {
        margin: [0, 0, 0, 0],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('PDF Generation Failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePdf, isGenerating };
}
