export type CanvasSource = HTMLImageElement | ImageBitmap;

export interface DrawRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export const MAX_CANVAS_PIXELS = 16_000_000;
export const MAX_LONG_EDGE = 4096;

export function smartImageQuality(file: File, width: number, height: number, mode: 'photo' | 'document' | 'share' = 'photo') {
  const megapixels = (width * height) / 1_000_000;
  const sizeMB = file.size / 1024 / 1024;

  if (mode === 'document') {
    if (megapixels > 10 || sizeMB > 8) return 86;
    if (megapixels > 5 || sizeMB > 4) return 90;
    return 92;
  }

  if (mode === 'share') {
    if (megapixels > 10 || sizeMB > 8) return 76;
    if (megapixels > 5 || sizeMB > 4) return 80;
    return 84;
  }

  if (megapixels > 10 || sizeMB > 8) return 78;
  if (megapixels > 5 || sizeMB > 4) return 82;
  if (megapixels > 2 || sizeMB > 2) return 86;
  return 90;
}

export function safeCanvasSize(width: number, height: number, maxLongEdge = MAX_LONG_EDGE, maxPixels = MAX_CANVAS_PIXELS) {
  const longEdgeScale = Math.min(1, maxLongEdge / Math.max(width, height));
  const pixelScale = Math.min(1, Math.sqrt(maxPixels / (width * height)));
  const scale = Math.min(longEdgeScale, pixelScale);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  };
}

export async function loadImage(url: string) {
  const img = new window.Image();
  img.decoding = 'async';
  img.src = url;

  if ('decode' in img) {
    try {
      await img.decode();
      return img;
    } catch {
      // Fall back to onload/onerror below for older or stricter browsers.
    }
  }

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Could not load image.'));
  });

  return img;
}

export function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function getCanvasContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return ctx;
}

export function containRect(srcW: number, srcH: number, dstW: number, dstH: number): DrawRect {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  let dw = dstW;
  let dh = dstH;

  if (srcAspect > dstAspect) {
    dh = dstW / srcAspect;
  } else {
    dw = dstH * srcAspect;
  }

  return {
    sx: 0,
    sy: 0,
    sw: srcW,
    sh: srcH,
    dx: (dstW - dw) / 2,
    dy: (dstH - dh) / 2,
    dw,
    dh,
  };
}

export function coverRect(srcW: number, srcH: number, dstW: number, dstH: number, faceAware = false): DrawRect {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;

  if (srcAspect > dstAspect) {
    sw = srcH * dstAspect;
    sx = (srcW - sw) / 2;
  } else {
    sh = srcW / dstAspect;
    const centerBias = faceAware ? 0.42 : 0.5;
    sy = Math.max(0, Math.min(srcH - sh, srcH * centerBias - sh / 2));
  }

  return { sx, sy, sw, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
}

export function drawRect(ctx: CanvasRenderingContext2D, source: CanvasSource, rect: DrawRect) {
  ctx.drawImage(source, rect.sx, rect.sy, rect.sw, rect.sh, rect.dx, rect.dy, rect.dw, rect.dh);
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create output file.'))),
      mime,
      quality,
    );
  });
}

export async function compressCanvasToTarget(
  sourceCanvas: HTMLCanvasElement,
  mime: string,
  targetBytes: number,
  options: { minQuality?: number; maxQuality?: number; attempts?: number; allowDownscale?: boolean } = {},
) {
  const minQuality = options.minQuality ?? 0.08;
  const maxQuality = options.maxQuality ?? 0.96;
  const attempts = options.attempts ?? 14;

  let lo = minQuality;
  let hi = maxQuality;
  let best: Blob | null = null;

  for (let i = 0; i < attempts; i++) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(sourceCanvas, mime, mid);

    if (blob.size <= targetBytes) {
      best = blob;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  if (best || !options.allowDownscale) {
    return best || canvasToBlob(sourceCanvas, mime, minQuality);
  }

  let scale = 0.92;
  while (scale >= 0.35) {
    const canvas = makeCanvas(sourceCanvas.width * scale, sourceCanvas.height * scale);
    const ctx = getCanvasContext(canvas);
    ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);

    const blob = await canvasToBlob(canvas, mime, minQuality);
    if (blob.size <= targetBytes) return blob;

    scale -= 0.08;
    await yieldToBrowser();
  }

  return canvasToBlob(sourceCanvas, mime, minQuality);
}

export function revokeUrl(url?: string) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}

export function safeDownloadName(name: string, fallback: string) {
  const base = (name || fallback)
    .replace(/\.[^.]+$/, '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return base || fallback;
}

export function downloadUrl(url: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function yieldToBrowser() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}
