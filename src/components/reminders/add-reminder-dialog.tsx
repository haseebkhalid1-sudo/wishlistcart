'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createReminder } from '@/lib/actions/reminders'

export function AddReminderDialog() {
  const [open, setOpen] = useState(false)
  const [occasionType, setOccasionType] = useState<string>('birthday')
  const [isRecurring, setIsRecurring] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      // Reset state when closing
      setOccasionType('birthday')
      setIsRecurring(true)
      setError(null)
    }
  }

  function handleSubmit(formData: FormData) {
    // Inject controlled values not captured by native form
    formData.set('isRecurring', isRecurring ? 'true' : 'false')
    formData.set('occasionType', occasionType)

    setError(null)
    startTransition(async () => {
      try {
        const result = await createReminder(formData)
        if (!result.success) {
          setError(result.error)
          return
        }
        toast.success('Reminder added!')
        setOpen(false)
        router.refresh()
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
          <Plus className="h-4 w-4" />
          Add reminder
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add a reminder</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {/* Person name */}
          <div className="space-y-1.5">
            <Label htmlFor="personName">Person *</Label>
            <Input
              id="personName"
              name="personName"
              placeholder="Sarah, Mom, John…"
              required
              autoFocus
            />
          </div>

          {/* Occasion type */}
          <div className="space-y-1.5">
            <Label htmlFor="occasionType">Occasion *</Label>
            <Select
              name="occasionType"
              value={occasionType}
              onValueChange={setOccasionType}
            >
              <SelectTrigger id="occasionType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom label (only for "custom") */}
          {occasionType === 'custom' && (
            <div className="space-y-1.5">
              <Label htmlFor="customLabel">Custom occasion label</Label>
              <Input
                id="customLabel"
                name="customLabel"
                placeholder="Graduation, Work anniversary…"
                maxLength={50}
              />
            </div>
          )}

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" name="date" type="date" required />
          </div>

          {/* Remind me */}
          <div className="space-y-1.5">
            <Label htmlFor="reminderDaysBefore">Remind me</Label>
            <Select name="reminderDaysBefore" defaultValue="14">
              <SelectTrigger id="reminderDaysBefore">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">1 week before</SelectItem>
                <SelectItem value="14">2 weeks before</SelectItem>
                <SelectItem value="30">1 month before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked === true)}
            />
            <Label htmlFor="isRecurring" className="cursor-pointer font-normal">
              Repeat every year
            </Label>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {isPending ? 'Saving…' : 'Add reminder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
