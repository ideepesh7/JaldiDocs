// src/components/HomePage.tsx
import { useMemo, useState } from 'react';
import {
  Search, ArrowRight, Shield, Zap, Smartphone, Lock,
  FileText, Image, Briefcase, GraduationCap,
  Star, CheckCircle2, Users, Clock, Upload, Download, Sparkles
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { HOME_FAQS } from '../data/faqs';
import Hero3DScene from './Hero3DScene';
import ToolCard from './ui/ToolCard';
import FAQSection from './ui/FAQSection';
import AdSlot from './ui/AdSlot';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    let tools = activeCategory === 'all' ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return tools;
  }, [search, activeCategory]);

  return (
    <main>
      <section className="hero-shell relative overflow-hidden bg-gradient-to-b from-white via-bg to-bg px-4 py-10 md:py-16">
        <div className="hero-ambient" />
        <span className="floating-tool left-[6%] top-20 hidden md:inline-flex">PDF</span>
        <span className="floating-tool right-[8%] top-24 hidden md:inline-flex" style={{ animationDelay: '1.1s' }}>Photo 50KB</span>
        <span className="floating-tool left-[12%] bottom-20 hidden lg:inline-flex" style={{ animationDelay: '2s' }}>Invoice</span>
        <span className="floating-tool right-[14%] bottom-24 hidden lg:inline-flex" style={{ animationDelay: '3s' }}>HRA</span>

        <div className="hero-grid relative z-10 mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="text-center lg:text-left">
            <div className="motion-pop inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 text-xs font-medium text-secondary mb-6 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-accent" />
              Free browser-based tools - no upload, no signup
            </div>

            <h1 className="motion-reveal motion-delay-1 text-4xl md:text-6xl xl:text-7xl font-semibold text-primary tracking-tight leading-tight mb-6">
              Free PDF, Image &{' '}
              <span className="hero-emphasis font-serif italic text-accent">Document Tools</span>
              {' '}for India
            </h1>

            <p className="motion-reveal motion-delay-2 text-lg md:text-xl text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
              Compress, resize, convert and create everyday documents directly in your browser.
              No signup. No upload. No cost.
            </p>

            <div className="motion-reveal motion-delay-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <a href="#all-tools" className="btn-primary px-6 py-3 text-base">
                Explore Tools <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/tools/image-resize/" className="btn-secondary px-6 py-3 text-base">
                Resize Image
              </a>
            </div>

            <div className="motion-stagger flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {[
                { icon: Users, label: 'No Signup Required' },
                { icon: Shield, label: 'Browser-based' },
                { icon: Star, label: 'Free to Use' },
                { icon: Lock, label: 'Privacy-first' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="trust-pill flex items-center gap-1.5 bg-white border border-border rounded-full px-3.5 py-1.5 text-xs font-medium text-secondary shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-success" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-stage motion-reveal motion-delay-3">
            <Hero3DScene />
            <div className="hero-flow hero-flow-overlay" aria-hidden="true">
              <div className="flow-lane">
                {[
                  { icon: Upload, label: 'Pick file', detail: 'local only' },
                  { icon: Sparkles, label: 'Auto fix', detail: 'size ready' },
                  { icon: Download, label: 'Download', detail: 'instant PDF' },
                ].map(({ icon: Icon, label, detail }, index) => (
                  <div key={label} className="motion-file-card" style={{ animationDelay: `${index * 0.35}s` }}>
                    <div className="motion-file-icon">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-semibold text-primary">{label}</p>
                      <p className="text-[10px] font-medium text-secondary">{detail}</p>
                    </div>
                    <div className="mini-progress" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="all-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="motion-reveal motion-delay-4 card p-4 md:p-6">
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PDF, image, invoice, passport photo..."
              className="input-field pl-10 text-sm"
              aria-label="Search tools"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                  activeCategory === cat.id
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-white text-secondary border-border hover:border-accent hover:text-accent'
                }`}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-secondary text-sm">No tools found for "{search}". Try a different search.</p>
          </div>
        ) : (
          <>
            {search === '' && activeCategory === 'all' && (
              <div className="motion-reveal mb-6">
                <h2 className="section-title mb-1">Popular Tools</h2>
                <p className="section-subtitle text-sm">Most used tools by Indian students, freelancers and small businesses.</p>
              </div>
            )}
            <div className="motion-stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AdSlot label="Advertisement" className="max-w-2xl mx-auto" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="motion-reveal bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-3xl p-8 md:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="success-pulse w-10 h-10 rounded-xl bg-success flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-success uppercase tracking-wide">Privacy First</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4 tracking-tight">
              Your files stay on your device
            </h2>
            <p className="text-secondary leading-relaxed mb-6">
              Every tool on JaldiDocs processes your files entirely in your browser using modern web APIs.
              Your photos, PDFs, invoices, and documents <strong>never leave your device</strong> and are
              never uploaded to any server. This is not just a claim - it is how the technology works.
            </p>
            <div className="motion-stagger grid sm:grid-cols-2 gap-4">
              {[
                'Files processed locally in your browser',
                'Zero server uploads in this MVP',
                'No account or login required',
                'Invoice drafts saved only in your browser',
                'You can clear all local data anytime',
                'No tracking or analytics in MVP',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <a href="/privacy/" className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-success hover:underline">
              Read our Privacy Policy <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="motion-reveal text-center mb-10">
          <h2 className="section-title">Why JaldiDocs?</h2>
          <p className="section-subtitle mx-auto">Built for real Indian document needs. Fast, honest, and free.</p>
        </div>
        <div className="motion-stagger grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              icon: Zap,
              title: 'Instant Results',
              desc: 'All tools run in your browser. No waiting for server uploads or queue processing.',
            },
            {
              icon: Lock,
              title: 'True Privacy',
              desc: 'Your files are never sent to a server. Process sensitive documents with confidence.',
            },
            {
              icon: Smartphone,
              title: 'Works on Mobile',
              desc: 'Mobile-first design means every tool works on your Android or iPhone browser.',
            },
            {
              icon: Clock,
              title: 'No Signup Ever',
              desc: 'Open any tool and start working. No account, no email, no password required.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card card p-5">
              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-primary text-sm mb-2">{title}</h3>
              <p className="text-xs text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pdf-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="motion-reveal text-center mb-10">
          <h2 className="section-title">Built for Everyday India</h2>
          <p className="section-subtitle mx-auto">Real tools for real tasks that millions of Indians face every day.</p>
        </div>
        <div className="motion-stagger grid md:grid-cols-2 gap-5">
          {[
            {
              icon: GraduationCap,
              title: 'Students & Exam Applicants',
              items: [
                'Resize photo to under 50KB for exam forms',
                'Resize signature for UPSC/SSC/state PSC portals',
                'Convert Aadhaar/marksheet images to PDF',
                'Compress documents for college portal uploads',
              ],
            },
            {
              icon: Briefcase,
              title: 'Freelancers & Small Businesses',
              items: [
                'Create GST invoices and download as PDF',
                'Generate rent receipts for HRA tax claims',
                'Merge multiple project documents into one PDF',
                'Create professional invoices without Excel',
              ],
            },
            {
              icon: FileText,
              title: 'Government Form Users',
              items: [
                'Resize passport photo to exact 35x45mm',
                'Compress photo for government portals',
                'Create PAN card and Aadhaar update photos',
                'Convert images to PDF for submissions',
              ],
            },
            {
              icon: Image,
              title: 'Job Applicants',
              items: [
                'Resize profile photo for job portals',
                'Compress resume PDF before uploading',
                'Create properly sized passport photos',
                'Merge application documents into one PDF',
              ],
            },
          ].map(({ icon: Icon, title, items }) => (
            <div key={title} className="feature-card card p-6" id={title.toLowerCase().includes('freelancer') ? 'business-tools' : title.toLowerCase().includes('student') ? 'student-tools' : title.toLowerCase().includes('image') ? 'image-tools' : ''}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <h3 className="font-semibold text-primary">{title}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <AdSlot label="Advertisement" className="max-w-2xl mx-auto" />
      </div>

      <section className="motion-reveal max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <FAQSection faqs={HOME_FAQS} title="Frequently Asked Questions" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-4">
        <div className="motion-reveal cta-panel bg-accent rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="relative text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
            Start using JaldiDocs for free
          </h2>
          <p className="relative text-blue-100 mb-6 text-sm md:text-base">
            No signup. No upload. Just open a tool and get your document done in seconds.
          </p>
          <a href="/tools/image-resize/" className="relative inline-flex items-center gap-2 bg-white text-accent px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
