import React from 'react'
import { Text, Link, Section } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface RegistryInviteEmailProps {
  ownerName: string
  registryName: string
  eventType?: string
  eventDate?: string
  shareUrl: string
}

export function RegistryInviteEmail({
  ownerName,
  registryName,
  eventType,
  eventDate,
  shareUrl,
}: RegistryInviteEmailProps) {
  const hasEventDetails = !!(eventType || eventDate)

  return (
    <EmailLayout previewText={`You're invited to ${registryName} — view the gift registry`}>
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        You&apos;re invited
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        <strong style={{ color: '#0F0F0F' }}>{ownerName}</strong> has invited you to view their
        gift registry.
      </Text>

      {/* Registry card */}
      <Section
        style={{
          border: '1px solid #e4e4e0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <Text
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#0F0F0F',
            margin: '0 0 4px',
          }}
        >
          {registryName}
        </Text>
        {hasEventDetails && (
          <Text style={{ fontSize: '14px', color: '#8a8a8a', margin: 0 }}>
            {[eventType, eventDate].filter(Boolean).join(' · ')}
          </Text>
        )}
      </Section>

      {/* CTA */}
      <Link
        href={shareUrl}
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
        View Registry
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because {ownerName} invited you via WishlistCart.
      </Text>
    </EmailLayout>
  )
}

export default RegistryInviteEmail
