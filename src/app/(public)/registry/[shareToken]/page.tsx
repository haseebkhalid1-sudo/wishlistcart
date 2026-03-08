import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicRegistry } from '@/lib/queries/registry'
import type { PublicRegistry } from '@/lib/queries/registry'
import { PublicRegistryView } from '@/components/registry/public-registry-view'
import type { EventType } from '@prisma/client'

interface Props {
  params: Promise<{ shareToken: string }>
}

function getEventTypeLabel(eventType: EventType | null | undefined): string {
  switch (eventType) {
    case 'WEDDING':       return 'Wedding Registry'
    case 'BABY_SHOWER':   return 'Baby Shower Registry'
    case 'BIRTHDAY':      return 'Birthday Wishlist'
    case 'HOLIDAY':       return 'Holiday Registry'
    case 'HOUSEWARMING':  return 'Housewarming Registry'
    case 'GRADUATION':    return 'Graduation Registry'
    case 'ANNIVERSARY':   return 'Anniversary Registry'
    case 'BACK_TO_SCHOOL': return 'Back to School List'
    case 'CUSTOM':
    default:              return 'Gift Registry'
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareToken } = await params
  const registry = await getPublicRegistry(shareToken)
  if (!registry) return { title: 'Not found' }

  const owner = registry.user.name ?? registry.user.username ?? 'Someone'
  const eventTypeLabel = getEventTypeLabel(registry.eventType)
  const title = `${registry.name} — ${eventTypeLabel}`
  const description = `Gift registry for ${owner}. ${registry._count.items} items from any store.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og-image?title=${encodeURIComponent(registry.name)}&subtitle=${encodeURIComponent(eventTypeLabel)}&items=${registry._count.items}`,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function buildEventSchema(registry: PublicRegistry, shareToken: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: registry.name,
    description:
      registry.description ??
      `${registry.user?.name ?? 'Someone'}'s gift registry on WishlistCart`,
    organizer: {
      '@type': 'Person',
      name: registry.user?.name ?? registry.user?.username ?? 'Anonymous',
    },
    url: `${process.env.NEXT_PUBLIC_APP_URL}/registry/${shareToken}`,
  }
  if (registry.eventDate) {
    schema.startDate = registry.eventDate.toISOString()
  }
  return schema
}

function buildItemListSchema(registry: PublicRegistry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${registry.name} — Gift Registry`,
    numberOfItems: registry.items.length,
    itemListElement: registry.items.slice(0, 10).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: item.title,
        ...(item.imageUrl ? { image: item.imageUrl } : {}),
        ...(item.price
          ? {
              offers: {
                '@type': 'Offer',
                price: Number(item.price).toFixed(2),
                priceCurrency: item.currency ?? 'USD',
              },
            }
          : {}),
      },
    })),
  }
}

export default async function PublicRegistryPage({ params }: Props) {
  const { shareToken } = await params
  const registry = await getPublicRegistry(shareToken)

  if (!registry) notFound()

  const eventSchema = buildEventSchema(registry, shareToken)
  const itemListSchema = buildItemListSchema(registry)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PublicRegistryView registry={registry} shareToken={shareToken} />
    </>
  )
}
