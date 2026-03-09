'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackReferralClick } from '@/lib/actions/referrals'

interface ReferralLinkBoxProps {
  url: string
  code: string
}

export function ReferralLinkBox({ url, code }: ReferralLinkBoxProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      // Track the click (fire-and-forget)
      trackReferralClick(code).catch(() => undefined)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        value={url}
        className="font-mono text-sm text-muted-foreground bg-subtle"
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleCopy}
        className="shrink-0"
        aria-label={copied ? 'Copied' : 'Copy link'}
      >
        {copied ? (
          <Check className="h-4 w-4 text-foreground" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
