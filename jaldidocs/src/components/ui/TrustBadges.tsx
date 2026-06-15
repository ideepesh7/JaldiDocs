// src/components/ui/TrustBadges.tsx
import { Shield, UserX, Server, IndianRupee } from 'lucide-react';

const badges = [
  { icon: UserX, label: 'No Signup' },
  { icon: Server, label: 'Browser-based' },
  { icon: IndianRupee, label: 'Free to use' },
  { icon: Shield, label: 'Privacy-first' },
];

export default function TrustBadges({ size = 'default' }: { size?: 'default' | 'sm' }) {
  return (
    <div className="flex flex-wrap gap-3">
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={`flex items-center gap-1.5 bg-white border border-border rounded-full font-medium text-secondary ${
            size === 'sm' ? 'text-xs px-3 py-1' : 'text-xs px-3.5 py-1.5'
          }`}
        >
          <Icon className={size === 'sm' ? 'w-3 h-3 text-success' : 'w-3.5 h-3.5 text-success'} />
          {label}
        </div>
      ))}
    </div>
  );
}
