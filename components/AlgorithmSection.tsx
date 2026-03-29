'use client'

import type { AlgorithmIntelligence } from '@/lib/types'

interface AlgorithmSectionProps {
  data: AlgorithmIntelligence
}

function AlgoScore({ score }: { score: number }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 65 ? '#3e8db4' : score >= 40 ? '#fdb661' : '#fc532e'
  const label = score >= 65 ? 'Aligned' : score >= 40 ? 'At Risk' : 'Suppressed'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="-rotate-90 w-full h-full" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} stroke="rgba(255,253,251,0.06)" strokeWidth="5" fill="none" />
          <circle
            cx="48" cy="48" r={r}
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] text-[rgba(255,253,251,0.35)]">/100</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
    </div>
  )
}

const IMPACT_COLORS = {
  High:   { bg: 'bg-[rgba(252,83,46,0.10)]',   text: 'text-[#fc532e]',   border: 'border-[rgba(252,83,46,0.2)]' },
  Medium: { bg: 'bg-[rgba(253,182,97,0.10)]',  text: 'text-[#fdb661]',   border: 'border-[rgba(253,182,97,0.2)]' },
  Low:    { bg: 'bg-[rgba(62,141,180,0.10)]',  text: 'text-[#3e8db4]',   border: 'border-[rgba(62,141,180,0.2)]' },
}

const EFFORT_COLORS = {
  Low:    { bg: 'bg-[rgba(62,141,180,0.10)]',  text: 'text-[#3e8db4]',  border: 'border-[rgba(62,141,180,0.2)]' },
  Medium: { bg: 'bg-[rgba(253,182,97,0.10)]',  text: 'text-[#fdb661]',  border: 'border-[rgba(253,182,97,0.2)]' },
  High:   { bg: 'bg-[rgba(252,83,46,0.10)]',   text: 'text-[#fc532e]',  border: 'border-[rgba(252,83,46,0.2)]' },
}

const STATUS_STYLES = {
  'Doing This':   { dot: 'bg-[#3e8db4]', text: 'text-[#3e8db4]',  label: 'Doing This' },
  'Partially':    { dot: 'bg-[#fdb661]', text: 'text-[#fdb661]',  label: 'Partially'  },
  'Missing This': { dot: 'bg-[#fc532e]', text: 'text-[#fc532e]',  label: 'Missing'    },
}

export default function AlgorithmSection({ data }: AlgorithmSectionProps) {
  // Defensive fallbacks for local model incomplete responses
  const suppressionSignals = data.suppressionSignals  ?? []
  const boostTactics       = data.boostTactics        ?? []
  const currentPriorities  = data.currentPriorities   ?? []

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)]">
          Algorithm Intelligence
        </h2>
        <span className="text-[10px] bg-[rgba(252,83,46,0.08)] text-[#fc532e] border border-[rgba(252,83,46,0.15)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          New
        </span>
      </div>

      {/* Main card */}
      <div className="bg-gradient-to-br from-[#120d0a] to-[#0e1110] border border-[rgba(252,83,46,0.15)] rounded-2xl overflow-hidden">

        {/* Score + headline */}
        <div className="p-6 flex items-center gap-6 border-b border-[rgba(255,253,251,0.06)]">
          <AlgoScore score={data.score} />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#fffdfb] text-base mb-2 leading-snug">{data.headline}</h3>
            <p className="text-[rgba(255,253,251,0.55)] text-sm leading-relaxed">{data.summary}</p>
          </div>
        </div>

        {/* What's suppressing your reach */}
        <div className="p-6 border-b border-[rgba(255,253,251,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#fc532e] mb-4">
            What's Suppressing Your Reach Right Now
          </p>
          <div className="space-y-3">
            {suppressionSignals.map((s, i) => {
              const c = IMPACT_COLORS[s.impact]
              return (
                <div key={i} className="bg-[rgba(255,253,251,0.03)] border border-[rgba(255,253,251,0.06)] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[#fffdfb] text-sm font-semibold leading-snug">{s.signal}</p>
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
                      {s.impact} Impact
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#3e8db4] text-xs mt-0.5 flex-shrink-0">→</span>
                    <p className="text-[rgba(255,253,251,0.55)] text-xs leading-relaxed">{s.fix}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current algorithm priorities */}
        <div className="p-6 border-b border-[rgba(255,253,251,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#fdb661] mb-4">
            What Instagram's Algorithm Rewards Right Now
          </p>
          <div className="space-y-2.5">
            {currentPriorities.map((p, i) => {
              const s = STATUS_STYLES[p.status]
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[#fffdfb] text-sm font-semibold">{p.priority}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${s.text}`}>
                        · {s.label}
                      </span>
                    </div>
                    <p className="text-[rgba(255,253,251,0.4)] text-xs leading-relaxed">{p.why}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Boost tactics */}
        <div className="p-6 border-b border-[rgba(255,253,251,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e8db4] mb-4">
            How to Work the Algorithm in Your Favor
          </p>
          <div className="space-y-3">
            {boostTactics.map((t, i) => {
              const c = EFFORT_COLORS[t.effort]
              return (
                <div key={i} className="bg-[rgba(255,253,251,0.03)] border border-[rgba(255,253,251,0.06)] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[#fffdfb] text-sm font-semibold leading-snug">{t.tactic}</p>
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
                      {t.effort} Effort
                    </span>
                  </div>
                  <p className="text-[rgba(255,253,251,0.55)] text-xs leading-relaxed mb-2">{t.howTo}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#fdb661] text-[10px]">✦</span>
                    <p className="text-[rgba(253,182,97,0.7)] text-[11px] font-semibold">{t.expectedImpact}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekly system */}
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)] mb-3">
            Your Minimum Viable Weekly System
          </p>
          <div className="bg-[rgba(255,253,251,0.04)] border border-[rgba(255,253,251,0.08)] rounded-xl p-4">
            <p className="text-[#fffdfb] text-sm font-semibold leading-relaxed">{data.weeklySystem}</p>
            <p className="text-[rgba(255,253,251,0.35)] text-xs mt-2">
              This is the minimum consistent effort needed to stay in the algorithm's favor — without a social media manager.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
