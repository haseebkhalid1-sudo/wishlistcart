import React from 'react'
import { Text, Link, Section } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface ReferralRewardEmailProps {
  userName: string
}

const APP_URL = 'https://wishlistcart.com'

export function ReferralRewardEmail({ userName }: ReferralRewardEmailProps) {
  return (
    <EmailLayout previewText="You earned a Pro upgrade on WishlistCart!">
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        You earned a Pro upgrade!
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {userName}, someone you referred just joined WishlistCart.
      </Text>

      {/* Reward card */}
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
            fontSize: '16px',
            fontWeight: '600',
            color: '#0F0F0F',
            margin: '0 0 8px',
          }}
        >
          Your account has been upgraded to Pro
        </Text>
        <Text style={{ fontSize: '14px', color: '#555555', margin: '0 0 16px' }}>
          As a thank you for spreading the word, you now have access to:
        </Text>

        {[
          'Unlimited wishlists',
          'Price tracking on all items',
          'Instant price drop alerts',
          'Priority support',
        ].map((feature) => (
          <Text
            key={feature}
            style={{ fontSize: '14px', color: '#0F0F0F', margin: '0 0 6px', paddingLeft: '0' }}
          >
            ✓ {feature}
          </Text>
        ))}
      </Section>

      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Keep sharing your referral link to earn more rewards — every successful referral counts.
      </Text>

      {/* CTA */}
      <Link
        href={`${APP_URL}/dashboard/referrals`}
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
        View your referrals
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because someone used your referral link on WishlistCart.
      </Text>
    </EmailLayout>
  )
}

export default ReferralRewardEmail
