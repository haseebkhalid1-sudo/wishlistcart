import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getWidgets } from '@/lib/actions/widget'
import { WidgetDashboard } from '@/components/widget/widget-dashboard'

export const metadata: Metadata = {
  title: 'Embed Widget — WishlistCart',
  description: 'Embed a WishlistCart wishlist widget on your website or e-commerce store.',
}

export default async function WidgetPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const result = await getWidgets()
  const widgets = result.success ? result.data : []

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground">Embed Widget</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Embed a &ldquo;Save to WishlistCart&rdquo; widget on your website, blog, or e-commerce
          store.
        </p>
      </div>
      <WidgetDashboard widgets={widgets} />
    </div>
  )
}
