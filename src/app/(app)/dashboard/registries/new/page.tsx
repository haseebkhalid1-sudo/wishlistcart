import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateRegistryForm } from './create-registry-form'

export const metadata: Metadata = {
  title: 'New Registry',
}

export default function NewRegistryPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/dashboard/registries"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Registries
      </Link>

      <h1 className="font-serif text-display-md text-foreground">Create a Registry</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Set up a gift registry for your event.
      </p>

      <div className="mt-8">
        <CreateRegistryForm />
      </div>
    </div>
  )
}
