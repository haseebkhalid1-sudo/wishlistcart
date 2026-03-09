'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { User, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile'
import type { ProfileData } from '@/lib/actions/profile'

interface Props {
  profile: ProfileData
}

export function ProfileForm({ profile }: Props) {
  const [name, setName] = useState(profile.name ?? '')
  const [username, setUsername] = useState(profile.username ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [isSaving, startSave] = useTransition()
  const [isUploading, startUpload] = useTransition()

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.set('avatar', file)

    startUpload(async () => {
      const result = await uploadAvatar(formData)
      if (result.success) {
        setAvatarUrl(result.data.url)
        toast.success('Avatar updated')
      } else {
        toast.error(result.error)
      }
      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    })
  }

  function handleSave() {
    setFieldErrors({})
    startSave(async () => {
      const result = await updateProfile({ name, username, bio: bio || undefined })
      if (result.success) {
        toast.success('Profile updated')
      } else {
        toast.error(result.error)
        if (!result.success && result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
        }
      }
    })
  }

  const initials =
    name.trim().charAt(0).toUpperCase() ||
    profile.email.charAt(0).toUpperCase()

  const isPending = isSaving || isUploading

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-bg-overlay">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-foreground">
                {initials || <User className="h-6 w-6" />}
              </div>
            )}
          </div>

          {/* Upload overlay button */}
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-subtle disabled:opacity-50"
            aria-label="Upload avatar"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">{profile.email}</p>
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="mt-0.5 text-xs text-muted-foreground underline-offset-2 hover:underline disabled:opacity-50"
          >
            {isUploading ? 'Uploading…' : 'Change photo'}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={100}
          disabled={isPending}
        />
        {fieldErrors.name && (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-username">Username</Label>
        <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <span className="select-none pl-3 text-sm text-muted-foreground">@</span>
          <input
            id="profile-username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="username"
            maxLength={30}
            disabled={isPending}
            className="h-10 flex-1 bg-transparent px-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {fieldErrors.username ? (
          <p className="text-xs text-destructive">{fieldErrors.username[0]}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Letters, numbers, and underscores only. Min 3 characters.
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="profile-bio">Bio</Label>
          <span className="text-xs text-muted-foreground">{bio.length}/300</span>
        </div>
        <Textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell people a little about yourself…"
          maxLength={300}
          rows={3}
          disabled={isPending}
          className="resize-none"
        />
        {fieldErrors.bio && (
          <p className="text-xs text-destructive">{fieldErrors.bio[0]}</p>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
