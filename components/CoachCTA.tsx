'use client'

import { useState } from 'react'
import type { AuditReport } from '@/lib/types'

interface CoachCTAProps {
  report: AuditReport
}

function buildAuditBrief(report: AuditReport): string {
  const topGaps = (report.sections ?? [])
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .flatMap((s) => (s.gaps ?? []).slice(0, 1))

  const topAction = (report.actionPlan ?? [])[0]?.task ?? report.nextStep
  const buckets = (report.contentBuckets ?? []).map(b => b.name).join(', ')
  const isNew = report.meta.handle === 'new-creator'

  return `Hey! I just ran a brand audit through humbld.media and wanted to continue the conversation here.

Here's my snapshot:
• ${!isNew ? `Handle: ${report.meta.displayHandle}` : `Type: ${report.meta.creatorType} (just getting started)`}
• Creator type: ${report.meta.creatorType}${report.meta.niche !== 'General' ? ` · ${report.meta.niche}` : ''}
• Overall score: ${report.overview.overallScore}/100 — ${report.overview.tier}

My content buckets: ${buckets || 'Not set yet'}

My biggest gaps right now:
${topGaps.map((g) => `• ${g}`).join('\n')}

My #1 priority action: ${topAction}

Can you help me dig into these and build a plan?`
}

export default function CoachCTA({ report }: CoachCTAProps) {
  const [copied, setCopied] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const brief = buildAuditBrief(report)
  const igDMUrl = 'https://ig.me/m/yourcontent.coach'

  function handleClick() {
    navigator.clipboard.writeText(brief).catch(() => {
      // Fallback: show manual copy overlay even if clipboard fails
    })
    setCopied(true)
    setShowOverlay(true)

    setTimeout(() => {
      window.open(igDMUrl, '_blank', 'noopener,noreferrer')
    }, 800)

    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <>
      {/* ── CTA Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(62,141,180,0.2)] bg-gradient-to-br from-[#0d1a24] to-[#0e1110] p-6 mb-6">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[rgba(62,141,180,0.06)] blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-[rgba(62,141,180,0.12)] border border-[rgba(62,141,180,0.2)] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(62,141,180,0.12)]">
            <span className="text-2xl">◈</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[#fffdfb] text-base">Your Content Coach</h3>
              <span className="text-[10px] bg-[rgba(62,141,180,0.12)] text-[#3e8db4] border border-[rgba(62,141,180,0.2)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                AI · humbld.media
              </span>
            </div>
            <p className="text-[rgba(255,253,251,0.45)] text-xs mb-1">@yourcontent.coach on Instagram</p>
            <p className="text-[rgba(255,253,251,0.6)] text-sm leading-relaxed">
              Take this further. Your content coach lives in your DMs and already knows your audit results — ready to go deeper on any section.
            </p>
          </div>
        </div>

        {/* Audit brief preview */}
        <div className="mt-5 bg-[rgba(255,253,251,0.04)] border border-[rgba(255,253,251,0.06)] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgba(255,253,251,0.25)] mb-2">
            What your coach will receive
          </p>
          <p className="text-[rgba(255,253,251,0.45)] text-xs leading-relaxed font-mono whitespace-pre-line line-clamp-4">
            {brief}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="mt-5 w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-3 bg-[#3e8db4] text-[#fffdfb] hover:bg-[#3580a5] shadow-[0_4px_20px_rgba(62,141,180,0.25)]"
        >
          {copied ? (
            <>
              <span>✓</span>
              Context copied — opening Instagram...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              DM Your Content Coach on Instagram
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-[rgba(255,253,251,0.2)] mt-3">
          Your audit summary is automatically copied — just paste it when the DM opens
        </p>
      </div>

      {/* ── Overlay ── */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-[rgba(14,17,16,0.85)] backdrop-blur-sm z-50 flex items-end justify-center p-6"
          onClick={() => setShowOverlay(false)}
        >
          <div
            className="w-full max-w-sm bg-[#181f1e] border border-[rgba(62,141,180,0.2)] rounded-2xl p-6 mb-4 animate-[slideUp_0.35s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-[rgba(62,141,180,0.12)] border border-[rgba(62,141,180,0.2)] flex items-center justify-center mx-auto mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3e8db4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                <path d="M9 14l2 2 4-4"/>
              </svg>
            </div>

            <h3 className="font-bold text-[#fffdfb] text-center text-base mb-2">Audit context copied!</h3>
            <p className="text-[rgba(255,253,251,0.55)] text-sm text-center leading-relaxed mb-5">
              Instagram is opening now. When the DM loads, just{' '}
              <strong className="text-[#fffdfb]">paste</strong> — your content coach will have your full context and be ready to go deeper.
            </p>

            {/* Manual copy fallback */}
            <div className="bg-[rgba(255,253,251,0.04)] rounded-xl p-3 mb-5 max-h-32 overflow-y-auto">
              <p className="text-[rgba(255,253,251,0.4)] text-xs leading-relaxed font-mono whitespace-pre-line">{brief}</p>
            </div>

            <button
              onClick={() => setShowOverlay(false)}
              className="w-full py-3 rounded-xl bg-[rgba(255,253,251,0.08)] text-[rgba(255,253,251,0.6)] text-sm font-semibold hover:bg-[rgba(255,253,251,0.12)] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
