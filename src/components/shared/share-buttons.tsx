'use client'

import { useState } from 'react'
import { Link2, Twitter, Facebook, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>

      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Twitter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Share</span>
        </Button>
      </a>

      <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Facebook className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Share</span>
        </Button>
      </a>
    </div>
  )
}
