import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'
import { AdminAddProductForm } from '@/components/marketplace/admin-add-product-form'
import { AdminProductRow } from '@/components/marketplace/admin-product-row'
import type { MarketplaceProductRow } from '@/lib/actions/marketplace'

export const metadata: Metadata = {
  title: 'Marketplace Admin — WishlistCart',
}

export default async function AdminMarketplacePage() {
  const products = (await prisma.marketplaceProduct.findMany({
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })) as unknown as MarketplaceProductRow[]

  const featuredCount = products.filter((p) => p.isFeatured).length
  const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0)

  return (
    <div>
      {/* Heading */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''} · {featuredCount} featured ·{' '}
            {totalClicks.toLocaleString()} total clicks
          </p>
        </div>
        <AdminAddProductForm />
      </div>

      {/* Products list */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No products yet. Add the first one above.</p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <AdminProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
