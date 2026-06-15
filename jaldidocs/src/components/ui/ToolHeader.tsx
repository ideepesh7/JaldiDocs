// src/components/ui/ToolHeader.tsx
import { Shield } from 'lucide-react';
import TrustBadges from './TrustBadges';

interface ToolHeaderProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
}

export default function ToolHeader({ name, description, icon, breadcrumb }: ToolHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-secondary mb-4" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i < breadcrumb.length - 1 ? (
                <>
                  <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
                  <span>/</span>
                </>
              ) : (
                <span className="text-primary font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-blue-100 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight">{name}</h1>
          <p className="text-secondary mt-2 text-sm md:text-base leading-relaxed max-w-2xl">{description}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <TrustBadges size="sm" />
        <div className="flex items-center gap-1.5 text-xs text-success">
          <Shield className="w-3.5 h-3.5" />
          <span>Files stay on your device. Not uploaded anywhere.</span>
        </div>
      </div>
    </div>
  );
}
