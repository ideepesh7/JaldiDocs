import { useMemo, useState } from 'react';
import { CaseSensitive, Copy } from 'lucide-react';

const toTitleCase = (value: string) =>
  value.toLowerCase().replace(/\b[\p{L}\p{N}]/gu, (char) => char.toUpperCase());

const toSentenceCase = (value: string) =>
  value.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase());

export default function CaseConverter() {
  const [text, setText] = useState('');
  const outputs = useMemo(
    () => [
      ['UPPERCASE', text.toUpperCase()],
      ['lowercase', text.toLowerCase()],
      ['Title Case', toTitleCase(text)],
      ['Sentence case', toSentenceCase(text)],
      ['Clean spaces', text.replace(/\s+/g, ' ').trim()],
    ],
    [text],
  );

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <CaseSensitive className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">Text case converter</h2>
          <p className="text-xs text-secondary">Clean names, headings, form text and copied content.</p>
        </div>
      </div>

      <textarea
        className="input-field min-h-40 resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to convert..."
        aria-label="Text to convert"
      />

      <div className="space-y-3">
        {outputs.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-sm font-semibold text-primary">{label}</h3>
              <button
                type="button"
                className="btn-ghost text-xs gap-1.5"
                onClick={() => navigator.clipboard?.writeText(value)}
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <p className="text-sm text-secondary whitespace-pre-wrap break-words">{value || 'Converted text will appear here.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
