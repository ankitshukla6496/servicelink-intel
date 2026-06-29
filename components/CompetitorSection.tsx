'use client'

import { useState } from 'react'
import { CompetitorNews } from '@/lib/types'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return 'Just now'
}

const COLORS = [
  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
]

export default function CompetitorSection({ competitors }: { competitors: CompetitorNews[] }) {
  const [selected, setSelected] = useState<string>(competitors[0]?.competitor ?? '')
  const active = competitors.find((c) => c.competitor === selected)

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 space-y-1.5">
        <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3 px-1">Companies</p>
        {competitors.map((c, i) => {
          const colorClass = COLORS[i % COLORS.length]
          const isActive = selected === c.competitor
          return (
            <button
              key={c.competitor}
              onClick={() => setSelected(c.competitor)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <span className="font-medium truncate">{c.competitor}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full border flex-shrink-0 ml-2 ${colorClass}`}>
                {c.articles.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Articles */}
      <div className="flex-1 space-y-3">
        {active?.articles.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">
            No recent news found for {active.competitor}
          </div>
        )}
        {active?.articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 hover:border-white/20 transition-all block"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs font-medium text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                {article.source}
              </span>
              <span className="text-xs text-white/30 flex-shrink-0">{timeAgo(article.publishedAt)}</span>
            </div>
            <h3 className="font-semibold text-white/90 group-hover:text-white text-sm leading-snug mb-2 transition-colors">
              {article.title}
            </h3>
            <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{article.summary}...</p>
            <div className="mt-3 text-xs text-blue-400/60 group-hover:text-blue-400 transition-colors font-medium">
              Read article →
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
