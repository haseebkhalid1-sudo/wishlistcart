import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicRegistry } from '@/lib/queries/registry'
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

export default async function PublicRegistryPage({ params }: Props) {
  const { shareToken } = await params
  const registry = await getPublicRegistry(shareToken)

  if (!registry) notFound()

  return <PublicRegistryView registry={registry} shareToken={shareToken} />
}
