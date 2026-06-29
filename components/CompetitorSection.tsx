'use client'

import { useState } from 'react'
import { CompetitorNews } from '@/lib/types'

const COMPETITOR_COLORS: Record<string, string> = {
  'Class Valuation': 'bg-purple-100 text-purple-800',
  'Clear Capital': 'bg-blue-100 text-blue-800',
  'Solidifi': 'bg-green-100 text-green-800',
  'CoreLogic': 'bg-orange-100 text-orange-800',
  'Reggora': 'bg-pink-100 text-pink-800',
  'Nationwide Appraisal Network': 'bg-yellow-100 text-yellow-800',
}

export default function CompetitorSection({ competitors }: { competitors: CompetitorNews[] }) {
  const [selected, setSelected] = useState<string>(competitors[0]?.competitor ?? '')

  const active = competitors.find((c) => c.competitor === selected)

  return (
    <div className="flex gap-6 h-full">
      <div className="w-56 flex-shrink-0 space-y-2">
        {competitors.map((c) => (
          <button
            key={c.competitor}
            onClick={() => setSelected(c.competitor)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selected === c.competitor
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c.competitor}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              selected === c.competitor ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {c.articles.length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3">
        {active?.articles.map((article, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-1">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug">
                  {article.title}
                </h3>
              </a>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${COMPETITOR_COLORS[active.competitor] ?? 'bg-gray-100 text-gray-600'}`}>
                {active.competitor}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">{article.summary}...</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">{article.source}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-blue-500 hover:text-blue-700 font-medium">
                Read →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
