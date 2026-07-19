// src/components/ui/ToolCard.tsx
import {
  Maximize2, Minimize2, UserSquare2, Receipt, FileImage, Combine,
  FileDown, Pen, CreditCard, IdCard, Home, ArrowRight, CalendarDays,
  Percent, FileText, CaseSensitive, IndianRupee
} from 'lucide-react';
import type { Tool } from '../../data/tools';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Maximize2, Minimize2, UserSquare2, Receipt, FileImage, Combine,
  FileDown, Pen, CreditCard, IdCard, Home, CalendarDays, Percent,
  FileText, CaseSensitive, IndianRupee,
};

const CATEGORY_STYLES = {
  pdf: 'badge-pdf',
  image: 'badge-image',
  business: 'badge-business',
  student: 'badge-student',
};

const CATEGORY_LABELS = {
  pdf: 'PDF',
  image: 'Image',
  business: 'Business',
  student: 'Student',
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const Icon = ICON_MAP[tool.icon] || FileDown;

  return (
    <a
      href={tool.slug}
      className="tool-card group flex flex-col"
      aria-label={`Open ${tool.name} tool`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-accent-soft flex items-center justify-center group-hover:bg-accent transition-colors duration-200">
          <Icon className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-200" />
        </div>
        <span className={CATEGORY_STYLES[tool.category]}>
          {CATEGORY_LABELS[tool.category]}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-primary mb-1">{tool.name}</h3>
      <p className="text-xs text-secondary leading-relaxed flex-1">{tool.shortDesc}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all duration-200">
        Use Tool <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </a>
  );
}
