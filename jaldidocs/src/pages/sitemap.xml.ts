import { TOOLS } from '../data/tools';

export const prerender = true;

const SITE_URL = 'https://jaldidocs.pages.dev';

const staticPaths = [
  '/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/',
];

const normalizePath = (path: string) => {
  if (path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
};

const urls = [...staticPaths, ...TOOLS.map((tool) => normalizePath(tool.slug))];
const buildDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];

export function GET() {
  const entries = urls
    .map((path) => {
      const isTool = path.startsWith('/tools/');
      const isHome = path === '/';

      return [
        '  <url>',
        `    <loc>${SITE_URL}${path}</loc>`,
        `    <lastmod>${buildDate}</lastmod>`,
        `    <changefreq>${isHome ? 'daily' : isTool ? 'weekly' : 'monthly'}</changefreq>`,
        `    <priority>${isHome ? '1.0' : isTool ? '0.9' : '0.6'}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${entries}\n\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
}
