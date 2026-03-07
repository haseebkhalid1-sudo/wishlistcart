'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyInput({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 overflow-hidden rounded-md border border-border bg-bg-overlay px-3 py-1.5">
        <p className="truncate text-xs text-muted-foreground">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        aria-label="Copy share link"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-subtle"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-foreground" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}
