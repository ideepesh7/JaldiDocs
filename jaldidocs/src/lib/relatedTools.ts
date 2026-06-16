import { TOOLS } from '../data/tools';

const relatedPriority: Record<string, string[]> = {
  'image-resize': ['image-compress', 'passport-photo-maker', 'signature-resize', 'jpg-to-pdf'],
  'image-compress': ['image-resize', 'passport-photo-maker', 'signature-resize', 'jpg-to-pdf'],
  'passport-photo-maker': ['aadhaar-photo-resize', 'pan-card-photo-resize', 'image-compress', 'signature-resize'],
  'signature-resize': ['image-compress', 'image-resize', 'aadhaar-photo-resize', 'passport-photo-maker'],
  'aadhaar-photo-resize': ['pan-card-photo-resize', 'passport-photo-maker', 'image-compress', 'signature-resize'],
  'pan-card-photo-resize': ['aadhaar-photo-resize', 'passport-photo-maker', 'image-compress', 'signature-resize'],
  'jpg-to-pdf': ['image-compress', 'image-resize', 'merge-pdf', 'pdf-compressor'],
  'merge-pdf': ['jpg-to-pdf', 'pdf-compressor', 'image-compress', 'invoice-maker'],
  'pdf-compressor': ['merge-pdf', 'jpg-to-pdf', 'image-compress', 'image-resize'],
  'invoice-maker': ['rent-receipt-generator', 'pdf-compressor', 'merge-pdf', 'jpg-to-pdf'],
  'rent-receipt-generator': ['invoice-maker', 'pdf-compressor', 'merge-pdf', 'jpg-to-pdf'],
};

export function getRelatedTools(currentId: string, limit = 4) {
  const current = TOOLS.find((tool) => tool.id === currentId);
  const priority = relatedPriority[currentId] || [];
  const selected = new Set<string>();

  const related = priority
    .map((id) => TOOLS.find((tool) => tool.id === id))
    .filter(Boolean)
    .filter((tool) => {
      if (!tool || tool.id === currentId || selected.has(tool.id)) return false;
      selected.add(tool.id);
      return true;
    });

  if (related.length < limit && current) {
    for (const tool of TOOLS) {
      if (tool.id === currentId || selected.has(tool.id)) continue;
      if (tool.category !== current.category && !tool.tags.some((tag) => current.tags.includes(tag))) continue;
      selected.add(tool.id);
      related.push(tool);
      if (related.length >= limit) break;
    }
  }

  return related.slice(0, limit);
}
