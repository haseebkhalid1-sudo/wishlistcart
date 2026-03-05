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
  ]

  // TODO: Phase 1B — add public wishlist pages from DB once we have enough users
  // const publicWishlists = await prisma.wishlist.findMany({ where: { privacy: 'PUBLIC' }, ... })
  // return [...staticPages, ...publicWishlists.map(w => ({ url: `${BASE_URL}/@${w.username}/${w.slug}`, ... }))]

  return staticPages
}
