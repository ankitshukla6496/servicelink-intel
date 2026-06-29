'use client'

import { useEffect, useState } from 'react'

const AGENTS = [
  {
    id: 'news',
    name: 'News Agent',
    icon: '📰',
    color: 'blue',
    description: 'Scanning AMC & appraisal industry news from the last 7 days',
    detail: 'Querying 5 search topics across industry sources',
    delay: 0,
  },
  {
    id: 'competitor',
    name: 'Competitor Agent',
    icon: '🔭',
    color: 'purple',
    description: 'Monitoring 6 rival companies for moves and announcements',
    detail: 'Class Valuation · Clear Capital · Solidifi · CoreLogic · Reggora · NAN',
    delay: 400,
  },
  {
    id: 'valuation',
    name: 'Valuation Agent',
    icon: '🏡',
    color: 'amber',
    description: 'Scanning AVM, hybrid appraisals, and valuation tech trends',
    detail: 'Querying GSE waivers, desktop appraisals, AVM accuracy',
    delay: 800,
  },
  {
    id: 'ideas',
    name: 'Ideas Agent',
    icon: '💡',
    color: 'emerald',
    description: 'Synthesizing all intelligence with Claude to generate strategic ideas',
    detail: 'Powered by claude-sonnet-4-6 · Opportunities · Threats · Strategy · Innovation',
    delay: 1200,
  },
]

const COLOR_MAP: Record<string, { ring: string; bg: string; text: string; pulse: string; line: string }> = {
  blue:    { ring: 'border-blue-500/60',   bg: 'bg-blue-500/10',   text: 'text-blue-400',   pulse: 'bg-blue-500',   line: 'bg-blue-500/40' },
  purple:  { ring: 'border-purple-500/60', bg: 'bg-purple-500/10', text: 'text-purple-400', pulse: 'bg-purple-500', line: 'bg-purple-500/40' },
  amber:   { ring: 'border-amber-500/60',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  pulse: 'bg-amber-500',  line: 'bg-amber-500/40' },
  emerald: { ring: 'border-emerald-500/60',bg: 'bg-emerald-500/10',text: 'text-emerald-400',pulse: 'bg-emerald-500',line: 'bg-emerald-500/40' },
}

export default function AgentPipeline() {
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set())
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    AGENTS.forEach((agent) => {
      const t = setTimeout(() => {
        setActiveAgents((prev) => new Set([...prev, agent.id]))
        setStep((s) => s + 1)
      }, agent.delay)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <p className="text-white/50 text-sm mb-12 tracking-wide uppercase text-xs font-medium">Intelligence pipeline running</p>

      {/* Agent nodes */}
      <div className="flex items-start gap-0 w-full max-w-4xl">
        {AGENTS.map((agent, i) => {
          const c = COLOR_MAP[agent.color]
          const isActive = activeAgents.has(agent.id)
          const isLast = i === AGENTS.length - 1
          const isIdeas = agent.id === 'ideas'

          return (
            <div key={agent.id} className="flex items-start flex-1 min-w-0">
              {/* Node + card */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                {/* Circle node */}
                <div className={`relative w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                  isActive ? `${c.ring} ${c.bg} shadow-lg` : 'border-white/10 bg-white/5'
                }`}>
                  <span className={`text-2xl transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-30'}`}>
                    {agent.icon}
                  </span>
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${c.pulse} animate-ping`} />
                  )}
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${c.pulse}`} />
                  )}
                </div>

                {/* Label */}
                <p className={`mt-3 text-xs font-semibold text-center transition-colors duration-300 ${isActive ? c.text : 'text-white/20'}`}>
                  {agent.name}
                </p>

                {/* Description card */}
                <div className={`mt-3 rounded-xl p-3 w-full border transition-all duration-500 ${
                  isActive ? `${c.bg} ${c.ring}` : 'bg-white/3 border-white/5'
                }`}>
                  <p className={`text-xs leading-relaxed transition-colors duration-300 ${isActive ? 'text-white/70' : 'text-white/20'}`}>
                    {agent.description}
                  </p>
                  <p className={`text-xs mt-1.5 leading-relaxed transition-colors duration-300 ${isActive ? 'text-white/35' : 'text-white/10'}`}>
                    {agent.detail}
                  </p>
                </div>

                {/* "feeds into" label for ideas agent */}
                {isIdeas && isActive && (
                  <div className="mt-3 text-xs text-white/30 text-center">
                    ↑ consumes output from all 3 agents
                  </div>
                )}
              </div>

              {/* Arrow connector */}
              {!isLast && (
                <div className="flex items-start pt-7 px-1 flex-shrink-0">
                  <div className={`flex items-center gap-0.5 transition-all duration-500 ${
                    activeAgents.has(AGENTS[i + 1]?.id) ? 'opacity-100' : 'opacity-20'
                  }`}>
                    <div className={`w-6 h-0.5 ${c.line}`} />
                    <svg className={`w-3 h-3 ${activeAgents.has(AGENTS[i + 1]?.id) ? c.text : 'text-white/20'}`} viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 0l6 6-6 6V8H0V4h6z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Status line */}
      <div className="mt-10 flex items-center gap-2 text-sm text-white/40">
        <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {step < AGENTS.length
          ? `Starting ${AGENTS[step]?.name ?? 'agents'}...`
          : 'All agents running · Fetching results...'}
      </div>
    </div>
  )
}
