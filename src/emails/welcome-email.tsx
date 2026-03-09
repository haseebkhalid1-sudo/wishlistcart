import React from 'react'
import { Text, Link, Section, Row, Column } from '@react-email/components'
import { EmailLayout } from './base-layout'

export interface WelcomeEmailProps {
  userName: string
}

const APP_URL = 'https://wishlistcart.com'

const steps = [
  {
    number: '1',
    title: 'Create your first wishlist',
    description: 'Organise your wishes by occasion or category.',
    href: `${APP_URL}/dashboard/wishlists`,
    linkText: 'Create a wishlist →',
  },
  {
    number: '2',
    title: 'Add items from any store',
    description: 'Paste any product URL into your wishlist and we\'ll pull in the details automatically.',
    href: `${APP_URL}/dashboard/wishlists`,
    linkText: 'Add your first item →',
  },
  {
    number: '3',
    title: 'Share with friends & family',
    description: 'Share your wishlist link — guests can claim gifts without spoiling the surprise.',
    href: `${APP_URL}/explore`,
    linkText: 'See how sharing works →',
  },
]

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText={`Welcome to WishlistCart, ${userName}!`}>
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F0F0F',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        Welcome to WishlistCart!
      </Text>
      <Text style={{ fontSize: '15px', color: '#555555', margin: '0 0 28px' }}>
        Hi {userName}, your account is all set. Here&apos;s how to get started in three steps.
      </Text>

      {/* Steps */}
      {steps.map((step, i) => (
        <Section
          key={step.number}
          style={{
            borderLeft: '3px solid #0F0F0F',
            paddingLeft: '16px',
            marginBottom: i < steps.length - 1 ? '20px' : '28px',
          }}
        >
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
            Step {step.number}
          </Text>
          <Text
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#0F0F0F',
              margin: '0 0 4px',
            }}
          >
            {step.title}
          </Text>
          <Text style={{ fontSize: '14px', color: '#555555', margin: '0 0 6px' }}>
            {step.description}
          </Text>
          <Link
            href={step.href}
            style={{ fontSize: '14px', color: '#0F0F0F', fontWeight: '500' }}
          >
            {step.linkText}
          </Link>
        </Section>
      ))}

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
        }}
      >
        Go to my dashboard
      </Link>

      <Text style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '24px', marginBottom: 0 }}>
        Questions? Reply to this email — we&apos;re happy to help.
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
