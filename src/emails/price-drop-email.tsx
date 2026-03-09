import React from 'react'
import { Text, Link, Img, Section, Row, Column } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface PriceDropEmailProps {
  userName: string
  itemTitle: string
  storeName: string
  oldPrice: number
  newPrice: number
  currency: string
  itemUrl: string
  imageUrl?: string
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(price)
}

export function PriceDropEmail({
  userName,
  itemTitle,
  storeName,
  oldPrice,
  newPrice,
  currency,
  itemUrl,
  imageUrl,
}: PriceDropEmailProps) {
  const dropAmount = oldPrice - newPrice
  const dropPct = Math.round((dropAmount / oldPrice) * 100)
  const formattedOld = formatPrice(oldPrice, currency)
  const formattedNew = formatPrice(newPrice, currency)
  const formattedSavings = formatPrice(dropAmount, currency)

  return (
    <EmailLayout previewText={`Price dropped ${dropPct}% on "${itemTitle}"`}>
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        Price drop alert
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {userName}, an item you&apos;re tracking just got cheaper.
      </Text>

      {/* Item card */}
      <Section
        style={{
          border: '1px solid #e4e4e0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        {imageUrl && (
          <Img
            src={imageUrl}
            alt={itemTitle}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          />
        )}
        <Text
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0F0F0F',
            margin: '0 0 4px',
          }}
        >
          {itemTitle}
        </Text>
        <Text style={{ fontSize: '13px', color: '#8a8a8a', margin: '0 0 16px' }}>
          {storeName}
        </Text>

        {/* Price row */}
        <Row>
          <Column style={{ width: 'auto', paddingRight: '16px' }}>
            <Text
              style={{
                fontSize: '13px',
                color: '#8a8a8a',
                textDecoration: 'line-through',
                margin: 0,
              }}
            >
              {formattedOld}
            </Text>
          </Column>
          <Column style={{ width: 'auto', paddingRight: '12px' }}>
            <Text
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#0F0F0F',
                margin: 0,
              }}
            >
              {formattedNew}
            </Text>
          </Column>
          <Column style={{ width: 'auto' }}>
            {/* Drop % badge */}
            <Text
              style={{
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1a7a4a',
                border: '1px solid #bbf0d5',
                borderRadius: '6px',
                padding: '2px 8px',
                margin: 0,
                backgroundColor: '#f0fdf6',
              }}
            >
              -{dropPct}% · save {formattedSavings}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* CTA */}
      <Link
        href={itemUrl}
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
        View deal →
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because you have a price alert set on WishlistCart.
      </Text>
    </EmailLayout>
  )
}

export default PriceDropEmail
