import type { Metadata } from 'next'
import { Gift } from 'lucide-react'

export const metadata: Metadata = { title: 'Registries' }

export default function RegistriesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-subtle border border-border">
        <Gift className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="font-serif text-2xl text-foreground">Gift Registries</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Create event registries for weddings, baby showers, and more. Coming soon.
      </p>
    </div>
  )
}
