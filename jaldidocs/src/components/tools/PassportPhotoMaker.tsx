// src/components/tools/PassportPhotoMaker.tsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, UserSquare2 } from 'lucide-react';
import UploadDropzone from '../ui/UploadDropzone';
import { jsPDF } from 'jspdf';

const PHOTO_SIZES = [
  { id: 'passport-india', label: 'Indian Passport (35×45mm)', w: 413, h: 531, desc: 'Standard for Indian passport applications' },
  { id: 'us-visa', label: '2×2 inch (US/Visa)', w: 600, h: 600, desc: 'US visa, green card, and international use' },
  { id: 'square', label: 'Square 200×200', w: 200, h: 200, desc: 'General purpose square photo' },
  { id: 'custom', label: 'Custom Size', w: 0, h: 0, desc: 'Enter your own dimensions' },
];

const BG_COLORS = [
  { id: 'white', label: 'White', value: '#FFFFFF' },
  { id: 'lightblue', label: 'Light Blue', value: '#C8DCEF' },
  { id: 'lightgrey', label: 'Light Grey', value: '#E8E8E8' },
];

export default function PassportPhotoMaker() {
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedSize, setSelectedSize] = useState(PHOTO_SIZES[0]);
  const [customW, setCustomW] = useState('413');
  const [customH, setCustomH] = useState('531');
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const [outputUrl, setOutputUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const loadImage = useCallback((files: File[]) => {
    const file = files[0];
    setFileName(file.name);
    setError('');
    setOutputUrl('');
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const generate = async () => {
    if (!imageUrl) return;
    setProcessing(true);
    setError('');

    try {
      const targetW = selectedSize.id === 'custom' ? parseInt(customW) : selectedSize.w;
      const targetH = selectedSize.id === 'custom' ? parseInt(customH) : selectedSize.h;

      if (!targetW || !targetH || targetW < 10 || targetH < 10) {
        setError('Please enter valid dimensions.');
        setProcessing(false);
        return;
      }

      const img = new window.Image();
      img.src = imageUrl;
      await new Promise((res) => (img.onload = res));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;

      // Fill background
      ctx.fillStyle = bgColor.value;
      ctx.fillRect(0, 0, targetW, targetH);

      // Fit image centered, preserving aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = targetW / targetH;
      let drawW, drawH, drawX, drawY;

      if (imgAspect > canvasAspect) {
        drawH = targetH;
        drawW = drawH * imgAspect;
        drawX = (targetW - drawW) / 2;
        drawY = 0;
      } else {
        drawW = targetW;
        drawH = drawW / imgAspect;
        drawX = 0;
        drawY = (targetH - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const url = canvas.toDataURL('image/jpeg', 0.95);
      setOutputUrl(url);
    } catch {
      setError('Could not generate photo. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadJpg = () => {
    if (!outputUrl) return;
    const a = downloadRef.current!;
    a.href = outputUrl;
    a.download = 'passport-photo.jpg';
    a.click();
  };

  const downloadPdf = () => {
    if (!outputUrl) return;
    const doc = new jsPDF({ unit: 'mm', format: [152.4, 101.6] }); // 6×4 inch
    const photoW = selectedSize.id === 'custom' ? parseFloat(customW) / 11.811 : (selectedSize.w / 11.811);
    const photoH = selectedSize.id === 'custom' ? parseFloat(customH) / 11.811 : (selectedSize.h / 11.811);
    const cols = Math.floor(152.4 / (photoW + 3));
    const rows = Math.floor(101.6 / (photoH + 3));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        doc.addImage(outputUrl, 'JPEG', 3 + c * (photoW + 3), 3 + r * (photoH + 3), photoW, photoH);
      }
    }
    doc.save('passport-photos-sheet.pdf');
  };

  return (
    <div className="space-y-6">
      {!imageUrl && (
        <div className="card p-6">
          <UploadDropzone
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onFiles={loadImage}
            label="Upload your photo"
            helpText="JPG, PNG or WEBP • Front-facing, good lighting"
            maxSizeMB={15}
            icon={<UserSquare2 className="w-6 h-6" />}
          />
        </div>
      )}

      {imageUrl && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="card p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary">Uploaded Photo</h3>
                <button onClick={() => { setImageUrl(''); setOutputUrl(''); }} className="btn-ghost text-xs gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Change
                </button>
              </div>
              <img src={imageUrl} alt="Uploaded" className="w-full max-h-40 object-contain rounded-xl bg-gray-50" />
            </div>

            {/* Photo size */}
            <div>
              <label className="label">Photo Size</label>
              <div className="space-y-2">
                {PHOTO_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      selectedSize.id === size.id
                        ? 'border-accent bg-accent-soft text-primary'
                        : 'border-border text-secondary hover:border-accent'
                    }`}
                    aria-pressed={selectedSize.id === size.id}
                  >
                    <p className="font-medium text-sm">{size.label}</p>
                    <p className="text-xs text-secondary mt-0.5">{size.desc}</p>
                  </button>
                ))}
              </div>
              {selectedSize.id === 'custom' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="label text-xs">Width (px)</label>
                    <input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} className="input-field" min="10" />
                  </div>
                  <div>
                    <label className="label text-xs">Height (px)</label>
                    <input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)} className="input-field" min="10" />
                  </div>
                </div>
              )}
            </div>

            {/* Background */}
            <div>
              <label className="label">Background Colour</label>
              <div className="flex gap-3">
                {BG_COLORS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBgColor(bg)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      bgColor.id === bg.id ? 'border-accent' : 'border-border'
                    }`}
                    aria-pressed={bgColor.id === bg.id}
                    aria-label={bg.label}
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-200"
                      style={{ backgroundColor: bg.value }}
                    />
                    <span className="text-[10px] text-secondary">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              onClick={generate}
              disabled={processing}
              className="btn-primary w-full justify-center"
            >
              {processing ? 'Generating…' : 'Generate Passport Photo'}
            </button>

            <p className="text-[11px] text-gray-400 bg-gray-50 rounded-xl p-3 leading-relaxed">
              Disclaimer: Photo requirements may change. Please verify official requirements on the relevant portal before submitting. We do not guarantee acceptance.
            </p>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {outputUrl && (
              <>
                <div className="card p-4">
                  <p className="text-xs font-medium text-secondary mb-3 uppercase tracking-wide">Generated Photo</p>
                  <div className="flex justify-center bg-gray-100 rounded-xl p-6">
                    <img
                      src={outputUrl}
                      alt="Generated passport photo"
                      className="max-w-[180px] max-h-[220px] object-contain shadow-lg"
                    />
                  </div>
                </div>

                <div className="card p-5 space-y-3">
                  <button onClick={downloadJpg} className="btn-primary w-full justify-center">
                    <Download className="w-4 h-4" /> Download as JPG
                  </button>
                  <button onClick={downloadPdf} className="btn-secondary w-full justify-center">
                    <Download className="w-4 h-4" /> Download Printable Sheet (PDF)
                  </button>
                  <p className="text-[11px] text-gray-400 text-center">
                    The PDF sheet arranges multiple photos on a 6×4 inch page for printing.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <a ref={downloadRef} className="sr-only" aria-hidden="true">download</a>
    </div>
  );
}
