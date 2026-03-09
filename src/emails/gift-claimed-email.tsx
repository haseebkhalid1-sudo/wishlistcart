import React from 'react'
import { Text, Link, Section } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface GiftClaimedEmailProps {
  wishlistOwnerName: string
  itemTitle: string
  claimerName: string
  isAnonymous: boolean
}

const APP_URL = 'https://wishlistcart.com'

export function GiftClaimedEmail({
  wishlistOwnerName,
  itemTitle,
  claimerName,
  isAnonymous,
}: GiftClaimedEmailProps) {
  const claimerLabel = isAnonymous ? 'A gift giver' : claimerName

  return (
    <EmailLayout previewText="Someone just claimed a gift from your wishlist!">
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        A gift has been claimed 🎁
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {wishlistOwnerName}, someone just claimed an item from your wishlist.
      </Text>

      {/* Claim card */}
      <Section
        style={{
          border: '1px solid #e4e4e0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          backgroundColor: '#fafaf9',
        }}
      >
        <Text
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#8a8a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            margin: '0 0 8px',
          }}
        >
          {claimerLabel} claimed
        </Text>
        <Text
          style={{
            fontSize: '17px',
            fontWeight: '600',
            color: '#0F0F0F',
            margin: 0,
          }}
        >
          {itemTitle}
        </Text>
      </Section>

      {/* Surprise notice */}
      <Section
        style={{
          border: '1px solid #e4e4e0',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '24px',
          backgroundColor: '#fffbf0',
        }}
      >
        <Text style={{ fontSize: '14px', color: '#7a5a00', margin: 0 }}>
          We won&apos;t tell you exactly which item was claimed — that would spoil the surprise! 🎁
          You can see claimed items after your event.
        </Text>
      </Section>

      {/* CTA */}
      <Link
        href={`${APP_URL}/dashboard/wishlists`}
        style={{
          display: 'inline-block',
          backgroundColor: '#0F0F0F',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
        }}
      >
        View your wishlist
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because someone claimed a gift on your WishlistCart wishlist.
      </Text>
    </EmailLayout>
  )
}

export default GiftClaimedEmail
