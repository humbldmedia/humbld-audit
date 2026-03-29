'use client'

import { useEffect, useState } from 'react'
import type { AuditReport } from '@/lib/types'

// Minimal print-specific render — clean white document
export default function PrintPage() {
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('humbld-print-report')
      if (!raw) { setError('No report found. Please generate a report first.'); return }
      setReport(JSON.parse(raw))
    } catch {
      setError('Could not load report data.')
    }
  }, [])

  useEffect(() => {
    if (!report) return
    // Update document title with handle for clean print header
    document.title = `Brand Audit — ${report.meta.displayHandle} | humbld`
    // Auto-print after styles load
    const t = setTimeout(() => window.print(), 600)
    return () => clearTimeout(t)
  }, [report])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Preparing your report...</p>
      </div>
    )
  }

  const { meta, overview, quickStats = [], audienceInsights, algorithmIntelligence, contentBuckets = [], actionPlan = [], sections = [], hiddenInsights = [], verdict, nextStep } = report

  // Group action plan by week
  const weeks: Record<number, typeof actionPlan> = { 1: [], 2: [], 3: [], 4: [] }
  actionPlan.forEach(item => {
    const w = item.week ?? 1
    if (weeks[w]) weeks[w].push(item)
  })

  const scoreColor = (s: number) => s >= 70 ? '#2d6f8f' : s >= 50 ? '#c98c00' : '#fc532e'

  return (
    <div className="print-doc bg-white min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Quicksand', system-ui, sans-serif; background: white; color: #282e2d; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { margin: 18mm 16mm; size: A4; }
        @media print { .no-print { display: none !important; } }
        .print-doc { max-width: 760px; margin: 0 auto; padding: 32px 24px; }
        h1 { font-size: 28px; font-weight: 700; color: #282e2d; }
        h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #9a9591; }
        h3 { font-size: 13px; font-weight: 700; color: #282e2d; }
        p  { font-size: 12px; line-height: 1.6; color: #5a5550; }
        .label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #b0aaa4; }
        .section-break { page-break-before: always; break-before: always; }
        .avoid-break { page-break-inside: avoid; break-inside: avoid; }
        .card { border: 1px solid #e8e2d8; border-radius: 10px; padding: 16px; margin-bottom: 10px; }
        .tag { display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 8px; border-radius: 99px; border: 1px solid; }
      `}</style>

      {/* ── Brand Header ── */}
      <div style={{ borderBottom: '2px solid #fc532e', paddingBottom: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fc532e' }}>
            humbld · Brand Audit Report
          </span>
          <span style={{ fontSize: '9px', color: '#b0aaa4' }}>{meta.generatedAt}</span>
        </div>
      </div>

      {/* ── Title + Score ── */}
      <div className="avoid-break" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '6px' }}>{meta.displayHandle}</h1>
          <p style={{ fontSize: '11px', color: '#9a9591', marginBottom: '8px' }}>
            {meta.creatorType}{meta.niche && meta.niche !== 'General' ? ` · ${meta.niche}` : ''}
          </p>
          <span
            className="tag"
            style={{ color: '#fc532e', borderColor: 'rgba(252,83,46,0.3)', background: 'rgba(252,83,46,0.05)' }}
          >
            {overview.tier}
          </span>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '36px', fontWeight: 700, color: scoreColor(overview.overallScore), lineHeight: 1 }}>
            {overview.overallScore}
          </div>
          <div style={{ fontSize: '9px', color: '#b0aaa4', marginTop: '2px' }}>Overall Score</div>
        </div>
      </div>

      <div className="card avoid-break" style={{ marginBottom: '24px' }}>
        <p className="label" style={{ marginBottom: '6px' }}>Executive Summary</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#282e2d', lineHeight: 1.5 }}>{overview.headline}</p>
        <p style={{ marginTop: '6px' }}>{overview.oneLineSummary}</p>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }} className="avoid-break">
        {quickStats.map((stat, i) => (
          <div key={i} className="card" style={{ marginBottom: 0 }}>
            <p className="label" style={{ marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#282e2d', lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: '10px', color: '#b0aaa4', marginTop: '2px' }}>Benchmark: {stat.benchmark}</p>
          </div>
        ))}
      </div>

      {/* ── Audience Snapshot ── */}
      {audienceInsights && (
        <div className="card avoid-break" style={{ marginBottom: '24px' }}>
          <p className="label" style={{ marginBottom: '12px' }}>Audience Snapshot <span style={{ color: '#c98c00' }}>· AI Estimated</span></p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <p className="label" style={{ marginBottom: '3px' }}>Tier</p>
              <p style={{ fontWeight: 600, color: '#282e2d', fontSize: '12px' }}>{audienceInsights.followerTier}</p>
            </div>
            <div>
              <p className="label" style={{ marginBottom: '3px' }}>Est. Reach</p>
              <p style={{ fontWeight: 600, color: '#c98c00', fontSize: '12px' }}>{audienceInsights.estimatedReach}</p>
            </div>
            <div>
              <p className="label" style={{ marginBottom: '3px' }}>Eng. Rate</p>
              <p style={{ fontWeight: 600, color: '#2d6f8f', fontSize: '12px' }}>{audienceInsights.engagementRate}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
            <div>
              <p className="label" style={{ marginBottom: '3px' }}>Age Range</p>
              <p style={{ fontSize: '11px' }}>{audienceInsights.ageRange}</p>
            </div>
            <div>
              <p className="label" style={{ marginBottom: '3px' }}>Gender Split</p>
              <p style={{ fontSize: '11px' }}>{audienceInsights.genderSplit}</p>
            </div>
          </div>
          <div>
            <p className="label" style={{ marginBottom: '3px' }}>Top Locations</p>
            <p style={{ fontSize: '11px' }}>{(audienceInsights.topLocations ?? []).join(' · ')}</p>
          </div>
          <div style={{ background: '#faf8f4', borderRadius: '6px', padding: '10px', marginTop: '10px' }}>
            <p style={{ fontSize: '11px', fontStyle: 'italic' }}>{audienceInsights.audiencePersona}</p>
          </div>
        </div>
      )}

      {/* ── Content Buckets ── */}
      {contentBuckets.length > 0 && (
        <div className="section-break">
          <h2 style={{ marginBottom: '14px' }}>Your Content System — 5 Buckets</h2>
          {contentBuckets.slice(0, 5).map((bucket, i) => (
            <div key={i} className="card avoid-break">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#282e2d' }}>{i + 1}. {bucket.name}</span>
                  <span style={{ marginLeft: '8px', fontSize: '10px', color: '#9a9591' }}>{bucket.frequency}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fc532e' }}>{bucket.percentage ?? '—'}%</span>
              </div>
              <p style={{ marginBottom: '6px' }}>{bucket.description}</p>
              <p style={{ fontSize: '10px', color: '#b0aaa4' }}>
                Formats: {(bucket.formats ?? []).join(', ')}
              </p>
              {(bucket.exampleIdeas ?? []).length > 0 && (
                <ul style={{ marginTop: '8px', paddingLeft: '12px' }}>
                  {bucket.exampleIdeas.map((idea, ii) => (
                    <li key={ii} style={{ fontSize: '11px', color: '#5a5550', marginBottom: '3px', listStyle: 'disc' }}>{idea}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Algorithm Intelligence ── */}
      {algorithmIntelligence && (
        <div className="section-break">
          <h2 style={{ marginBottom: '14px' }}>Algorithm Intelligence — Score: {algorithmIntelligence.score}/100</h2>
          <div className="card avoid-break" style={{ marginBottom: '12px' }}>
            <h3 style={{ marginBottom: '6px' }}>{algorithmIntelligence.headline}</h3>
            <p>{algorithmIntelligence.summary}</p>
          </div>
          {algorithmIntelligence.suppressionSignals?.length > 0 && (
            <div className="card avoid-break" style={{ marginBottom: '12px' }}>
              <p className="label" style={{ color: '#fc532e', marginBottom: '8px' }}>Suppression Signals</p>
              {algorithmIntelligence.suppressionSignals.map((sig, i) => (
                <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: i < algorithmIntelligence.suppressionSignals.length - 1 ? '1px solid #f0ebe4' : 'none' }}>
                  <p style={{ fontWeight: 600, fontSize: '12px', color: '#282e2d', marginBottom: '2px' }}>{sig.signal} <span className="tag" style={{ color: '#fc532e', borderColor: 'rgba(252,83,46,0.3)' }}>{sig.impact}</span></p>
                  <p style={{ fontSize: '11px' }}>Fix: {sig.fix}</p>
                </div>
              ))}
            </div>
          )}
          <div className="card avoid-break">
            <p className="label" style={{ marginBottom: '6px' }}>Weekly System</p>
            <p>{algorithmIntelligence.weeklySystem}</p>
          </div>
        </div>
      )}

      {/* ── 30-Day Roadmap ── */}
      {actionPlan.length > 0 && (
        <div className="section-break">
          <h2 style={{ marginBottom: '14px' }}>30-Day Growth Roadmap</h2>
          {[1, 2, 3, 4].map(w => {
            const items = weeks[w]
            if (!items || items.length === 0) return null
            return (
              <div key={w} className="card avoid-break">
                <p className="label" style={{ color: w <= 2 ? '#fc532e' : '#2d6f8f', marginBottom: '8px' }}>Week {w}</p>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                    <p style={{ flex: 1, fontSize: '12px' }}>{item.task}</p>
                    <span className="tag" style={{
                      color: item.impact === 'High' ? '#fc532e' : item.impact === 'Medium' ? '#c98c00' : '#2d6f8f',
                      borderColor: item.impact === 'High' ? 'rgba(252,83,46,0.3)' : item.impact === 'Medium' ? 'rgba(201,140,0,0.3)' : 'rgba(45,111,143,0.3)',
                      flexShrink: 0
                    }}>
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Deep Analysis ── */}
      {sections.length > 0 && (
        <div className="section-break">
          <h2 style={{ marginBottom: '14px' }}>Deep Analysis</h2>
          {sections.map((section, i) => (
            <div key={i} className="card avoid-break">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3>{section.title}</h3>
                <span style={{ fontSize: '16px', fontWeight: 700, color: scoreColor(section.score) }}>{section.score}</span>
              </div>
              <p style={{ marginBottom: '8px' }}>{section.summary}</p>
              {section.strengths?.length > 0 && (
                <div style={{ marginBottom: '6px' }}>
                  <p className="label" style={{ color: '#2d6f8f', marginBottom: '4px' }}>What&apos;s Working</p>
                  {section.strengths.map((s, si) => <p key={si} style={{ fontSize: '11px', paddingLeft: '8px' }}>✓ {s}</p>)}
                </div>
              )}
              {section.gaps?.length > 0 && (
                <div style={{ marginBottom: '6px' }}>
                  <p className="label" style={{ color: '#c98c00', marginBottom: '4px' }}>Gaps &amp; Risks</p>
                  {section.gaps.map((g, gi) => <p key={gi} style={{ fontSize: '11px', paddingLeft: '8px' }}>◈ {g}</p>)}
                </div>
              )}
              {section.recommendations?.length > 0 && (
                <div>
                  <p className="label" style={{ color: '#fc532e', marginBottom: '4px' }}>Recommendations</p>
                  {section.recommendations.map((r, ri) => <p key={ri} style={{ fontSize: '11px', paddingLeft: '8px' }}>→ {r}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Hidden Insights ── */}
      {hiddenInsights.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '14px' }}>Hidden Insights — What Instagram Won&apos;t Tell You</h2>
          {hiddenInsights.map((insight, i) => (
            <div key={i} className="card avoid-break">
              <h3 style={{ marginBottom: '4px' }}>✦ {insight.title}</h3>
              <p style={{ marginBottom: '6px' }}>{insight.insight}</p>
              <p style={{ fontSize: '11px', fontStyle: 'italic', marginBottom: '4px', color: '#9a9591' }}>Why it matters: {insight.why}</p>
              <p style={{ fontSize: '11px' }}>→ {insight.action}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Verdict ── */}
      <div className="card avoid-break" style={{ marginTop: '24px', borderColor: 'rgba(252,83,46,0.25)', background: 'rgba(252,83,46,0.02)' }}>
        <p className="label" style={{ color: '#fc532e', marginBottom: '8px' }}>Final Verdict</p>
        <p style={{ fontSize: '13px', lineHeight: 1.7 }}>{verdict}</p>
        <div style={{ borderTop: '1px solid #f0ebe4', marginTop: '10px', paddingTop: '10px' }}>
          <p className="label" style={{ marginBottom: '4px' }}>Recommended Next Step</p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#282e2d' }}>{nextStep}</p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: '32px', paddingTop: '12px', borderTop: '1px solid #e8e2d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '9px', color: '#b0aaa4' }}>Generated by humbld.media · AI-Powered Brand Intelligence</p>
        <p style={{ fontSize: '9px', color: '#b0aaa4' }}>Book a Strategy Call: humbld.media/book</p>
      </div>

      {/* No-print button for if they close the dialog */}
      <div className="no-print" style={{ position: 'fixed', bottom: '24px', right: '24px' }}>
        <button
          onClick={() => window.print()}
          style={{ background: '#fc532e', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  )
}
