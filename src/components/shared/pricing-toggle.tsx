'use client'

import { useTransition } from 'react'

interface PricingToggleProps {
  billing: 'monthly' | 'yearly'
  onChange: (billing: 'monthly' | 'yearly') => void
}

export function PricingToggle({ billing, onChange }: PricingToggleProps) {
  const [, startTransition] = useTransition()

  function handleChange(next: 'monthly' | 'yearly') {
    startTransition(() => {
      onChange(next)
    })
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-subtle p-1">
      <button
        type="button"
        onClick={() => handleChange('monthly')}
        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
          billing === 'monthly'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => handleChange('yearly')}
        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
          billing === 'yearly'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Yearly{' '}
        <span
          className={`text-xs font-semibold ${
            billing === 'yearly' ? 'text-background/70' : 'text-muted-foreground'
          }`}
        >
          save 20%
        </span>
      </button>
    </div>
  )
}
