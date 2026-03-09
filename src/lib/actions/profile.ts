'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma/client'
import { updateProfileSchema } from '@/lib/validators/profile'
import type { ActionResult } from '@/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ---------------------------------------------------------------------------
// getProfile — returns current user's profile fields for pre-filling the form
// ---------------------------------------------------------------------------

export interface ProfileData {
  name: string | null
  username: string | null
  bio: string | null
  avatarUrl: string | null
  email: string
}

export async function getProfile(): Promise<ProfileData | null> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, username: true, bio: true, avatarUrl: true, email: true },
  })

  if (!dbUser) return null
  return dbUser
}

// ---------------------------------------------------------------------------
// updateProfile — validates + checks username uniqueness + updates DB + Supabase Auth
// ---------------------------------------------------------------------------

export async function updateProfile(data: {
  name: string
  username: string
  bio?: string
}): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Validate
  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [key, issues] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = issues as string[]
    }
    return { success: false, error: 'Validation failed', fieldErrors }
  }

  const { name, username, bio } = parsed.data

  // Check username uniqueness (excluding current user)
  const existing = await prisma.user.findFirst({
    where: {
      username,
      NOT: { id: user.id },
    },
    select: { id: true },
  })

  if (existing) {
    return {
      success: false,
      error: 'Username taken',
      fieldErrors: { username: ['This username is already taken'] },
    }
  }

  try {
    // Update Prisma DB
    await prisma.user.update({
      where: { id: user.id },
      data: { name, username, bio: bio ?? null },
    })

    // Sync full_name to Supabase Auth metadata
    await supabase.auth.updateUser({ data: { full_name: name } })

    revalidatePath('/dashboard/settings')
    revalidatePath(`/@${username}`)

    return { success: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update profile'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// uploadAvatar — validates file, uploads to Supabase Storage, updates DB
// ---------------------------------------------------------------------------

export async function uploadAvatar(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const file = formData.get('avatar')

  if (!file || !(file instanceof File)) {
    return { success: false, error: 'No file provided' }
  }

  // Validate type
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'File must be an image' }
  }

  // Validate size (max 2MB)
  const MAX_SIZE = 2 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'Image must be smaller than 2MB' }
  }

  // Derive extension from MIME type
  const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
  const path = `${user.id}/avatar.${ext}`

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const supabaseAdmin = getSupabaseAdmin()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, fileBuffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('avatars').getPublicUrl(path)

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: publicUrl },
    })

    revalidatePath('/dashboard/settings')

    return { success: true, data: { url: publicUrl } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return { success: false, error: message }
  }
}
