import { useMemo, useState } from 'react';
import { Percent } from 'lucide-react';

const numberValue = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export default function PercentageCalculator() {
  const [marks, setMarks] = useState('450');
  const [total, setTotal] = useState('500');
  const [part, setPart] = useState('25');
  const [whole, setWhole] = useState('200');
  const [oldValue, setOldValue] = useState('1000');
  const [newValue, setNewValue] = useState('1250');

  const results = useMemo(() => {
    const m = numberValue(marks);
    const t = numberValue(total);
    const p = numberValue(part);
    const w = numberValue(whole);
    const oldN = numberValue(oldValue);
    const newN = numberValue(newValue);

    return {
      marksPercentage: t ? (m / t) * 100 : 0,
      partPercentage: w ? (p / w) * 100 : 0,
      changePercentage: oldN ? ((newN - oldN) / oldN) * 100 : 0,
    };
  }, [marks, total, part, whole, oldValue, newValue]);

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <Percent className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">Percentage calculator</h2>
          <p className="text-xs text-secondary">Marks, ratios, increase and decrease in one place.</p>
        </div>
      </div>

      <div className="motion-stagger grid md:grid-cols-3 gap-4">
        <div className="result-panel rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-primary">Marks percentage</h3>
          <input className="input-field" value={marks} onChange={(e) => setMarks(e.target.value)} inputMode="decimal" aria-label="Marks obtained" />
          <input className="input-field" value={total} onChange={(e) => setTotal(e.target.value)} inputMode="decimal" aria-label="Total marks" />
          <p className="text-2xl font-semibold text-accent">{results.marksPercentage.toFixed(2)}%</p>
        </div>

        <div className="result-panel rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-primary">What percent?</h3>
          <input className="input-field" value={part} onChange={(e) => setPart(e.target.value)} inputMode="decimal" aria-label="Part value" />
          <input className="input-field" value={whole} onChange={(e) => setWhole(e.target.value)} inputMode="decimal" aria-label="Whole value" />
          <p className="text-2xl font-semibold text-accent">{results.partPercentage.toFixed(2)}%</p>
        </div>

        <div className="result-panel rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-primary">Increase/decrease</h3>
          <input className="input-field" value={oldValue} onChange={(e) => setOldValue(e.target.value)} inputMode="decimal" aria-label="Old value" />
          <input className="input-field" value={newValue} onChange={(e) => setNewValue(e.target.value)} inputMode="decimal" aria-label="New value" />
          <p className={`text-2xl font-semibold ${results.changePercentage >= 0 ? 'text-success' : 'text-danger'}`}>
            {results.changePercentage.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
