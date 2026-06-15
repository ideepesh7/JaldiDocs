// src/components/ui/UploadDropzone.tsx
import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface UploadDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  helpText?: string;
  maxSizeMB?: number;
  icon?: React.ReactNode;
}

export default function UploadDropzone({
  accept,
  multiple = false,
  onFiles,
  label = 'Drop files here or click to browse',
  helpText,
  maxSizeMB = 50,
  icon,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');

    const acceptedTypes = accept.split(',').map((a) => a.trim().toLowerCase());
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const mime = file.type.toLowerCase();
      const isValid = acceptedTypes.some(
        (a) => a === ext || a === mime || (a.endsWith('/*') && mime.startsWith(a.slice(0, -1)))
      );

      if (!isValid) {
        setError(`File "${file.name}" is not a supported type.`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSizeMB}MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) onFiles(validFiles);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        aria-label={label}
        className={`dropzone ${isDragOver ? 'dropzone-active' : ''}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-accent text-white' : 'bg-accent-soft text-accent'
          }`}>
            {icon || <Upload className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-sm font-medium text-primary">{label}</p>
            {helpText && <p className="text-xs text-secondary mt-1">{helpText}</p>}
            <p className="text-xs text-gray-400 mt-1">Max {maxSizeMB}MB per file</p>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="btn-secondary text-xs pointer-events-none"
          >
            Choose File{multiple ? 's' : ''}
          </button>
        </div>
      </div>
      {error && (
        <p className="error-text mt-2 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-hidden="true"
      />
    </div>
  );
}
