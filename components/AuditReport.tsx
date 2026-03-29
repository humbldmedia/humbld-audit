'use client'

import { useState } from 'react'
import type { AuditReport, AuditSection, HiddenInsight, QuickStat } from '@/lib/types'
import CoachCTA from './CoachCTA'
import AlgorithmSection from './AlgorithmSection'
import ContentBucketsSection from './ContentBucketsSection'
import AudienceSnapshot from './AudienceSnapshot'

interface AuditReportProps {
  report: AuditReport
  onReset: () => void
}

// ── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 70 ? '#3e8db4' : score >= 50 ? '#fdb661' : '#fc532e'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,253,251,0.06)" strokeWidth="4" fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
    </svg>
  )
}

// ── Score Badge ─────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-[#3e8db4]' : score >= 50 ? 'text-[#fdb661]' : 'text-[#fc532e]'
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <ScoreRing score={score} size={80} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${color}`}>{score}</span>
      </div>
    </div>
  )
}

// ── Status Dot ──────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: QuickStat['status'] }) {
  const colors = {
    good:     'bg-[#3e8db4]',
    warning:  'bg-[#fdb661]',
    critical: 'bg-[#fc532e]',
    info:     'bg-[rgba(255,253,251,0.35)]',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status]} flex-shrink-0 mt-0.5`} />
}

// ── Impact Tag ──────────────────────────────────────────────────────────────
function ImpactTag({ impact }: { impact: 'High' | 'Medium' | 'Low' }) {
  const styles = {
    High:   'bg-[rgba(252,83,46,0.12)] text-[#fc532e] border-[rgba(252,83,46,0.2)]',
    Medium: 'bg-[rgba(253,182,97,0.10)] text-[#fdb661] border-[rgba(253,182,97,0.2)]',
    Low:    'bg-[rgba(62,141,180,0.10)] text-[#3e8db4] border-[rgba(62,141,180,0.2)]',
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${styles[impact]} flex-shrink-0`}>
      {impact}
    </span>
  )
}

// ── Tier Badge ──────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: AuditReport['overview']['tier'] }) {
  const styles = {
    Emerging:   'border-[rgba(253,182,97,0.3)] text-[#fdb661] bg-[rgba(253,182,97,0.06)]',
    Growing:    'border-[rgba(62,141,180,0.3)] text-[#3e8db4] bg-[rgba(62,141,180,0.06)]',
    Established:'border-[rgba(252,83,46,0.3)] text-[#fc532e] bg-[rgba(252,83,46,0.06)]',
    Authority:  'border-[rgba(255,253,251,0.3)] text-[#fffdfb] bg-[rgba(255,253,251,0.06)]',
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${styles[tier]}`}>
      {tier}
    </span>
  )
}

// ── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ section, index }: { section: AuditSection; index: number }) {
  const scoreColor = section.score >= 70 ? '#3e8db4' : section.score >= 50 ? '#fdb661' : '#fc532e'

  return (
    <div
      className="section-card bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl p-6 hover:border-[rgba(255,253,251,0.12)] transition-colors"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-start gap-4 mb-5">
        <ScoreBadge score={section.score} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#fffdfb] text-base mb-1">{section.title}</h3>
          <p className="text-[rgba(255,253,251,0.55)] text-sm leading-relaxed">{section.summary}</p>
        </div>
      </div>

      {(section.strengths ?? []).length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e8db4] mb-2">What's Working</p>
          <ul className="space-y-1.5">
            {section.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[rgba(255,253,251,0.7)]">
                <span className="text-[#3e8db4] mt-0.5 flex-shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(section.gaps ?? []).length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#fdb661] mb-2">Gaps & Risks</p>
          <ul className="space-y-1.5">
            {section.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[rgba(255,253,251,0.7)]">
                <span className="text-[#fdb661] mt-0.5 flex-shrink-0">◈</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(section.recommendations ?? []).length > 0 && (
        <div className="pt-4 border-t border-[rgba(255,253,251,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#fc532e] mb-2">Recommendations</p>
          <ul className="space-y-1.5">
            {section.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[rgba(255,253,251,0.7)]">
                <span style={{ color: scoreColor }} className="mt-0.5 flex-shrink-0">→</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Hidden Insight Card ───────────────────────────────────────────────────────
function HiddenInsightCard({ insight, index }: { insight: HiddenInsight; index: number }) {
  return (
    <div
      className="section-card bg-gradient-to-br from-[#1e1510] to-[#181f1e] border border-[rgba(253,182,97,0.12)] rounded-2xl p-5"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-[#fdb661] text-lg flex-shrink-0">✦</span>
        <h4 className="font-bold text-[#fffdfb] text-sm">{insight.title}</h4>
      </div>
      <p className="text-[rgba(255,253,251,0.65)] text-sm leading-relaxed mb-3">{insight.insight}</p>
      <div className="bg-[rgba(253,182,97,0.06)] rounded-lg px-3 py-2 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(253,182,97,0.6)] mb-1">Why it matters</p>
        <p className="text-[rgba(255,253,251,0.55)] text-xs leading-relaxed">{insight.why}</p>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-[#fc532e] text-xs mt-0.5 flex-shrink-0">→</span>
        <p className="text-[rgba(255,253,251,0.7)] text-xs leading-relaxed">{insight.action}</p>
      </div>
    </div>
  )
}

// ── Table of Contents ─────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: 'executive-summary',  label: 'Executive Summary' },
  { id: 'goals-checklist',    label: 'Goals & Quick Wins' },
  { id: 'audience-snapshot',  label: 'Audience Snapshot' },
  { id: 'algorithm-intelligence', label: 'Algorithm Intelligence' },
  { id: 'content-buckets',    label: 'Your Content System' },
  { id: 'deep-analysis',      label: 'Deep Analysis' },
  { id: 'hidden-insights',    label: 'Hidden Insights' },
  { id: 'roadmap-30',         label: '30-Day Roadmap' },
  { id: 'final-verdict',      label: 'Final Verdict' },
]

function TableOfContents() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl p-5 mb-8" data-print="hide">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-4">
        Table of Contents
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
        {TOC_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-[rgba(255,253,251,0.05)] transition-colors group"
          >
            <span className="text-[10px] font-bold text-[rgba(255,253,251,0.2)] w-4 flex-shrink-0 group-hover:text-[#fc532e] transition-colors">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-xs text-[rgba(255,253,251,0.5)] group-hover:text-[rgba(255,253,251,0.85)] transition-colors leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main Report ──────────────────────────────────────────────────────────────
export default function AuditReport({ report, onReset }: AuditReportProps) {
  const { meta, overview, verdict, nextStep, executiveSummary } = report

  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([false, false, false])
  function toggleTask(i: number) {
    setCheckedTasks(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  // Defensive fallbacks — local models sometimes omit fields
  const quickStats     = report.quickStats     ?? []
  const sections       = report.sections       ?? []
  const hiddenInsights = report.hiddenInsights  ?? []
  const actionPlan     = report.actionPlan      ?? []
  const contentBuckets = report.contentBuckets  ?? []
  const checklistTasks = report.checklistTasks  ?? []
  const primaryGoal    = report.primaryGoal
  const secondaryGoal  = report.secondaryGoal

  // Group 30-day plan by week
  const weeklyPlan: Record<number, typeof actionPlan> = { 1: [], 2: [], 3: [], 4: [] }
  actionPlan.forEach(item => {
    const w = item.week ?? 1
    if (weeklyPlan[w]) weeklyPlan[w].push(item)
  })

  function handleSaveReport() {
    // localStorage is shared across tabs — sessionStorage is NOT
    try {
      localStorage.setItem('humbld-print-report', JSON.stringify(report))
    } catch { /* ignore storage errors */ }
    window.open('/print', '_blank', 'noopener')
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.5s_ease_forwards]" data-report-root>

      {/* ── Header ── */}
      <div className="text-center mb-10">
        <div data-print="hide" className="inline-flex items-center gap-2 bg-[rgba(252,83,46,0.08)] border border-[rgba(252,83,46,0.15)] rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#fc532e] animate-pulse" />
          <span className="text-xs font-semibold text-[rgba(255,253,251,0.6)]">Brand Audit Complete</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#fffdfb] mb-2">
          {meta.displayHandle}
        </h1>
        <p className="text-[rgba(255,253,251,0.45)] text-sm mb-4 capitalize">
          {meta.creatorType}{meta.niche ? ` · ${meta.niche}` : ''}
        </p>
        <TierBadge tier={overview.tier} />
        <p className="text-[rgba(255,253,251,0.45)] text-xs mt-2">{overview.tierDescription}</p>
      </div>

      {/* ── Outside-In Methodology Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0e1a14] to-[#0e1110] border border-[rgba(253,182,97,0.12)] rounded-2xl p-5 mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[rgba(253,182,97,0.04)] blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-[rgba(253,182,97,0.08)] border border-[rgba(253,182,97,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[#fdb661] text-base">◎</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#fdb661]">The Outside-In Perspective</p>
            </div>
            <p className="text-[rgba(255,253,251,0.6)] text-sm leading-relaxed">
              This audit analyzes <strong className="text-[rgba(255,253,251,0.85)]">what the world sees</strong> when it finds you — not a repackaging of your own data. What a first-time follower notices. What a brand manager evaluates. What the algorithm reads. The perspective Instagram is built from the inside out, so it can never give you this.
            </p>
          </div>
        </div>
      </div>

      {/* ── Table of Contents ── */}
      <TableOfContents />

      {/* ── Executive Summary ── */}
      <div id="executive-summary" className="scroll-mt-6">
        {/* Score + headline */}
        <div className="bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl p-5 sm:p-6 mb-4 flex items-center gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <ScoreRing score={overview.overallScore} size={80} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl sm:text-2xl font-bold ${overview.overallScore >= 70 ? 'text-[#3e8db4]' : overview.overallScore >= 50 ? 'text-[#fdb661]' : 'text-[#fc532e]'}`}>
                {overview.overallScore}
              </span>
              <span className="text-[rgba(255,253,251,0.35)] text-xs">/ 100</span>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-[#fffdfb] text-base sm:text-lg mb-1 leading-tight">{overview.headline}</h2>
            <p className="text-[rgba(255,253,251,0.45)] text-xs sm:text-sm">{overview.tierDescription}</p>
          </div>
        </div>

        {/* Expert analysis paragraph */}
        {executiveSummary && (
          <div className="bg-gradient-to-br from-[#141a13] to-[#0e1110] border border-[rgba(255,253,251,0.08)] rounded-2xl p-5 sm:p-6 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-3">
              Expert Analysis
            </p>
            <p className="text-[rgba(255,253,251,0.75)] text-sm sm:text-base leading-relaxed font-medium">
              {executiveSummary}
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-xl p-4">
            <div className="flex items-start gap-2 mb-1">
              <StatusDot status={stat.status} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)] leading-tight">{stat.label}</p>
            </div>
            <p className="text-xl font-bold text-[#fffdfb] mb-0.5">{stat.value}</p>
            <p className="text-[10px] text-[rgba(255,253,251,0.35)]">Benchmark: {stat.benchmark}</p>
            {stat.note && <p className="text-[10px] text-[rgba(255,253,251,0.45)] mt-1 italic">{stat.note}</p>}
          </div>
        ))}
      </div>

      {/* ── Goals & Checklist ── */}
      {(primaryGoal || secondaryGoal || checklistTasks.length > 0) && (
        <div id="goals-checklist" className="mt-10 scroll-mt-6">

          {/* Goals */}
          {(primaryGoal || secondaryGoal) && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)] mb-4">
                Your Goals
              </h2>
              <div className="space-y-3">
                {primaryGoal && (
                  <div className="bg-gradient-to-br from-[#1a1108] to-[#181f1e] border border-[rgba(252,83,46,0.15)] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(252,83,46,0.12)] text-[#fc532e] border border-[rgba(252,83,46,0.2)] px-2 py-0.5 rounded-full">
                        Primary Goal
                      </span>
                    </div>
                    <h3 className="font-bold text-[#fffdfb] text-base mb-1.5">{primaryGoal.title}</h3>
                    <p className="text-[rgba(255,253,251,0.6)] text-sm leading-relaxed mb-3">{primaryGoal.description}</p>
                    <div className="flex items-start gap-2 bg-[rgba(252,83,46,0.06)] rounded-xl px-3 py-2">
                      <span className="text-[#fc532e] text-xs mt-0.5 flex-shrink-0">◎</span>
                      <p className="text-[rgba(255,253,251,0.5)] text-xs leading-relaxed">
                        <span className="font-bold text-[rgba(255,253,251,0.6)]">How to measure: </span>
                        {primaryGoal.metric}
                      </p>
                    </div>
                  </div>
                )}

                {secondaryGoal && (
                  <div className="bg-[#181f1e] border border-[rgba(253,182,97,0.12)] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(253,182,97,0.10)] text-[#fdb661] border border-[rgba(253,182,97,0.2)] px-2 py-0.5 rounded-full">
                        Secondary Goal
                      </span>
                    </div>
                    <h3 className="font-bold text-[#fffdfb] text-base mb-1.5">{secondaryGoal.title}</h3>
                    <p className="text-[rgba(255,253,251,0.6)] text-sm leading-relaxed mb-3">{secondaryGoal.description}</p>
                    <div className="flex items-start gap-2 bg-[rgba(253,182,97,0.05)] rounded-xl px-3 py-2">
                      <span className="text-[#fdb661] text-xs mt-0.5 flex-shrink-0">◎</span>
                      <p className="text-[rgba(255,253,251,0.5)] text-xs leading-relaxed">
                        <span className="font-bold text-[rgba(255,253,251,0.6)]">How to measure: </span>
                        {secondaryGoal.metric}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Wins Checklist */}
          {checklistTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)]">
                  Quick Wins Checklist
                </h2>
                <span className="text-[10px] bg-[rgba(62,141,180,0.10)] text-[#3e8db4] border border-[rgba(62,141,180,0.2)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Do These First
                </span>
              </div>
              <div className="bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl p-5 space-y-4">
                {checklistTasks.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 cursor-pointer group"
                    onClick={() => toggleTask(i)}
                  >
                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                      checkedTasks[i]
                        ? 'bg-[#3e8db4] border-[#3e8db4]'
                        : 'border-[rgba(255,253,251,0.2)] group-hover:border-[#3e8db4]'
                    }`}>
                      {checkedTasks[i] && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4.5 8.5L11 1.5" stroke="#fffdfb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-snug mb-1 transition-all duration-200 ${
                        checkedTasks[i] ? 'line-through text-[rgba(255,253,251,0.3)]' : 'text-[#fffdfb]'
                      }`}>
                        {item.task}
                      </p>
                      <p className="text-[rgba(255,253,251,0.45)] text-xs leading-relaxed">{item.why}</p>
                    </div>

                    <span className="text-[10px] font-bold text-[rgba(255,253,251,0.25)] flex-shrink-0 mt-0.5 whitespace-nowrap">
                      {item.timeEstimate}
                    </span>
                  </div>
                ))}

                {/* Progress indicator */}
                <div className="pt-3 border-t border-[rgba(255,253,251,0.06)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.25)]">
                      {checkedTasks.filter(Boolean).length} of 3 complete
                    </p>
                    {checkedTasks.every(Boolean) && (
                      <span className="text-[10px] font-bold text-[#3e8db4] uppercase tracking-wider">
                        All done ✓
                      </span>
                    )}
                  </div>
                  <div className="h-1 bg-[rgba(255,253,251,0.06)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3e8db4] rounded-full transition-all duration-500"
                      style={{ width: `${(checkedTasks.filter(Boolean).length / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Audience Snapshot ── */}
      <div id="audience-snapshot" className="scroll-mt-6">
        {report.audienceInsights && (
          <AudienceSnapshot data={report.audienceInsights} />
        )}
      </div>

      {/* ── Algorithm Intelligence ── */}
      <div id="algorithm-intelligence" className="scroll-mt-6">
        {report.algorithmIntelligence && (
          <AlgorithmSection data={report.algorithmIntelligence} />
        )}
      </div>

      {/* ── Content Buckets ── */}
      <div id="content-buckets" className="scroll-mt-6">
        {contentBuckets.length > 0 && (
          <ContentBucketsSection buckets={contentBuckets} />
        )}
      </div>

      {/* ── Deep Analysis ── */}
      <div id="deep-analysis" className="mt-10 mb-2 scroll-mt-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)] mb-5">Deep Analysis</h2>
        <div className="space-y-4">
          {sections.map((section, i) => (
            <SectionCard key={section.id ?? i} section={section} index={i} />
          ))}
        </div>
      </div>

      {/* ── Hidden Insights ── */}
      <div id="hidden-insights" className="scroll-mt-6">
        {hiddenInsights.length > 0 && (
          <div className="mt-10 mb-2">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)]">Hidden Insights</h2>
              <span className="text-[10px] bg-[rgba(253,182,97,0.10)] text-[#fdb661] border border-[rgba(253,182,97,0.2)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                What Instagram Won't Tell You
              </span>
            </div>
            <div className="space-y-4">
              {hiddenInsights.map((insight, i) => (
                <HiddenInsightCard key={i} insight={insight} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 30-Day Roadmap ── */}
      <div id="roadmap-30" className="mt-10 scroll-mt-6">
        <div className="bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)]">
              30-Day Growth Roadmap
            </h2>
            <span className="text-[10px] bg-[rgba(252,83,46,0.10)] text-[#fc532e] border border-[rgba(252,83,46,0.2)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Week by Week
            </span>
          </div>

          <div className="space-y-6">
            {([1, 2, 3, 4] as const).map((week) => {
              const items = weeklyPlan[week]
              if (!items || items.length === 0) return null
              const weekColor = week <= 2 ? '#fc532e' : '#3e8db4'
              return (
                <div key={week}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: weekColor }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: weekColor }}>
                      Week {week}
                    </p>
                  </div>
                  <ul className="space-y-2 pl-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start justify-between gap-4">
                        <span className="text-sm text-[rgba(255,253,251,0.7)] leading-snug">{item.task}</span>
                        <ImpactTag impact={item.impact} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Final Verdict ── */}
      <div id="final-verdict" className="scroll-mt-6">
        <div className="bg-gradient-to-br from-[#1a1108] to-[#0e1110] border border-[rgba(253,182,97,0.15)] rounded-2xl p-6 mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#fdb661] mb-3">Final Verdict</p>
          <p className="text-[rgba(255,253,251,0.8)] text-sm leading-relaxed mb-4">{verdict}</p>
          <div className="pt-4 border-t border-[rgba(253,182,97,0.1)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)] mb-2">Recommended Next Step</p>
            <p className="text-[#fffdfb] text-sm font-semibold">{nextStep}</p>
          </div>
        </div>
      </div>

      {/* ── Meta note ── */}
      <p className="text-center text-[rgba(255,253,251,0.25)] text-xs mb-10 leading-relaxed px-4">
        {meta.analysisNote}
      </p>

      {/* ── Coach CTA ── */}
      <div data-print="hide">
        <CoachCTA report={report} />
      </div>

      {/* ── Strategy Call CTA ── */}
      <div className="bg-gradient-to-br from-[#1a0e08] to-[#0e1110] border border-[rgba(252,83,46,0.15)] rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[rgba(252,83,46,0.10)] border border-[rgba(252,83,46,0.2)] flex items-center justify-center flex-shrink-0">
            <span className="text-[#fc532e] text-base">✦</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#fffdfb] text-base mb-1">Want the full strategy session?</h3>
            <p className="text-[rgba(255,253,251,0.55)] text-sm leading-relaxed mb-4">
              Book a 1-on-1 with Philip — 60 minutes to turn this audit into a real growth plan, content system, and brand story that lands.
            </p>
            <a
              href="https://humbld.media/book"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#fc532e] text-[#fffdfb] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e8441f] transition-colors shadow-[0_4px_16px_rgba(252,83,46,0.25)]"
            >
              Book a Strategy Call → humbld.media/book
            </a>
          </div>
        </div>
      </div>

      {/* ── Value prop / pricing strip ── */}
      <div className="bg-[rgba(255,253,251,0.03)] border border-[rgba(255,253,251,0.06)] rounded-2xl p-5 mb-8 text-center" data-print="hide">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.25)] mb-2">
          What's included in this report
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-[rgba(255,253,251,0.4)] mb-4">
          {[
            'Executive Summary',
            'Audience Snapshot',
            'Algorithm Intelligence',
            '5 Content Buckets',
            '30-Day Roadmap',
            'Deep Analysis',
            'Hidden Insights',
            'Content Coach Access',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1">
              <span className="text-[#fc532e]">✓</span> {item}
            </span>
          ))}
        </div>
        <p className="text-[rgba(255,253,251,0.2)] text-xs">
          The same insights you'd get in a paid strategy session — available to anyone for $5.
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3" data-print="hide">
        <button
          onClick={onReset}
          className="flex-1 py-3.5 rounded-xl border border-[rgba(255,253,251,0.10)] text-[rgba(255,253,251,0.55)] text-sm font-semibold hover:border-[rgba(255,253,251,0.25)] hover:text-[rgba(255,253,251,0.8)] transition-all"
        >
          ← New Audit
        </button>
        <button
          onClick={handleSaveReport}
          className="flex-1 py-3.5 rounded-xl bg-[#fc532e] text-[#fffdfb] text-sm font-bold hover:bg-[#e8441f] transition-colors shadow-[0_4px_20px_rgba(252,83,46,0.25)]"
        >
          Save Report ↓
        </button>
      </div>
    </div>
  )
}
