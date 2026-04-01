import { NextRequest, NextResponse } from 'next/server'
import { generateAuditReport } from '@/lib/claude'

// Groq is fast (10-20s). Vercel Hobby plan max is 60s.
export const maxDuration = 60

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { handle, hasAccount, creatorType, description, niche } = body as Record<string, unknown>

  // Basic validation
  if (!creatorType || typeof creatorType !== 'string') {
    return NextResponse.json({ error: 'Creator type is required' }, { status: 400 })
  }

  if (hasAccount && (!handle || typeof handle !== 'string' || handle.trim().length === 0)) {
    return NextResponse.json({ error: 'Instagram handle is required when account exists' }, { status: 400 })
  }

  if (!hasAccount && (!description || typeof description !== 'string' || description.trim().length < 10)) {
    return NextResponse.json({ error: 'Please describe what you do (at least 10 characters)' }, { status: 400 })
  }

  try {
    const report = await generateAuditReport({
      handle: typeof handle === 'string' ? handle.replace('@', '').trim() : '',
      hasAccount: Boolean(hasAccount),
      creatorType: creatorType.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      niche: typeof niche === 'string' ? niche.trim() : '',
    })

    return NextResponse.json({ report })
  } catch (err) {
    console.error('Audit generation error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate audit'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
