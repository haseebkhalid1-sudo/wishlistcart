'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  Lock,
  Copy,
  Check,
  Code2,
  Trash2,
  RotateCcw,
  Pencil,
  Globe,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { createWidget, updateWidget, deleteWidget, rotateApiKey } from '@/lib/actions/widget'

type Widget = {
  id: string
  name: string
  apiKeyPrefix: string
  allowedDomains: string[]
  isActive: boolean
  requestCount: number
  createdAt: Date
}

interface WidgetDashboardProps {
  widgets: Widget[]
}

function parseDomains(raw: string): string[] {
  return raw
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean)
}

// ── API Key Reveal Modal ─────────────────────────────────────────────────────

function ApiKeyRevealDialog({
  revealedKey,
  onClose,
}: {
  revealedKey: string | null
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!revealedKey) return
    navigator.clipboard.writeText(revealedKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Dialog open={!!revealedKey} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save your API key</DialogTitle>
          <DialogDescription>
            This key will only be shown once. Copy it now and store it securely.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted p-3 font-mono text-sm">
          <span className="flex-1 break-all">{revealedKey}</span>
          <Button size="icon" variant="ghost" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          ⚠️ Store this key in your environment variables, not in your frontend code.
        </p>
        <Button onClick={onClose} className="w-full bg-[#0F0F0F] text-white hover:bg-gray-800">
          I&apos;ve saved my key
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// ── Embed Code Sheet ─────────────────────────────────────────────────────────

function EmbedCodeSheet({
  widget,
  open,
  onClose,
}: {
  widget: Widget | null
  open: boolean
  onClose: () => void
}) {
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [copiedJs, setCopiedJs] = useState(false)

  if (!widget) return null

  const htmlSnippet = `<script src="https://wishlistcart.com/widget.js" data-key="${widget.apiKeyPrefix}..."></script>`
  const jsSnippet = `// Optional: configure before loading\nwindow.WishlistCartWidget = {\n  apiKey: '${widget.apiKeyPrefix}...',\n  buttonText: 'Save to Wishlist',\n  position: 'bottom-right', // or 'bottom-left'\n}`

  function copyHtml() {
    navigator.clipboard.writeText(htmlSnippet).then(() => {
      setCopiedHtml(true)
      setTimeout(() => setCopiedHtml(false), 2000)
    })
  }

  function copyJs() {
    navigator.clipboard.writeText(jsSnippet).then(() => {
      setCopiedJs(true)
      setTimeout(() => setCopiedJs(false), 2000)
    })
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Embed code — {widget.name}</SheetTitle>
          <SheetDescription>
            Copy either snippet below and paste it into your website.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* HTML snippet */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">HTML snippet</p>
              <Button size="sm" variant="ghost" onClick={copyHtml} className="h-7 gap-1.5 text-xs">
                {copiedHtml ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedHtml ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[#0F0F0F] p-4 text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
              {htmlSnippet}
            </pre>
          </div>

          {/* JS snippet */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">JavaScript (manual init)</p>
              <Button size="sm" variant="ghost" onClick={copyJs} className="h-7 gap-1.5 text-xs">
                {copiedJs ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedJs ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[#0F0F0F] p-4 text-xs text-green-400 font-mono whitespace-pre-wrap">
              {jsSnippet}
            </pre>
          </div>

          <p className="text-xs text-muted-foreground">
            Replace <code className="font-mono">{widget.apiKeyPrefix}...</code> with your actual
            API key. The key prefix shown is <code className="font-mono">{widget.apiKeyPrefix}...</code>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  pending,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
  pending: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={pending}
            className="bg-[#0F0F0F] text-white hover:bg-gray-800"
          >
            {pending ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Widget Card ──────────────────────────────────────────────────────────────

function WidgetCard({
  widget,
  onUpdated,
  onDeleted,
  onKeyRotated,
}: {
  widget: Widget
  onUpdated: (updated: Widget) => void
  onDeleted: (id: string) => void
  onKeyRotated: (id: string, rawKey: string, prefix: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [showEmbed, setShowEmbed] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRotateConfirm, setShowRotateConfirm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(widget.name)
  const [editDomains, setEditDomains] = useState(widget.allowedDomains.join('\n'))

  function handleToggleActive() {
    startTransition(async () => {
      const result = await updateWidget({ widgetId: widget.id, isActive: !widget.isActive })
      if (result.success) {
        onUpdated({ ...widget, isActive: !widget.isActive })
        toast.success(widget.isActive ? 'Widget deactivated' : 'Widget activated')
      } else {
        toast.error(result.error ?? 'Failed to update widget')
      }
    })
  }

  function handleSaveEdit() {
    if (!editName.trim()) {
      toast.error('Widget name is required')
      return
    }
    startTransition(async () => {
      const result = await updateWidget({
        widgetId: widget.id,
        name: editName.trim(),
        allowedDomains: parseDomains(editDomains),
      })
      if (result.success) {
        onUpdated({
          ...widget,
          name: editName.trim(),
          allowedDomains: parseDomains(editDomains),
        })
        setEditing(false)
        toast.success('Widget updated')
      } else {
        toast.error(result.error ?? 'Failed to update widget')
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteWidget(widget.id)
      if (result.success) {
        onDeleted(widget.id)
        toast.success('Widget deleted')
      } else {
        toast.error(result.error ?? 'Failed to delete widget')
      }
      setShowDeleteConfirm(false)
    })
  }

  function handleRotate() {
    startTransition(async () => {
      const result = await rotateApiKey(widget.id)
      if (result.success) {
        onKeyRotated(widget.id, result.data.rawApiKey, result.data.apiKeyPrefix)
        toast.success('API key rotated')
      } else {
        toast.error(result.error ?? 'Failed to rotate key')
      }
      setShowRotateConfirm(false)
    })
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-background p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {editing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-sm font-semibold"
                placeholder="Widget name"
              />
            ) : (
              <p className="font-semibold text-foreground truncate">{widget.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                widget.isActive
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground'
              }`}
            >
              {widget.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* API key row */}
        <div className="mb-3 flex items-center gap-2 rounded-md border border-border bg-subtle px-3 py-2">
          <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <code className="text-xs text-muted-foreground font-mono">
            {widget.apiKeyPrefix}●●●●●●●●
          </code>
        </div>

        {/* Domains */}
        <div className="mb-3">
          {editing ? (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Allowed domains (one per line, empty = all domains)
              </Label>
              <Textarea
                value={editDomains}
                onChange={(e) => setEditDomains(e.target.value)}
                placeholder="example.com&#10;shop.example.com"
                rows={3}
                className="text-xs font-mono"
              />
            </div>
          ) : (
            <div className="flex items-start gap-1.5">
              <Globe className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              {widget.allowedDomains.length === 0 ? (
                <span className="text-xs text-muted-foreground">All domains allowed</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {widget.allowedDomains.map((d) => (
                    <span
                      key={d}
                      className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{widget.requestCount.toLocaleString()} requests</span>
          <span>Created {new Date(widget.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        {editing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isPending}
              className="bg-[#0F0F0F] text-white hover:bg-gray-800"
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(false)
                setEditName(widget.name)
                setEditDomains(widget.allowedDomains.join('\n'))
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setShowEmbed(true)}
            >
              <Code2 className="h-3.5 w-3.5" />
              Embed Code
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setShowRotateConfirm(true)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Rotate Key
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs ml-auto"
              onClick={handleToggleActive}
              disabled={isPending}
            >
              {widget.isActive ? (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  Deactivate
                </>
              ) : (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Activate
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Embed sheet */}
      <EmbedCodeSheet
        widget={widget}
        open={showEmbed}
        onClose={() => setShowEmbed(false)}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete widget?"
        description={`This will permanently delete "${widget.name}" and invalidate its API key. Any embeds using this key will stop working.`}
        confirmLabel="Delete widget"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        pending={isPending}
      />

      {/* Rotate confirm */}
      <ConfirmDialog
        open={showRotateConfirm}
        title="Rotate API key?"
        description="The current key will be invalidated immediately. You will be shown the new key once. Any existing embeds must be updated."
        confirmLabel="Rotate key"
        onConfirm={handleRotate}
        onClose={() => setShowRotateConfirm(false)}
        pending={isPending}
      />
    </>
  )
}

// ── Create Widget Form ───────────────────────────────────────────────────────

function CreateWidgetForm({
  onCreated,
  onCancel,
}: {
  onCreated: (widget: Widget, rawKey: string) => void
  onCancel: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [domains, setDomains] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Widget name is required')
      return
    }
    startTransition(async () => {
      const result = await createWidget({
        name: name.trim(),
        allowedDomains: parseDomains(domains),
      })
      if (result.success) {
        onCreated(
          {
            id: result.data.widget.id,
            name: result.data.widget.name,
            apiKeyPrefix: result.data.widget.apiKeyPrefix,
            allowedDomains: parseDomains(domains),
            isActive: true,
            requestCount: 0,
            createdAt: new Date(),
          },
          result.data.rawApiKey,
        )
      } else {
        toast.error(result.error ?? 'Failed to create widget')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-background p-5 space-y-4"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-foreground text-sm">New widget</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="widget-name" className="text-xs">
          Widget name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="widget-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Shop Widget"
          required
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="widget-domains" className="text-xs">
          Allowed domains{' '}
          <span className="text-muted-foreground font-normal">(one per line — empty allows all)</span>
        </Label>
        <Textarea
          id="widget-domains"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          placeholder="example.com&#10;shop.example.com"
          rows={3}
          className="text-xs font-mono"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#0F0F0F] text-white hover:bg-gray-800"
        >
          {isPending ? 'Creating…' : 'Create widget'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export function WidgetDashboard({ widgets: initialWidgets }: WidgetDashboardProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  function handleCreated(widget: Widget, rawKey: string) {
    setWidgets((prev) => [widget, ...prev])
    setCreating(false)
    setRevealedKey(rawKey)
  }

  function handleUpdated(updated: Widget) {
    setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
  }

  function handleDeleted(id: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  function handleKeyRotated(id: string, rawKey: string, prefix: string) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, apiKeyPrefix: prefix } : w)),
    )
    setRevealedKey(rawKey)
  }

  return (
    <>
      {/* API key reveal modal */}
      <ApiKeyRevealDialog revealedKey={revealedKey} onClose={() => setRevealedKey(null)} />

      {widgets.length === 0 && !creating ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-subtle">
            <Code2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-foreground mb-2">No widgets yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Create your first widget to embed a &ldquo;Save to WishlistCart&rdquo; button on any
            website.
          </p>
          <Button
            onClick={() => setCreating(true)}
            className="bg-[#0F0F0F] text-white hover:bg-gray-800"
          >
            Create your first widget
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'}
            </p>
            {!creating && (
              <Button
                onClick={() => setCreating(true)}
                className="bg-[#0F0F0F] text-white hover:bg-gray-800"
                size="sm"
              >
                Create Widget
              </Button>
            )}
          </div>

          {/* Create form (inline) */}
          {creating && (
            <CreateWidgetForm
              onCreated={handleCreated}
              onCancel={() => setCreating(false)}
            />
          )}

          {/* Widget cards */}
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
              onKeyRotated={handleKeyRotated}
            />
          ))}
        </div>
      )}
    </>
  )
}
