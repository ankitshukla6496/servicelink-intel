'use client'

import { Idea } from '@/lib/types'

const CATEGORY_CONFIG = {
  opportunity: { label: 'Opportunity', color: 'bg-green-100 text-green-800 border-green-200', icon: '🚀' },
  threat: { label: 'Threat', color: 'bg-red-100 text-red-800 border-red-200', icon: '⚠️' },
  strategy: { label: 'Strategy', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🎯' },
  innovation: { label: 'Innovation', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '💡' },
}

export default function IdeasSection({ ideas }: { ideas: Idea[] }) {
  const grouped = ideas.reduce((acc, idea) => {
    if (!acc[idea.category]) acc[idea.category] = []
    acc[idea.category].push(idea)
    return acc
  }, {} as Record<string, Idea[]>)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(Object.keys(CATEGORY_CONFIG) as Idea['category'][]).map((category) => {
        const config = CATEGORY_CONFIG[category]
        const categoryIdeas = grouped[category] ?? []
        if (categoryIdeas.length === 0) return null

        return (
          <div key={category} className={`border rounded-lg p-4 ${config.color}`}>
            <h3 className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>{config.icon}</span>
              {config.label}
            </h3>
            <div className="space-y-3">
              {categoryIdeas.map((idea, i) => (
                <div key={i} className="bg-white bg-opacity-70 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{idea.title}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
