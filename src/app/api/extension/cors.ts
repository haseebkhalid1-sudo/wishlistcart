import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function withExtensionCors(response: NextResponse, req: NextRequest): NextResponse {
  const origin = req.headers.get('origin') ?? ''
  const isExtension = origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')
  const isLocalhost = origin.startsWith('http://localhost')

  if (isExtension || isLocalhost) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  return response
}

export function extensionCorsHeaders(req: NextRequest): HeadersInit {
  const origin = req.headers.get('origin') ?? ''
  const isExtension = origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')
  const isLocalhost = origin.startsWith('http://localhost')

  if (isExtension || isLocalhost) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  }
  return {}
}
