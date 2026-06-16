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

export function GET() {
  const entries = urls
    .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`)
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
