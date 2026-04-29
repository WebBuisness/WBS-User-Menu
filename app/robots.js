export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/confirmation'],
    },
    sitemap: 'https://wbs-demo-menu.vercel.app/sitemap.xml',
  };
}
