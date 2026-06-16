// src/components/tools/ImageCompress.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { Minimize2, Download, RotateCcw, TrendingDown } from 'lucide-react';
import UploadDropzone from '../ui/UploadDropzone';
import {
  canvasToBlob,
  compressCanvasToTarget,
  detectImageUseCase,
  downloadUrl,
  getCanvasContext,
  loadImage as loadCanvasImage,
  makeCanvas,
  revokeUrl,
  safeCanvasSize,
  safeDownloadName,
  smartImageQuality,
  suggestedTargetKB,
} from '../../lib/imageProcessing';

interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

const SIZE_PRESETS = [
  { label: 'Under 50 KB', targetKB: 50 },
  { label: 'Under 100 KB', targetKB: 100 },
  { label: 'Under 200 KB', targetKB: 200 },
  { label: 'Under 500 KB', targetKB: 500 },
];

export default function ImageCompress() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [targetKB, setTargetKB] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const urlsRef = useRef<{ image?: string; output?: string }>({});

  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  useEffect(() => {
    urlsRef.current = { image: image?.url, output: outputUrl };
  }, [image?.url, outputUrl]);

  useEffect(() => () => {
    revokeUrl(urlsRef.current.image);
    revokeUrl(urlsRef.current.output);
  }, []);

  const loadImage = useCallback((files: File[]) => {
    const file = files[0];
    setError('');
    setOutputUrl('');
    setOutputSize(0);

    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const useCase = detectImageUseCase(file, img.naturalWidth, img.naturalHeight);
      const qualityMode = useCase === 'document' || useCase === 'signature' ? 'document' : 'share';
      setQuality(smartImageQuality(file, img.naturalWidth, img.naturalHeight, qualityMode));
      if (!targetKB) setTargetKB(String(suggestedTargetKB(file, img.naturalWidth, img.naturalHeight, useCase)));
      setImage({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      revokeUrl(url);
      setError('Could not load image.');
    };
    img.src = url;
  }, []);

  const compress = async () => {
    if (!image) return;
    setProcessing(true);
    setError('');

    try {
      const mime = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
      const img = await loadCanvasImage(image.url);
      const safeSize = safeCanvasSize(img.naturalWidth, img.naturalHeight);
      const canvas = makeCanvas(safeSize.width, safeSize.height);
      const ctx = getCanvasContext(canvas);

      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let blob: Blob;

      if (targetKB && Number(targetKB) > 0) {
        const minQuality = detectImageUseCase(image.file, image.width, image.height) === 'document' ? 0.28 : 0.12;
        blob = await compressCanvasToTarget(canvas, mime, Number(targetKB) * 1024, {
          minQuality,
          maxQuality: 0.96,
          allowDownscale: true,
        });
      } else {
        blob = await canvasToBlob(canvas, mime, quality / 100);
      }

      const url = URL.createObjectURL(blob);
      revokeUrl(outputUrl);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch {
      setError('Compression failed. Please try another image.');
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!outputUrl || !image) return;
    const baseName = safeDownloadName(image.file.name, 'image');
    downloadUrl(outputUrl, `compressed-${baseName}.${format === 'jpeg' ? 'jpg' : format}`);
  };

  const reset = () => {
    revokeUrl(image?.url);
    revokeUrl(outputUrl);
    setImage(null);
    setOutputUrl('');
    setOutputSize(0);
    setError('');
  };

  const savings = image && outputSize
    ? Math.max(0, Math.round(((image.file.size - outputSize) / image.file.size) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {!image && (
        <div className="card p-6">
          <UploadDropzone
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onFiles={loadImage}
            label="Drop your image here or click to choose"
            helpText="Supports JPG, PNG and WEBP"
            maxSizeMB={20}
            icon={<Minimize2 className="w-6 h-6" />}
          />
        </div>
      )}

      {image && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary">File Info</h3>
                <button onClick={reset} className="btn-ghost text-xs gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Change
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-secondary space-y-1">
                <p>File: <span className="text-primary font-medium">{image.file.name}</span></p>
                <p>Original size: <span className="text-primary font-medium">{fmtSize(image.file.size)}</span></p>
                <p>Dimensions: <span className="text-primary font-medium">{image.width} × {image.height} px</span></p>
              </div>
            </div>

            <div>
              <label className="label">Quick Size Target</label>
              <div className="grid grid-cols-2 gap-2">
                {SIZE_PRESETS.map((p) => (
                  <button
                    key={p.targetKB}
                    onClick={() => { setTargetKB(String(p.targetKB)); setQuality(80); }}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      targetKB === String(p.targetKB)
                        ? 'border-accent bg-accent text-white'
                        : 'border-border text-secondary hover:border-accent'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="label text-xs">Or enter custom target (KB)</label>
                <input
                  type="number"
                  value={targetKB}
                  onChange={(e) => setTargetKB(e.target.value)}
                  placeholder="e.g. 150"
                  className="input-field text-sm"
                  min="10"
                  aria-label="Target file size in KB"
                />
                <p className="helper-text">Leave blank to use the quality slider instead</p>
              </div>
            </div>

            {!targetKB && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Quality</label>
                  <span className="text-xs font-semibold text-accent">{quality}%</span>
                </div>
                <input
                  type="range" min="10" max="99" value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-accent"
                  aria-label="Compression quality"
                />
              </div>
            )}

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

            <p className="text-[11px] text-gray-400 bg-gray-50 rounded-xl p-3 leading-relaxed">
              Final size may vary depending on image content, format and dimensions. Results are estimates.
            </p>

            {error && <p className="error-text">{error}</p>}

            <button
              onClick={compress}
              disabled={processing}
              className="btn-primary w-full justify-center"
            >
              {processing ? 'Compressing…' : 'Compress Image'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <p className="text-xs font-medium text-secondary mb-3 uppercase tracking-wide">Preview</p>
              <img
                src={outputUrl || image.url}
                alt={outputUrl ? 'Compressed' : 'Original'}
                className="w-full max-h-64 object-contain rounded-xl bg-gray-50"
              />
            </div>

            {outputUrl && (
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingDown className="w-4.5 h-4.5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary">Compression result</p>
                    <p className="text-sm font-semibold text-success">{savings}% smaller</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-secondary">Original</p>
                    <p className="font-semibold text-primary">{fmtSize(image.file.size)}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-secondary">Compressed</p>
                    <p className="font-semibold text-success">{fmtSize(outputSize)}</p>
                  </div>
                </div>
                <button onClick={download} className="btn-primary w-full justify-center">
                  <Download className="w-4 h-4" /> Download Compressed Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
