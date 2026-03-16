import type { Metadata } from 'next'
import Link from 'next/link'
import { Key, Zap, BookOpen, Webhook } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Developer API — WishlistCart',
  description:
    'Build with the WishlistCart REST API. Integrate wishlists into any app with our simple, authenticated JSON API.',
  alternates: { canonical: 'https://wishlistcart.com/developers' },
}

const curlExample = `curl https://wishlistcart.com/api/v1/me \\
  -H "Authorization: Bearer wlc_your_api_key_here"`

const jsExample = `const response = await fetch('https://wishlistcart.com/api/v1/me', {
  headers: {
    Authorization: 'Bearer wlc_your_api_key_here',
  },
})
const user = await response.json()
console.log(user)`

const pythonExample = `import requests

response = requests.get(
    'https://wishlistcart.com/api/v1/me',
    headers={'Authorization': 'Bearer wlc_your_api_key_here'}
)
user = response.json()
print(user)`

const getMeResponse = `{
  "id": "a1b2c3d4-...",
  "email": "you@example.com",
  "name": "Jane Smith",
  "username": "janesmith",
  "plan": "PRO"
}`

const listWishlistsResponse = `{
  "data": [
    {
      "id": "d4e5f6a7-...",
      "name": "Birthday Wishlist",
      "description": null,
      "privacy": "PUBLIC",
      "slug": "birthday-wishlist",
      "createdAt": "2026-01-15T12:00:00.000Z",
      "_count": { "items": 12 }
    }
  ],
  "page": 1,
  "limit": 20
}`

const createWishlistBody = `{
  "name": "My New Wishlist",
  "description": "Things I want",
  "privacy": "PRIVATE"
}`

const createWishlistResponse = `{
  "data": {
    "id": "f7g8h9i0-...",
    "name": "My New Wishlist",
    "description": "Things I want",
    "privacy": "PRIVATE",
    "slug": "my-new-wishlist",
    "createdAt": "2026-03-17T09:00:00.000Z",
    "_count": { "items": 0 }
  }
}`

const listItemsResponse = `{
  "data": [
    {
      "id": "j1k2l3m4-...",
      "title": "Sony WH-1000XM5 Headphones",
      "url": "https://www.amazon.com/dp/B09XS7JWHH",
      "price": 279.99,
      "currency": "USD",
      "priority": 4,
      "createdAt": "2026-02-10T08:30:00.000Z"
    }
  ]
}`

const addItemBody = `{
  "title": "Sony WH-1000XM5 Headphones",
  "url": "https://www.amazon.com/dp/B09XS7JWHH",
  "price": 279.99,
  "currency": "USD",
  "notes": "Black colour please",
  "priority": 4
}`

const addItemResponse = `{
  "data": {
    "id": "j1k2l3m4-...",
    "title": "Sony WH-1000XM5 Headphones",
    "url": "https://www.amazon.com/dp/B09XS7JWHH",
    "price": 279.99,
    "currency": "USD",
    "priority": 4,
    "createdAt": "2026-03-17T09:05:00.000Z"
  }
}`

const webhookPayload = `{
  "event": "item.added",
  "timestamp": "2026-03-17T09:05:00.000Z",
  "data": {
    "wishlistId": "d4e5f6a7-...",
    "item": {
      "id": "j1k2l3m4-...",
      "title": "Sony WH-1000XM5 Headphones",
      "price": 279.99,
      "currency": "USD"
    }
  }
}`

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-[#0F0F0F] text-[#e5e7eb] rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  )
}

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  if (method === 'GET') {
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        GET
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
      POST
    </span>
  )
}

