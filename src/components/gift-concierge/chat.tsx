'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Send, Plus, Check, ChevronLeft, ChevronRight, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { saveRecommendationToWishlist } from '@/lib/actions/concierge'

// ---- Types ----

type Message = {
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

type Session = {
  id: string
  title: string
  messages: unknown
  createdAt: Date
  updatedAt: Date
}

type Wishlist = {
  id: string
  name: string
}

interface ConciergeChatUIProps {
  initialUsage: { used: number; limit: number; plan: string }
  recentSessions: Session[]
  wishlists: Wishlist[]
}

// ---- Markdown renderer ----

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let key = 0

  function renderInline(line: string): React.ReactNode {
    const parts: React.ReactNode[] = []
    const regex = /\*\*(.+?)\*\*/g
    let last = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) {
        parts.push(line.slice(last, match.index))
      }
      parts.push(<strong key={key++}>{match[1]}</strong>)
      last = match.index + match[0].length
    }

    if (last < line.length) {
      parts.push(line.slice(last))
    }

    return parts.length === 1 ? parts[0] : parts
  }

  let i = 0
  while (i < lines.length) {
    const line: string = lines[i] ?? ''

    if (line.trim() === '') {
      i++
      continue
    }

    const listMatch = /^(\d+)\.\s+(.*)$/.exec(line)
    if (listMatch) {
      const num: string = listMatch[1] ?? ''
      const body: string = listMatch[2] ?? ''
      nodes.push(
        <div key={key++} className="flex items-start gap-3 py-0.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-semibold">
            {num}
          </span>
          <p className="text-sm leading-relaxed text-foreground">{renderInline(body)}</p>
        </div>
      )
      i++
      continue
    }

    nodes.push(
      <p key={key++} className="text-sm leading-relaxed text-foreground py-0.5">
        {renderInline(line)}
      </p>
    )
    i++
  }

  return <>{nodes}</>
}

// ---- Product extraction ----

type Product = {
  name: string
  price: string
  priceNum: number
}

function extractProducts(content: string): Product[] {
  const regex = /\*\*([^*]+)\*\*\s*\((\$[\d,]+(?:[–\-]\$?[\d,]+)?)\)/g
  const results: Product[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    const name = match[1]?.trim() ?? ''
    const price = match[2]?.trim() ?? ''
    // Extract first number for priceNum
    const numMatch = /[\d,]+/.exec(price.replace(/[^0-9,]/g, ''))
    const priceNum = numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0
    if (name && price) {
      results.push({ name, price, priceNum })
    }
  }

  return results
}

// ---- SaveToWishlistButton ----

