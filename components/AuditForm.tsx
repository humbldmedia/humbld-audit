'use client'

import { useState } from 'react'

export type CreatorType = 'artist' | 'creator' | 'business' | 'starting'

export interface AuditFormData {
  creatorType: CreatorType
  handle: string
  hasAccount: boolean
  description: string
  niche: string
}

interface AuditFormProps {
  onSubmit: (data: AuditFormData) => void
  loading: boolean
}

const CREATOR_TYPES = [
  {
    id: 'artist' as CreatorType,
    label: 'Artist',
    icon: '🎨',
    desc: 'Musician, visual artist, filmmaker, performer',
  },
  {
    id: 'creator' as CreatorType,
    label: 'Creator',
    icon: '✦',
    desc: 'Content creator, influencer, educator, coach',
  },
  {
    id: 'business' as CreatorType,
    label: 'Business',
    icon: '◈',
    desc: 'Brand, studio, agency, or company',
  },
  {
    id: 'starting' as CreatorType,
    label: 'Just Starting',
    icon: '◎',
    desc: 'No account yet — building your foundation',
  },
]

const NICHE_OPTIONS = [
  'Music', 'Film / Video', 'Visual Art', 'Photography', 'Fashion',
  'Beauty', 'Fitness / Wellness', 'Food', 'Travel', 'Spirituality / Faith',
  'Business / Entrepreneurship', 'Education', 'Comedy / Entertainment', 'Lifestyle', 'Other',
]

