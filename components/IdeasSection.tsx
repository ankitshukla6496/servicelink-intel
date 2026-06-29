'use client'

import { Idea } from '@/lib/types'

const CATEGORY_CONFIG = {
  opportunity: {
    label: 'Opportunity',
    icon: '🚀',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  threat: {
    label: 'Threat',
    icon: '⚠️',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    pill: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  strategy: {
    label: 'Strategy',
    icon: '🎯',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    pill: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  innovation: {
    label: 'Innovation',
    icon: '💡',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
}

export default function IdeasSection({ ideas }: { ideas: Idea[] }) {
  const grouped = ideas.reduce((acc, idea) => {
    if (!acc[idea.category]) acc[idea.category] = []
    acc[idea.category].push(idea)
    return acc
  }, {} as Record<string, Idea[]>)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {(Object.keys(CATEGORY_CONFIG) as Idea['category'][]).map((category) => {
        const config = CATEGORY_CONFIG[category]
        const categoryIdeas = grouped[category] ?? []
        if (categoryIdeas.length === 0) return null

        return (
          <div key={category} className={`border rounded-xl p-5 ${config.bg}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{config.icon}</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
                {config.label}
              </span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${config.pill}`}>
                {categoryIdeas.length}
              </span>
            </div>
            <div className="space-y-3">
              {categoryIdeas.map((idea, i) => (
                <div key={i} className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <h4 className="font-semibold text-white text-sm mb-1.5">{idea.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
