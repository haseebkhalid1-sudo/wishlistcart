'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CashFundCardProps {
  fund: {
    id: string
    title: string
    description: string | null
    goalAmount: unknown // Decimal — cast to Number()
    currentAmount: unknown // Decimal — cast to Number()
    isActive: boolean
  }
  showContributeButton?: boolean
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function fmt(value: unknown): string {
  return currency.format(Number(value))
}

export function CashFundCard({ fund, showContributeButton = false }: CashFundCardProps) {
  const current = Number(fund.currentAmount)
  const goal = fund.goalAmount !== null && fund.goalAmount !== undefined ? Number(fund.goalAmount) : null
  const progressPct = goal && goal > 0 ? Math.min(100, (current / goal) * 100) : null

  return (
    <div className="border border-border rounded-xl p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-sm text-foreground">{fund.title}</h3>
          {fund.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{fund.description}</p>
          )}
        </div>

        {!fund.isActive && (
          <span className="shrink-0 inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            Fund closed
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        {progressPct !== null ? (
          <>
            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">{fmt(current)}</span> raised
              </span>
              <span>of {fmt(goal)} goal</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{fmt(current)}</span> raised
          </p>
        )}
      </div>

      {/* Contribute button */}
      {showContributeButton && fund.isActive && (
        <Button
          asChild
          className="w-full h-9 bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90 mt-1"
          size="sm"
        >
          <Link href={`/cash-fund/${fund.id}`}>Contribute</Link>
        </Button>
      )}
    </div>
  )
}
