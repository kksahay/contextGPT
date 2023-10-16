import { useState, useEffect } from 'react';

function Viewer() {
  const [pdfBase64, setPdfBase64] = useState(null);

  useEffect(() => {
    const storedPdfBase64 = sessionStorage.getItem('pdfFile');
    if (storedPdfBase64) {
      setPdfBase64(storedPdfBase64);
    }
  }, []);

  return (
    <div>
      {pdfBase64 && (
        <iframe
          src={`data:application/pdf;base64,${pdfBase64}`}
          type="application/pdf"
          className='w-full aspect-auto h-92v rounded-xl'
        >
        </iframe>
      )}
    </div>
  );
}

export default Viewer;
