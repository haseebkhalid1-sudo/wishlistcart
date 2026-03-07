import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getRegistryById } from '@/lib/actions/registries'
import { RegistrySettingsForm } from './registry-settings-form'
import { DangerZone } from './registry-settings-form'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const registry = await getRegistryById(id)
  return {
    title: registry ? `Settings — ${registry.name}` : 'Registry Settings',
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RegistrySettingsPage({ params }: Props) {
  const { id } = await params
  const registry = await getRegistryById(id)

  if (!registry) notFound()

  const registryProp = {
    id: registry.id,
    name: registry.name,
    description: registry.description,
    eventType: registry.eventType,
    eventDate: registry.eventDate ? new Date(registry.eventDate) : null,
    eventLocation: registry.eventLocation,
    privacy: registry.privacy,
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* ── Back link ── */}
      <Link
        href={`/dashboard/registries/${registry.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {registry.name}
      </Link>

      {/* ── Page heading ── */}
      <h1 className="font-serif text-display-md text-foreground leading-tight mb-8">
        Registry Settings
      </h1>

      {/* ── Registry details section ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Registry details
        </h2>
        <div className="rounded-xl border border-border bg-subtle p-6">
          <RegistrySettingsForm registry={registryProp} />
        </div>
      </section>

      {/* ── Danger zone ── */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Danger zone
        </h2>
        <DangerZone registryId={registry.id} isArchived={registry.isArchived} />
      </section>
    </div>
  )
}
