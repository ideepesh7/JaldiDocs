import { PDFDocument } from 'pdf-lib';

export function naturalFileSort<T extends { name: string }>(files: T[]) {
  return [...files].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
  );
}

export async function loadPdfSafely(file: File) {
  const bytes = await file.arrayBuffer();

  try {
    const doc = await PDFDocument.load(bytes, {
      ignoreEncryption: false,
      throwOnInvalidObject: true,
      updateMetadata: false,
    });

    if (doc.getPageCount() < 1) {
      throw new Error('empty-pdf');
    }

    return { doc, bytes };
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('encrypted')) {
      throw new Error('encrypted-pdf');
    }

    throw error;
  }
}

export async function savePdfSafely(doc: PDFDocument) {
  const bytes = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: false,
  });

  const validation = await PDFDocument.load(bytes, {
    ignoreEncryption: false,
    throwOnInvalidObject: true,
    updateMetadata: false,
  });

  if (validation.getPageCount() < 1) {
    throw new Error('invalid-output-pdf');
  }

  return bytes;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-');
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function yieldToBrowser() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}