function SaveToWishlistButton({
  productName,
  productPrice,
  wishlists,
}: {
  productName: string
  productPrice: number
  wishlists: Wishlist[]
}) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave(wishlistId: string, wishlistName: string) {
    if (saved || saving) return
    setSaving(true)
    try {
      const result = await saveRecommendationToWishlist({
        wishlistId,
        title: productName,
        price: productPrice,
      })
      if (result.success) {
        setSaved(true)
        toast.success(`Saved to ${wishlistName}!`)
      } else {
        toast.error(result.error ?? 'Failed to save item')
      }
    } catch {
      toast.error('Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  if (wishlists.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={saved || saving}
          className={cn(
            'flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium transition-colors',
            saved
              ? 'border-foreground/20 bg-foreground/5 text-muted-foreground cursor-default'
              : 'hover:border-foreground/40 hover:bg-accent text-foreground'
          )}
        >
          {saved ? (
            <>
              <Check className="h-3 w-3" />
              Saved
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              {saving ? 'Saving…' : 'Save'}
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {wishlists.map((w) => (
          <DropdownMenuItem
            key={w.id}
            onSelect={() => handleSave(w.id, w.name)}
            className="cursor-pointer text-sm"
          >
            {w.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---- Product cards row ----

function ProductCards({
  content,
  wishlists,
}: {
  content: string
  wishlists: Wishlist[]
}) {
  const products = extractProducts(content)
  if (products.length === 0) return null

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {products.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <span className="font-medium text-foreground">{p.name}</span>
          <span className="text-muted-foreground">{p.price}</span>
          <SaveToWishlistButton
            productName={p.name}
            productPrice={p.priceNum}
            wishlists={wishlists}
          />
        </div>
      ))}
    </div>
  )
}

// ---- Typing indicator ----

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
        <Sparkles className="h-3.5 w-3.5 text-background" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

// ---- Welcome screen ----

function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
        <Sparkles className="h-7 w-7 text-background" />
      </div>
      <div>
        <h2 className="font-serif text-xl text-foreground">Your AI Gift Advisor</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell me who you&apos;re shopping for and I&apos;ll suggest perfect gifts.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-subtle px-4 py-3 text-left">
        <p className="text-xs text-muted-foreground">Try asking:</p>
        <p className="mt-1 text-sm text-foreground italic">
          &ldquo;I&apos;m shopping for my mom&apos;s 60th birthday, budget $80&rdquo;
        </p>
      </div>
    </div>
  )
}

// ---- Format date for session list ----

function formatSessionDate(date: Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ---- Main component ----

export function ConciergeChatUI({
  initialUsage,
  recentSessions,
  wishlists,
}: ConciergeChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [recipient, setRecipient] = useState('')
  const [budget, setBudget] = useState('')
  const [occasion, setOccasion] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showLeftPanel, setShowLeftPanel] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }, [input])

  function startNewChat() {
    setMessages([])
    setStreamingContent('')
    setCurrentSessionId(null)
    setInput('')
  }

  function loadSession(session: Session) {
    const msgs = session.messages
    if (!Array.isArray(msgs)) return

    const loaded: Message[] = (msgs as unknown[]).flatMap((m) => {
      if (
        typeof m === 'object' &&
        m !== null &&
        'role' in m &&
        'content' in m &&
        typeof (m as Record<string, unknown>).role === 'string' &&
        typeof (m as Record<string, unknown>).content === 'string'
      ) {
        const typed = m as { role: string; content: string; createdAt?: string }
        if (typed.role === 'user' || typed.role === 'assistant') {
          return [
            {
              role: typed.role as 'user' | 'assistant',
              content: typed.content,
              createdAt: typed.createdAt ?? new Date().toISOString(),
            },
          ]
        }
      }
      return []
    })

    setMessages(loaded)
    setCurrentSessionId(session.id)
    setStreamingContent('')
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return

      const userMessage: Message = {
        role: 'user',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsStreaming(true)
      setStreamingContent('')

      try {
        const res = await fetch('/api/gift-concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            sessionId: currentSessionId,
            context: { recipient, budget, occasion },
          }),
        })

        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            limitReached?: boolean
            error?: string
          }
          if (err.limitReached) {
            toast.error(
              'Monthly limit reached. Upgrade to Pro for unlimited sessions.'
            )
          } else {
            toast.error(err.error ?? 'Failed to get response')
          }
          setIsStreaming(false)
          return
        }

        if (!res.body) {
          toast.error('No response body')
          setIsStreaming(false)
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''
        let sessionIdCaptured = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)

          if (!sessionIdCaptured && chunk.startsWith('__SESSION_ID__:')) {
            sessionIdCaptured = true
            const newlineIdx = chunk.indexOf('\n')
            const idLine = chunk.slice(0, newlineIdx === -1 ? chunk.length : newlineIdx)
            const id = idLine.replace('__SESSION_ID__:', '')
            setCurrentSessionId(id)
            const rest = newlineIdx === -1 ? '' : chunk.slice(newlineIdx + 1)
            fullText += rest
          } else {
            fullText += chunk
          }

          setStreamingContent(fullText)
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: fullText,
            createdAt: new Date().toISOString(),
          },
        ])
        setStreamingContent('')
      } catch {
        toast.error('Something went wrong. Please try again.')
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, isStreaming, currentSessionId, recipient, budget, occasion]
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }

  const isFree = initialUsage.plan === 'FREE'
  const atLimit = isFree && initialUsage.used >= initialUsage.limit

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left panel */}
      <div
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-border bg-subtle transition-all duration-200',
          showLeftPanel ? 'w-60' : 'w-0 overflow-hidden'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Concierge
          </span>
          <button
            onClick={startNewChat}
            className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Plus className="h-3 w-3" />
            New Chat
          </button>
        </div>

        {/* Context inputs */}
        <div className="border-b border-border px-3 py-3 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Context (optional)
          </p>
          <div className="space-y-1.5">
            <input
              type="text"
              placeholder="Recipient (e.g. Mom)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <input
              type="text"
              placeholder="Budget (e.g. $50–$100)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <input
              type="text"
              placeholder="Occasion (e.g. Birthday)"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
        </div>

        {/* Session history */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {recentSessions.length > 0 && (
            <>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Recent
              </p>
              <div className="space-y-0.5">
                {recentSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => loadSession(s)}
                    className={cn(
                      'w-full rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent',
                      currentSessionId === s.id
                        ? 'bg-background shadow-xs'
                        : 'text-muted-foreground'
                    )}
                  >
                    <p className="truncate text-xs font-medium text-foreground">
                      {s.title.length > 30 ? s.title.slice(0, 30) + '…' : s.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatSessionDate(s.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Usage / upgrade */}
        {isFree && (
          <div className="border-t border-border px-3 py-3">
            <div className="rounded-lg border border-border bg-background p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Crown className="h-3 w-3 text-foreground" />
                <p className="text-xs font-medium text-foreground">
                  {initialUsage.used}/{initialUsage.limit} sessions used
                </p>
              </div>
              {atLimit ? (
                <a
                  href="/dashboard/settings"
                  className="block w-full rounded-md bg-foreground px-2 py-1 text-center text-xs font-medium text-background transition-opacity hover:opacity-90"
                >
                  Upgrade to Pro
                </a>
              ) : (
                <p className="text-[10px] text-muted-foreground">
                  {initialUsage.limit - initialUsage.used} free{' '}
                  {initialUsage.limit - initialUsage.used === 1 ? 'session' : 'sessions'} left this month
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toggle panel button (visible on all screen sizes) */}
      <button
        onClick={() => setShowLeftPanel((v) => !v)}
        className="flex h-full w-4 shrink-0 items-center justify-center border-r border-border bg-subtle transition-colors hover:bg-accent lg:hidden"
        aria-label={showLeftPanel ? 'Hide panel' : 'Show panel'}
      >
        {showLeftPanel ? (
          <ChevronLeft className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
      </button>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !isStreaming ? (
            <WelcomeScreen />
          ) : (
            <div className="mx-auto max-w-2xl space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'justify-end' : 'items-end'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-background" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[80%]',
                      msg.role === 'user' ? 'flex flex-col items-end' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3',
                        msg.role === 'user'
                          ? 'rounded-br-sm bg-foreground text-background'
                          : 'rounded-bl-sm bg-muted text-foreground'
                      )}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="space-y-1">{renderMarkdown(msg.content)}</div>
                      )}
                    </div>

                    {msg.role === 'assistant' && (
                      <ProductCards content={msg.content} wishlists={wishlists} />
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming message */}
              {isStreaming && streamingContent && (
                <div className="flex items-end gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-background" />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                      <div className="space-y-1">{renderMarkdown(streamingContent)}</div>
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/50" />
                    </div>
                  </div>
                </div>
              )}

              {/* Typing indicator (before first chunk arrives) */}
              {isStreaming && !streamingContent && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border bg-background px-4 py-3">
          {atLimit ? (
            <div className="mx-auto max-w-2xl rounded-xl border border-border bg-subtle px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground">
                You&apos;ve used all {initialUsage.limit} free sessions this month.{' '}
                <a
                  href="/dashboard/settings"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Upgrade to Pro
                </a>{' '}
                for unlimited access.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me about gifts…"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none rounded-xl border border-border bg-subtle px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ maxHeight: '96px' }}
              />
              <button
                onClick={() => void sendMessage(input)}
                disabled={isStreaming || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