export default function AuditForm({ onSubmit, loading }: AuditFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [creatorType, setCreatorType] = useState<CreatorType | null>(null)
  const [hasAccount, setHasAccount] = useState(true)
  const [handle, setHandle]           = useState('')
  const [description, setDescription] = useState('')
  const [niche, setNiche]             = useState('')

  const canProceedStep1 = creatorType !== null
  const canSubmit = creatorType !== null && (
    hasAccount ? handle.trim().length > 0 : description.trim().length > 0
  )

  function handleStep1Next() {
    if (canProceedStep1) setStep(2)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !creatorType) return
    onSubmit({ creatorType, handle: handle.replace('@', '').trim(), hasAccount, description, niche })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      {step === 1 && (
        <div className="animate-[slideUp_0.4s_ease_forwards]">
          <p className="text-sm tracking-widest uppercase text-[#fdb661] mb-3 font-semibold">
            Step 1 of 2
          </p>
          <h2 className="text-2xl font-bold text-[#fffdfb] mb-2">
            What best describes you?
          </h2>
          <p className="text-[rgba(255,253,251,0.55)] mb-8 text-sm">
            This helps us calibrate your audit against the right benchmarks.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {CREATOR_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setCreatorType(type.id)}
                className={`
                  relative p-4 rounded-xl border text-left transition-all duration-200
                  ${creatorType === type.id
                    ? 'border-[#fc532e] bg-[rgba(252,83,46,0.08)] shadow-[0_0_20px_rgba(252,83,46,0.15)]'
                    : 'border-[rgba(255,253,251,0.10)] bg-[#181f1e] hover:border-[rgba(255,253,251,0.25)] hover:bg-[#1e2826]'
                  }
                `}
              >
                <span className="block text-2xl mb-2">{type.icon}</span>
                <span className="block font-bold text-[#fffdfb] text-sm mb-1">{type.label}</span>
                <span className="block text-[rgba(255,253,251,0.45)] text-xs leading-snug">{type.desc}</span>
                {creatorType === type.id && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#fc532e] flex items-center justify-center">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleStep1Next}
            disabled={!canProceedStep1}
            className={`
              w-full py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200
              ${canProceedStep1
                ? 'bg-[#fc532e] text-[#fffdfb] hover:bg-[#e8441f] shadow-[0_4px_20px_rgba(252,83,46,0.3)]'
                : 'bg-[#1e2826] text-[rgba(255,253,251,0.25)] cursor-not-allowed'
              }
            `}
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-[slideUp_0.4s_ease_forwards]">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-[rgba(255,253,251,0.45)] text-sm mb-6 hover:text-[rgba(255,253,251,0.7)] transition-colors"
          >
            ← Back
          </button>

          <p className="text-sm tracking-widest uppercase text-[#fdb661] mb-3 font-semibold">
            Step 2 of 2
          </p>
          <h2 className="text-2xl font-bold text-[#fffdfb] mb-2">
            Your Instagram presence
          </h2>
          <p className="text-[rgba(255,253,251,0.55)] mb-8 text-sm">
            Share what you've got — even if it's nothing yet.
          </p>

          {/* Account toggle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setHasAccount(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                hasAccount
                  ? 'border-[#3e8db4] bg-[rgba(62,141,180,0.10)] text-[#3e8db4]'
                  : 'border-[rgba(255,253,251,0.10)] text-[rgba(255,253,251,0.45)] hover:border-[rgba(255,253,251,0.25)]'
              }`}
            >
              I have an account
            </button>
            <button
              type="button"
              onClick={() => setHasAccount(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                !hasAccount
                  ? 'border-[#3e8db4] bg-[rgba(62,141,180,0.10)] text-[#3e8db4]'
                  : 'border-[rgba(255,253,251,0.10)] text-[rgba(255,253,251,0.45)] hover:border-[rgba(255,253,251,0.25)]'
              }`}
            >
              No account yet
            </button>
          </div>

          {hasAccount ? (
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[rgba(255,253,251,0.45)] mb-2">
                Instagram Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,253,251,0.35)] font-semibold">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="yourhandle"
                  className="w-full bg-[#181f1e] border border-[rgba(255,253,251,0.10)] rounded-xl pl-8 pr-4 py-3.5 text-[#fffdfb] placeholder:text-[rgba(255,253,251,0.25)] focus:outline-none focus:border-[#fc532e] transition-colors text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[rgba(255,253,251,0.45)] mb-2">
                Tell us about what you do
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. I'm a gospel musician releasing my first EP this summer. I want to build a faith-based audience before I launch."
                rows={4}
                className="w-full bg-[#181f1e] border border-[rgba(255,253,251,0.10)] rounded-xl px-4 py-3.5 text-[#fffdfb] placeholder:text-[rgba(255,253,251,0.25)] focus:outline-none focus:border-[#fc532e] transition-colors text-sm resize-none"
              />
            </div>
          )}

          {/* Niche selector */}
          <div className="mb-8">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[rgba(255,253,251,0.45)] mb-2">
              Your Niche <span className="text-[rgba(255,253,251,0.25)] normal-case tracking-normal">(optional — helps us get precise)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {NICHE_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiche(niche === n ? '' : n)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    niche === n
                      ? 'border-[#fdb661] bg-[rgba(253,182,97,0.12)] text-[#fdb661]'
                      : 'border-[rgba(255,253,251,0.10)] text-[rgba(255,253,251,0.45)] hover:border-[rgba(255,253,251,0.25)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`
              w-full py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-3
              ${canSubmit && !loading
                ? 'bg-[#fc532e] text-[#fffdfb] hover:bg-[#e8441f] shadow-[0_4px_20px_rgba(252,83,46,0.3)]'
                : 'bg-[#1e2826] text-[rgba(255,253,251,0.25)] cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <>
                <span className="dot-1 w-2 h-2 rounded-full bg-current inline-block" />
                <span className="dot-2 w-2 h-2 rounded-full bg-current inline-block" />
                <span className="dot-3 w-2 h-2 rounded-full bg-current inline-block" />
              </>
            ) : (
              'Generate My Audit →'
            )}
          </button>

          <p className="text-center text-xs text-[rgba(255,253,251,0.25)] mt-4">
            Powered by AI · Your data is never stored or sold
          </p>
        </div>
      )}
    </form>
  )
}
