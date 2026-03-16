import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const FREE_SESSION_LIMIT = 3

const bodySchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(4000),
  })).min(1).max(20),
  sessionId: z.string().uuid().optional().nullable(),
  context: z.object({
    recipient: z.string().max(100).optional(),
    budget: z.string().max(50).optional(),
    occasion: z.string().max(100).optional(),
  }).optional(),
})

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Parse + validate body
  let parsed: z.infer<typeof bodySchema>
  try {
    parsed = bodySchema.parse(await req.json())
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { messages, sessionId, context } = parsed

  // Check plan limits for FREE users
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true },
  })

  if (dbUser?.plan === 'FREE' && !sessionId) {
    // Count sessions this calendar month for free users
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const sessionCount = await prisma.conciergeSession.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    })

    if (sessionCount >= FREE_SESSION_LIMIT) {
      return Response.json(
        { error: 'Monthly limit reached', limitReached: true, used: sessionCount, limit: FREE_SESSION_LIMIT },
        { status: 403 }
      )
    }
  }

  // Build system prompt with context
  const contextLines: string[] = []
  if (context?.recipient) contextLines.push(`Shopping for: ${context.recipient}`)
  if (context?.budget) contextLines.push(`Budget: ${context.budget}`)
  if (context?.occasion) contextLines.push(`Occasion: ${context.occasion}`)

  const systemPrompt = `You are a warm, knowledgeable personal gift advisor for WishlistCart. Your job is to suggest specific, thoughtful gift ideas based on the user's needs.

${contextLines.length > 0 ? `Current shopping context:\n${contextLines.join('\n')}\n` : ''}
Guidelines:
- Be conversational and friendly, like a knowledgeable friend
- Recommend SPECIFIC products (say "Sony WH-1000XM5 headphones" not just "headphones")
- For each recommended product, format it as: **Product Name** ($price range) — then a brief explanation
- Include 4-6 recommendations per response unless asked for more/fewer
- Vary price points within the budget
- If you don't know the budget, ask before listing items
- End with a brief encouraging note or a follow-up question
- Keep responses concise — each product gets 1-2 sentences max`

  // Create or load session
  let session: { id: string; title: string } | null = null

  if (sessionId) {
    session = await prisma.conciergeSession.findFirst({
      where: { id: sessionId, userId: user.id },
      select: { id: true, title: true },
    }) as { id: string; title: string } | null
  }

  if (!session) {
    // Auto-title from first user message
    const firstUserMsg = messages.find(m => m.role === 'user')?.content ?? 'Gift Advice Session'
    const title = firstUserMsg.length > 50 ? firstUserMsg.slice(0, 47) + '...' : firstUserMsg
    session = await prisma.conciergeSession.create({
      data: { userId: user.id, title, messages: [] },
      select: { id: true, title: true },
    }) as unknown as { id: string; title: string }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  })

  const encoder = new TextEncoder()
  let fullText = ''
  const capturedSession = session

  const readable = new ReadableStream({
    async start(controller) {
      // First chunk: session ID so client can track it
      controller.enqueue(encoder.encode(`__SESSION_ID__:${capturedSession.id}\n`))

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          fullText += chunk.delta.text
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }

      // Save completed messages to DB (fire-and-forget)
      const updatedMessages = [
        ...messages,
        { role: 'assistant', content: fullText, createdAt: new Date().toISOString() },
      ]
      prisma.conciergeSession.update({
        where: { id: capturedSession.id },
        data: { messages: updatedMessages },
      }).catch(() => null)

      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}
