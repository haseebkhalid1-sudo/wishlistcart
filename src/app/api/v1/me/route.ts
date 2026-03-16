import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey, checkRateLimit } from '@/lib/api-v1/auth'

export async function GET(req: NextRequest) {
  const user = await validateApiKey(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkRateLimit(user.id, user.plan)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    plan: user.plan,
  })
}
