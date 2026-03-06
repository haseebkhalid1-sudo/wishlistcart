'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatPrice } from '@/lib/utils'

interface PricePoint {
  price: number | { toNumber: () => number }
  checkedAt: Date | string
}

interface PriceHistoryChartProps {
  data: PricePoint[]
  currency?: string
}

export function PriceHistoryChart({ data, currency = 'USD' }: PriceHistoryChartProps) {
  if (data.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-subtle text-sm text-muted-foreground">
        Not enough price history yet.
      </div>
    )
  }

  const chartData = data.map((point) => ({
    price: typeof point.price === 'object' ? point.price.toNumber() : point.price,
    date: new Date(point.checkedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const prices = chartData.map((d) => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const padding = (max - min) * 0.1 || 1

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[min - padding, max + padding]}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          width={50}
        />
        <Tooltip
          formatter={(value) => formatPrice(Number(value), currency)}
          contentStyle={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="var(--color-text)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
