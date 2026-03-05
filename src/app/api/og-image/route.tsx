import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') ?? 'My Wishlist'
  const subtitle = searchParams.get('subtitle') ?? ''
  const itemCount = searchParams.get('items') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          padding: '80px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top: Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#0F0F0F',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#6B6B6B',
              letterSpacing: '-0.02em',
            }}
          >
            wishlistcart.com
          </span>
        </div>

        {/* Middle: Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? '52px' : '64px',
              fontWeight: 700,
              color: '#0F0F0F',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '24px',
                color: '#6B6B6B',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Bottom: Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {itemCount && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8F8F7',
                borderRadius: '100px',
                padding: '10px 20px',
              }}
            >
              <span style={{ fontSize: '16px', color: '#0F0F0F', fontWeight: 500 }}>
                🎁 {itemCount} {Number(itemCount) === 1 ? 'item' : 'items'}
              </span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0F0F0F',
              borderRadius: '100px',
              padding: '10px 20px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500 }}>
              View wishlist →
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
