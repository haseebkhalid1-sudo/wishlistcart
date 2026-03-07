'use client'

interface PoolStatusCardProps {
  pool: {
    id: string
    goalAmount: unknown
    currentAmount: unknown
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    deadline: Date | string | null
    _count: { contributions: number }
  }
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function formatDeadline(deadline: Date | string | null): string | null {
  if (!deadline) return null
  const d = deadline instanceof Date ? deadline : new Date(deadline)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function PoolStatusCard({ pool }: PoolStatusCardProps) {
  const goal = Number(pool.goalAmount)
  const current = Number(pool.currentAmount)
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0
  const deadlineLabel = formatDeadline(pool.deadline)

  return (
    <div className="border border-border rounded-lg p-3 mt-2 bg-subtle">
      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">
            {usd.format(current)} raised of {usd.format(goal)} goal
          </span>
          <span className="text-xs font-medium">{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Contributors + deadline */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>{pool._count.contributions} contributor{pool._count.contributions !== 1 ? 's' : ''}</span>
        {deadlineLabel && <span>Deadline: {deadlineLabel}</span>}
      </div>

      {/* Status badge + link */}
      <div className="flex items-center justify-between">
        {pool.status === 'ACTIVE' && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200">
            Active
          </span>
        )}
        {pool.status === 'COMPLETED' && (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground border border-border">
            Goal reached! 🎉
          </span>
        )}
        {pool.status === 'CANCELLED' && (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
            Cancelled
          </span>
        )}

        <a
          href={`/gift-pool/${pool.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline text-muted-foreground hover:text-foreground transition-colors"
        >
          View pool →
        </a>
      </div>
    </div>
  )
}
