import type { AuditReport } from './types'

// ── Provider config ──────────────────────────────────────────────────────────
// Production: set GROQ_API_KEY in Vercel env vars → uses Groq (Llama 3.3 70B, fast + free)
// Local dev:  leave GROQ_API_KEY unset → uses Ollama at localhost
const GROQ_API_KEY  = process.env.GROQ_API_KEY
const OLLAMA_URL    = process.env.OLLAMA_URL  ?? 'http://localhost:11434'
const OLLAMA_MODEL  = process.env.OLLAMA_MODEL ?? 'llama3.1'
const GROQ_MODEL    = process.env.GROQ_MODEL   ?? 'llama-3.3-70b-versatile'
const USE_GROQ      = Boolean(GROQ_API_KEY)

export interface AuditInput {
  handle: string
  hasAccount: boolean
  creatorType: string
  description: string
  niche: string
}

function buildPrompt(input: AuditInput): string {
  const subject = input.hasAccount && input.handle
    ? `Instagram account @${input.handle}`
    : `a ${input.creatorType} who is just starting to build their presence`

  const contextBlock = input.hasAccount && input.handle
    ? `Instagram Handle: @${input.handle}
Creator Type: ${input.creatorType}
Niche: ${input.niche || 'Not specified'}
${input.description ? `Additional context from creator: ${input.description}` : ''}`
    : `Creator Type: ${input.creatorType}
Niche: ${input.niche || 'Not specified'}
About them: ${input.description}`

  return `You are a world-class brand strategist and social media expert at humbld, a creative agency for artists, creators, and businesses. You give honest, actionable brand audits that go deeper than Instagram's native analytics.

You are auditing ${subject}.

CONTEXT:
${contextBlock}

NOTES:
${input.hasAccount && input.handle
  ? `- You do not have real-time access to live Instagram analytics. Generate realistic, calibrated estimates based on the creator type and niche.
- Be transparent in the analysisNote field that this is an AI-powered analysis.`
  : `- This creator has no Instagram account yet. Provide a blueprint audit: what they should build, what benchmarks to target, pitfalls to avoid.`
}

Generate a comprehensive brand audit. Return ONLY a valid JSON object. No explanation, no markdown, no text outside the JSON.

Use this exact JSON structure:

{
  "meta": {
    "handle": "${input.hasAccount ? input.handle : 'new-creator'}",
    "displayHandle": "${input.hasAccount && input.handle ? '@' + input.handle : 'New Creator'}",
    "creatorType": "${input.creatorType}",
    "niche": "${input.niche || 'General'}",
    "generatedAt": "${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}",
    "analysisNote": "one sentence explaining this is an outside-in analysis of their public brand presence — what the world sees, not internal analytics"
  },
  "overview": {
    "headline": "punchy 5-8 word headline capturing their brand moment",
    "overallScore": 65,
    "tier": "Growing",
    "tierDescription": "one sentence describing what this tier means for them",
    "oneLineSummary": "honest 1-2 sentence brand assessment"
  },
  "quickStats": [
    { "label": "Engagement Rate", "value": "1.8%", "benchmark": "2.5% avg for niche", "status": "warning", "note": "optional note" },
    { "label": "Posting Frequency", "value": "2x/week", "benchmark": "4-5x/week", "status": "warning" },
    { "label": "Profile Strength", "value": "72/100", "benchmark": "80+ ideal", "status": "warning" },
    { "label": "Content Diversity", "value": "Low", "benchmark": "3+ formats", "status": "critical" }
  ],
  "executiveSummary": "2-3 sentence third-party expert analysis of this brand from the outside looking in — written as if a brand consultant is presenting findings to the creator for the first time. What does their public presence actually communicate to a stranger? Be honest, specific to their niche, and forward-looking. This is NOT a recap of their score — it's an expert read on their brand identity and positioning.",
  "verdict": "2-3 sentence honest, direct, encouraging closing assessment of where they are and the opportunity ahead — be specific to their niche",
  "nextStep": "single most important next action — be specific, not generic",
  "primaryGoal": {
    "title": "short goal title — 4-6 words",
    "description": "1-2 sentences explaining this goal and why it's the priority for this creator right now",
    "metric": "how they will know they're making progress — specific and measurable"
  },
  "secondaryGoal": {
    "title": "short secondary goal title",
    "description": "1-2 sentences explaining this goal and how it supports the primary goal",
    "metric": "how they will measure progress on this goal"
  },
  "checklistTasks": [
    {
      "task": "specific, concrete first task — something they can do today",
      "why": "one sentence on why this task matters most right now for their brand",
      "timeEstimate": "15 min"
    },
    {
      "task": "specific second task — a bit more involved",
      "why": "one sentence on why this moves the needle",
      "timeEstimate": "1 hour"
    },
    {
      "task": "specific third task — strategic setup for growth",
      "why": "one sentence on the longer-term payoff",
      "timeEstimate": "30 min"
    }
  ],
  "actionPlan": [
    { "task": "Week 1 action 1 — specific task tied to their niche and content buckets", "impact": "High", "week": 1 },
    { "task": "Week 1 action 2 — specific task", "impact": "High", "week": 1 },
    { "task": "Week 1 action 3 — specific task", "impact": "Medium", "week": 1 },
    { "task": "Week 2 action 1 — build on week 1 wins", "impact": "High", "week": 2 },
    { "task": "Week 2 action 2 — specific task", "impact": "Medium", "week": 2 },
    { "task": "Week 3 action 1 — momentum-building task", "impact": "High", "week": 3 },
    { "task": "Week 3 action 2 — specific task", "impact": "Medium", "week": 3 },
    { "task": "Week 4 action 1 — consolidation and review", "impact": "High", "week": 4 },
    { "task": "Week 4 action 2 — position for month 2", "impact": "Medium", "week": 4 }
  ],
  "audienceInsights": {
    "followerTier": "Nano (under 10K)",
    "estimatedReach": "~500–2,000 per post",
    "engagementRate": "3.8% (above average for nano tier)",
    "topLocations": ["United States", "United Kingdom", "Canada"],
    "ageRange": "18–24 primary (45%) · 25–34 secondary (32%)",
    "genderSplit": "~62% female · 38% male",
    "audiencePersona": "1-2 sentence description of who is likely following this creator based on niche and creator type",
    "growthInsight": "1-2 sentences on their audience growth pattern and biggest opportunity based on their niche",
    "note": "AI-estimated based on creator type and niche. Connect your Instagram account or share your Insights for exact data."
  },
  "algorithmIntelligence": {
    "score": 38,
    "headline": "specific headline about how the algorithm is affecting this creator — make it direct and honest",
    "summary": "2-3 sentences explaining how Instagram's current algorithm is specifically working against or for this creator based on their behavior and niche",
    "suppressionSignals": [
      {
        "signal": "specific behavior that is hurting their algorithmic reach",
        "impact": "High",
        "fix": "specific, actionable fix for this creator"
      },
      {
        "signal": "another suppression signal specific to their niche/behavior",
        "impact": "High",
        "fix": "specific fix"
      },
      {
        "signal": "third suppression signal",
        "impact": "Medium",
        "fix": "specific fix"
      }
    ],
    "boostTactics": [
      {
        "tactic": "specific tactic name for this creator",
        "effort": "Low",
        "expectedImpact": "what metric will improve and by roughly how much",
        "howTo": "exact steps to implement this tactic — be specific to their niche"
      },
      {
        "tactic": "another tactic",
        "effort": "Low",
        "expectedImpact": "expected result",
        "howTo": "specific steps"
      },
      {
        "tactic": "medium effort tactic with higher payoff",
        "effort": "Medium",
        "expectedImpact": "expected result",
        "howTo": "specific steps"
      },
      {
        "tactic": "high effort but high reward tactic",
        "effort": "Medium",
        "expectedImpact": "expected result",
        "howTo": "specific steps"
      }
    ],
    "currentPriorities": [
      { "priority": "Reels Watch Time", "why": "Instagram distributes Reels to non-followers — highest reach multiplier available", "status": "Missing This" },
      { "priority": "Saves & Shares over Likes", "why": "Saves signal 'worth revisiting', shares extend reach to new audiences — both weighted 3x more than likes", "status": "Missing This" },
      { "priority": "Keyword-Rich Captions", "why": "Instagram now indexes captions for search — SEO in captions reaches people who don't follow you", "status": "Partially" },
      { "priority": "Early Engagement (first 30 min)", "why": "The algorithm tests each post with a small audience — strong early engagement triggers wider distribution", "status": "Missing This" },
      { "priority": "Carousel Posts", "why": "Carousels get shown twice — once normally, once to re-engage non-swipers — doubling the opportunity", "status": "Doing This" },
      { "priority": "Consistent Posting Rhythm", "why": "Gaps of 5+ days cause the algorithm to de-prioritize your account in follower feeds", "status": "Partially" }
    ],
    "weeklySystem": "specific minimum viable weekly system for THIS creator — e.g. '3 feed posts (1 Reel, 2 carousels) · 5 Stories · reply to every comment within 2 hours of posting · 1 engagement session (comment on 10 accounts in your niche)' — keep it achievable without a social media manager"
  },
  "contentBuckets": [
    {
      "name": "short catchy bucket name — e.g. 'Behind the Work'",
      "description": "one sentence on what this bucket covers and why it resonates with this niche",
      "formats": ["Reels", "Carousels"],
      "frequency": "2x/week",
      "percentage": 30,
      "exampleIdeas": ["specific post idea 1 for this creator", "specific post idea 2"]
    },
    {
      "name": "second content bucket name",
      "description": "one sentence description",
      "formats": ["Stories", "Carousels"],
      "frequency": "1x/week",
      "percentage": 25,
      "exampleIdeas": ["post idea 1", "post idea 2"]
    },
    {
      "name": "third content bucket name",
      "description": "one sentence description",
      "formats": ["Reels", "Stories"],
      "frequency": "1x/week",
      "percentage": 20,
      "exampleIdeas": ["post idea 1", "post idea 2"]
    },
    {
      "name": "fourth content bucket name",
      "description": "one sentence description",
      "formats": ["Carousels"],
      "frequency": "1x/week",
      "percentage": 15,
      "exampleIdeas": ["post idea 1", "post idea 2"]
    },
    {
      "name": "fifth content bucket name",
      "description": "one sentence description",
      "formats": ["Reels", "Carousels"],
      "frequency": "1x/2 weeks",
      "percentage": 10,
      "exampleIdeas": ["post idea 1", "post idea 2"]
    }
  ],
  "sections": [
    {
      "id": "brand-identity",
      "title": "Brand Identity",
      "score": 65,
      "summary": "2-3 sentence honest assessment",
      "strengths": ["specific strength 1", "specific strength 2"],
      "gaps": ["specific gap 1", "specific gap 2"],
      "recommendations": ["specific action 1", "specific action 2"]
    },
    {
      "id": "content-strategy",
      "title": "Content Strategy",
      "score": 55,
      "summary": "2-3 sentence honest assessment",
      "strengths": ["strength"],
      "gaps": ["gap"],
      "recommendations": ["action"]
    },
    {
      "id": "engagement-community",
      "title": "Engagement & Community",
      "score": 60,
      "summary": "2-3 sentence honest assessment",
      "strengths": ["strength"],
      "gaps": ["gap"],
      "recommendations": ["action"]
    },
    {
      "id": "audience-alignment",
      "title": "Audience Alignment",
      "score": 70,
      "summary": "2-3 sentence honest assessment",
      "strengths": ["strength"],
      "gaps": ["gap"],
      "recommendations": ["action"]
    },
    {
      "id": "platform-optimization",
      "title": "Platform Optimization",
      "score": 50,
      "summary": "2-3 sentence honest assessment",
      "strengths": ["strength"],
      "gaps": ["gap"],
      "recommendations": ["action"]
    },
    {
      "id": "monetization-readiness",
      "title": "Monetization Readiness",
      "score": 45,
      "summary": "2-3 sentence honest assessment",
      "strengths": ["strength"],
      "gaps": ["gap"],
      "recommendations": ["action"]
    }
  ],
  "hiddenInsights": [
    {
      "title": "insight title",
      "insight": "the insight — something Instagram analytics won't show",
      "why": "why this matters strategically",
      "action": "what to do about it"
    },
    {
      "title": "insight title",
      "insight": "insight 2",
      "why": "why it matters",
      "action": "what to do"
    },
    {
      "title": "insight title",
      "insight": "insight 3",
      "why": "why it matters",
      "action": "what to do"
    }
  ]
}

IMPORTANT RULES:
- Replace ALL placeholder text with real, specific, niche-relevant content for this creator
- Scores should be honest — most creators score 45-75, not 90+
- algorithmIntelligence.score reflects how well they currently work WITH the algorithm (most score 25-55)
- suppressionSignals must be specific to THEIR behavior and niche — not generic advice
- boostTactics must be ranked by effort and specific to their creator type
- currentPriorities: adjust status ('Doing This', 'Partially', 'Missing This') based on what you know
- weeklySystem must be achievable in under 2 hours/week — not aspirational
- contentBuckets MUST be exactly 5 — no more, no less
- contentBuckets percentages MUST add up to exactly 100
- bucket names should be short, catchy, and ownable (3-4 words max)
- executiveSummary must read like a brand consultant's opening statement — specific, honest, expert tone
- Do NOT use IGTV as a format — it no longer exists. Use Reels, Carousels, Stories, or Live only
- verdict must be specific to their niche and situation — not generic encouragement
- primaryGoal must be the single most impactful focus area for the next 30-60 days
- secondaryGoal must support the primary goal and be achievable in parallel
- checklistTasks must be EXACTLY 3 — specific, doable, and immediately actionable (not vague)
- actionPlan tasks must be specific to their content buckets and niche — not generic advice
- actionPlan must have items across all 4 weeks (week: 1, 2, 3, 4)
- audienceInsights should be calibrated realistic estimates for their creator type and niche
- Hidden insights must feel like genuine consultant-level revelations, not generic advice
- Be specific to their niche and creator type throughout
- Return ONLY the JSON object, nothing else`
}

