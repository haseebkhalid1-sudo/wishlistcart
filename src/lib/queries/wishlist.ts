import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

// ============================================================
// SURPRISE MODE — these two functions enforce the invariant:
// The wishlist OWNER can never see claim data (isPurchased, purchasedBy, giftMessage)
// Gift-givers CAN see isPurchased but NOT who purchased
// ============================================================

/**
 * Owner view — strips ALL gift coordination fields.
 * Call this when the authenticated user IS the wishlist owner.
 */
export async function getWishlistForOwner(wishlistId: string, ownerId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId, userId: ownerId },
    include: {
      items: {
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          affiliateUrl: true,
          storeName: true,
          storeDomain: true,
          imageUrl: true,
          price: true,
          currency: true,
          originalPrice: true,
          priority: true,
          position: true,
          notes: true,
          category: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          wishlistId: true,
          userId: true,
          // NEVER include: isPurchased, purchasedBy, purchasedAt, giftMessage, isAnonymous
        },
      },
      _count: { select: { items: true } },
      user: { select: { name: true, username: true, avatarUrl: true } },
    },
  })
  return wishlist
}

/**
 * Public / gift-giver view — includes isPurchased so items can show "claimed"
 * but NEVER reveals who purchased (purchasedBy is excluded).
 */
export async function getPublicWishlist(username: string, slug: string) {
  const wishlist = await prisma.wishlist.findFirst({
    where: {
      slug,
      user: { username },
      privacy: { in: ['PUBLIC', 'SHARED'] },
      isArchived: false,
    },
    include: {
      items: {
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          affiliateUrl: true,
          storeName: true,
          storeDomain: true,
          imageUrl: true,
          price: true,
          currency: true,
          originalPrice: true,
          priority: true,
          position: true,
          category: true,
          tags: true,
          isPurchased: true,    // gift-givers CAN see if claimed
          isAnonymous: true,
          // NEVER include: purchasedBy, giftMessage, notes (personal)
        },
      },
      _count: { select: { items: true } },
      user: { select: { name: true, username: true, avatarUrl: true } },
      cashFund: true,
    },
  })
  return wishlist
}

export type PublicWishlistItem = Prisma.WishlistItemGetPayload<{
  select: {
    id: true; title: true; description: true; url: true; affiliateUrl: true;
    storeName: true; storeDomain: true; imageUrl: true; price: true; currency: true;
    originalPrice: true; priority: true; position: true; category: true; tags: true;
    isPurchased: true; isAnonymous: true;
  }
}>
