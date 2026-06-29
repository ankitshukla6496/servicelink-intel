'use client'

import { useState } from 'react'
import { ValuationData } from '@/lib/types'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return 'Just now'
}

const IDEA_CONFIG = {
  opportunity: { icon: '🚀', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  threat:      { icon: '⚠️', color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
  strategy:    { icon: '🎯', color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  innovation:  { icon: '💡', color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
}

const COMPETITOR_COLORS = [
  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
]

type SubTab = 'news' | 'competitors' | 'ideas'

export default function ValuationsSection({ data }: { data: ValuationData }) {
  const [subTab, setSubTab] = useState<SubTab>('news')
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>(
    data.competitorMoves[0]?.competitor ?? ''
  )

  const activeCompetitor = data.competitorMoves.find((c) => c.competitor === selectedCompetitor)

  const grouped = data.ideas.reduce((acc, idea) => {
    if (!acc[idea.category]) acc[idea.category] = []
    acc[idea.category].push(idea)
    return acc
  }, {} as Record<string, typeof data.ideas>)

  const SUB_TABS: { id: SubTab; label: string; count: number }[] = [
    { id: 'news', label: 'Valuation News', count: data.news.length },
    { id: 'competitors', label: 'Competitor Moves', count: data.competitorMoves.length },
    { id: 'ideas', label: 'Valuation Ideas', count: data.ideas.length },
  ]

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              subTab === t.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              subTab === t.id ? 'bg-amber-500/20 text-amber-200' : 'bg-white/10 text-white/30'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Valuation News */}
      {subTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.news.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all block"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  {article.source}
                </span>
                <span className="text-xs text-white/30 flex-shrink-0">{timeAgo(article.publishedAt)}</span>
              </div>
              <h3 className="font-semibold text-white/90 group-hover:text-white text-sm leading-snug mb-2 transition-colors">
                {article.title}
              </h3>
              <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{article.summary}...</p>
              <div className="mt-3 text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors font-medium">
                Read article →
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Competitor Valuation Moves */}
      {subTab === 'competitors' && (
        <div className="flex gap-6">
          <div className="w-52 flex-shrink-0 space-y-1.5">
            <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3 px-1">Companies</p>
            {data.competitorMoves.map((c, i) => (
              <button
                key={c.competitor}
                onClick={() => setSelectedCompetitor(c.competitor)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                  selectedCompetitor === c.competitor
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="font-medium truncate">{c.competitor}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border flex-shrink-0 ml-2 ${COMPETITOR_COLORS[i % COMPETITOR_COLORS.length]}`}>
                  {c.articles.length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-3">
            {activeCompetitor?.articles.length === 0 && (
              <div className="text-center py-12 text-white/30 text-sm">
                No valuation news found for {activeCompetitor.competitor} this week
              </div>
            )}
            {activeCompetitor?.articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all block"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-medium text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                    {article.source}
                  </span>
                  <span className="text-xs text-white/30 flex-shrink-0">{timeAgo(article.publishedAt)}</span>
                </div>
                <h3 className="font-semibold text-white/90 group-hover:text-white text-sm leading-snug mb-2">
                  {article.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{article.summary}...</p>
                <div className="mt-3 text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors font-medium">
                  Read article →
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Valuation Ideas */}
      {subTab === 'ideas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(Object.keys(IDEA_CONFIG) as Array<keyof typeof IDEA_CONFIG>).map((category) => {
            const config = IDEA_CONFIG[category]
            const ideas = grouped[category] ?? []
            if (ideas.length === 0) return null
            return (
              <div key={category} className={`border rounded-xl p-5 ${config.bg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{config.icon}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
                    {category}
                  </span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/40">
                    {ideas.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {ideas.map((idea, i) => (
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
      )}
    </div>
  )
}
