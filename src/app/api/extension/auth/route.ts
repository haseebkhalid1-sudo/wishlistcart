import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { withExtensionCors } from '@/app/api/extension/cors'

export const dynamic = 'force-dynamic'

export async function OPTIONS(req: NextRequest) {
  return withExtensionCors(new NextResponse(null, { status: 204 }), req)
}

// GET /api/extension/auth
// Returns: { user: { id, name, email } | null }
export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const response = NextResponse.json({
    user: user
      ? {
          id: user.id,
          name: user.user_metadata?.name as string | null ?? null,
          email: user.email ?? null,
        }
      : null,
  })

  return withExtensionCors(response, req)
}
