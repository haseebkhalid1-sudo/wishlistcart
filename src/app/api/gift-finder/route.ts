import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const body = (await req.json()) as {
    recipient: string
    age: string
    interests: string[]
    budget: string
    occasion: string
  }

  const { recipient, age, interests, budget, occasion } = body

  const prompt = `You are a thoughtful gift recommendation expert. Generate 6 specific, creative gift ideas based on these details:

- Recipient: ${recipient}
- Age: ${age}
- Interests: ${interests.join(', ')}
- Budget: ${budget}
- Occasion: ${occasion}

Format your response as a numbered list of gift ideas. For each gift:
1. Bold the gift name
2. Include a realistic price range in parentheses
3. Write 1-2 sentences explaining why it's a great choice
4. Keep it conversational and enthusiastic

Be specific — say "Oura Ring 4" not just "a fitness tracker". Include a mix of price points within the budget range. End with a brief encouraging note.`

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
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
