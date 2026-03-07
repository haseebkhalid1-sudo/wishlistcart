import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getGroupGiftPool } from '@/lib/actions/group-gift'
import { ContributionForm } from '@/components/group-gift/contribution-form'

interface Props {
  params: Promise<{ poolId: string }>
  searchParams: Promise<{ contributed?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { poolId } = await params
  const pool = await getGroupGiftPool(poolId)
  if (!pool) return { title: 'Not found' }

  const title = `Contribute to ${pool.item.title}`
  const description = `Join the group gift pool and help make this gift happen!`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function GiftPoolPage({ params, searchParams }: Props) {
  const { poolId } = await params
  const { contributed } = await searchParams

  const pool = await getGroupGiftPool(poolId)
  if (!pool) notFound()

  const goalAmount = Number(pool.goalAmount)
  const currentAmount = Number(pool.currentAmount)
  const percent = goalAmount > 0 ? Math.min(100, Math.round((currentAmount / goalAmount) * 100)) : 0
  const contributorCount = pool.contributions.length
  const shareToken = pool.item.wishlist.shareToken
  const backHref = shareToken ? `/registry/${shareToken}` : '/'

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Thank-you banner */}
      {contributed === '1' && (
        <div className="mb-6 rounded-lg border border-border bg-subtle p-4 text-center">
          <p className="font-medium text-foreground">Thank you for your contribution! 🎁</p>
          <p className="mt-1 text-sm text-muted-foreground">The gift pool has been updated.</p>
        </div>
      )}

      {/* Back link */}
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to registry
      </Link>

      {/* Item hero card */}
      <div className="rounded-xl border border-border bg-background p-5 mb-6 space-y-4">
        <div className="flex gap-4 items-start">
          {pool.item.imageUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-subtle">
              <Image
                src={pool.item.imageUrl}
                alt={pool.item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground leading-snug line-clamp-2">
              {pool.item.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Goal:{' '}
              <span className="font-medium text-foreground">
                ${goalAmount.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>${currentAmount.toFixed(2)} raised</span>
            <span>${goalAmount.toFixed(2)} goal</span>
          </div>
          <div className="h-2 w-full rounded-full bg-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {percent}% funded · {contributorCount} contributor{contributorCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Pool status badge */}
      <div className="mb-6">
        {pool.status === 'ACTIVE' && (
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
            Accepting contributions
          </span>
        )}
        {pool.status === 'COMPLETED' && (
          <span className="inline-flex items-center rounded-full border border-border bg-foreground px-3 py-1 text-xs font-medium text-background">
            Goal reached!
          </span>
        )}
        {pool.status === 'CANCELLED' && (
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            This pool is closed
          </span>
        )}
      </div>

      {/* Contribution form (active pools only) */}
      {pool.status === 'ACTIVE' && (
        <div className="rounded-xl border border-border bg-background p-5 mb-8">
          <h2 className="font-semibold text-foreground mb-4">Make a contribution</h2>
          <ContributionForm poolId={poolId} />
        </div>
      )}

      {/* Contributors list */}
      {pool.contributions.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3">Contributors</h2>
          <ul className="space-y-2">
            {pool.contributions.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {c.isAnonymous ? 'Anonymous' : c.contributorName}
                  </p>
                  {c.message && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.message}</p>
                  )}
                </div>
                <div className="ml-4 shrink-0 text-right">
                  <p className="text-sm font-medium text-foreground">
                    ${Number(c.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
