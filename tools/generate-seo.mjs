import fs from 'fs';
import path from 'path';

function getSiteUrl() {
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL.replace(/\/$/, '');
  }

  // Tenta ler do .env.production
  const envPath = path.resolve('.env.production');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/VITE_SITE_URL\s*=\s*(.+)/);
    if (match && match[1]) {
      return match[1].trim().replace(/['"]/g, '').replace(/\/$/, '');
    }
  }

  return 'https://braseiro-tau.vercel.app';
}

function generateRobots(siteUrl) {
  const content = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  fs.writeFileSync('public/robots.txt', content, 'utf8');
  console.log('public/robots.txt gerado com sucesso.');
}

function generateSitemap(siteUrl) {
  const today = new Date().toISOString().split('T')[0];

  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/cardapio', priority: '0.9', changefreq: 'weekly' },
    { path: '/cardapio/gastronomia', priority: '0.8', changefreq: 'weekly' },
    { path: '/cardapio/drinks', priority: '0.8', changefreq: 'weekly' },
    { path: '/cardapio/executivos', priority: '0.8', changefreq: 'weekly' },
  ];

  const urlsXml = routes
    .map(
      (r) => `  <url>
    <loc>${siteUrl}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

  fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');
  console.log('public/sitemap.xml gerado com sucesso.');
}

function main() {
  const siteUrl = getSiteUrl();
  console.log(`Gerando SEO para: ${siteUrl}`);
  generateRobots(siteUrl);
  generateSitemap(siteUrl);
}

main();
