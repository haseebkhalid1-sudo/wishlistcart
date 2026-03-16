'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { Copy, Check, Key, Trash2, Plus, X, AlertTriangle } from 'lucide-react'
import { createApiKey, revokeApiKey, type ApiKeyRow } from '@/lib/actions/api-keys'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  initialKeys: ApiKeyRow[]
}

export function ApiKeysClient({ initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyRow | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for your API key')
      return
    }

    startTransition(async () => {
      const result = await createApiKey({ name: newKeyName.trim() })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      const { key } = result.data
      setKeys((prev) => [key, ...prev])
      setRevealedKey(key.rawKey)
      setNewKeyName('')
      setShowCreateForm(false)
      toast.success('API key created')
    })
  }

  function handleRevoke(keyId: string) {
    startTransition(async () => {
      const result = await revokeApiKey(keyId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setKeys((prev) => prev.filter((k) => k.id !== keyId))
      setRevokeTarget(null)
      toast.success('API key revoked')
    })
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-6">
      {/* Revealed key — one-time display */}
      {revealedKey && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">Store this key now</p>
              <p className="mt-0.5 text-sm text-amber-700">
                This is the only time you&apos;ll see the full key. It won&apos;t be shown
                again.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white p-3">
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
              {revealedKey}
            </code>
            <button
              onClick={() => handleCopy(revealedKey)}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Copy key"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => setRevealedKey(null)}
            className="mt-3 flex items-center gap-1.5 text-sm text-amber-700 underline-offset-2 hover:underline"
          >
            <X className="h-3.5 w-3.5" />
            I&apos;ve saved it — dismiss
          </button>
        </div>
      )}

      {/* Create new key form */}
      {showCreateForm ? (
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-medium text-foreground">Create New API Key</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="key-name" className="mb-1.5 block text-sm">
                Key name
              </Label>
              <Input
                id="key-name"
                placeholder="e.g. Zapier Integration, Home App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') {
                    setShowCreateForm(false)
                    setNewKeyName('')
                  }
                }}
                maxLength={100}
                autoFocus
                disabled={isPending}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={isPending || !newKeyName.trim()}
                className="bg-foreground text-background hover:opacity-90"
                size="sm"
              >
                {isPending ? 'Creating…' : 'Create Key'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateForm(false)
                  setNewKeyName('')
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {keys.length === 0
              ? 'No API keys yet.'
              : `${keys.length} active key${keys.length !== 1 ? 's' : ''}`}
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="bg-foreground text-background hover:opacity-90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Create New Key
          </Button>
        </div>
      )}

      {/* Keys list */}
      {keys.length === 0 && !showCreateForm ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center shadow-card">
          <Key className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium text-foreground">No API keys yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one to start using the REST API.
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="mt-4 bg-foreground text-background hover:opacity-90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Create New Key
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-card"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-overlay">
                  <Key className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{key.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <code className="font-mono text-xs text-muted-foreground">
                      {key.keyPrefix}…
                    </code>
                    <span className="text-xs text-muted-foreground">
                      Created{' '}
                      {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last used:{' '}
                      {key.lastUsedAt
                        ? formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRevokeTarget(key)}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                disabled={isPending}
                title="Revoke key"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Revoke confirmation dialog */}
      <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API key?</DialogTitle>
            <DialogDescription>
              The key &quot;<strong>{revokeTarget?.name}</strong>&quot; (
              {revokeTarget?.keyPrefix}…) will be permanently revoked. Any applications using
              this key will stop working immediately. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeTarget(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => revokeTarget && handleRevoke(revokeTarget.id)}
              disabled={isPending}
              className="bg-foreground text-background hover:opacity-90"
            >
              {isPending ? 'Revoking…' : 'Revoke Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usage info */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-3 font-medium text-foreground">Using the API</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Pass your key in the{' '}
          <code className="font-mono text-xs">Authorization</code> header:
        </p>
        <div className="rounded-lg bg-bg-overlay p-3">
          <code className="block overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
            Authorization: Bearer wlc_your_key_here
          </code>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground">
            <strong>Base URL:</strong>{' '}
            <code className="font-mono text-xs">https://wishlistcart.com/api/v1</code>
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Endpoints:</strong>{' '}
            <code className="font-mono text-xs">GET /me</code>,{' '}
            <code className="font-mono text-xs">GET/POST /wishlists</code>,{' '}
            <code className="font-mono text-xs">GET/POST /wishlists/:id/items</code>
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Rate limit:</strong> 100 req/min (Free), 1000 req/min (Pro)
          </p>
        </div>
      </div>
    </div>
  )
}
