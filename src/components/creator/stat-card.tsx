import { cn } from '@/lib/utils'

interface TrendProps {
  value: number
  label: string
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: TrendProps
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  const isPositive = trend && trend.value >= 0

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-card',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 font-serif text-3xl font-semibold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                'mt-1.5 text-xs font-medium',
                isPositive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {isPositive ? '+' : ''}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-overlay text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  )
}
