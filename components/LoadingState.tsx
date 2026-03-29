'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  { text: 'Reading your profile as a first-time visitor...', icon: '◉' },
  { text: 'Analyzing what stops a scroll in your niche...', icon: '◈' },
  { text: 'Benchmarking your public presence...', icon: '◎' },
  { text: 'Evaluating what brands and collabs would see...', icon: '◉' },
  { text: 'Mapping the gaps only an outsider can find...', icon: '◈' },
  { text: 'Identifying algorithm signals in your content...', icon: '◎' },
  { text: 'Building your outside-in brand report...', icon: '✦' },
]

interface LoadingStateProps {
  handle?: string
  creatorType?: string
}

export default function LoadingState({ handle, creatorType }: LoadingStateProps) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i < MESSAGES.length - 1 ? i + 1 : i))
    }, 2200)

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p
        // Slow down as we approach the end
        const increment = p < 60 ? 3 : p < 80 ? 1.5 : 0.5
        return Math.min(p + increment, 92)
      })
    }, 150)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto text-center animate-[slideUp_0.4s_ease_forwards]">
      {/* Animated logo mark */}
      <div className="relative w-24 h-24 mx-auto mb-10">
        {/* Outer ring */}
        <svg className="absolute inset-0 animate-spin-slow" viewBox="0 0 96 96" fill="none">
          <circle
            cx="48" cy="48" r="44"
            stroke="rgba(253,182,97,0.15)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="44" stroke="rgba(255,253,251,0.06)" strokeWidth="2" />
          <circle
            cx="48" cy="48" r="44"
            stroke="#fc532e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        {/* Inner glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#181f1e] border border-[rgba(252,83,46,0.2)] flex items-center justify-center shadow-[0_0_30px_rgba(252,83,46,0.15)]">
            <span className="text-[#fc532e] text-xl font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Handle or context */}
      {handle && (
        <p className="text-[rgba(255,253,251,0.35)] text-sm mb-2 font-medium">
          @{handle}
        </p>
      )}
      {!handle && creatorType && (
        <p className="text-[rgba(255,253,251,0.35)] text-sm mb-2 font-medium capitalize">
          {creatorType} profile
        </p>
      )}

      {/* Current message */}
      <div className="h-7 mb-8 overflow-hidden relative">
        {MESSAGES.map((msg, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{
              opacity: i === msgIndex ? 1 : 0,
              transform: i === msgIndex ? 'translateY(0)' : i < msgIndex ? 'translateY(-100%)' : 'translateY(100%)',
            }}
          >
            <span className="text-[#fdb661] mr-2 text-sm">{msg.icon}</span>
            <span className="text-[rgba(255,253,251,0.7)] text-sm font-medium">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[rgba(255,253,251,0.06)] rounded-full h-1 mb-10">
        <div
          className="h-1 rounded-full bg-gradient-to-r from-[#fc532e] to-[#fdb661] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps checklist */}
      <div className="space-y-3">
        {MESSAGES.slice(0, -1).map((msg, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-left transition-all duration-300"
            style={{ opacity: i <= msgIndex ? 1 : 0.25 }}
          >
            <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
              i < msgIndex
                ? 'bg-[#fc532e]'
                : i === msgIndex
                ? 'border-2 border-[#fc532e] bg-transparent'
                : 'border border-[rgba(255,253,251,0.15)] bg-transparent'
            }`}>
              {i < msgIndex && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {i === msgIndex && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#fc532e] animate-pulse" />
              )}
            </div>
            <span className={`text-xs font-medium ${i < msgIndex ? 'text-[rgba(255,253,251,0.45)]' : i === msgIndex ? 'text-[#fffdfb]' : 'text-[rgba(255,253,251,0.25)]'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
