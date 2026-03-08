'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Loader2, ShoppingCart, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { SearchResponse } from '@/app/api/search/route'

interface SearchBarProps {
  /** When true, renders a compact version (for sidebar) */
  compact?: boolean
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null)
      setOpen(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = (await res.json()) as SearchResponse
      setResults(data)
      setOpen(true)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setResults(null)
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      void fetchResults(val.trim())
    }, 300)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const hasResults =
    results && (results.wishlists.length > 0 || results.users.length > 0)
  const showEmpty = results && !hasResults && query.length >= 2

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={compact ? 'Search…' : 'Search wishlists & people…'}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results && query.length >= 2) setOpen(true)
          }}
          className={
            compact
              ? 'h-8 pl-8 pr-3 text-xs'
              : 'h-9 pl-8 pr-3 text-sm'
          }
          aria-label="Search"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {showEmpty ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {/* Wishlists section */}
              {results && results.wishlists.length > 0 && (
                <div>
                  <p className="px-3 pt-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Wishlists
                  </p>
                  {results.wishlists.map((w) => {
                    const href =
                      w.user.username
                        ? `/@${w.user.username}/${w.slug}`
                        : null
                    return href ? (
                      <Link
                        key={w.id}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-subtle"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-overlay">
                          <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{w.name}</p>
                          {w.user.username && (
                            <p className="truncate text-xs text-muted-foreground">
                              @{w.user.username}
                            </p>
                          )}
                        </div>
                      </Link>
                    ) : null
                  })}
                </div>
              )}

              {/* Users section */}
              {results && results.users.length > 0 && (
                <div>
                  <p className="px-3 pt-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    People
                  </p>
                  {results.users.map((u) => {
                    if (!u.username) return null
                    return (
                      <Link
                        key={u.id}
                        href={`/@${u.username}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-subtle"
                      >
                        {/* Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-overlay">
                          {u.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.avatarUrl}
                              alt={u.name ?? u.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {u.name ?? `@${u.username}`}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            @{u.username} · {u._count.wishlists} wishlist
                            {u._count.wishlists !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* View all link */}
              <div className="border-t border-border px-3 py-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Search className="h-3 w-3" />
                  View all results for &ldquo;{query}&rdquo;
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
