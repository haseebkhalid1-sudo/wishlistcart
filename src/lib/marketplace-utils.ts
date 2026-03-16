// Shared marketplace utilities — no 'use server', safe to import in client components

export const MARKETPLACE_CATEGORIES = [
  { slug: 'home', label: 'Home & Living' },
  { slug: 'tech', label: 'Tech & Gadgets' },
  { slug: 'fashion', label: 'Fashion & Style' },
  { slug: 'beauty', label: 'Beauty & Wellness' },
  { slug: 'kids', label: 'Kids & Toys' },
  { slug: 'books', label: 'Books & Learning' },
  { slug: 'sports', label: 'Sports & Outdoors' },
  { slug: 'food', label: 'Food & Drink' },
] as const

export type CategorySlug = (typeof MARKETPLACE_CATEGORIES)[number]['slug']

export function slugToLabel(slug: string): string {
  return (
    MARKETPLACE_CATEGORIES.find((c) => c.slug === slug)?.label ??
    slug.charAt(0).toUpperCase() + slug.slice(1)
  )
}
