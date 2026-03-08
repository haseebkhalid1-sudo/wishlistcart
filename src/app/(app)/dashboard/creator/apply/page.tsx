import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getCreatorStatus } from '@/lib/actions/creator'
import { ApplyForm } from '@/components/creator/apply-form'

export const metadata: Metadata = { title: 'Apply to Become a Creator' }

export default async function CreatorApplyPage() {
  const status = await getCreatorStatus()

  // Already has an application (pending, approved, or rejected) — redirect to hub
  if (status.application) {
    redirect('/dashboard/creator')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/dashboard/creator"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Apply to Become a Creator</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about yourself and your audience. Applications are reviewed within 2–3 business
          days.
        </p>
      </div>

      <ApplyForm />
    </div>
  )
}
