/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://poshkaarkashmir.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // make product pages slightly higher priority
    if (path.startsWith('/product/')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.85,
        lastmod: new Date().toISOString(),
      };
    }
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
