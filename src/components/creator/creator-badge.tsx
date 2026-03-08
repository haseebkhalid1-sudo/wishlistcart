import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreatorBadgeProps {
  variant?: 'inline' | 'card'
  className?: string
}

export function CreatorBadge({ variant = 'inline', className }: CreatorBadgeProps) {
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg bg-[#0F0F0F] px-3 py-1.5 text-sm font-medium text-white',
          className
        )}
      >
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span>Verified Creator</span>
      </div>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-[#0F0F0F] px-2 py-0.5 text-xs font-medium text-white',
        className
      )}
    >
      <CheckCircle className="h-3 w-3 shrink-0" />
      Creator
    </span>
  )
}
