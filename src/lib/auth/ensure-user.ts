import { prisma } from '@/lib/prisma/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Ensure a User row exists in our database for the given Supabase Auth user.
 * Since we migrated from Supabase Postgres (which had a trigger) to Vercel Prisma Postgres,
 * the trigger no longer fires. This function upserts the user on first access.
 */
export async function ensureUser(supabaseUser: SupabaseUser): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
    select: { id: true },
  })

  if (existing) return existing.id

  const user = await prisma.user.create({
    data: {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email?.split('@')[0] ?? null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
      emailVerified: !!supabaseUser.email_confirmed_at,
    },
    select: { id: true },
  })

  return user.id
}
