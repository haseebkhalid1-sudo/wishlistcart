'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { followUser, unfollowUser } from '@/lib/actions/social'
import { toast } from 'sonner'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
}

export function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isHoveringFollowing, setIsHoveringFollowing] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    // Optimistic update
    const nextState = !isFollowing
    setIsFollowing(nextState)

    startTransition(async () => {
      const result = nextState
        ? await followUser(targetUserId)
        : await unfollowUser(targetUserId)

      if (!result.success) {
        // Revert on error
        setIsFollowing(!nextState)
        toast.error(result.error)
      }
    })
  }

  if (isFollowing) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={handleClick}
        onMouseEnter={() => setIsHoveringFollowing(true)}
        onMouseLeave={() => setIsHoveringFollowing(false)}
      >
        {isHoveringFollowing ? 'Unfollow' : 'Following'}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      className="bg-foreground text-background hover:bg-foreground/90"
      disabled={isPending}
      onClick={handleClick}
    >
      Follow
    </Button>
  )
}
