import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Preview,
} from '@react-email/components'

interface EmailLayoutProps {
  children: React.ReactNode
  previewText?: string
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body
        style={{
          backgroundColor: '#f8f8f7',
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: '560px',
            margin: '40px auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e4e4e0',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Section style={{ backgroundColor: '#0F0F0F', padding: '20px 32px' }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              WishlistCart
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px' }}>{children}</Section>

          {/* Footer */}
          <Section
            style={{
              borderTop: '1px solid #e4e4e0',
              padding: '20px 32px',
              backgroundColor: '#f8f8f7',
            }}
          >
            <Text style={{ fontSize: '12px', color: '#8a8a8a', margin: 0 }}>
              © 2026 WishlistCart ·{' '}
              <Link
                href="https://wishlistcart.com/dashboard/settings/notifications"
                style={{ color: '#8a8a8a' }}
              >
                Manage preferences
              </Link>{' '}
              ·{' '}
              <Link href="https://wishlistcart.com" style={{ color: '#8a8a8a' }}>
                wishlistcart.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
