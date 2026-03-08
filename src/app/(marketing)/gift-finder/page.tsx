'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

// ---- Types ----

type Step = 'recipient' | 'age' | 'interests' | 'budget' | 'occasion' | 'result'

interface QuizState {
  recipient: string
  age: string
  interests: string[]
  budget: string
  occasion: string
}

// ---- Option sets ----

const RECIPIENT_OPTIONS = [
  'Mom', 'Dad', 'Partner / Spouse', 'Best Friend',
  'Sister', 'Brother', 'Grandparent', 'Child',
  'Colleague', 'Teacher', 'Myself',
]

const AGE_OPTIONS = [
  'Under 10', '10–17', '18–25', '26–35',
  '36–50', '51–65', '65+',
]

const INTEREST_OPTIONS = [
  'Cooking & Food', 'Travel', 'Fitness & Health', 'Reading',
  'Gaming', 'Music', 'Art & Crafts', 'Fashion',
  'Gardening', 'Tech & Gadgets', 'Movies & TV', 'Outdoors',
  'Home Décor', 'Beauty & Skincare', 'Sports', 'Photography',
]

const BUDGET_OPTIONS = [
  'Under $25', '$25–$50', '$50–$100', '$100–$200', '$200–$500', '$500+',
]

const OCCASION_OPTIONS = [
  'Birthday', 'Christmas / Holiday', "Valentine's Day", "Mother's Day",
  "Father's Day", 'Wedding / Anniversary', 'Graduation', 'Just Because',
]

// ---- Main component ----

export default function GiftFinderPage() {
  const [step, setStep] = useState<Step>('recipient')
  const [quiz, setQuiz] = useState<QuizState>({
    recipient: '',
    age: '',
    interests: [],
    budget: '',
    occasion: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const steps: Step[] = ['recipient', 'age', 'interests', 'budget', 'occasion', 'result']
  const stepIndex = steps.indexOf(step)
  const progressPct = stepIndex === 0 ? 5 : Math.round((stepIndex / (steps.length - 1)) * 100)

  async function handleFinish(finalQuiz: QuizState) {
    setStep('result')
    setLoading(true)
    setResult('')

    try {
      const res = await fetch('/api/gift-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalQuiz),
      })

      if (!res.ok || !res.body) throw new Error('Failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setResult((prev) => prev + decoder.decode(value))
      }
    } catch {
      setResult('Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep('recipient')
    setQuiz({ recipient: '', age: '', interests: [], budget: '', occasion: '' })
    setResult('')
  }

  // ---- Step renderers ----

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
              <Sparkles className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-foreground">Your Gift Ideas</h1>
              <p className="text-xs text-muted-foreground">
                Personalized for {quiz.recipient} · {quiz.budget} · {quiz.occasion}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            {loading && !result && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating gift ideas…
              </div>
            )}
            {result && (
              <div className="prose prose-sm max-w-none text-foreground">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
              </div>
            )}
            {loading && result && (
              <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-foreground" />
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={reset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start over
            </Button>
            <Button asChild>
              <Link href="/signup">
                Save these to a wishlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
              <Sparkles className="h-6 w-6 text-background" />
            </div>
            <h1 className="font-serif text-display-md text-foreground">Gift Finder</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Answer 5 quick questions and get AI-powered gift ideas in seconds.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-t border-border">
          <div className="mx-auto max-w-2xl px-4 py-2 md:px-6">
            <div className="h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        {step === 'recipient' && (
          <QuizStep
            question="Who are you shopping for?"
            hint="Choose one"
          >
            <OptionGrid
              options={RECIPIENT_OPTIONS}
              selected={[quiz.recipient]}
              onSelect={(v) => {
                setQuiz((q) => ({ ...q, recipient: v }))
                setStep('age')
              }}
              single
            />
          </QuizStep>
        )}

        {step === 'age' && (
          <QuizStep
            question="What's their age range?"
            hint="Choose one"
            onBack={() => setStep('recipient')}
          >
            <OptionGrid
              options={AGE_OPTIONS}
              selected={[quiz.age]}
              onSelect={(v) => {
                setQuiz((q) => ({ ...q, age: v }))
                setStep('interests')
              }}
              single
            />
          </QuizStep>
        )}

        {step === 'interests' && (
          <QuizStep
            question="What are their interests?"
            hint="Choose up to 4"
            onBack={() => setStep('age')}
            onNext={
              quiz.interests.length > 0
                ? () => setStep('budget')
                : undefined
            }
            nextLabel="Next"
          >
            <OptionGrid
              options={INTEREST_OPTIONS}
              selected={quiz.interests}
              onSelect={(v) => {
                setQuiz((q) => ({
                  ...q,
                  interests: q.interests.includes(v)
                    ? q.interests.filter((i) => i !== v)
                    : q.interests.length < 4
                    ? [...q.interests, v]
                    : q.interests,
                }))
              }}
            />
          </QuizStep>
        )}

        {step === 'budget' && (
          <QuizStep
            question="What's your budget?"
            hint="Choose one"
            onBack={() => setStep('interests')}
          >
            <OptionGrid
              options={BUDGET_OPTIONS}
              selected={[quiz.budget]}
              onSelect={(v) => {
                setQuiz((q) => ({ ...q, budget: v }))
                setStep('occasion')
              }}
              single
            />
          </QuizStep>
        )}

        {step === 'occasion' && (
          <QuizStep
            question="What's the occasion?"
            hint="Choose one"
            onBack={() => setStep('budget')}
          >
            <OptionGrid
              options={OCCASION_OPTIONS}
              selected={[quiz.occasion]}
              onSelect={(v) => {
                const finalQuiz = { ...quiz, occasion: v }
                setQuiz(finalQuiz)
                handleFinish(finalQuiz)
              }}
              single
            />
          </QuizStep>
        )}
      </div>
    </div>
  )
}

// ---- Sub-components ----

function QuizStep({
  question,
  hint,
  children,
  onBack,
  onNext,
  nextLabel = 'Next',
}: {
  question: string
  hint?: string
  children: React.ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-xl text-foreground">{question}</h2>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
      {(onBack ?? onNext) && (
        <div className="mt-6 flex items-center justify-between">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}
          {onNext && (
            <Button onClick={onNext}>
              {nextLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function OptionGrid({
  options,
  selected,
  onSelect,
  single = false,
}: {
  options: string[]
  selected: string[]
  onSelect: (v: string) => void
  single?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={[
              'rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
              isSelected
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-foreground hover:border-foreground/40 hover:bg-subtle',
            ].join(' ')}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
