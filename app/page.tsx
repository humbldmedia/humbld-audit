'use client'

import { useState } from 'react'
import AuditForm, { type AuditFormData } from '@/components/AuditForm'
import LoadingState from '@/components/LoadingState'
import AuditReport from '@/components/AuditReport'
import type { AuditReport as AuditReportType } from '@/lib/types'

type Step = 'form' | 'loading' | 'report' | 'error'

export default function Home() {
  const [step, setStep]       = useState<Step>('form')
  const [formData, setFormData] = useState<AuditFormData | null>(null)
  const [report, setReport]   = useState<AuditReportType | null>(null)
  const [error, setError]     = useState<string | null>(null)

  async function handleFormSubmit(data: AuditFormData) {
    setFormData(data)
    setStep('loading')
    setError(null)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Something went wrong. Please try again.')
      }

      setReport(json.report)
      setStep('report')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('error')
    }
  }

  async function handleRetry() {
    if (!formData) { handleReset(); return }
    await handleFormSubmit(formData)
  }

  function handleReset() {
    setStep('form')
    setFormData(null)
    setReport(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-[#0e1110] px-4 py-12 md:py-20">
      {/* ── Nav ── */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-16" data-print="hide">
        <a
          href="https://humbld.media"
          className="text-[rgba(255,253,251,0.45)] text-sm font-semibold hover:text-[rgba(255,253,251,0.7)] transition-colors tracking-wider"
        >
          humbld ↗
        </a>
        <span className="text-[rgba(255,253,251,0.2)] text-xs">Brand Audit Tool</span>
      </div>

      {/* ── Hero (only on form step) ── */}
      {step === 'form' && (
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease_forwards]">
          <div className="inline-flex items-center gap-2 bg-[rgba(253,182,97,0.06)] border border-[rgba(253,182,97,0.15)] rounded-full px-4 py-1.5 mb-8">
            <span className="text-[#fdb661] text-xs">✦</span>
            <span className="text-xs font-semibold text-[rgba(255,253,251,0.5)]">AI-Powered · Outside-In Analysis · Instant</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="text-[#fffdfb]">See yourself</span>
            <br />
            <span className="shimmer-text">the way the world does.</span>
          </h1>

          <p className="text-[rgba(255,253,251,0.5)] text-lg max-w-md mx-auto leading-relaxed mb-6">
            You know your numbers. This audit shows what a brand manager, potential collaborator, or first-time follower actually sees — the perspective Instagram can never give you.
          </p>

          {/* External perspective value props */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[rgba(255,253,251,0.35)] mb-8 max-w-sm mx-auto">
            <span className="flex items-center gap-1.5"><span className="text-[#fc532e]">◈</span> What stops a scroll</span>
            <span className="flex items-center gap-1.5"><span className="text-[#fc532e]">◈</span> What brands evaluate</span>
            <span className="flex items-center gap-1.5"><span className="text-[#fc532e]">◈</span> What the algorithm reads</span>
            <span className="flex items-center gap-1.5"><span className="text-[#fc532e]">◈</span> What your niche expects</span>
          </div>

          <p className="text-[rgba(255,253,251,0.2)] text-sm">
            Original intelligence. Not a repackaging of your own data.
          </p>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[rgba(255,253,251,0.15)] to-transparent mx-auto mt-10" />
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-2xl mx-auto">
        {step === 'form' && (
          <AuditForm onSubmit={handleFormSubmit} loading={false} />
        )}

        {step === 'loading' && (
          <LoadingState
            handle={formData?.hasAccount ? formData.handle : undefined}
            creatorType={formData?.creatorType}
          />
        )}

        {step === 'report' && report && (
          <AuditReport report={report} onReset={handleReset} />
        )}

        {step === 'error' && (
          <div className="text-center animate-[slideUp_0.4s_ease_forwards]">
            <div className="w-16 h-16 rounded-full bg-[rgba(252,83,46,0.08)] border border-[rgba(252,83,46,0.2)] flex items-center justify-center mx-auto mb-6">
              <span className="text-[#fc532e] text-2xl">!</span>
            </div>
            <h2 className="font-bold text-[#fffdfb] text-xl mb-2">Something went wrong</h2>
            <p className="text-[rgba(255,253,251,0.45)] text-sm mb-8 max-w-sm mx-auto">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-xl border border-[rgba(255,253,251,0.10)] text-[rgba(255,253,251,0.55)] text-sm font-semibold hover:border-[rgba(255,253,251,0.25)] hover:text-[rgba(255,253,251,0.8)] transition-all"
              >
                ← Start Over
              </button>
              <button
                onClick={handleRetry}
                className="px-8 py-3.5 rounded-xl bg-[#fc532e] text-[#fffdfb] font-bold text-sm hover:bg-[#e8441f] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {step === 'form' && (
        <div className="text-center mt-20">
          <p className="text-[rgba(255,253,251,0.2)] text-xs">
            Built by{' '}
            <a href="https://humbld.media" className="hover:text-[rgba(255,253,251,0.4)] transition-colors">
              humbld.media
            </a>
            {' '}· AI-Powered Brand Intelligence
          </p>
        </div>
      )}
    </main>
  )
}
