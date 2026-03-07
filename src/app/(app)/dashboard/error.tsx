'use client'

import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="font-serif text-2xl text-foreground">Something went wrong</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      {error.message && (
        <p className="mt-2 max-w-sm font-mono text-xs text-muted-foreground/60 break-all">
          {error.message}
        </p>
      )}
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-muted-foreground/40">
          ID: {error.digest}
        </p>
      )}
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
