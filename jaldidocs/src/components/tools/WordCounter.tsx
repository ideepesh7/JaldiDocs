import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0;
    const readingMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
  }, [text]);

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">Word and character counter</h2>
          <p className="text-xs text-secondary">Paste text for essays, resumes, bios and applications.</p>
        </div>
      </div>

      <textarea
        className="input-field min-h-56 resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        aria-label="Text to count"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          ['Words', stats.words],
          ['Characters', stats.characters],
          ['No spaces', stats.charactersNoSpaces],
          ['Sentences', stats.sentences],
          ['Paragraphs', stats.paragraphs],
          ['Reading time', `${stats.readingMinutes} min`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-gray-50 p-4">
            <p className="text-xl font-semibold text-primary">{value}</p>
            <p className="text-xs text-secondary mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
