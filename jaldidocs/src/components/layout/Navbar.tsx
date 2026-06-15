// src/components/layout/Navbar.tsx
import { useState } from 'react';
import { Menu, X, FileText, Zap } from 'lucide-react';

const navLinks = [
  { label: 'PDF Tools', href: '/#pdf-tools' },
  { label: 'Image Tools', href: '/#image-tools' },
  { label: 'Business Tools', href: '/#business-tools' },
  { label: 'Student Tools', href: '/#student-tools' },
  { label: 'Privacy', href: '/privacy' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 text-primary font-semibold text-lg tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </span>
            <span>
              Jaldi<span className="text-accent">Docs</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="btn-ghost text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/tools/image-resize" className="btn-primary text-sm">
              Start Free
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-secondary hover:bg-gray-100 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-border shadow-lg">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-gray-50 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border mt-3">
              <a href="/tools/image-resize" className="btn-primary w-full justify-center text-sm">
                Start Free
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
