import { useMemo, useState } from 'react';
import { IndianRupee } from 'lucide-react';

const n = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function HraCalculator() {
  const [basic, setBasic] = useState('50000');
  const [hra, setHra] = useState('20000');
  const [rent, setRent] = useState('18000');
  const [metro, setMetro] = useState('yes');

  const result = useMemo(() => {
    const annualBasic = n(basic) * 12;
    const annualHra = n(hra) * 12;
    const annualRent = n(rent) * 12;
    const salaryPercent = annualBasic * (metro === 'yes' ? 0.5 : 0.4);
    const rentMinusTenPercent = Math.max(0, annualRent - annualBasic * 0.1);
    const exemption = Math.max(0, Math.min(annualHra, salaryPercent, rentMinusTenPercent));
    return {
      annualBasic,
      annualHra,
      annualRent,
      salaryPercent,
      rentMinusTenPercent,
      exemption,
      taxableHra: Math.max(0, annualHra - exemption),
    };
  }, [basic, hra, rent, metro]);

  const fmt = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <IndianRupee className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">HRA exemption estimator</h2>
          <p className="text-xs text-secondary">Uses the common old-tax-regime HRA formula for quick planning.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 text-sm font-medium text-primary">
          Monthly basic salary + DA
          <input className="input-field" value={basic} onChange={(e) => setBasic(e.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-primary">
          Monthly HRA received
          <input className="input-field" value={hra} onChange={(e) => setHra(e.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-primary">
          Monthly rent paid
          <input className="input-field" value={rent} onChange={(e) => setRent(e.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-primary">
          City type
          <select className="input-field" value={metro} onChange={(e) => setMetro(e.target.value)}>
            <option value="yes">Metro city: Delhi, Mumbai, Kolkata, Chennai</option>
            <option value="no">Non-metro city</option>
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-emerald-50 p-4">
          <p className="text-xs text-secondary">Estimated exemption</p>
          <p className="text-2xl font-semibold text-success mt-1">{fmt(result.exemption)}</p>
        </div>
        <div className="rounded-xl border border-border bg-gray-50 p-4">
          <p className="text-xs text-secondary">Taxable HRA</p>
          <p className="text-2xl font-semibold text-primary mt-1">{fmt(result.taxableHra)}</p>
        </div>
        <div className="rounded-xl border border-border bg-gray-50 p-4">
          <p className="text-xs text-secondary">Annual rent</p>
          <p className="text-2xl font-semibold text-primary mt-1">{fmt(result.annualRent)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden text-sm">
        {[
          ['Actual HRA received', result.annualHra],
          [`${metro === 'yes' ? '50%' : '40%'} of salary`, result.salaryPercent],
          ['Rent paid minus 10% of salary', result.rentMinusTenPercent],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border last:border-b-0">
            <span className="text-secondary">{label}</span>
            <strong className="text-primary">{fmt(value as number)}</strong>
          </div>
        ))}
      </div>

      <p className="text-xs text-secondary">
        This is an estimate for informational use. HRA rules can depend on your tax regime, salary structure,
        employer policy and rent proofs. Consult a tax professional for filing decisions.
      </p>
    </div>
  );
}
