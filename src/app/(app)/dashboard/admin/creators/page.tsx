import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { Badge } from '@/components/ui/badge'
import { ReviewButtons } from '@/components/admin/review-buttons'
import type { Prisma } from '@prisma/client'

type PendingApplication = Prisma.CreatorApplicationGetPayload<{
  include: { user: { select: { username: true; name: true; email: true } } }
}>

type ReviewedApplication = Prisma.CreatorApplicationGetPayload<{
  include: { user: { select: { username: true; name: true } } }
}>

export const metadata: Metadata = {
  title: 'Creator Applications — Admin',
}

function statusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      )
    case 'APPROVED':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      )
    case 'REJECTED':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default async function AdminCreatorsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const [pendingRaw, reviewedRaw] = await Promise.all([
    prisma.creatorApplication.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { username: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.creatorApplication.findMany({
      where: { status: { in: ['APPROVED', 'REJECTED'] } },
      include: {
        user: { select: { username: true, name: true } },
      },
      orderBy: { reviewedAt: 'desc' },
      take: 50,
    }),
  ])

  const pending = pendingRaw as unknown as PendingApplication[]
  const reviewed = reviewedRaw as unknown as ReviewedApplication[]

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Creator Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage creator program applications.
        </p>
      </div>

      {/* Pending section */}
      <div className="mb-8 rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Pending Review</h2>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {pending.length}
          </Badge>
        </div>

        {pending.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No pending applications.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {pending.map((app) => (
              <div key={app.id} className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {app.user.name ?? app.user.username ?? app.user.email}
                      </span>
                      {app.user.username && (
                        <span className="text-xs text-muted-foreground">@{app.user.username}</span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{app.bio}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {app.niche && (
                        <span>
                          Niche: <span className="text-foreground">{app.niche}</span>
                        </span>
                      )}
                      {app.audienceSize && (
                        <span>
                          Audience: <span className="text-foreground">{app.audienceSize}</span>
                        </span>
                      )}
                      <span>
                        Applied:{' '}
                        <span className="text-foreground">
                          {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <ReviewButtons applicationId={app.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed section */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Recently Reviewed</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 50 decisions</p>
        </div>

        {reviewed.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No reviewed applications yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Applicant
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Reviewed
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviewed.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {app.user.name ?? app.user.username ?? '—'}
                        </p>
                        {app.user.username && (
                          <p className="text-xs text-muted-foreground">@{app.user.username}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">{statusBadge(app.status)}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {app.reviewedAt
                        ? new Date(app.reviewedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-3 max-w-xs truncate text-muted-foreground">
                      {app.reviewNote ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
