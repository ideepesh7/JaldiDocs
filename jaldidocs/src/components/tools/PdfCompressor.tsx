import { useState } from 'react';
import { FileDown, Download, RotateCcw, AlertCircle, Info } from 'lucide-react';
import UploadDropzone from '../ui/UploadDropzone';
import { downloadBlob, loadPdfSafely, savePdfSafely } from '../../lib/pdfProcessing';

interface PdfInfo {
  file: File;
  originalSize: number;
}

export default function PdfCompressor() {
  const [pdf, setPdf] = useState<PdfInfo | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ blob: Blob; size: number; savings: number } | null>(null);

  const handleFile = (files: File[]) => {
    setPdf({ file: files[0], originalSize: files[0].size });
    setError('');
    setResult(null);
  };

  const fmtSize = (b: number) =>
    b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  const compress = async () => {
    if (!pdf) return;
    setProcessing(true);
    setError('');
    setResult(null);

    try {
      const { doc } = await loadPdfSafely(pdf.file);
      doc.setCreator('JaldiDocs');
      doc.setProducer('JaldiDocs');
      doc.setModificationDate(new Date());

      const optimised = await savePdfSafely(doc);
      const blob = new Blob([optimised], { type: 'application/pdf' });
      const savings = Math.round(((pdf.originalSize - blob.size) / pdf.originalSize) * 100);
      setResult({ blob, size: blob.size, savings });
    } catch (e: any) {
      if (e?.message === 'encrypted-pdf') {
        setError('This PDF is password-protected and cannot be processed. Please remove the password first.');
      } else {
        setError('Could not process this PDF. The file may be corrupted or use an unsupported format.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    downloadBlob(result.blob, `compressed-${pdf?.file.name || 'document.pdf'}`);
  };

  const reset = () => {
    setPdf(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3.5 text-sm text-blue-800">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Browser-based compressor:</strong> This tool performs a basic structural optimisation of
          your PDF — it works best on text-heavy and vector PDFs. It does{' '}
          <strong>not</strong> re-compress embedded images. For heavily scanned or image-heavy PDFs,
          the size reduction may be small or zero. Your file is never uploaded to any server.
        </p>
      </div>

      {!pdf && (
        <div className="card p-6">
          <UploadDropzone
            accept=".pdf,application/pdf"
            onFiles={handleFile}
            label="Drop your PDF here or click to choose"
            helpText="Supports standard PDF files up to 100MB"
            maxSizeMB={100}
            icon={<FileDown className="w-6 h-6" />}
          />
        </div>
      )}

      {pdf && (
        <div className="card p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-primary">File Details</h3>
              <button onClick={reset} className="btn-ghost text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Change file
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-secondary space-y-1.5">
              <div className="flex justify-between">
                <span>File name</span>
                <span className="text-primary font-medium truncate max-w-[200px]">{pdf.file.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Original size</span>
                <span className="text-primary font-semibold">{fmtSize(pdf.originalSize)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {result && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-border text-center">
                <div className="p-4">
                  <p className="text-xs text-secondary mb-1">Original</p>
                  <p className="font-semibold text-primary">{fmtSize(pdf.originalSize)}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-secondary mb-1">Optimised</p>
                  <p className={`font-semibold ${result.savings > 0 ? 'text-success' : 'text-primary'}`}>
                    {fmtSize(result.size)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-secondary mb-1">Saved</p>
                  <p className={`font-semibold ${result.savings > 0 ? 'text-success' : 'text-secondary'}`}>
                    {result.savings > 0 ? `${result.savings}%` : 'Minimal'}
                  </p>
                </div>
              </div>

              {result.savings <= 2 && (
                <div className="px-4 py-3 bg-amber-50 border-t border-border text-xs text-amber-800">
                  The optimisation had little effect on this PDF. This is normal for image-heavy or
                  scanned PDFs — those require server-side recompression which is outside what a
                  browser tool can do while keeping your files private.
                </div>
              )}
            </div>
          )}

          {!result ? (
            <button onClick={compress} disabled={processing} className="btn-primary w-full justify-center">
              {processing ? 'Optimising PDF…' : 'Optimise PDF'}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={download} className="btn-primary flex-1 justify-center">
                <Download className="w-4 h-4" /> Download Optimised PDF
              </button>
              <button onClick={reset} className="btn-secondary justify-center">
                <RotateCcw className="w-4 h-4" /> Try another file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
