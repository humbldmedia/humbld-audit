export interface QuickStat {
  label: string
  value: string
  benchmark: string
  status: 'good' | 'warning' | 'critical' | 'info'
  note?: string
}

export interface AuditSection {
  id: string
  title: string
  score: number           // 0–100
  summary: string
  strengths: string[]
  gaps: string[]
  recommendations: string[]
}

export interface HiddenInsight {
  title: string
  insight: string
  why: string
  action: string
}

export interface ActionItem {
  task: string
  impact: 'High' | 'Medium' | 'Low'
  week: 1 | 2 | 3 | 4
}

export interface BrandGoal {
  title: string
  description: string
  metric: string        // how to measure progress
}

export interface ChecklistTask {
  task: string
  why: string
  timeEstimate: string  // e.g. "15 min", "1 hour"
}

export interface SuppressionSignal {
  signal: string
  impact: 'High' | 'Medium' | 'Low'
  fix: string
}

export interface BoostTactic {
  tactic: string
  effort: 'Low' | 'Medium' | 'High'
  expectedImpact: string
  howTo: string
}

export interface AlgorithmPriority {
  priority: string
  why: string
  status: 'Doing This' | 'Missing This' | 'Partially'
}

export interface AlgorithmIntelligence {
  score: number
  headline: string
  summary: string
  suppressionSignals: SuppressionSignal[]
  boostTactics: BoostTactic[]
  currentPriorities: AlgorithmPriority[]
  weeklySystem: string
}

export interface ContentBucket {
  name: string
  description: string
  formats: string[]
  frequency: string
  percentage: number    // focus allocation — all 5 must total 100
  exampleIdeas: string[]
}

export interface AudienceInsights {
  followerTier: string
  estimatedReach: string
  engagementRate: string
  topLocations: string[]
  ageRange: string
  genderSplit: string
  audiencePersona: string
  growthInsight: string
  note: string
}

export interface AuditReport {
  meta: {
    handle: string
    displayHandle: string
    creatorType: string
    niche: string
    generatedAt: string
    analysisNote: string
  }
  overview: {
    headline: string
    overallScore: number
    tier: 'Emerging' | 'Growing' | 'Established' | 'Authority'
    tierDescription: string
    oneLineSummary: string
  }
  quickStats: QuickStat[]
  // ── Critical fields first (generated before long sections) ──
  executiveSummary: string    // third-party expert paragraph on the brand
  verdict: string
  nextStep: string
  primaryGoal: BrandGoal
  secondaryGoal: BrandGoal
  checklistTasks: ChecklistTask[]   // always exactly 3
  actionPlan: ActionItem[]          // 30-day, items have week: 1|2|3|4
  // ── Deeper sections (generated after critical content) ──
  audienceInsights: AudienceInsights
  algorithmIntelligence: AlgorithmIntelligence
  contentBuckets: ContentBucket[]   // always exactly 5
  sections: AuditSection[]
  hiddenInsights: HiddenInsight[]
}
