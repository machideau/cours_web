const { getCoursesList } = require('./courseService');

const BASE_URL = process.env.SITE_URL || 'https://coursmachideau.fr';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildUrl(loc, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function generateSitemap() {
  const courses = getCoursesList();
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    buildUrl(`${BASE_URL}/`, 'weekly', '1.0'),
    ...courses.map(c =>
      buildUrl(`${BASE_URL}/cours/${escapeXml(c.slug)}`, 'monthly', '0.8')
    ),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <!-- Generated: ${today} -->`,
    ...urls,
    '</urlset>',
  ].join('\n');
}

module.exports = { generateSitemap };