// ── Groq (production) ────────────────────────────────────────────────────────
async function callGroq(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Groq error ${res.status}: ${body}`)
  }

  const data = await res.json() as {
    choices?: { message?: { content?: string } }[]
    error?: { message: string }
  }

  if (data.error) throw new Error(`Groq: ${data.error.message}`)
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from Groq')
  return content
}

// ── Ollama (local dev) ────────────────────────────────────────────────────────
async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: prompt }],
      format: 'json',
      stream: false,
      options: { num_predict: 8192, temperature: 0.7 },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    if (res.status === 404) {
      throw new Error(`Model "${OLLAMA_MODEL}" not found. Run: ollama pull ${OLLAMA_MODEL}`)
    }
    throw new Error(`Ollama error ${res.status}: ${body}`)
  }

  const data = await res.json() as { message?: { content?: string }; error?: string }
  if (data.error) throw new Error(`Ollama: ${data.error}`)
  const content = data.message?.content
  if (!content) throw new Error('Empty response from Ollama')
  return content
}

export async function generateAuditReport(input: AuditInput): Promise<AuditReport> {
  if (!USE_GROQ) {
    // Local dev — check Ollama is running
    try {
      await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) })
    } catch {
      throw new Error('Ollama is not running. Start it with: ollama serve')
    }
  }

  const prompt = buildPrompt(input)
  const raw = USE_GROQ ? await callGroq(prompt) : await callOllama(prompt)

  // Strip any accidental markdown fences
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '')

  let report: AuditReport
  try {
    report = JSON.parse(cleaned)
  } catch {
    // Try to extract JSON object if there's stray text
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Could not parse audit report — try again')
    try {
      report = JSON.parse(match[0])
    } catch {
      throw new Error('Could not parse audit report — try again')
    }
  }

  return report
}
