import React from 'react'
import { Text, Link, Section, Row, Column } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface DigestAlert {
  itemTitle: string
  oldPrice: number
  newPrice: number
  currency: string
  itemUrl: string
}

export interface WeeklyDigestEmailProps {
  userName: string
  alerts: DigestAlert[]
}

const APP_URL = 'https://wishlistcart.com'

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(price)
}

export function WeeklyDigestEmail({ userName, alerts }: WeeklyDigestEmailProps) {
  const count = alerts.length

  return (
    <EmailLayout
      previewText={`${count} price drop${count !== 1 ? 's' : ''} on your wishlists this week`}
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
        Your weekly price digest
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {userName}, here are the price drops on your wishlists this week.
      </Text>

      {/* Table header */}
      <Section style={{ marginBottom: '0' }}>
        <Row
          style={{
            borderBottom: '2px solid #e4e4e0',
            paddingBottom: '8px',
            marginBottom: '0',
          }}
        >
          <Column>
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
              Item
            </Text>
          </Column>
          <Column style={{ width: '70px', textAlign: 'right' }}>
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
              Was
            </Text>
          </Column>
          <Column style={{ width: '70px', textAlign: 'right' }}>
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
              Now
            </Text>
          </Column>
          <Column style={{ width: '80px', textAlign: 'right' }}>
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
              Savings
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Table rows */}
      {alerts.map((alert, i) => {
        const savings = alert.oldPrice - alert.newPrice
        const isLast = i === alerts.length - 1
        return (
          <Section key={i} style={{ marginBottom: '0' }}>
            <Row
              style={{
                borderBottom: isLast ? 'none' : '1px solid #f0f0ee',
                padding: '10px 0',
              }}
            >
              <Column>
                <Link
                  href={alert.itemUrl}
                  style={{
                    fontSize: '14px',
                    color: '#0F0F0F',
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}
                >
                  {alert.itemTitle}
                </Link>
              </Column>
              <Column style={{ width: '70px', textAlign: 'right' }}>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#8a8a8a',
                    textDecoration: 'line-through',
                    margin: 0,
                  }}
                >
                  {formatPrice(alert.oldPrice, alert.currency)}
                </Text>
              </Column>
              <Column style={{ width: '70px', textAlign: 'right' }}>
                <Text
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1a7a4a',
                    margin: 0,
                  }}
                >
                  {formatPrice(alert.newPrice, alert.currency)}
                </Text>
              </Column>
              <Column style={{ width: '80px', textAlign: 'right' }}>
                <Text
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a7a4a',
                    margin: 0,
                  }}
                >
                  -{formatPrice(savings, alert.currency)}
                </Text>
              </Column>
            </Row>
          </Section>
        )
      })}

      {/* CTA */}
      <Link
        href={`${APP_URL}/dashboard`}
        style={{
          display: 'inline-block',
          backgroundColor: '#0F0F0F',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
          marginTop: '24px',
        }}
      >
        View all my wishlists
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because you have items with price tracking on WishlistCart.
      </Text>
    </EmailLayout>
  )
}

export default WeeklyDigestEmail
