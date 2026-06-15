// src/components/tools/ImageResize.tsx
import { useState, useRef, useCallback } from 'react';
import { Maximize2, Download, RotateCcw, Lock, Unlock } from 'lucide-react';
import UploadDropzone from '../ui/UploadDropzone';

interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

const PRESETS = [
  { label: '100×100', w: 100, h: 100 },
  { label: '200×200', w: 200, h: 200 },
  { label: '300×300', w: 300, h: 300 },
  { label: '600×600', w: 600, h: 600 },
  { label: '1024w', w: 1024, h: 0 },
  { label: '35×45mm', w: 413, h: 531 },
];

export default function ImageResize() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(92);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputSize, setOutputSize] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const loadImage = useCallback((files: File[]) => {
    const file = files[0];
    setError('');
    setOutputUrl('');
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({ file, url, width: img.naturalWidth, height: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.onerror = () => setError('Could not load image. Please try another file.');
    img.src = url;
  }, []);

  const applyPreset = (w: number, h: number) => {
    if (h === 0 && image) {
      // Width-only preset
      const ratio = image.height / image.width;
      setWidth(String(w));
      setHeight(String(Math.round(w * ratio)));
    } else {
      setWidth(String(w));
      setHeight(String(h));
    }
  };

  const onWidthChange = (val: string) => {
    setWidth(val);
    if (lockAspect && image && val) {
      const ratio = image.height / image.width;
      setHeight(String(Math.round(Number(val) * ratio)));
    }
  };

  const onHeightChange = (val: string) => {
    setHeight(val);
    if (lockAspect && image && val) {
      const ratio = image.width / image.height;
      setWidth(String(Math.round(Number(val) * ratio)));
    }
  };

  const resize = async () => {
    if (!image || !width || !height) return;
    setProcessing(true);
    setError('');

    try {
      const w = parseInt(width);
      const h = parseInt(height);
      if (isNaN(w) || isNaN(h) || w < 1 || h < 1 || w > 8000 || h > 8000) {
        setError('Please enter valid dimensions (1–8000 px).');
        setProcessing(false);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();
      img.src = image.url;
      await new Promise((res) => (img.onload = res));
      ctx.drawImage(img, 0, 0, w, h);

      const mime = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
      const q = format === 'png' ? undefined : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) { setError('Could not generate output.'); setProcessing(false); return; }
          const url = URL.createObjectURL(blob);
          setOutputUrl(url);
          setOutputSize(blob.size < 1024 * 1024
            ? `${(blob.size / 1024).toFixed(1)} KB`
            : `${(blob.size / 1024 / 1024).toFixed(2)} MB`
          );
          setProcessing(false);
        },
        mime,
        q
      );
    } catch {
      setError('Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  const download = () => {
    if (!outputUrl) return;
    const a = downloadRef.current!;
    a.href = outputUrl;
    a.download = `resized-${image?.file.name?.replace(/\.[^.]+$/, '') || 'image'}.${format === 'jpeg' ? 'jpg' : format}`;
    a.click();
  };

  const reset = () => {
    setImage(null);
    setOutputUrl('');
    setError('');
    setWidth('');
    setHeight('');
  };

  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {!image && (
        <div className="card p-6">
          <UploadDropzone
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onFiles={loadImage}
            label="Drop your image here or click to choose"
            helpText="Supports JPG, PNG and WEBP"
            maxSizeMB={20}
            icon={<Maximize2 className="w-6 h-6" />}
          />
        </div>
      )}

      {/* Main tool */}
      {image && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="card p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary">Original</h3>
                <button onClick={reset} className="btn-ghost text-xs gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Change file
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-secondary space-y-1">
                <p>File: <span className="text-primary font-medium">{image.file.name}</span></p>
                <p>Size: <span className="text-primary font-medium">{fmtSize(image.file.size)}</span></p>
                <p>Dimensions: <span className="text-primary font-medium">{image.width} × {image.height} px</span></p>
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="label">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Width / Height */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Dimensions (px)</label>
                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                    lockAspect ? 'border-accent text-accent bg-accent-soft' : 'border-border text-secondary'
                  }`}
                  aria-pressed={lockAspect}
                >
                  {lockAspect ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {lockAspect ? 'Locked' : 'Free'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-secondary mb-1 block">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => onWidthChange(e.target.value)}
                    className="input-field"
                    min="1" max="8000"
                    aria-label="Width in pixels"
                  />
                </div>
                <div>
                  <label className="text-xs text-secondary mb-1 block">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => onHeightChange(e.target.value)}
                    className="input-field"
                    min="1" max="8000"
                    aria-label="Height in pixels"
                  />
                </div>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="label">Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['jpeg', 'png', 'webp'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      format === f ? 'border-accent bg-accent text-white' : 'border-border text-secondary hover:border-accent'
                    }`}
                    aria-pressed={format === f}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            {format !== 'png' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Quality</label>
                  <span className="text-xs font-semibold text-accent">{quality}%</span>
                </div>
                <input
                  type="range" min="10" max="100" value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-accent"
                  aria-label="Image quality"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            {error && <p className="error-text">{error}</p>}

            <button
              onClick={resize}
              disabled={processing || !width || !height}
              className="btn-primary w-full justify-center"
            >
              {processing ? 'Resizing…' : 'Resize Image'}
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            {/* Original preview */}
            <div className="card p-4">
              <p className="text-xs font-medium text-secondary mb-3 uppercase tracking-wide">Original</p>
              <img
                src={image.url}
                alt="Original"
                className="w-full max-h-64 object-contain rounded-xl bg-gray-50"
              />
            </div>

            {/* Resized preview */}
            {outputUrl && (
              <div className="card p-4">
                <p className="text-xs font-medium text-secondary mb-3 uppercase tracking-wide">Resized</p>
                <img
                  src={outputUrl}
                  alt="Resized"
                  className="w-full max-h-64 object-contain rounded-xl bg-gray-50"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-secondary">
                  <span>{width} × {height} px</span>
                  <span className="font-medium text-success">{outputSize}</span>
                </div>
                <button onClick={download} className="btn-primary w-full justify-center mt-3">
                  <Download className="w-4 h-4" /> Download Resized Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <a ref={downloadRef} className="sr-only" aria-hidden="true">download</a>
    </div>
  );
}
