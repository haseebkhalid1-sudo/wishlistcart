import type { Metadata } from 'next'
import { getUserRegistries } from '@/lib/actions/registries'
import { RegistryGrid } from '@/components/registry/registry-card'
import { CreateRegistryDialog } from '@/components/registry/create-registry-dialog'

export const metadata: Metadata = {
  title: 'My Registries',
}

export default async function RegistriesPage() {
  const registries = await getUserRegistries()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">My Registries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {registries.length} {registries.length === 1 ? 'registry' : 'registries'}
          </p>
        </div>
        <CreateRegistryDialog />
      </div>

      <RegistryGrid registries={registries} />
    </div>
  )
}
