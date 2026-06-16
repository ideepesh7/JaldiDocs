import { useState, useCallback, useEffect, useRef } from 'react';
import { Pen, Download, RotateCcw } from 'lucide-react';
import UploadDropzone from '../ui/UploadDropzone';
import {
  canvasToBlob,
  compressCanvasToTarget,
  containRect,
  downloadUrl,
  drawRect,
  getCanvasContext,
  loadImage as loadCanvasImage,
  makeCanvas,
  MAX_CANVAS_PIXELS,
  revokeUrl,
} from '../../lib/imageProcessing';

interface ImageInfo { file: File; url: string; width: number; height: number }

const PRESETS = [
  { label: '140×60 px', w: 140, h: 60 },
  { label: '160×60 px', w: 160, h: 60 },
  { label: '200×80 px', w: 200, h: 80 },
  { label: '300×100 px', w: 300, h: 100 },
];

const SIZE_PRESETS = [
  { label: 'Under 20 KB', targetKB: 20 },
  { label: 'Under 50 KB', targetKB: 50 },
  { label: 'Under 100 KB', targetKB: 100 },
];

type OutputFormat = 'jpeg' | 'png';

export default function SignatureResize() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [width, setWidth] = useState('160');
  const [height, setHeight] = useState('60');
  const [targetKB, setTargetKB] = useState(20);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const urlsRef = useRef<{ image?: string; output?: string }>({});

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
    img.onload = () => setImage({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      revokeUrl(url);
      setError('Could not load image.');
    };
    img.src = url;
  }, []);

  const process = async () => {
    if (!image) return;
    setProcessing(true);
    setError('');

    try {
      const w = parseInt(width);
      const h = parseInt(height);
      if (!w || !h || w < 1 || h < 1) {
        setError('Enter valid dimensions.');
        setProcessing(false);
        return;
      }
      if (w * h > MAX_CANVAS_PIXELS) {
        setError('These dimensions are too large for safe mobile processing. Please try a smaller size.');
        setProcessing(false);
        return;
      }

      const img = await loadCanvasImage(image.url);
      const canvas = makeCanvas(w, h);
      const ctx = getCanvasContext(canvas);

      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
      }

      drawRect(ctx, img, containRect(img.naturalWidth, img.naturalHeight, w, h));

      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const blob = format === 'jpeg'
        ? await compressCanvasToTarget(canvas, mime, targetKB * 1024, {
            minQuality: 0.16,
            maxQuality: 0.96,
            allowDownscale: false,
          })
        : await canvasToBlob(canvas, mime);

      const url = URL.createObjectURL(blob);
      revokeUrl(outputUrl);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch {
      setError('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!outputUrl) return;
    downloadUrl(outputUrl, `signature.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="space-y-6">
      {!image && (
        <div className="card p-6">
          <UploadDropzone
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onFiles={loadImage}
            label="Drop your signature image here"
            helpText="JPG, PNG or WEBP • Scanned or photographed signature"
            maxSizeMB={10}
            icon={<Pen className="w-6 h-6" />}
          />
        </div>
      )}

      {image && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary">Uploaded Signature</h3>
                <button onClick={() => { revokeUrl(image.url); revokeUrl(outputUrl); setImage(null); setOutputUrl(''); }} className="btn-ghost text-xs gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Change
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center">
                <img src={image.url} alt="Uploaded signature" className="max-h-20 object-contain" />
              </div>
              <p className="text-xs text-secondary mt-1.5">
                Original: {image.width}×{image.height}px · {fmtSize(image.file.size)}
              </p>
            </div>

            <div>
              <label className="label">Standard Form Sizes</label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setWidth(String(p.w)); setHeight(String(p.h)); }}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      width === String(p.w) && height === String(p.h)
                        ? 'border-accent bg-accent text-white'
                        : 'border-border text-secondary hover:border-accent'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs" htmlFor="sig-width">Width (px)</label>
                <input id="sig-width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field text-sm" min="1" />
              </div>
              <div>
                <label className="label text-xs" htmlFor="sig-height">Height (px)</label>
                <input id="sig-height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field text-sm" min="1" />
              </div>
            </div>

            <div>
              <label className="label">Compress To</label>
              <div className="grid grid-cols-3 gap-2">
                {SIZE_PRESETS.map((p) => (
                  <button
                    key={p.targetKB}
                    onClick={() => setTargetKB(p.targetKB)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      targetKB === p.targetKB
                        ? 'border-accent bg-accent text-white'
                        : 'border-border text-secondary hover:border-accent'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Output Format</label>
              <div className="grid grid-cols-2 gap-2">
                {(['jpeg', 'png'] as OutputFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      format === f ? 'border-accent bg-accent text-white' : 'border-border text-secondary hover:border-accent'
                    }`}
                  >
                    {f.toUpperCase()} {f === 'png' ? '(transparent)' : '(white bg)'}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button onClick={process} disabled={processing} className="btn-primary w-full justify-center">
              {processing ? 'Processing…' : 'Resize & Compress Signature'}
            </button>
          </div>

          <div className="space-y-4">
            {outputUrl ? (
              <div className="card p-5 space-y-4">
                <p className="text-xs font-medium text-secondary uppercase tracking-wide">Result</p>
                <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center">
                  <img src={outputUrl} alt="Resized signature" className="max-h-24 object-contain" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-secondary">Dimensions</p>
                    <p className="font-semibold text-primary mt-0.5">{width}×{height}px</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-secondary">File size</p>
                    <p className="font-semibold text-success mt-0.5">{fmtSize(outputSize)}</p>
                  </div>
                </div>
                <button onClick={download} className="btn-primary w-full justify-center">
                  <Download className="w-4 h-4" /> Download Signature
                </button>
              </div>
            ) : (
              <div className="card p-8 flex items-center justify-center text-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
                    <Pen className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm text-secondary">Your resized signature will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
