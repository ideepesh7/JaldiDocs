# JaldiDocs — Google AdSense Readiness Checklist

This checklist must be completed before applying for Google AdSense approval.
AdSense approval is not guaranteed, but following these practices gives you the
best chance of approval and compliance.

---

## ✅ Content & Pages

- [ ] Site has 16+ useful, working pages (tools + legal + info pages)
- [ ] All pages have unique title tags and meta descriptions
- [ ] All pages have an H1 heading
- [ ] All pages have real, original, helpful content (no lorem ipsum)
- [ ] No under-construction pages linked from navigation
- [ ] No broken internal links
- [ ] No pages with thin or duplicate content
- [ ] Each tool page has: working tool, how-to guide, use cases, FAQs, related tools
- [ ] FAQ sections present on all tool pages
- [ ] All tool pages link to related tools

---

## ✅ Required Trust Pages (must be complete before applying)

- [ ] Privacy Policy (`/privacy`) — complete, mentions browser-only processing, no server upload
- [ ] Terms of Use (`/terms`) — complete, mentions convenience tools, no official acceptance guarantee
- [ ] About page (`/about`) — explains site mission and browser-based privacy
- [ ] Contact page (`/contact`) — real contact email (not placeholder) before applying

> ⚠️ Replace `hello@jaldi-docs.example` with a real email address BEFORE applying for AdSense.

---

## ✅ Navigation & Structure

- [ ] Clear header navigation present on all pages
- [ ] Clear footer navigation with all tool and legal links
- [ ] Breadcrumbs present on all tool pages
- [ ] Related tools section on all tool pages
- [ ] All navigation links lead to real, working pages
- [ ] Mobile menu works correctly on small screens

---

## ✅ Ad Placement Safety (pre-AdSense)

- [ ] AdSlot placeholder components are present but show only "Ad space reserved"
- [ ] No ad placeholders placed immediately next to tool action buttons (upload, process, download)
- [ ] No fake "Click here" or "Download" text near ad slots
- [ ] No pop-ups, pop-unders, or auto-redirect scripts
- [ ] No fake download buttons
- [ ] No incentivised click language anywhere on site

---

## ✅ Technical Readiness

- [ ] Site is live and accessible via HTTPS (Cloudflare Pages provides this automatically)
- [ ] Site loads on mobile without horizontal scroll
- [ ] All interactive tool components function correctly
- [ ] No JavaScript console errors on page load
- [ ] `robots.txt` is present and allows crawling
- [ ] `sitemap.xml` or `sitemap-index.xml` is generated at build time
- [ ] `ads.txt` is present at root with correct publisher ID (add AFTER approval)

---

## ✅ AdSense Code Placement (add ONLY after approval)

When you receive AdSense approval:

1. Open `src/layouts/BaseLayout.astro`
2. Find the comment block:
   ```
   <!-- ADSENSE PLACEMENT:
   To add Google AdSense verification or script, insert here: ...
   -->
   ```
3. Replace it with your actual AdSense script tag:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
4. Update `public/ads.txt` with your real publisher ID line:
   ```
   google.com, pub-XXXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
5. Replace AdSlot placeholder components with real `<ins class="adsbygoogle">` ad units.

---

## ✅ Before Applying — Final Checks

- [ ] Site has received some real visitors (organic, direct, or social) before review — avoid submitting on day 1
- [ ] Contact email is a real address (not placeholder)
- [ ] Custom domain is connected (optional for MVP, but recommended for faster approval)
- [ ] Privacy Policy updated if analytics or ads have been added
- [ ] Site does not contain any copied content from competitors
- [ ] Site does not contain any adult, violent, hate speech, or otherwise policy-violating content

---

## 📋 Deployment Reference

```bash
# Local development
npm install
npm run dev          # http://localhost:4321

# Production build
npm run build        # Output: /dist

# Cloudflare Pages settings
# Build command:    npm run build
# Output directory: dist
# Node version:     18 or 20
```

---

## 📋 Domain & Hosting (₹0 MVP)

- Hosting: Cloudflare Pages free plan
- Subdomain: `jaldi-docs.pages.dev` (auto-assigned)
- Custom domain: Optional — connect via Cloudflare Pages > Custom domains (requires domain purchase)
- SSL: Automatic via Cloudflare (free)
- CDN: Automatic via Cloudflare (free)

---

*Last updated: January 2025*
