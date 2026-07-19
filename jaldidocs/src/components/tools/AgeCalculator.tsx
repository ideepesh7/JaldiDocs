import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';

function diffDates(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export default function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState('');
  const [asOf, setAsOf] = useState(today);

  const result = useMemo(() => {
    if (!dob || !asOf) return null;
    const start = new Date(`${dob}T00:00:00`);
    const end = new Date(`${asOf}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return null;
    const exact = diffDates(start, end);
    const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000);
    return { ...exact, totalDays };
  }, [dob, asOf]);

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">Calculate exact age</h2>
          <p className="text-xs text-secondary">Useful for exam, school, job and government forms.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 text-sm font-medium text-primary">
          Date of birth
          <input className="input-field" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-primary">
          Age on date
          <input className="input-field" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </label>
      </div>

      {result ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['Years', result.years],
            ['Months', result.months],
            ['Days', result.days],
            ['Total days', result.totalDays],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-gray-50 p-4 text-center">
              <p className="text-2xl font-semibold text-primary">{value}</p>
              <p className="text-xs text-secondary mt-1">{label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary bg-gray-50 rounded-xl p-4">
          Enter a valid date of birth and target date. The target date must be after the date of birth.
        </p>
      )}
    </div>
  );
}
