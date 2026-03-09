'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  updateProfileFromOnboarding,
  createWishlistFromOnboarding,
  completeOnboarding,
} from '@/lib/actions/onboarding'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Privacy = 'PRIVATE' | 'SHARED' | 'PUBLIC'

interface OnboardingWizardProps {
  userName: string | null
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i < current ? 'bg-foreground' : i === current - 1 ? 'bg-foreground' : 'bg-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="h-1 w-full rounded-full bg-muted">
      <div
        className="h-1 rounded-full bg-foreground transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Privacy toggle
// ---------------------------------------------------------------------------

const PRIVACY_OPTIONS: { value: Privacy; label: string; description: string }[] = [
  { value: 'PRIVATE', label: 'Private', description: 'Only you can see it' },
  { value: 'SHARED', label: 'Shared', description: 'Anyone with the link' },
  { value: 'PUBLIC', label: 'Public', description: 'Visible to everyone' },
]

function PrivacyToggle({
  value,
  onChange,
}: {
  value: Privacy
  onChange: (v: Privacy) => void
}) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {PRIVACY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors focus:outline-none ${
            value === opt.value
              ? 'bg-foreground text-background'
              : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Animated checkmark (CSS-only)
// ---------------------------------------------------------------------------

function AnimatedCheck() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-foreground">
        <svg
          className="h-10 w-10 text-background"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          style={{
            strokeDasharray: 30,
            strokeDashoffset: 0,
            animation: 'dash-check 0.5s ease forwards',
          }}
        >
          <style>{`
            @keyframes dash-check {
              from { stroke-dashoffset: 30; opacity: 0; }
              to   { stroke-dashoffset: 0;  opacity: 1; }
            }
          `}</style>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main wizard
// ---------------------------------------------------------------------------

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 3

  // Step 1 state
  const [name, setName] = useState(userName ?? '')
  const [username, setUsername] = useState('')
  const [step1Error, setStep1Error] = useState<string | null>(null)

  // Step 2 state
  const [wishlistName, setWishlistName] = useState('')
  const [privacy, setPrivacy] = useState<Privacy>('PRIVATE')
  const [step2Error, setStep2Error] = useState<string | null>(null)

  // Step 3 state — created wishlist
  const [createdWishlist, setCreatedWishlist] = useState<{ id: string; slug: string } | null>(null)

  // ---------------------------------------------------------------------------
  // Step 1 → Step 2: save name + username
  // ---------------------------------------------------------------------------

  const step1Valid = name.trim().length > 0 && /^[a-zA-Z0-9_]{3,20}$/.test(username)

  function handleStep1Next() {
    if (!step1Valid) return
    setStep1Error(null)

    startTransition(async () => {
      const result = await updateProfileFromOnboarding({ name: name.trim(), username })
      if (!result.success) {
        setStep1Error(
          result.fieldErrors?.username?.[0] ?? result.error ?? 'Something went wrong'
        )
        return
      }
      setStep(2)
    })
  }

  // ---------------------------------------------------------------------------
  // Step 2 → Step 3: create wishlist
  // ---------------------------------------------------------------------------

  const step2Valid = wishlistName.trim().length > 0

  function handleStep2Next() {
    if (!step2Valid) return
    setStep2Error(null)

    startTransition(async () => {
      const result = await createWishlistFromOnboarding({
        name: wishlistName.trim(),
        privacy,
      })
      if (!result.success) {
        setStep2Error(result.error ?? 'Something went wrong')
        return
      }
      setCreatedWishlist(result.data)

      // Mark onboarding complete as we enter step 3
      await completeOnboarding()
      setStep(3)
    })
  }

  // ---------------------------------------------------------------------------
  // Step 3: navigate
  // ---------------------------------------------------------------------------

  function goToDashboard() {
    router.push('/dashboard/wishlists')
  }

  function goToWishlist() {
    if (createdWishlist) {
      router.push(`/dashboard/wishlists/${createdWishlist.id}`)
    } else {
      router.push('/dashboard/wishlists')
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Logo */}
      <div className="mb-10 self-start sm:self-auto sm:mb-10">
        <span className="text-lg font-bold tracking-tight text-foreground">WishlistCart</span>
      </div>

      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <StepDots current={step} total={TOTAL_STEPS} />
            <span className="text-xs text-muted-foreground">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Welcome! What&apos;s your name?</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Set up your profile so friends can find you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <span className="pl-3 text-sm text-muted-foreground select-none">@</span>
                  <input
                    id="username"
                    className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    autoComplete="username"
                    maxLength={20}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  3–20 characters, letters, numbers, and underscores only.
                </p>
              </div>

              {step1Error && (
                <p className="text-sm text-destructive">{step1Error}</p>
              )}
            </div>

            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              disabled={!step1Valid || isPending}
              onClick={handleStep1Next}
            >
              {isPending ? 'Saving…' : 'Next →'}
            </Button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Create your first wishlist</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Give it a name and choose who can see it.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="wishlist-name">Wishlist name</Label>
                <Input
                  id="wishlist-name"
                  placeholder="e.g. My Birthday 2026"
                  value={wishlistName}
                  onChange={(e) => setWishlistName(e.target.value)}
                  autoFocus
                  maxLength={100}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Privacy</Label>
                <PrivacyToggle value={privacy} onChange={setPrivacy} />
                <p className="text-xs text-muted-foreground">
                  {PRIVACY_OPTIONS.find((o) => o.value === privacy)?.description}
                </p>
              </div>

              {step2Error && (
                <p className="text-sm text-destructive">{step2Error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
                disabled={isPending}
              >
                ← Back
              </Button>
              <Button
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                disabled={!step2Valid || isPending}
                onClick={handleStep2Next}
              >
                {isPending ? 'Creating…' : 'Create & Continue →'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-8 text-center">
            <AnimatedCheck />

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">You&apos;re all set! 🎉</h1>
              <p className="text-sm text-muted-foreground">
                Your wishlist is ready. Start adding items or share it with friends.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                onClick={goToWishlist}
              >
                Share your wishlist
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={goToDashboard}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