export default function DevelopersPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          REST API · v1
        </div>
        <h1 className="font-serif text-5xl text-foreground leading-tight max-w-3xl mx-auto md:text-6xl">
          Build with WishlistCart
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Integrate wishlists into your apps with our simple REST API. Authenticated, JSON-based,
          and designed for developers.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[160px]">
            <Link href="/dashboard/api-keys">Get your API key</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
              Download OpenAPI spec
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground mb-3">Quick start</h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Make your first API call in seconds. All endpoints return JSON.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  cURL
                </span>
              </p>
              <CodeBlock code={curlExample} />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  JavaScript / Node.js
                </span>
              </p>
              <CodeBlock code={jsExample} />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  Python
                </span>
              </p>
              <CodeBlock code={pythonExample} />
            </div>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-subtle">
            <Key className="h-4 w-4 text-foreground" />
          </div>
          <h2 className="font-serif text-3xl text-foreground">Authentication</h2>
        </div>
        <div className="prose-none space-y-4 max-w-2xl">
          <p className="text-muted-foreground leading-relaxed">
            Every request must include your API key in the{' '}
            <code className="rounded bg-subtle border border-border px-1.5 py-0.5 text-xs font-mono text-foreground">
              Authorization
            </code>{' '}
            header using the Bearer scheme:
          </p>
          <CodeBlock code={`Authorization: Bearer wlc_your_api_key_here`} />
          <p className="text-muted-foreground leading-relaxed">
            API keys start with the{' '}
            <code className="rounded bg-subtle border border-border px-1.5 py-0.5 text-xs font-mono text-foreground">
              wlc_
            </code>{' '}
            prefix. Keep them secret — never expose them in client-side code or version control.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You can generate and manage API keys from your{' '}
            <Link href="/dashboard/api-keys" className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">
              dashboard API keys page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
              <Zap className="h-4 w-4 text-foreground" />
            </div>
            <h2 className="font-serif text-3xl text-foreground">Rate limits</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Rate limits are applied per API key. Exceeding the limit returns a{' '}
            <code className="rounded bg-background border border-border px-1.5 py-0.5 text-xs font-mono text-foreground">
              429 Too Many Requests
            </code>{' '}
            response.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left font-semibold text-foreground">Plan</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-foreground">Requests / minute</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-foreground">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-5 py-3.5 text-foreground font-medium">Free</td>
                  <td className="px-5 py-3.5 text-muted-foreground">100</td>
                  <td className="px-5 py-3.5 text-muted-foreground">Shared quota across all keys</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-foreground font-medium">Pro</td>
                  <td className="px-5 py-3.5 text-muted-foreground">1,000</td>
                  <td className="px-5 py-3.5 text-muted-foreground">Per-key quota, priority routing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Rate limit headers are included in every response:{' '}
            <code className="font-mono">X-RateLimit-Limit</code>,{' '}
            <code className="font-mono">X-RateLimit-Remaining</code>,{' '}
            <code className="font-mono">X-RateLimit-Reset</code>.
          </p>
        </div>
      </section>

      {/* Endpoints Reference */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-subtle">
            <BookOpen className="h-4 w-4 text-foreground" />
          </div>
          <h2 className="font-serif text-3xl text-foreground">Endpoints</h2>
        </div>
        <p className="text-muted-foreground mb-14 max-w-xl">
          Base URL:{' '}
          <code className="rounded bg-subtle border border-border px-1.5 py-0.5 text-xs font-mono text-foreground">
            https://wishlistcart.com/api/v1
          </code>
        </p>

        <div className="space-y-14">
          {/* GET /me */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MethodBadge method="GET" />
              <code className="text-sm font-mono font-semibold text-foreground">/me</code>
              <span className="text-sm text-muted-foreground">— Get current user profile</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Returns the authenticated user&apos;s profile including plan information.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response 200</p>
            <CodeBlock code={getMeResponse} />
          </div>

          {/* GET /wishlists */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MethodBadge method="GET" />
              <code className="text-sm font-mono font-semibold text-foreground">/wishlists</code>
              <span className="text-sm text-muted-foreground">— List wishlists</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Returns a paginated list of the authenticated user&apos;s wishlists.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border bg-subtle mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5 text-left font-semibold text-foreground">Parameter</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-foreground">Type</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-foreground">Default</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">page</td>
                    <td className="px-4 py-2.5 text-muted-foreground">integer</td>
                    <td className="px-4 py-2.5 text-muted-foreground">1</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Page number</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">limit</td>
                    <td className="px-4 py-2.5 text-muted-foreground">integer</td>
                    <td className="px-4 py-2.5 text-muted-foreground">20</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Results per page (max 100)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response 200</p>
            <CodeBlock code={listWishlistsResponse} />
          </div>

          {/* POST /wishlists */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MethodBadge method="POST" />
              <code className="text-sm font-mono font-semibold text-foreground">/wishlists</code>
              <span className="text-sm text-muted-foreground">— Create a wishlist</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Creates a new wishlist for the authenticated user.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request body</p>
            <CodeBlock code={createWishlistBody} />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">Response 201</p>
            <CodeBlock code={createWishlistResponse} />
          </div>

          {/* GET /wishlists/{id}/items */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MethodBadge method="GET" />
              <code className="text-sm font-mono font-semibold text-foreground">/wishlists/{'{id}'}/items</code>
              <span className="text-sm text-muted-foreground">— List items in a wishlist</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Returns all items in the specified wishlist. The wishlist must belong to the authenticated user.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response 200</p>
            <CodeBlock code={listItemsResponse} />
          </div>

          {/* POST /wishlists/{id}/items */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MethodBadge method="POST" />
              <code className="text-sm font-mono font-semibold text-foreground">/wishlists/{'{id}'}/items</code>
              <span className="text-sm text-muted-foreground">— Add item to wishlist</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Adds a new item to the specified wishlist. Only{' '}
              <code className="rounded bg-subtle border border-border px-1 py-0.5 text-xs font-mono text-foreground">
                title
              </code>{' '}
              is required; all other fields are optional.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request body</p>
            <CodeBlock code={addItemBody} />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">Response 201</p>
            <CodeBlock code={addItemResponse} />
          </div>
        </div>
      </section>

      {/* OpenAPI / SDK */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground mb-3">OpenAPI spec</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Download the full OpenAPI 3.0 specification to generate client SDKs in any language, import
            into Postman or Insomnia, or use with API documentation tools like Redoc or Swagger UI.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-[#0F0F0F] text-white hover:bg-gray-800">
              <Link href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
                Download openapi.yaml
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/partners">Partner integrations</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Use{' '}
            <code className="rounded bg-background border border-border px-1.5 py-0.5 text-xs font-mono text-foreground">
              openapi-generator-cli
            </code>
            ,{' '}
            <code className="rounded bg-background border border-border px-1.5 py-0.5 text-xs font-mono text-foreground">
              @openapitools/openapi-generator-cli
            </code>
            , or any compatible tool to generate typed clients for TypeScript, Python, Go, and more.
          </p>
        </div>
      </section>

      {/* Webhooks */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-subtle">
            <Webhook className="h-4 w-4 text-foreground" />
          </div>
          <h2 className="font-serif text-3xl text-foreground">
            Webhooks{' '}
            <span className="ml-2 inline-flex items-center rounded-full border border-border bg-subtle px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Coming soon
            </span>
          </h2>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Subscribe to real-time events from WishlistCart. Configure a webhook URL in your dashboard
          and we&apos;ll POST a JSON payload whenever a relevant event occurs.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 mb-10">
          <div className="rounded-xl border border-border bg-subtle p-6">
            <p className="font-semibold text-foreground mb-1.5">
              <code className="text-sm font-mono">item.added</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Fired when a new item is added to any of the user&apos;s wishlists.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-subtle p-6">
            <p className="font-semibold text-foreground mb-1.5">
              <code className="text-sm font-mono">gift.claimed</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Fired when a gift-giver claims an item from a shared wishlist.
            </p>
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Example payload
        </p>
        <CodeBlock code={webhookPayload} />

        <p className="mt-6 text-sm text-muted-foreground">
          Zapier integration is also on the roadmap — connect WishlistCart to 5,000+ apps without
          writing code.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-serif text-4xl text-foreground mb-4">Ready to start building?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Generate your API key and make your first request in under two minutes.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[160px]">
              <Link href="/dashboard/api-keys">Get your API key</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link href="/partners">View partner integrations</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required to get started.
          </p>
        </div>
      </section>
    </>
  )
}
