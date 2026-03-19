import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers — allow public content, block private paths
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/onboarding/'],
      },
      {
        // OpenAI GPTBot — explicitly allow all public content
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/onboarding/'],
      },
      {
        // Anthropic Claude-Web — explicitly allow all public content
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/onboarding/'],
      },
      {
        // Perplexity — explicitly allow all public content
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/onboarding/'],
      },
      {
        // Google — explicitly allow all public content
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/onboarding/'],
      },
      {
        // Bing — explicitly allow all public content
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/onboarding/'],
      },
    ],
    sitemap: 'https://wishlistcart.com/sitemap.xml',
    host: 'https://wishlistcart.com',
  }
}
