import React from 'react'
import { render } from '@react-email/components'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { ReferralRewardEmail } from '@/emails/referral-reward-email'

export const handleReferral = inngest.createFunction(
  { id: 'handle-referral', name: 'Handle Referral Completed' },
  { event: 'app/referral.completed' },
  async ({ event, step }) => {
    const { referrerId, newUserId } = event.data

    // Step 1: Check referrer eligibility + upgrade to PRO
    await step.run('upgrade-referrer', async () => {
      const referrer = await prisma.user.findUnique({
        where: { id: referrerId },
        select: { plan: true, email: true, name: true },
      })
      if (!referrer) return

      // Only upgrade if currently FREE (don't downgrade CORPORATE or overwrite existing PRO)
      if (referrer.plan === 'FREE') {
        await prisma.user.update({
          where: { id: referrerId },
          data: { plan: 'PRO' },
        })

        // Increment rewardsSent on the referral code
        await prisma.referralCode.update({
          where: { userId: referrerId },
          data: { rewardsSent: { increment: 1 } },
        })

        // Send reward email
        const html = await render(
          React.createElement(ReferralRewardEmail, {
            userName: referrer.name ?? 'there',
          })
        )

        await resend.emails.send({
          from: FROM_EMAIL,
          to: referrer.email,
          subject: 'You earned a Pro upgrade!',
          html,
        })
      }
    })

    // Step 2: Create in-app notification for referrer
    await step.run('notify-referrer', async () => {
      await prisma.notification.create({
        data: {
          userId: referrerId,
          type: 'referral_reward',
          title: 'You earned a Pro upgrade!',
          body: 'Someone you referred just joined WishlistCart. Your account has been upgraded to Pro.',
          data: {},
          sentVia: 'in_app',
        },
      })
    })

    return { referrerId, newUserId }
  }
)
