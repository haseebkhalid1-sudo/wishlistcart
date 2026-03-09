import React from 'react'
import { Text, Link, Section, Row, Column } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface ReminderEmailProps {
  userName: string
  personName: string
  occasionType: string
  daysUntil: number
  formattedDate: string
  linkedWishlistUrl?: string
}

const APP_URL = 'https://wishlistcart.com'

export function ReminderEmail({
  userName,
  personName,
  occasionType,
  daysUntil,
  formattedDate,
  linkedWishlistUrl,
}: ReminderEmailProps) {
  const daysLabel = daysUntil === 1 ? '1 day' : `${daysUntil} days`
  const ctaHref = linkedWishlistUrl ?? `${APP_URL}/explore`
  const ctaText = linkedWishlistUrl ? 'View their wishlist →' : 'Browse gift ideas →'

  return (
    <EmailLayout
      previewText={`Don't forget — ${personName}'s ${occasionType} is in ${daysLabel}`}
    >
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        Upcoming occasion reminder
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {userName}, here&apos;s a heads-up about an occasion coming up soon.
      </Text>

      {/* Details card */}
      <Section
        style={{
          border: '1px solid #e4e4e0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Who */}
        <Row style={{ borderBottom: '1px solid #f0f0ee', paddingBottom: '10px', marginBottom: '10px' }}>
          <Column style={{ width: '120px' }}>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              Who
            </Text>
          </Column>
          <Column>
            <Text style={{ fontSize: '15px', fontWeight: '600', color: '#0F0F0F', margin: 0 }}>
              {personName}
            </Text>
          </Column>
        </Row>

        {/* Occasion */}
        <Row style={{ borderBottom: '1px solid #f0f0ee', paddingBottom: '10px', marginBottom: '10px' }}>
          <Column style={{ width: '120px' }}>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              Occasion
            </Text>
          </Column>
          <Column>
            <Text style={{ fontSize: '15px', fontWeight: '600', color: '#0F0F0F', margin: 0 }}>
              {occasionType}
            </Text>
          </Column>
        </Row>

        {/* Date */}
        <Row style={{ borderBottom: '1px solid #f0f0ee', paddingBottom: '10px', marginBottom: '10px' }}>
          <Column style={{ width: '120px' }}>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              Date
            </Text>
          </Column>
          <Column>
            <Text style={{ fontSize: '15px', fontWeight: '600', color: '#0F0F0F', margin: 0 }}>
              {formattedDate}
            </Text>
          </Column>
        </Row>

        {/* Coming up */}
        <Row>
          <Column style={{ width: '120px' }}>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8a8a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              Coming up
            </Text>
          </Column>
          <Column>
            {/* Countdown badge */}
            <Text
              style={{
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: '700',
                color: '#0F0F0F',
                border: '1px solid #e4e4e0',
                borderRadius: '6px',
                padding: '2px 10px',
                margin: 0,
                backgroundColor: '#f8f8f7',
              }}
            >
              {daysLabel} away
            </Text>
          </Column>
        </Row>
      </Section>

      {/* CTA */}
      <Link
        href={ctaHref}
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
        {ctaText}
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because you set a reminder on WishlistCart.{' '}
        <Link href={`${APP_URL}/dashboard/reminders`} style={{ color: '#8a8a8a' }}>
          Manage reminders
        </Link>
      </Text>
    </EmailLayout>
  )
}

export default ReminderEmail
