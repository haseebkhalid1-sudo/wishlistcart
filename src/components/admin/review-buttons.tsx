'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { approveCreator, rejectCreator } from '@/lib/actions/admin'

interface ReviewButtonsProps {
  applicationId: string
}

export function ReviewButtons({ applicationId }: ReviewButtonsProps) {
  const [isPending, startTransition] = useTransition()
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [approveNote, setApproveNote] = useState('')
  const [rejectNote, setRejectNote] = useState('')

  function handleApprove() {
    startTransition(async () => {
      const result = await approveCreator(applicationId, approveNote || undefined)
      if (result.success) {
        toast.success('Creator approved successfully.')
        setApproveOpen(false)
        setApproveNote('')
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleReject() {
    if (!rejectNote.trim()) {
      toast.error('A rejection reason is required.')
      return
    }
    startTransition(async () => {
      const result = await rejectCreator(applicationId, rejectNote)
      if (result.success) {
        toast.success('Application rejected.')
        setRejectOpen(false)
        setRejectNote('')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      {/* Approve */}
      <Button
        size="sm"
        className="bg-foreground text-background hover:opacity-90"
        onClick={() => setApproveOpen(true)}
        disabled={isPending}
      >
        Approve
      </Button>

      {/* Reject */}
      <Button
        size="sm"
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => setRejectOpen(true)}
        disabled={isPending}
      >
        Reject
      </Button>

      {/* Approve dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Creator Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="approve-note" className="text-sm">
              Add a note <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="approve-note"
              placeholder="e.g. Great content, welcome to the program!"
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-foreground text-background hover:opacity-90"
              onClick={handleApprove}
              disabled={isPending}
            >
              {isPending ? 'Approving…' : 'Confirm Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Creator Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="reject-note" className="text-sm">
              Rejection reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reject-note"
              placeholder="e.g. Content doesn't meet minimum quality standards."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleReject}
              disabled={isPending}
            >
              {isPending ? 'Rejecting…' : 'Confirm Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
