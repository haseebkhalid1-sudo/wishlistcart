import React from 'react'
import { Text, Link, Section, Row, Column } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface RsvpNotificationEmailProps {
  ownerName: string
  registryName: string
  guestName: string
  guestEmail: string
  attending: 'YES' | 'NO' | 'MAYBE'
  guestCount?: number
  eventDate?: string
  message?: string
  registryUrl: string
}

function attendingLabel(attending: 'YES' | 'NO' | 'MAYBE'): string {
  switch (attending) {
    case 'YES':
      return 'Yes, will attend'
    case 'NO':
      return "Sorry, can't make it"
    case 'MAYBE':
      return 'Maybe'
  }
}

const attendingColor: Record<'YES' | 'NO' | 'MAYBE', string> = {
  YES: '#1a7a4a',
  NO: '#8a8a8a',
  MAYBE: '#7a5a00',
}

export function RsvpNotificationEmail({
  ownerName,
  registryName,
  guestName,
  guestEmail,
  attending,
  guestCount,
  eventDate,
  message,
  registryUrl,
}: RsvpNotificationEmailProps) {
  return (
    <EmailLayout previewText={`New RSVP from ${guestName} — ${registryName}`}>
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        New RSVP received
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 24px' }}>
        Hi {ownerName}, someone has responded to your registry{' '}
        <strong style={{ color: '#0F0F0F' }}>{registryName}</strong>.
      </Text>

      {/* RSVP details card */}
      <Section
        style={{
          border: '1px solid #e4e4e0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        {/* From */}
        <Row
          style={{ borderBottom: '1px solid #f0f0ee', paddingBottom: '8px', marginBottom: '8px' }}
        >
          <Column style={{ width: '130px' }}>
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
              From
            </Text>
          </Column>
          <Column>
            <Text style={{ fontSize: '14px', fontWeight: '600', color: '#0F0F0F', margin: 0 }}>
              {guestName}
            </Text>
          </Column>
        </Row>

        {/* Email */}
        <Row
          style={{ borderBottom: '1px solid #f0f0ee', paddingBottom: '8px', marginBottom: '8px' }}
        >
          <Column style={{ width: '130px' }}>
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
              Email
            </Text>
          </Column>
          <Column>
            <Link
              href={`mailto:${guestEmail}`}
              style={{ fontSize: '14px', color: '#0F0F0F', textDecoration: 'none' }}
            >
              {guestEmail}
            </Link>
          </Column>
        </Row>

        {/* Attending */}
        <Row
          style={
            guestCount != null || eventDate || message
              ? { borderBottom: '1px solid #f0f0ee', paddingBottom: '8px', marginBottom: '8px' }
              : {}
          }
        >
          <Column style={{ width: '130px' }}>
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
              Attending
            </Text>
          </Column>
          <Column>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: attendingColor[attending],
                margin: 0,
              }}
            >
              {attendingLabel(attending)}
            </Text>
          </Column>
        </Row>

        {/* Guest count (conditional) */}
        {guestCount != null && (
          <Row
            style={
              eventDate || message
                ? { borderBottom: '1px solid #f0f0ee', paddingBottom: '8px', marginBottom: '8px' }
                : {}
            }
          >
            <Column style={{ width: '130px' }}>
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
                Guests
              </Text>
            </Column>
            <Column>
              <Text style={{ fontSize: '14px', color: '#0F0F0F', margin: 0 }}>{guestCount}</Text>
            </Column>
          </Row>
        )}

        {/* Event date (conditional) */}
        {eventDate && (
          <Row
            style={
              message
                ? { borderBottom: '1px solid #f0f0ee', paddingBottom: '8px', marginBottom: '8px' }
                : {}
            }
          >
            <Column style={{ width: '130px' }}>
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
                Event date
              </Text>
            </Column>
            <Column>
              <Text style={{ fontSize: '14px', color: '#0F0F0F', margin: 0 }}>{eventDate}</Text>
            </Column>
          </Row>
        )}

        {/* Message (conditional) */}
        {message && (
          <Row>
            <Column style={{ width: '130px' }}>
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
                Message
              </Text>
            </Column>
            <Column>
              <Text
                style={{ fontSize: '14px', color: '#555555', fontStyle: 'italic', margin: 0 }}
              >
                &ldquo;{message}&rdquo;
              </Text>
            </Column>
          </Row>
        )}
      </Section>

      {/* CTA */}
      <Link
        href={registryUrl}
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
        View registry
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        You received this because someone RSVPd to your WishlistCart registry.
      </Text>
    </EmailLayout>
  )
}

export default RsvpNotificationEmail
