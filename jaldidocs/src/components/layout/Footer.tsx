// src/components/layout/Footer.tsx
import { Zap, Shield, Heart } from 'lucide-react';

const footerLinks = {
  'PDF Tools': [
    { label: 'JPG to PDF', href: '/tools/jpg-to-pdf' },
    { label: 'Merge PDF', href: '/tools/merge-pdf' },
    { label: 'PDF Compressor', href: '/tools/pdf-compressor' },
  ],
  'Image Tools': [
    { label: 'Image Resize', href: '/tools/image-resize' },
    { label: 'Image Compress', href: '/tools/image-compress' },
    { label: 'Passport Photo', href: '/tools/passport-photo-maker' },
    { label: 'Signature Resize', href: '/tools/signature-resize' },
  ],
  'Business Tools': [
    { label: 'Invoice Maker', href: '/tools/invoice-maker' },
    { label: 'Rent Receipt', href: '/tools/rent-receipt-generator' },
  ],
  'Student Tools': [
    { label: 'Aadhaar Photo Resize', href: '/tools/aadhaar-photo-resize' },
    { label: 'PAN Card Photo', href: '/tools/pan-card-photo-resize' },
  ],
  'Company': [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Brand row */}
        <div className="mb-10">
          <a href="/" className="flex items-center gap-2.5 text-primary font-semibold text-lg w-fit">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </span>
            <span>Jaldi<span className="text-accent">Docs</span></span>
          </a>
          <p className="text-secondary text-sm mt-3 max-w-xs leading-relaxed">
            Free PDF, image and document tools for India. Fast, private and free.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-secondary">
            <Shield className="w-3.5 h-3.5 text-success" />
            <span>Files processed locally in your browser. Nothing uploaded.</span>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-secondary">
            © {year} JaldiDocs. Made with{' '}
            <Heart className="w-3 h-3 inline text-danger" /> for India.
          </p>
          <p className="text-xs text-secondary">
            All tools are free and browser-based. No signup required.
          </p>
        </div>
      </div>
    </footer>
  );
}
