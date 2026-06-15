// src/components/ui/AdSlot.tsx
export default function AdSlot({ label = 'Advertisement space', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`ad-slot ${className}`} aria-label="Advertisement area">
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{label}</p>
      <p className="text-xs text-gray-300 mt-0.5">Ad space reserved for future</p>
    </div>
  );
}
