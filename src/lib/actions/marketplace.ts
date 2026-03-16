'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'
export type MarketplaceProductRow = Prisma.MarketplaceProductGetPayload<Record<string, never>>

// ---------------------------------------------------------------------------
// getMarketplaceProducts
// ---------------------------------------------------------------------------

export interface GetMarketplaceProductsOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  limit?: number
  offset?: number
}

export async function getMarketplaceProducts(
  options: GetMarketplaceProductsOptions = {}
): Promise<ActionResult<MarketplaceProductRow[]>> {
  try {
    const { category, minPrice, maxPrice, featured, limit = 48, offset = 0 } = options

    const where: Prisma.MarketplaceProductWhereInput = {}
    if (category) where.category = category
    if (featured !== undefined) where.isFeatured = featured
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    const products = (await prisma.marketplaceProduct.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      skip: offset,
    })) as unknown as MarketplaceProductRow[]

    return { success: true, data: products }
  } catch (err) {
    console.error('[getMarketplaceProducts]', err)
    return { success: false, error: 'Failed to fetch marketplace products.' }
  }
}

// ---------------------------------------------------------------------------
// searchMarketplace
// ---------------------------------------------------------------------------

export async function searchMarketplace(
  query: string,
  options: { category?: string } = {}
): Promise<ActionResult<MarketplaceProductRow[]>> {
  try {
    const { category } = options
    const q = query.trim()
    if (!q) return { success: true, data: [] }

    const where: Prisma.MarketplaceProductWhereInput = {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ],
    }
    if (category) where.category = category

    const products = (await prisma.marketplaceProduct.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 48,
    })) as unknown as MarketplaceProductRow[]

    return { success: true, data: products }
  } catch (err) {
    console.error('[searchMarketplace]', err)
    return { success: false, error: 'Failed to search marketplace.' }
  }
}

// ---------------------------------------------------------------------------
// getMarketplaceCategories — returns distinct categories with counts
// ---------------------------------------------------------------------------

export async function getMarketplaceCategories(): Promise<
  ActionResult<{ category: string; count: number }[]>
> {
  try {
    const groups = (await prisma.marketplaceProduct.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    })) as unknown as { category: string; _count: { category: number } }[]

    const data = groups.map((g) => ({
      category: g.category,
      count: g._count.category,
    }))

    return { success: true, data }
  } catch (err) {
    console.error('[getMarketplaceCategories]', err)
    return { success: false, error: 'Failed to fetch categories.' }
  }
}

// ---------------------------------------------------------------------------
// addMarketplaceProduct — admin only
// ---------------------------------------------------------------------------

export interface AddMarketplaceProductInput {
  title: string
  description?: string
  price: number
  currency?: string
  imageUrl?: string
  storeUrl: string
  tags?: string[]
  category: string
  isFeatured?: boolean
}

export async function addMarketplaceProduct(
  input: AddMarketplaceProductInput
): Promise<ActionResult<MarketplaceProductRow>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const product = (await prisma.marketplaceProduct.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() ?? null,
        price: input.price,
        currency: input.currency ?? 'USD',
        imageUrl: input.imageUrl?.trim() ?? null,
        storeUrl: input.storeUrl.trim(),
        tags: input.tags ?? [],
        category: input.category,
        isFeatured: input.isFeatured ?? false,
      },
    })) as unknown as MarketplaceProductRow

    revalidatePath('/marketplace')
    revalidatePath(`/marketplace/${input.category.toLowerCase()}`)
    revalidatePath('/dashboard/admin/marketplace')

    return { success: true, data: product }
  } catch (err) {
    console.error('[addMarketplaceProduct]', err)
    return { success: false, error: 'Failed to add product.' }
  }
}

// ---------------------------------------------------------------------------
// featureProduct — admin only
// ---------------------------------------------------------------------------

export async function featureProduct(
  productId: string,
  isFeatured: boolean
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
      select: { category: true },
    })
    if (!product) return { success: false, error: 'Product not found.' }

    await prisma.marketplaceProduct.update({
      where: { id: productId },
      data: { isFeatured },
    })

    revalidatePath('/marketplace')
    revalidatePath(`/marketplace/${product.category.toLowerCase()}`)
    revalidatePath('/dashboard/admin/marketplace')

    return { success: true, data: undefined }
  } catch (err) {
    console.error('[featureProduct]', err)
    return { success: false, error: 'Failed to update product.' }
  }
}

// ---------------------------------------------------------------------------
// deleteMarketplaceProduct — admin only
// ---------------------------------------------------------------------------

export async function deleteMarketplaceProduct(
  productId: string
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
      select: { category: true },
    })
    if (!product) return { success: false, error: 'Product not found.' }

    await prisma.marketplaceProduct.delete({ where: { id: productId } })

    revalidatePath('/marketplace')
    revalidatePath(`/marketplace/${product.category.toLowerCase()}`)
    revalidatePath('/dashboard/admin/marketplace')

    return { success: true, data: undefined }
  } catch (err) {
    console.error('[deleteMarketplaceProduct]', err)
    return { success: false, error: 'Failed to delete product.' }
  }
}
