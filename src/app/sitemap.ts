import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma/client'

const BASE_URL = 'https://wishlistcart.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      url: `${BASE_URL}/corporate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/developers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/classroom-wishlist`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/browser-extension`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
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
    {
      url: `${BASE_URL}/blog/wedding-registry-checklist-2026`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/baby-registry-must-haves-2026`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/price-tracking-wishlists-2026`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/how-to-create-a-wishlist`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/gift-ideas-for-people-who-have-everything`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/best-registry-apps-2026`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.8,
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

  const occasionGuides: MetadataRoute.Sitemap = [
    'wedding', 'baby-shower', 'birthday', 'christmas', 'valentines-day',
    'mothers-day', 'fathers-day', 'graduation', 'housewarming', 'anniversary',
  ].map((occasion) => ({
    url: `${BASE_URL}/gift-ideas/for/${occasion}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const budgetGuides: MetadataRoute.Sitemap = ['25', '50', '100', '150', '200', '300'].map((price) => ({
    url: `${BASE_URL}/gift-ideas/under/${price}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const marketplaceCategories: MetadataRoute.Sitemap = [
    'home', 'tech', 'fashion', 'beauty', 'kids', 'books', 'sports', 'food',
  ].map((slug) => ({
    url: `${BASE_URL}/marketplace/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const publicRegistries = await prisma.wishlist.findMany({
    where: {
      type: 'REGISTRY',
      privacy: 'PUBLIC',
      isArchived: false,
      shareToken: { not: null },
    },
    select: { shareToken: true, updatedAt: true },
    take: 5000,
    orderBy: { updatedAt: 'desc' },
  })

  const registryPages: MetadataRoute.Sitemap = publicRegistries.map((r) => ({
    url: `${BASE_URL}/registry/${r.shareToken as string}`,
    lastModified: r.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const marketplaceMain: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/marketplace`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  return [
    ...staticPages,
    ...personaGuides,
    ...occasionGuides,
    ...budgetGuides,
    ...marketplaceMain,
    ...marketplaceCategories,
    ...registryPages,
  ]
}
