'use client'

import { useEffect, useState } from 'react'

export default function AgentPipeline() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 0),     // news + competitor appear
      setTimeout(() => setStep(2), 600),   // arrows animate
      setTimeout(() => setStep(3), 1100),  // ideas appears
      setTimeout(() => setStep(4), 1600),  // valuation appears
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const show = (n: number) => step >= n

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-12">
        Intelligence pipeline running
      </p>

      <div className="w-full max-w-2xl">

        {/* ── Triangle: News + Competitor → Ideas ── */}
        <div className="relative">

          {/* Top row: News + Competitor */}
          <div className="flex justify-between gap-8 mb-2">
            {/* News Agent */}
            <AgentCard
              visible={show(1)}
              icon="📰"
              name="News Agent"
              color="blue"
              description="Scanning AMC & appraisal industry"
              detail="5 search queries · last 7 days"
            />

            {/* Competitor Agent */}
            <AgentCard
              visible={show(1)}
              icon="🔭"
              name="Competitor Agent"
              color="purple"
              description="Monitoring 6 rival companies"
              detail="Class Valuation · Clear Capital · Solidifi · CoreLogic · Reggora · NAN"
            />
          </div>

          {/* Converging arrows */}
          <div className={`relative h-12 transition-opacity duration-500 ${show(2) ? 'opacity-100' : 'opacity-0'}`}>
            {/* Left arrow */}
            <svg className="absolute left-[22%] top-0 w-32 h-12" viewBox="0 0 120 48" fill="none">
              <path d="M10 4 Q60 4 60 44" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
              <polygon points="55,40 60,48 65,40" fill="#3b82f6" opacity="0.7"/>
            </svg>
            {/* Right arrow */}
            <svg className="absolute right-[22%] top-0 w-32 h-12" viewBox="0 0 120 48" fill="none">
              <path d="M110 4 Q60 4 60 44" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
              <polygon points="55,40 60,48 65,40" fill="#a855f7" opacity="0.7"/>
            </svg>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs text-white/20 bg-[#0f1117] px-2 transition-opacity duration-300 ${show(2) ? 'opacity-100' : 'opacity-0'}`}>
                feeds into
              </span>
            </div>
          </div>

          {/* Ideas Agent — bottom center */}
          <div className="flex justify-center">
            <div className="w-64">
              <AgentCard
                visible={show(3)}
                icon="💡"
                name="Ideas Agent"
                color="emerald"
                description="Synthesizes both feeds into strategic insights"
                detail="Powered by claude-sonnet-4-6 · Opportunities · Threats · Strategy · Innovation"
                centered
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`my-8 flex items-center gap-3 transition-opacity duration-500 ${show(4) ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/20 uppercase tracking-widest">Standalone Module</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Valuation Agent — standalone */}
        <div className={`transition-all duration-500 ${show(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏡</span>
                <span className="absolute w-3 h-3 rounded-full bg-amber-500 animate-ping ml-8 -mt-8 opacity-60" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-amber-400">Valuation Agent</p>
                  <span className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/25 px-2 py-0.5 rounded-full">Self-contained</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Runs its own internal pipeline — valuation news, competitor valuation moves, and Claude-generated valuation ideas — completely independently.
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['Valuation News', 'Competitor Moves', 'Valuation Ideas'].map((tag) => (
                    <span key={tag} className="text-xs text-amber-400/60 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Status */}
      <div className="mt-10 flex items-center gap-2 text-sm text-white/30">
        <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {step < 4 ? 'Starting agents...' : 'All agents running · Fetching results...'}
      </div>
    </div>
  )
}

function AgentCard({
  visible, icon, name, color, description, detail, centered
}: {
  visible: boolean
  icon: string
  name: string
  color: 'blue' | 'purple' | 'emerald' | 'amber'
  description: string
  detail: string
  centered?: boolean
}) {
  const COLORS = {
    blue:    { ring: 'border-blue-500/40',   bg: 'bg-blue-500/10',   text: 'text-blue-400',   pulse: 'bg-blue-500' },
    purple:  { ring: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', pulse: 'bg-purple-500' },
    emerald: { ring: 'border-emerald-500/40',bg: 'bg-emerald-500/10',text: 'text-emerald-400',pulse: 'bg-emerald-500' },
    amber:   { ring: 'border-amber-500/40',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  pulse: 'bg-amber-500' },
  }
  const c = COLORS[color]

  return (
    <div className={`flex-1 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      <div className={`border rounded-xl p-4 ${c.ring} ${c.bg}`}>
        <div className={`flex ${centered ? 'flex-col items-center text-center' : 'items-start'} gap-3`}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xl">
              {icon}
            </div>
            {visible && (
              <>
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${c.pulse} animate-ping opacity-60`} />
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${c.pulse}`} />
              </>
            )}
          </div>
          <div>
            <p className={`text-sm font-semibold ${c.text}`}>{name}</p>
            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{description}</p>
            <p className="text-xs text-white/25 mt-1 leading-relaxed">{detail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
