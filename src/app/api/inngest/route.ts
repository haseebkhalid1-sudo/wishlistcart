import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { checkPrices } from '@/lib/inngest/functions/check-prices'
import { processAlert } from '@/lib/inngest/functions/process-alerts'
import { sendWeeklyDigest } from '@/lib/inngest/functions/send-digest'
import { sendOccasionReminders } from '@/lib/inngest/functions/send-reminders'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkPrices, processAlert, sendWeeklyDigest, sendOccasionReminders],
})
