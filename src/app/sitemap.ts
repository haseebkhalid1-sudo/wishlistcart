import type { MetadataRoute } from 'next'

const BASE_URL = 'https://wishlistcart.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/introducing-wishlistcart`,
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]

  const personaGuides: MetadataRoute.Sitemap = [
    'mom', 'dad', 'wife', 'husband', 'boyfriend', 'girlfriend', 'kids', 'teens', 'coworker',
  ].map((person) => ({
    url: `${BASE_URL}/gift-ideas/for/${person}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const budgetGuides: MetadataRoute.Sitemap = ['25', '50', '100'].map((price) => ({
    url: `${BASE_URL}/gift-ideas/under/${price}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // TODO: add public wishlist pages from DB once we have enough users
  // const publicWishlists = await prisma.wishlist.findMany({ where: { privacy: 'PUBLIC' }, ... })
  // return [...staticPages, ...publicWishlists.map(w => ({ url: `${BASE_URL}/@${w.username}/${w.slug}`, ... }))]

  return [...staticPages, ...personaGuides, ...budgetGuides]
}
