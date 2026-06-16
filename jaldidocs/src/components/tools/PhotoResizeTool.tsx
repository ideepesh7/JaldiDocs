// src/components/tools/PhotoResizeTool.tsx
// Reusable component used for Aadhaar Photo Resize, PAN Card Photo Resize, and similar tools.
import { useState, useCallback, useEffect } from 'react';
import { CreditCard, Download, RotateCcw, Lock, Unlock, AlertTriangle } from 'lucide-react';
import UploadDropzone from '../ui/UploadDropzone';
import {
  canvasToBlob,
  compressCanvasToTarget,
  coverRect,
  drawRect,
  downloadUrl,
  getCanvasContext,
  loadImage as loadCanvasImage,
  makeCanvas,
  MAX_CANVAS_PIXELS,
  revokeUrl,
  smartImageQuality,
} from '../../lib/imageProcessing';

interface Preset { label: string; w: number; h: number; note?: string }

interface PhotoResizeToolProps {
  toolName: string;
  presets: Preset[];
  disclaimer: string;
  icon?: React.ReactNode;
  helpText?: string;
}

interface ImageInfo { file: File; url: string; width: number; height: number }

export default function PhotoResizeTool({
  toolName,
  presets,
  disclaimer,
  icon,
  helpText = 'JPG, PNG or WEBP',
}: PhotoResizeToolProps) {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [targetKB, setTargetKB] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => {
    revokeUrl(image?.url);
    revokeUrl(outputUrl);
  }, [image?.url, outputUrl]);

  const loadImage = useCallback((files: File[]) => {
    const file = files[0];
    setError('');
    setOutputUrl('');
    setOutputSize(0);
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({ file, url, width: img.naturalWidth, height: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      setQuality(smartImageQuality(file, img.naturalWidth, img.naturalHeight, 'document'));
    };
    img.onerror = () => {
      revokeUrl(url);
      setError('Could not load image.');
    };
    img.src = url;
  }, []);

  const applyPreset = (w: number, h: number) => { setWidth(String(w)); setHeight(String(h)); };

  const onW = (val: string) => {
    setWidth(val);
    if (lockAspect && image && val) setHeight(String(Math.round(Number(val) * image.height / image.width)));
  };
  const onH = (val: string) => {
    setHeight(val);
    if (lockAspect && image && val) setWidth(String(Math.round(Number(val) * image.width / image.height)));
  };

  const process = async () => {
    if (!image) return;
    setProcessing(true);
    setError('');

    try {
      const w = parseInt(width), h = parseInt(height);
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

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      drawRect(ctx, img, coverRect(img.naturalWidth, img.naturalHeight, w, h, true));

      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      let blob: Blob;

      if (targetKB && Number(targetKB) > 0 && format === 'jpeg') {
        blob = await compressCanvasToTarget(canvas, mime, Number(targetKB) * 1024, {
          minQuality: 0.18,
          maxQuality: 0.96,
          allowDownscale: false,
        });
      } else {
        blob = await canvasToBlob(canvas, mime, format === 'png' ? undefined : quality / 100);
      }

      const url = URL.createObjectURL(blob);
      revokeUrl(outputUrl);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch {
      setError('Processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!outputUrl) return;
    downloadUrl(outputUrl, `photo.${format === 'jpeg' ? 'jpg' : 'png'}`);
  };

  const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>{disclaimer}</p>
      </div>

      {!image && (
        <div className="card p-6">
          <UploadDropzone
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onFiles={loadImage}
            label="Drop your photo here or click to choose"
            helpText={helpText}
            maxSizeMB={15}
            icon={icon || <CreditCard className="w-6 h-6" />}
          />
        </div>
      )}

      {image && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary">Photo</h3>
                <button onClick={() => { revokeUrl(image.url); revokeUrl(outputUrl); setImage(null); setOutputUrl(''); }} className="btn-ghost text-xs gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Change
                </button>
              </div>
              <img src={image.url} alt="Uploaded" className="w-full max-h-44 object-contain rounded-xl bg-gray-50" />
              <p className="text-xs text-secondary mt-1.5">{image.width}×{image.height}px · {fmtSize(image.file.size)}</p>
            </div>

            <div>
              <label className="label">Common Sizes</label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => applyPreset(p.w, p.h)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${
                      width === String(p.w) && height === String(p.h)
                        ? 'border-accent bg-accent-soft text-primary'
                        : 'border-border text-secondary hover:border-accent'
                    }`}>
                    <p className="font-medium">{p.label}</p>
                    {p.note && <p className="text-[10px] text-gray-400 mt-0.5">{p.note}</p>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Custom Dimensions (px)</label>
                <button onClick={() => setLockAspect(!lockAspect)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                    lockAspect ? 'border-accent text-accent bg-accent-soft' : 'border-border text-secondary'
                  }`}>
                  {lockAspect ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {lockAspect ? 'Locked' : 'Free'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-secondary mb-1 block">Width</label>
                  <input type="number" value={width} onChange={(e) => onW(e.target.value)} className="input-field" min="1" max="4000" />
                </div>
                <div>
                  <label className="text-xs text-secondary mb-1 block">Height</label>
                  <input type="number" value={height} onChange={(e) => onH(e.target.value)} className="input-field" min="1" max="4000" />
                </div>
              </div>
            </div>

            <div>
              <label className="label text-xs" htmlFor="target-kb">Target Size (KB) — optional</label>
              <input id="target-kb" type="number" value={targetKB} onChange={(e) => setTargetKB(e.target.value)} placeholder="e.g. 100" className="input-field text-sm" min="10" />
              <p className="helper-text">Leave blank to use quality slider</p>
            </div>

            {!targetKB && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label mb-0">Quality</label>
                  <span className="text-xs font-semibold text-accent">{quality}%</span>
                </div>
                <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-accent" />
              </div>
            )}

            <div>
              <label className="label">Format</label>
              <div className="grid grid-cols-2 gap-2">
                {(['jpeg', 'png'] as const).map((f) => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      format === f ? 'border-accent bg-accent text-white' : 'border-border text-secondary hover:border-accent'
                    }`}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button onClick={process} disabled={processing} className="btn-primary w-full justify-center">
              {processing ? 'Processing…' : 'Resize Photo'}
            </button>
          </div>

          <div className="space-y-4">
            {outputUrl ? (
              <div className="card p-5 space-y-4">
                <p className="text-xs font-medium text-secondary uppercase tracking-wide">Result</p>
                <img src={outputUrl} alt="Result" className="w-full max-h-64 object-contain rounded-xl bg-gray-50" />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-secondary">Size</p>
                    <p className="font-semibold text-primary mt-0.5">{width}×{height}px</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-secondary">File size</p>
                    <p className="font-semibold text-success mt-0.5">{fmtSize(outputSize)}</p>
                  </div>
                </div>
                <button onClick={download} className="btn-primary w-full justify-center">
                  <Download className="w-4 h-4" /> Download Photo
                </button>
              </div>
            ) : (
              <div className="card p-10 flex items-center justify-center text-center">
                <p className="text-sm text-secondary">Your resized photo will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
