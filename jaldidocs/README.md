# JaldiDocs

**Free PDF, Image & Document Tools for India**

> Fast, private and free tools for everyday documents — directly in your browser.
> No signup. No upload. No cost.

Live demo: [jaldi-docs.pages.dev](https://jaldi-docs.pages.dev)

---

## What is JaldiDocs?

JaldiDocs is a free, browser-based document utility website built for Indian users. Every tool
processes your files entirely in your browser using modern web APIs — your files are never uploaded
to any server.

### Tools included

| Tool | Route |
|---|---|
| Image Resize | `/tools/image-resize` |
| Image Compress | `/tools/image-compress` |
| Passport Photo Maker | `/tools/passport-photo-maker` |
| Invoice Maker (GST) | `/tools/invoice-maker` |
| JPG to PDF | `/tools/jpg-to-pdf` |
| Merge PDF | `/tools/merge-pdf` |
| PDF Compressor | `/tools/pdf-compressor` |
| Signature Resize | `/tools/signature-resize` |
| Aadhaar Photo Resize | `/tools/aadhaar-photo-resize` |
| PAN Card Photo Resize | `/tools/pan-card-photo-resize` |
| Rent Receipt Generator | `/tools/rent-receipt-generator` |

---

## Tech Stack

- **Framework:** [Astro](https://astro.build) v4 (static output)
- **UI Components:** React 18 + TypeScript
- **Styling:** Tailwind CSS v3
- **Icons:** lucide-react
- **PDF processing:** pdf-lib, jsPDF
- **Image processing:** Canvas API (browser-native)
- **Image compression:** browser-image-compression
- **Hosting:** Cloudflare Pages (free)
- **Cost:** ₹0 to build, host and run

---

## Local Development

### Prerequisites

- Node.js 18 or 20
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/jaldidocs.git
cd jaldidocs

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:4321
```

### Build

```bash
npm run build
# Output goes to /dist
```

### Preview production build

```bash
npm run preview
# Preview at http://localhost:4321
```

---

## Deployment — Cloudflare Pages (Free)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/jaldidocs.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Authorise Cloudflare to access your GitHub account
4. Select the `jaldidocs` repository
5. Set build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20` (set in Environment Variables: `NODE_VERSION = 20`)
6. Click **Save and Deploy**

Your site will be live at `https://jaldi-docs.pages.dev` (or your chosen subdomain) within 1–2 minutes.

### Every subsequent push to `main` triggers an automatic redeploy.

---

## Environment Variables

No environment variables are required. All processing is browser-side.

For future analytics or AdSense integration, see `ADSENSE_READY_CHECKLIST.md`.

---

## Customising for Production

Before going live, update these placeholders:

1. **Contact email** — Search for `hello@jaldi-docs.example` and replace with your real email in:
   - `src/pages/privacy.astro`
   - `src/pages/terms.astro`
   - `src/pages/about.astro`
   - `src/pages/contact.astro`

2. **Site URL** — In `astro.config.mjs`, update:
   ```js
   site: 'https://your-actual-domain.com'
   ```
   Also update `robots.txt` sitemap URL.

3. **OG Image** — Add a real `public/og-image.png` (1200×630 px) for social sharing previews.

4. **Apple Touch Icon** — Add `public/apple-touch-icon.png` (180×180 px).

---

## Project Structure

```
jaldidocs/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── ads.txt            # Placeholder — update after AdSense approval
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── tools/         # One .tsx per tool
│   │   └── ui/            # Reusable UI components
│   ├── data/
│   │   ├── tools.ts       # All tool metadata
│   │   └── faqs.ts        # FAQ data per tool
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ToolLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── tools/         # One .astro per tool
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── ADSENSE_READY_CHECKLIST.md
└── README.md
```

---

## Privacy

All file processing happens entirely in the user's browser using browser APIs (Canvas, pdf-lib, jsPDF).
No files are uploaded to any server. See `src/pages/privacy.astro` for the full privacy policy.

---

## Limitations (Browser-based Processing)

| Limitation | Reason |
|---|---|
| PDF image recompression limited | Requires server-side processing; browser cannot decompress/recompress JPEG inside PDF without quality loss |
| Encrypted PDFs cannot be merged | Browser cannot decrypt password-protected PDFs |
| Very large files may be slow | Browser memory limit; recommend keeping files under 50MB |
| No server-side OCR | Cannot extract text from scanned image PDFs |

---

## Roadmap

- [ ] OCR tool (using Tesseract.js — browser-based)
- [ ] Background remover for passport photos
- [ ] Resume builder / PDF formatter
- [ ] Bulk image resize
- [ ] QR code generator
- [ ] Digital signature tool

---

## Contributing

Pull requests are welcome. Please keep the ₹0 cost constraint — no paid APIs, no backend, no database.

---

## Licence

MIT — free to use, modify and distribute.

---

*JaldiDocs — Made for India.*
