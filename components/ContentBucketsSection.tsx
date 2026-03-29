'use client'

import type { ContentBucket } from '@/lib/types'

interface ContentBucketsSectionProps {
  buckets: ContentBucket[]
}

const FORMAT_ICONS: Record<string, string> = {
  Reels:     '▷',
  Carousels: '⊞',
  Stories:   '◎',
  Live:      '●',
  Static:    '□',
}

const BUCKET_COLORS = [
  { accent: '#fc532e', bg: 'rgba(252,83,46,0.08)', border: 'rgba(252,83,46,0.15)', bar: '#fc532e' },
  { accent: '#fdb661', bg: 'rgba(253,182,97,0.08)', border: 'rgba(253,182,97,0.15)', bar: '#fdb661' },
  { accent: '#3e8db4', bg: 'rgba(62,141,180,0.08)', border: 'rgba(62,141,180,0.15)', bar: '#3e8db4' },
  { accent: '#fc532e', bg: 'rgba(252,83,46,0.06)', border: 'rgba(252,83,46,0.12)', bar: '#fc532e' },
  { accent: '#fdb661', bg: 'rgba(253,182,97,0.06)', border: 'rgba(253,182,97,0.12)', bar: '#fdb661' },
]

// Llama sometimes returns percentage as "25%" string — normalise to number
function parsePct(raw: unknown, fallback: number): number {
  if (typeof raw === 'number') return raw
  if (typeof raw === 'string') {
    const n = parseInt(raw.replace('%', ''), 10)
    return isNaN(n) ? fallback : n
  }
  return fallback
}

function BucketCard({ bucket, index, compact = false }: {
  bucket: ContentBucket
  index: number
  compact?: boolean
}) {
  const color  = BUCKET_COLORS[index % BUCKET_COLORS.length]
  const pct    = parsePct(bucket.percentage, Math.round(100 / 5))
  const ideas  = bucket.exampleIdeas ?? []
  const fmts   = (bucket.formats ?? []).filter(f => f !== 'IGTV')

  return (
    <div
      className="section-card bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl flex flex-col hover:border-[rgba(255,253,251,0.12)] transition-colors"
      style={{ animationDelay: `${index * 0.07}s`, padding: compact ? '14px' : '20px' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ backgroundColor: color.bg, border: `1px solid ${color.border}`, color: color.accent }}
          >
            {index + 1}
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-[#fffdfb] leading-tight truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              {bucket.name}
            </h3>
            <p className="text-[rgba(255,253,251,0.35)] text-[10px]">{bucket.frequency}</p>
          </div>
        </div>
        {/* % badge */}
        <span
          className="flex-shrink-0 px-2 py-0.5 rounded-lg text-sm font-bold"
          style={{ backgroundColor: color.bg, color: color.accent, border: `1px solid ${color.border}` }}
        >
          {pct}%
        </span>
      </div>

      {/* Bar */}
      <div className="h-0.5 bg-[rgba(255,253,251,0.05)] rounded-full mb-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color.bar }}
        />
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-[rgba(255,253,251,0.55)] text-xs leading-relaxed mb-2.5">
          {bucket.description}
        </p>
      )}

      {/* Formats */}
      <div className="flex gap-1 flex-wrap mb-2.5">
        {fmts.map((fmt, fi) => (
          <span
            key={fi}
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[rgba(255,253,251,0.05)] border border-[rgba(255,253,251,0.08)] text-[rgba(255,253,251,0.4)]"
          >
            {FORMAT_ICONS[fmt] ?? '·'} {fmt}
          </span>
        ))}
      </div>

      {/* Post ideas */}
      {ideas.length > 0 && (
        <div className="bg-[rgba(255,253,251,0.03)] border border-[rgba(255,253,251,0.05)] rounded-xl px-3 py-2.5 mt-auto">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.2)] mb-1.5">
            Post Ideas
          </p>
          <ul className="space-y-1">
            {ideas.slice(0, compact ? 1 : 2).map((idea, ii) => (
              <li key={ii} className="flex items-start gap-1.5 text-xs text-[rgba(255,253,251,0.55)]">
                <span className="flex-shrink-0 mt-0.5" style={{ color: color.accent }}>✦</span>
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function ContentBucketsSection({ buckets }: ContentBucketsSectionProps) {
  if (!buckets || buckets.length === 0) return null

  const display  = buckets.slice(0, 5)
  const topThree = display.slice(0, 3)
  const bottomTwo = display.slice(3, 5)

  // Total pct for legend
  const totalPct = display.reduce((sum, b) => sum + parsePct(b.percentage, 20), 0)

  return (
    <div className="mt-10 mb-2" id="content-buckets">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)]">
          Your Content System
        </h2>
        <span className="text-[10px] bg-[rgba(252,83,46,0.10)] text-[#fc532e] border border-[rgba(252,83,46,0.2)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          5 Buckets
        </span>
      </div>

      {/* Allocation overview bar */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.25)] mb-2">
          Focus Allocation {totalPct !== 100 ? '' : '· 100%'}
        </p>
        <div className="flex rounded-lg overflow-hidden h-2.5 w-full gap-px">
          {display.map((bucket, i) => {
            const color = BUCKET_COLORS[i % BUCKET_COLORS.length]
            const pct   = parsePct(bucket.percentage, 20)
            return (
              <div
                key={i}
                style={{ width: `${pct}%`, backgroundColor: color.bar }}
                className="transition-all"
                title={`${bucket.name}: ${pct}%`}
              />
            )
          })}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
          {display.map((bucket, i) => {
            const color = BUCKET_COLORS[i % BUCKET_COLORS.length]
            const pct   = parsePct(bucket.percentage, 20)
            return (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color.bar }} />
                <span className="text-[10px] text-[rgba(255,253,251,0.4)]">
                  {bucket.name} <span style={{ color: color.accent }} className="font-bold">{pct}%</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 3 + 2 grid (desktop) / single column (mobile) ── */}

      {/* Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        {topThree.map((bucket, i) => (
          <BucketCard key={i} bucket={bucket} index={i} compact={true} />
        ))}
      </div>

      {/* Bottom 2 — centered under the top 3 */}
      {bottomTwo.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:w-2/3 sm:mx-auto">
          {bottomTwo.map((bucket, i) => (
            <BucketCard key={i + 3} bucket={bucket} index={i + 3} compact={true} />
          ))}
        </div>
      )}
    </div>
  )
}
