'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gift } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreateRegistryForm } from './create-registry-form'

interface CreateRegistryDialogProps {
  trigger?: React.ReactNode
}

export function CreateRegistryDialog({ trigger }: CreateRegistryDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function handleSuccess(registryId: string) {
    setOpen(false)
    router.push(`/dashboard/registries/${registryId}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Gift className="mr-2 h-4 w-4" strokeWidth={1.5} />
            + New Registry
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create a registry</DialogTitle>
        </DialogHeader>

        <CreateRegistryForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
