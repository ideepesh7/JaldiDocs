// src/components/tools/RentReceiptGenerator.tsx
import { useState, useEffect } from 'react';
import { Home, Download, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ReceiptData {
  tenantName: string;
  landlordName: string;
  rentAmount: string;
  month: string;
  year: string;
  address: string;
  paymentMode: string;
  receiptNo: string;
  receiptDate: string;
  landlordPan: string;
}

const STORAGE_KEY = 'jaldidocs_rent_receipt_draft';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PAYMENT_MODES = ['Cash', 'Bank Transfer / NEFT / IMPS', 'UPI', 'Cheque', 'Online Payment'];

const defaultData = (): ReceiptData => ({
  tenantName: '',
  landlordName: '',
  rentAmount: '',
  month: MONTHS[new Date().getMonth()],
  year: String(new Date().getFullYear()),
  address: '',
  paymentMode: 'Bank Transfer / NEFT / IMPS',
  receiptNo: 'RR-001',
  receiptDate: new Date().toISOString().split('T')[0],
  landlordPan: '',
});

export default function RentReceiptGenerator() {
  const [data, setData] = useState<ReceiptData>(defaultData);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<ReceiptData>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setData(JSON.parse(stored));
    } catch {}
  }, []);

  const set = (field: keyof ReceiptData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Partial<ReceiptData> = {};
    if (!data.tenantName.trim()) e.tenantName = 'Required';
    if (!data.landlordName.trim()) e.landlordName = 'Required';
    if (!data.rentAmount.trim() || isNaN(Number(data.rentAmount))) e.rentAmount = 'Enter a valid amount';
    if (!data.address.trim()) e.address = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData());
    setErrors({});
  };

  const amountInWords = (amount: string): string => {
    const n = parseInt(amount);
    if (isNaN(n)) return '';
    const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    const convert = (num: number): string => {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convert(num % 100) : '');
      if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
      if (num < 10000000) return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convert(num % 100000) : '');
      return convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convert(num % 10000000) : '');
    };
    return convert(n) + ' Rupees Only';
  };

  const downloadPdf = () => {
    if (!validate()) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a5' });
    const w = 148, m = 12;
    let y = m;

    // Border
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(m - 4, y - 4, w - 2 * m + 8, 200, 'S');

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(m - 4, y - 4, w - 2 * m + 8, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RENT RECEIPT', w / 2, y + 6, { align: 'center' });
    y += 20;

    doc.setTextColor(17, 24, 39);

    const row = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text(label, m, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(value || '—', w - m - 50);
      doc.text(lines, 55, y);
      y += Math.max(lines.length * 5, 7);
    };

    row('Receipt No.', data.receiptNo);
    row('Date', data.receiptDate);
    y += 3;
    doc.setDrawColor(229, 231, 235);
    doc.line(m, y, w - m, y);
    y += 5;

    row('Received from', data.tenantName);
    row('Rent Amount', `₹${Number(data.rentAmount).toLocaleString('en-IN')}/-`);
    row('In Words', amountInWords(data.rentAmount));
    row('For Month', `${data.month} ${data.year}`);
    row('Property Address', data.address);
    row('Payment Mode', data.paymentMode);
    if (data.landlordPan) row("Landlord's PAN", data.landlordPan);
    y += 3;
    doc.line(m, y, w - m, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('Received the above rent in full towards the premises mentioned.', m, y);
    y += 12;

    // Signature area
    doc.setFontSize(8);
    doc.text("Landlord's Signature", w - m - 35, y + 10, { align: 'right' });
    doc.line(w - m - 35, y + 12, w - m, y + 12);
    doc.text(data.landlordName, w - m - 35 + (35 / 2), y + 17, { align: 'center' });

    // Disclaimer
    y += 22;
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    const disc = doc.splitTextToSize('This is a basic rent receipt for reference purposes. For legal or tax use, verify requirements with a professional. Generated by JaldiDocs.', w - 2 * m);
    doc.text(disc, m, y);

    doc.save(`rent-receipt-${data.month}-${data.year}.pdf`);
  };

  const inputClass = (field: keyof ReceiptData) =>
    `input-field text-sm ${errors[field] ? 'border-danger ring-1 ring-danger' : ''}`;

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          This tool creates a basic rent receipt format for general use. For HRA tax claims or legal disputes,
          verify the exact format required with a CA or tax professional. We do not provide legal or tax advice.
        </p>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 justify-end">
        <button onClick={saveDraft} className="btn-secondary text-xs gap-1.5">
          <Save className="w-3.5 h-3.5" /> {saved ? 'Saved!' : 'Save Draft'}
        </button>
        <button onClick={clearDraft} className="btn-ghost text-xs text-danger gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-primary">Receipt Details</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="receiptNo">Receipt No.</label>
              <input id="receiptNo" type="text" value={data.receiptNo} onChange={(e) => set('receiptNo', e.target.value)} className="input-field text-sm" placeholder="RR-001" />
            </div>
            <div>
              <label className="label" htmlFor="receiptDate">Date</label>
              <input id="receiptDate" type="date" value={data.receiptDate} onChange={(e) => set('receiptDate', e.target.value)} className="input-field text-sm" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="tenantName">Tenant Name *</label>
            <input id="tenantName" type="text" value={data.tenantName} onChange={(e) => set('tenantName', e.target.value)} className={inputClass('tenantName')} placeholder="Rahul Sharma" />
            {errors.tenantName && <p className="error-text">{errors.tenantName}</p>}
          </div>

          <div>
            <label className="label" htmlFor="landlordName">Landlord Name *</label>
            <input id="landlordName" type="text" value={data.landlordName} onChange={(e) => set('landlordName', e.target.value)} className={inputClass('landlordName')} placeholder="Suresh Kumar" />
            {errors.landlordName && <p className="error-text">{errors.landlordName}</p>}
          </div>

          <div>
            <label className="label" htmlFor="rentAmount">Rent Amount (₹) *</label>
            <input id="rentAmount" type="number" value={data.rentAmount} onChange={(e) => set('rentAmount', e.target.value)} className={inputClass('rentAmount')} placeholder="12000" min="0" />
            {errors.rentAmount && <p className="error-text">{errors.rentAmount}</p>}
            {data.rentAmount && !isNaN(Number(data.rentAmount)) && (
              <p className="helper-text">{amountInWords(data.rentAmount)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="month">Month *</label>
              <select id="month" value={data.month} onChange={(e) => set('month', e.target.value)} className="input-field text-sm">
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="year">Year *</label>
              <input id="year" type="number" value={data.year} onChange={(e) => set('year', e.target.value)} className="input-field text-sm" min="2000" max="2099" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="address">Property Address *</label>
            <textarea id="address" value={data.address} onChange={(e) => set('address', e.target.value)} className={`${inputClass('address')} resize-none`} rows={2} placeholder="45, MG Road, Flat 3B, Bengaluru 560001" />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          <div>
            <label className="label" htmlFor="paymentMode">Payment Mode</label>
            <select id="paymentMode" value={data.paymentMode} onChange={(e) => set('paymentMode', e.target.value)} className="input-field text-sm">
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="landlordPan">Landlord PAN (optional)</label>
            <input id="landlordPan" type="text" value={data.landlordPan} onChange={(e) => set('landlordPan', e.target.value.toUpperCase())} className="input-field text-sm" placeholder="ABCDE1234F" maxLength={10} />
            <p className="helper-text">Required for HRA claims if annual rent exceeds ₹1 lakh</p>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          {/* Visual preview */}
          <div className="card p-5">
            <p className="text-xs font-medium text-secondary mb-4 uppercase tracking-wide">Preview</p>
            <div className="bg-white border border-border rounded-xl p-5 text-xs space-y-2 font-mono">
              <div className="bg-accent text-white text-center py-2 rounded-lg font-sans font-bold text-sm tracking-wide">
                RENT RECEIPT
              </div>
              <div className="grid grid-cols-2 gap-1 mt-3 font-sans">
                <span className="text-secondary">Receipt No.</span>
                <span className="font-medium text-primary">{data.receiptNo || '—'}</span>
                <span className="text-secondary">Date</span>
                <span className="font-medium text-primary">{data.receiptDate || '—'}</span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="grid grid-cols-2 gap-1 font-sans">
                <span className="text-secondary">Received from</span>
                <span className="font-medium text-primary">{data.tenantName || '—'}</span>
                <span className="text-secondary">Rent Amount</span>
                <span className="font-semibold text-accent">
                  {data.rentAmount ? `₹${Number(data.rentAmount).toLocaleString('en-IN')}/-` : '—'}
                </span>
                <span className="text-secondary">For Month</span>
                <span className="font-medium text-primary">{data.month} {data.year}</span>
                <span className="text-secondary">Property</span>
                <span className="font-medium text-primary truncate">{data.address || '—'}</span>
                <span className="text-secondary">Payment</span>
                <span className="font-medium text-primary">{data.paymentMode}</span>
              </div>
              <div className="border-t border-border mt-3 pt-3 text-right font-sans">
                <p className="text-secondary text-[10px]">Landlord's Signature</p>
                <p className="font-medium text-primary mt-1">{data.landlordName || '—'}</p>
              </div>
            </div>
          </div>

          <button onClick={downloadPdf} className="btn-primary w-full justify-center">
            <Download className="w-4 h-4" /> Download Rent Receipt PDF
          </button>

          <p className="text-xs text-gray-400 text-center">
            Receipt data is saved only in your browser (localStorage) if you click Save Draft.
          </p>
        </div>
      </div>
    </div>
  );
}
