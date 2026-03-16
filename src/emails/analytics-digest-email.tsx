import React from 'react'
import { Text, Link, Section, Row, Column } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface AnalyticsDigestEmailProps {
  userName: string
  period: string
  totalViews: number
  totalClicks: number
  claimedItems: number
  topWishlist: string
  unsubscribeUrl: string
}

export function AnalyticsDigestEmail({
  userName,
  period,
  totalViews,
  totalClicks,
  claimedItems,
  topWishlist,
  unsubscribeUrl,
}: AnalyticsDigestEmailProps) {
  const APP_URL = 'https://wishlistcart.com'

  return (
    <EmailLayout previewText={`Your WishlistCart analytics for ${period}`}>
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        Your weekly analytics
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {userName}, here&apos;s your WishlistCart summary for {period}.
      </Text>

      {/* Stats table */}
      <Section
        style={{
          backgroundColor: '#f8f8f7',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <Row style={{ marginBottom: '12px' }}>
          <Column>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 4px',
              }}
            >
              Wishlist Views
            </Text>
            <Text
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0F0F0F',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              {totalViews.toLocaleString()}
            </Text>
          </Column>
          <Column style={{ width: '40px' }} />
          <Column>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 4px',
              }}
            >
              Affiliate Clicks
            </Text>
            <Text
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0F0F0F',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              {totalClicks.toLocaleString()}
            </Text>
          </Column>
          <Column style={{ width: '40px' }} />
          <Column>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 4px',
              }}
            >
              Items Claimed
            </Text>
            <Text
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0F0F0F',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              {claimedItems.toLocaleString()}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Top wishlist */}
      {topWishlist && (
        <Section style={{ marginBottom: '24px' }}>
          <Text
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#8a8a8a',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 6px',
            }}
          >
            Top Wishlist This Week
          </Text>
          <Text
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#0F0F0F',
              margin: 0,
            }}
          >
            {topWishlist}
          </Text>
        </Section>
      )}

      {/* CTA */}
      <Link
        href={`${APP_URL}/dashboard/analytics`}
        style={{
          display: 'inline-block',
          backgroundColor: '#0F0F0F',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
          marginBottom: '24px',
        }}
      >
        View full analytics
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', margin: '0 0 4px' }}>
        You received this as a Pro subscriber.{' '}
        <Link href={unsubscribeUrl} style={{ color: '#8a8a8a' }}>
          Unsubscribe
        </Link>
      </Text>
    </EmailLayout>
  )
}

export default AnalyticsDigestEmail
