'use client'

import type { AudienceInsights } from '@/lib/types'

interface AudienceSnapshotProps {
  data: AudienceInsights
}

export default function AudienceSnapshot({ data }: AudienceSnapshotProps) {
  if (!data) return null

  // Parse gender split for visual bar
  const femaleMatch = data.genderSplit?.match(/(\d+)%\s*female/i)
  const maleMatch   = data.genderSplit?.match(/(\d+)%\s*male/i)
  const femalePct   = femaleMatch ? parseInt(femaleMatch[1]) : 50
  const malePct     = maleMatch   ? parseInt(maleMatch[1])  : 50

  return (
    <div className="mt-10 mb-2" id="audience-snapshot">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,253,251,0.35)]">
          Audience Snapshot
        </h2>
        <span className="text-[10px] bg-[rgba(253,182,97,0.10)] text-[#fdb661] border border-[rgba(253,182,97,0.2)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Outside-In Analysis
        </span>
      </div>

      <div className="bg-[#181f1e] border border-[rgba(255,253,251,0.07)] rounded-2xl p-6">
        {/* Top row — key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-1">Tier</p>
            <p className="text-[#fffdfb] font-bold text-sm leading-snug">{data.followerTier}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-1">Est. Reach</p>
            <p className="text-[#fdb661] font-bold text-sm leading-snug">{data.estimatedReach}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-1">Eng. Rate</p>
            <p className="text-[#3e8db4] font-bold text-sm leading-snug">{data.engagementRate}</p>
          </div>
        </div>

        {/* Gender split bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)]">Audience Gender</p>
            <p className="text-[10px] text-[rgba(255,253,251,0.35)]">{data.genderSplit}</p>
          </div>
          <div className="flex rounded-full overflow-hidden h-2 w-full gap-px">
            <div
              className="h-full transition-all"
              style={{ width: `${femalePct}%`, backgroundColor: '#fc532e' }}
            />
            <div
              className="h-full transition-all"
              style={{ width: `${malePct}%`, backgroundColor: '#3e8db4' }}
            />
          </div>
          <div className="flex gap-4 mt-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#fc532e]" />
              <span className="text-[10px] text-[rgba(255,253,251,0.4)]">Female {femalePct}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#3e8db4]" />
              <span className="text-[10px] text-[rgba(255,253,251,0.4)]">Male {malePct}%</span>
            </div>
          </div>
        </div>

        {/* Age + Locations row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-2">Age Range</p>
            <p className="text-[rgba(255,253,251,0.7)] text-sm">{data.ageRange}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.3)] mb-2">Top Locations</p>
            <div className="flex flex-col gap-1">
              {(data.topLocations ?? []).map((loc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[rgba(255,253,251,0.3)] text-xs">{i + 1}</span>
                  <span className="text-[rgba(255,253,251,0.7)] text-sm">{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audience persona */}
        <div className="bg-[rgba(253,182,97,0.05)] border border-[rgba(253,182,97,0.1)] rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(253,182,97,0.6)] mb-1">Who's Watching</p>
          <p className="text-[rgba(255,253,251,0.65)] text-sm leading-relaxed">{data.audiencePersona}</p>
        </div>

        {/* Growth insight */}
        <div className="flex items-start gap-3">
          <span className="text-[#3e8db4] flex-shrink-0 mt-0.5">→</span>
          <p className="text-[rgba(255,253,251,0.55)] text-sm leading-relaxed">{data.growthInsight}</p>
        </div>

        {/* Disclaimer */}
        <p className="text-[rgba(255,253,251,0.2)] text-[10px] mt-4 pt-3 border-t border-[rgba(255,253,251,0.05)]">
          ◎ This is an outside-in estimate — what your public presence signals to the world based on your niche, creator type, and content patterns. {data.note}
        </p>
      </div>
    </div>
  )
}
