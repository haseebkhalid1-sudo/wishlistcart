'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { creatorApplicationSchema, type CreatorApplicationInput } from '@/lib/validators/creator'
import { applyForCreator } from '@/lib/actions/creator'

const NICHES = [
  'Technology',
  'Fashion & Style',
  'Home & Living',
  'Gaming',
  'Food & Cooking',
  'Travel',
  'Fitness & Health',
  'Beauty',
  'Parenting',
  'Books & Education',
  'Lifestyle',
  'Other',
]

const AUDIENCE_SIZES: { value: CreatorApplicationInput['audienceSize']; label: string }[] = [
  { value: 'under_1k', label: 'Under 1K' },
  { value: '1k_10k', label: '1K – 10K' },
  { value: '10k_100k', label: '10K – 100K' },
  { value: '100k_plus', label: '100K+' },
]

export function ApplyForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedAudience, setSelectedAudience] =
    useState<CreatorApplicationInput['audienceSize']>('under_1k')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatorApplicationInput>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: {
      bio: '',
      niche: '',
      audienceSize: 'under_1k',
      socialLinks: {
        youtube: '',
        instagram: '',
        twitter: '',
        tiktok: '',
        website: '',
      },
    },
  })

  const bioValue = watch('bio') ?? ''

  function onSubmit(data: CreatorApplicationInput) {
    startTransition(async () => {
      const result = await applyForCreator(data)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("Application submitted! We'll review it shortly.")
      router.push('/dashboard/creator')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">
          Tell us about yourself{' '}
          <span className="text-muted-foreground">({bioValue.length}/1000)</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="Share your content focus, what you create, who your audience is, and why you'd be a great creator partner…"
          rows={5}
          {...register('bio')}
          className="resize-none"
        />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
      </div>

      {/* Niche */}
      <div className="space-y-1.5">
        <Label htmlFor="niche">Content niche</Label>
        <Select onValueChange={(val) => setValue('niche', val, { shouldValidate: true })}>
          <SelectTrigger id="niche">
            <SelectValue placeholder="Select your niche" />
          </SelectTrigger>
          <SelectContent>
            {NICHES.map((niche) => (
              <SelectItem key={niche} value={niche}>
                {niche}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.niche && <p className="text-xs text-destructive">{errors.niche.message}</p>}
      </div>

      {/* Audience size */}
      <div className="space-y-2">
        <Label>Audience size</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AUDIENCE_SIZES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSelectedAudience(value)
                setValue('audienceSize', value, { shouldValidate: true })
              }}
              className={cn(
                'flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm transition-colors',
                selectedAudience === value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-foreground hover:bg-accent'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.audienceSize && (
          <p className="text-xs text-destructive">{errors.audienceSize.message}</p>
        )}
      </div>

      {/* Social links */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Social links</CardTitle>
          <CardDescription>All optional — add whichever apply to you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@handle' },
              {
                key: 'instagram',
                label: 'Instagram',
                placeholder: 'https://instagram.com/handle',
              },
              { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/handle' },
              { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@handle' },
              { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
            ] as const
          ).map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`social-${key}`} className="text-sm font-normal">
                {label}
              </Label>
              <Input
                id={`social-${key}`}
                type="url"
                placeholder={placeholder}
                {...register(`socialLinks.${key}`)}
              />
              {errors.socialLinks?.[key] && (
                <p className="text-xs text-destructive">{errors.socialLinks[key]?.message}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          'Submit Application'
        )}
      </Button>
    </form>
  )
}
