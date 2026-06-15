// src/components/ui/RelatedTools.tsx
import { ArrowRight } from 'lucide-react';
import type { Tool } from '../../data/tools';

export default function RelatedTools({ tools, currentId }: { tools: Tool[]; currentId: string }) {
  const related = tools.filter((t) => t.id !== currentId).slice(0, 4);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-primary mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((tool) => (
          <a
            key={tool.id}
            href={tool.slug}
            className="flex items-center justify-between gap-3 card px-4 py-3.5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div>
              <p className="text-sm font-medium text-primary">{tool.name}</p>
              <p className="text-xs text-secondary mt-0.5">{tool.shortDesc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-secondary group-hover:text-accent transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
}
