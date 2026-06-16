import { useState } from 'react';
import { Combine, ArrowUp, ArrowDown, X, Download, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import UploadDropzone from '../ui/UploadDropzone';
import { downloadBlob, loadPdfSafely, naturalFileSort, savePdfSafely, yieldToBrowser } from '../../lib/pdfProcessing';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePdf() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addPdfs = (files: File[]) => {
    setError('');
    setSuccess('');

    const existing = new Set(pdfs.map((pdf) => `${pdf.name}-${pdf.size}`));
    const incoming = naturalFileSort(files).filter((file) => !existing.has(`${file.name}-${file.size}`));

    if (incoming.length === 0) {
      setError('These PDFs are already added.');
      return;
    }

    const newPdfs = incoming.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
    }));

    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const remove = (id: string) => setPdfs((prev) => prev.filter((p) => p.id !== id));

  const move = (id: string, dir: 'up' | 'down') => {
    setPdfs((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === prev.length - 1)) return prev;
      const arr = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  const merge = async () => {
    if (pdfs.length < 2) { setError('Please add at least 2 PDF files to merge.'); return; }
    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const merged = await PDFDocument.create({ updateMetadata: false });
      merged.setTitle('Merged PDF');
      merged.setCreator('JaldiDocs');
      merged.setProducer('JaldiDocs');
      merged.setCreationDate(new Date());
      merged.setModificationDate(new Date());

      for (const pdfFile of pdfs) {
        try {
          const { doc } = await loadPdfSafely(pdfFile.file);
          const pages = await merged.copyPages(doc, doc.getPageIndices());
          pages.forEach((p) => merged.addPage(p));
          await yieldToBrowser();
        } catch (e: any) {
          if (e?.message === 'encrypted-pdf') {
            setError(`"${pdfFile.name}" is password-protected and cannot be merged. Please remove the password first.`);
            setProcessing(false);
            return;
          }
          setError(`"${pdfFile.name}" could not be read. It may be corrupted or unsupported.`);
          setProcessing(false);
          return;
        }
      }

      const bytes = await savePdfSafely(merged);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, 'merged-document.pdf');
      setSuccess(`${pdfs.length} PDFs merged successfully. Download started.`);
    } catch {
      setError('Could not merge PDFs. One or more files may be corrupted or unsupported.');
    } finally {
      setProcessing(false);
    }
  };

  const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;
  const totalSize = pdfs.reduce((acc, p) => acc + p.size, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <UploadDropzone
          accept=".pdf,application/pdf"
          multiple
          onFiles={addPdfs}
          label={pdfs.length > 0 ? 'Add more PDFs' : 'Drop PDF files here or click to choose'}
          helpText="Select multiple PDF files to merge"
          maxSizeMB={100}
          icon={<Combine className="w-6 h-6" />}
        />
      </div>

      {pdfs.length > 0 && (
        <>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-primary">{pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''} added</h3>
                <p className="text-xs text-secondary">Total: {fmtSize(totalSize)}</p>
              </div>
              <button onClick={() => setPdfs([])} className="btn-ghost text-xs text-danger gap-1.5">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {pdfs.map((pdf, idx) => (
                <div key={pdf.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-red-600">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">{pdf.name}</p>
                    <p className="text-xs text-secondary">{fmtSize(pdf.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => move(pdf.id, 'up')} disabled={idx === 0} className="p-1.5 rounded-lg text-secondary hover:bg-gray-200 disabled:opacity-30 transition-colors" aria-label="Move up">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => move(pdf.id, 'down')} disabled={idx === pdfs.length - 1} className="p-1.5 rounded-lg text-secondary hover:bg-gray-200 disabled:opacity-30 transition-colors" aria-label="Move down">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(pdf.id)} className="p-1.5 rounded-lg text-danger hover:bg-red-50 transition-colors" aria-label="Remove file">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Password-protected PDFs cannot be merged. All merging happens in your browser — your files are not uploaded anywhere.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-sm text-success">{success}</p>
            </div>
          )}

          <button
            onClick={merge}
            disabled={processing || pdfs.length < 2}
            className="btn-primary w-full justify-center"
          >
            <Download className="w-4 h-4" />
            {processing ? 'Merging PDFs…' : `Merge ${pdfs.length} PDFs & Download`}
          </button>
        </>
      )}
    </div>
  );
}
