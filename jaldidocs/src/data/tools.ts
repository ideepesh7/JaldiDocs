// src/data/tools.ts
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  category: 'pdf' | 'image' | 'business' | 'student';
  icon: string;
  popular?: boolean;
  tags: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'image-resize',
    name: 'Image Resize',
    slug: '/tools/image-resize/',
    description: 'Resize any JPG, PNG or WEBP image to exact dimensions. Perfect for exam forms, job applications, and government portals.',
    shortDesc: 'Resize images to exact dimensions',
    category: 'image',
    icon: 'Maximize2',
    popular: true,
    tags: ['resize', 'image', 'photo', 'jpg', 'png', 'dimension'],
  },
  {
    id: 'image-compress',
    name: 'Image Compress',
    slug: '/tools/image-compress/',
    description: 'Compress JPG, PNG and WEBP images to reduce file size. Meet upload limits for forms and portals without losing quality.',
    shortDesc: 'Compress images under 50KB, 100KB, 200KB',
    category: 'image',
    icon: 'Minimize2',
    popular: true,
    tags: ['compress', 'reduce', 'image', 'file size', '50kb', '100kb'],
  },
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    slug: '/tools/passport-photo-maker/',
    description: 'Create standard passport and visa photos in 35×45mm, 2×2 inch and other sizes. Generate a printable sheet of multiple photos.',
    shortDesc: 'Create passport photos 35×45mm, 2×2 inch',
    category: 'image',
    icon: 'UserSquare2',
    popular: true,
    tags: ['passport', 'photo', 'visa', '35x45', '2x2', 'print'],
  },
  {
    id: 'invoice-maker',
    name: 'Invoice Maker',
    slug: '/tools/invoice-maker/',
    description: 'Create professional GST invoices with line items, tax calculation, and download as PDF. Free for freelancers and small businesses.',
    shortDesc: 'Create GST invoices, download as PDF',
    category: 'business',
    icon: 'Receipt',
    popular: true,
    tags: ['invoice', 'gst', 'bill', 'pdf', 'freelancer', 'business'],
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: '/tools/jpg-to-pdf/',
    description: 'Convert multiple JPG, PNG or WEBP images into a single PDF. Set page size, orientation and margin.',
    shortDesc: 'Convert images to a single PDF',
    category: 'pdf',
    icon: 'FileImage',
    popular: true,
    tags: ['jpg to pdf', 'image to pdf', 'convert', 'png to pdf'],
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: '/tools/merge-pdf/',
    description: 'Combine multiple PDF files into one. Upload, reorder and merge PDFs entirely in your browser.',
    shortDesc: 'Combine multiple PDFs into one',
    category: 'pdf',
    icon: 'Combine',
    popular: true,
    tags: ['merge pdf', 'combine pdf', 'join pdf', 'multiple pdf'],
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    slug: '/tools/pdf-compressor/',
    description: 'Reduce PDF file size with basic browser-based optimization. Works best on text-heavy PDFs.',
    shortDesc: 'Reduce PDF file size in your browser',
    category: 'pdf',
    icon: 'FileDown',
    popular: true,
    tags: ['compress pdf', 'reduce pdf', 'pdf size', 'smaller pdf'],
  },
  {
    id: 'signature-resize',
    name: 'Signature Resize',
    slug: '/tools/signature-resize/',
    description: 'Resize your scanned signature to standard sizes (140×60, 160×60, 200×80 px) and compress under 20KB for online forms.',
    shortDesc: 'Resize signature for online forms',
    category: 'student',
    icon: 'Pen',
    popular: true,
    tags: ['signature', 'resize', 'exam form', '20kb', 'scanned'],
  },
  {
    id: 'aadhaar-photo-resize',
    name: 'Aadhaar Photo Resize',
    slug: '/tools/aadhaar-photo-resize/',
    description: 'Resize your photo for Aadhaar card update, enrollment and other government portal requirements.',
    shortDesc: 'Resize photo for Aadhaar portals',
    category: 'student',
    icon: 'CreditCard',
    tags: ['aadhaar', 'photo', 'resize', 'government', 'id'],
  },
  {
    id: 'pan-card-photo-resize',
    name: 'PAN Card Photo Resize',
    slug: '/tools/pan-card-photo-resize/',
    description: 'Resize your photo to the correct size for PAN card applications and income tax portal uploads.',
    shortDesc: 'Resize photo for PAN card applications',
    category: 'student',
    icon: 'IdCard',
    tags: ['pan card', 'photo', 'resize', 'income tax', 'nsdl'],
  },
  {
    id: 'rent-receipt-generator',
    name: 'Rent Receipt Generator',
    slug: '/tools/rent-receipt-generator/',
    description: 'Generate professional rent receipts with tenant details, rent amount and payment mode. Download as PDF or print.',
    shortDesc: 'Generate rent receipts for HRA claims',
    category: 'business',
    icon: 'Home',
    tags: ['rent receipt', 'hra', 'landlord', 'tenant', 'pdf'],
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Tools', count: TOOLS.length },
  { id: 'pdf', label: 'PDF Tools', count: TOOLS.filter(t => t.category === 'pdf').length },
  { id: 'image', label: 'Image Tools', count: TOOLS.filter(t => t.category === 'image').length },
  { id: 'business', label: 'Business Tools', count: TOOLS.filter(t => t.category === 'business').length },
  { id: 'student', label: 'Student Tools', count: TOOLS.filter(t => t.category === 'student').length },
];

export const POPULAR_TOOLS = TOOLS.filter(t => t.popular);
