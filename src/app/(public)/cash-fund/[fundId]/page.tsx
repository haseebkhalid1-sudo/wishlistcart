import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCashFund } from '@/lib/actions/cash-fund'
import { CashFundCard } from '@/components/registry/cash-fund-card'
import { CashFundContributionForm } from '@/components/registry/cash-fund-contribution-form'

interface Props {
  params: Promise<{ fundId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fundId } = await params
  const fund = await getCashFund(fundId)
  if (!fund) return { title: 'Not found' }

  const title = `${fund.title} — ${fund.wishlist.name}`
  return { title }
}

export default async function CashFundPage({ params, searchParams }: Props) {
  const { fundId } = await params
  const query = await searchParams

  const fund = await getCashFund(fundId)
  if (!fund) notFound()

  const contributed = query['contributed'] === '1'

  const backHref = fund.wishlist.shareToken
    ? `/registry/${fund.wishlist.shareToken}`
    : '/'

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to registry
      </Link>

      {/* Thank-you banner */}
      {contributed && (
        <div className="mb-6 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
          Thank you for your contribution! Your gift has been received.
        </div>
      )}

      {/* Fund progress card */}
      <div className="mb-6">
        <CashFundCard fund={fund} showContributeButton={false} />
      </div>

      {/* Contribution form or closed message */}
      {fund.isActive ? (
        <CashFundContributionForm fundId={fundId} />
      ) : (
        <p className="text-sm text-muted-foreground text-center py-6">
          This fund is no longer accepting contributions.
        </p>
      )}
    </main>
  )
}
