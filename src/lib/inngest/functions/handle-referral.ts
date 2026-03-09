import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'

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
        await resend.emails.send({
          from: FROM_EMAIL,
          to: referrer.email,
          subject: 'You earned a Pro upgrade!',
          html: `<div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0F0F0F;">
  <h2 style="font-size: 20px; margin-bottom: 8px;">You earned a Pro upgrade!</h2>
  <p style="color: #666; margin-bottom: 16px;">Hi ${referrer.name ?? 'there'},</p>
  <p style="margin-bottom: 16px;">
    Someone you referred just joined WishlistCart! As a thank you, your account has been upgraded to
    <strong>Pro</strong>.
  </p>
  <p style="margin-bottom: 16px;">
    Enjoy unlimited wishlists, price tracking, and price drop alerts — on us.
  </p>
  <p style="margin-bottom: 24px;">
    Keep sharing your referral link to earn more rewards!
  </p>
  <a href="https://wishlistcart.com/dashboard/referrals"
     style="display: inline-block; background: #0F0F0F; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
    View your referrals
  </a>
  <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
    WishlistCart &middot;
    <a href="https://wishlistcart.com/dashboard/referrals" style="color: #aaa;">Manage referrals</a>
  </p>
</div>`,
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
