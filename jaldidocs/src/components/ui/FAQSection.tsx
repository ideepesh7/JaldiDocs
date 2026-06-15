// src/components/ui/FAQSection.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '../../data/faqs';

export default function FAQSection({ faqs, title = 'Frequently Asked Questions' }: { faqs: FAQ[]; title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="mt-12" aria-label="Frequently Asked Questions">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 className="text-xl font-semibold text-primary mb-6">{title}</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-primary hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-secondary flex-shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-secondary leading-relaxed border-t border-border pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
