'use client'

import { useState, useEffect } from 'react'
import NewsSection from '@/components/NewsSection'
import CompetitorSection from '@/components/CompetitorSection'
import IdeasSection from '@/components/IdeasSection'
import ValuationsSection from '@/components/ValuationsSection'
import AgentPipeline from '@/components/AgentPipeline'
import { IntelligenceData } from '@/lib/types'

type MainTab = 'mortgage' | 'valuations'
type SubTab = 'news' | 'competitors' | 'ideas'

export default function Home() {
  const [mainTab, setMainTab] = useState<MainTab>('mortgage')
  const [subTab, setSubTab] = useState<SubTab>('news')
  const [data, setData] = useState<IntelligenceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem('sl-intel-data')
    const cachedTime = localStorage.getItem('sl-intel-time')
    if (cached) {
      setData(JSON.parse(cached))
      setLastRefreshed(cachedTime ?? null)
    }
  }, [])

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/intelligence')
      if (!res.ok) throw new Error('Failed to fetch intelligence data')
      const json: IntelligenceData = await res.json()
      const timeStr = new Date().toLocaleTimeString()
      setData(json)
      setLastRefreshed(timeStr)
      localStorage.setItem('sl-intel-data', JSON.stringify(json))
      localStorage.setItem('sl-intel-time', timeStr)
    } catch {
      setError('Something went wrong. Check your API keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  const MORTGAGE_SUB_TABS = [
    { id: 'news' as SubTab,        label: 'Industry News',    count: data?.news.length },
    { id: 'competitors' as SubTab, label: 'Competitor Intel', count: data?.competitors.length },
    { id: 'ideas' as SubTab,       label: 'Strategic Ideas',  count: data?.ideas.length },
  ]

  const VALUATION_SUB_TABS = [
    { id: 'news' as SubTab,        label: 'Valuation News',   count: data?.valuations.news.length },
    { id: 'competitors' as SubTab, label: 'Competitor Moves', count: data?.valuations.competitorMoves.length },
    { id: 'ideas' as SubTab,       label: 'Valuation Ideas',  count: data?.valuations.ideas.length },
  ]

  const activeSubs = mainTab === 'mortgage' ? MORTGAGE_SUB_TABS : VALUATION_SUB_TABS

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex flex-col">

      {/* Header */}
      <header className="border-b border-white/8 bg-[#0a0c10]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <span className="text-white font-bold text-xs tracking-tight">SL</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-none tracking-tight">ServiceLink Intelligence Portal</h1>
              <p className="text-[11px] text-white/35 mt-0.5">AMC &amp; Appraisal Industry · Last 7 days</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {lastRefreshed && !loading && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Updated {lastRefreshed}
              </div>
            )}
            <div className="hidden sm:block text-[11px] text-white/25 border-r border-white/10 pr-5">
              Ankit Shukla
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>↻ Refresh Intelligence</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">


        {/* Empty state */}
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center mb-5">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Ready to gather intelligence</h2>
            <p className="text-white/35 mb-8 max-w-xs text-sm leading-relaxed">
              4 agents will run — scanning AMC news, monitoring competitors, tracking valuations, and generating strategic ideas.
            </p>
            <button
              onClick={refresh}
              className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
              Run Intelligence Pipeline
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <AgentPipeline />}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Main content */}
        {data && !loading && (
          <div>
            {/* ── Main tabs ── */}
            <div className="flex gap-2 mb-6">
              {([
                { id: 'mortgage' as MainTab,   label: 'Mortgage Industry', icon: '🏦' },
                { id: 'valuations' as MainTab, label: 'Valuations',        icon: '🏡' },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setMainTab(t.id); setSubTab('news') }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    mainTab === t.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/5 text-white/50 hover:bg-white/8 hover:text-white/80 border border-white/8'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Sub tabs ── */}
            <div className="flex gap-1 border-b border-white/8 mb-6">
              {activeSubs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSubTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                    subTab === t.id
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-white/35 hover:text-white/60 hover:border-white/20'
                  }`}
                >
                  {t.label}
                  {t.count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      subTab === t.id ? 'bg-blue-500/20 text-blue-300' : 'bg-white/8 text-white/25'
                    }`}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Content ── */}
            {mainTab === 'mortgage' && subTab === 'news'        && <NewsSection articles={data.news} />}
            {mainTab === 'mortgage' && subTab === 'competitors' && <CompetitorSection competitors={data.competitors} />}
            {mainTab === 'mortgage' && subTab === 'ideas'       && <IdeasSection ideas={data.ideas} />}

            {mainTab === 'valuations' && subTab === 'news'        && <NewsSection articles={data.valuations.news} />}
            {mainTab === 'valuations' && subTab === 'competitors' && <CompetitorSection competitors={data.valuations.competitorMoves} />}
            {mainTab === 'valuations' && subTab === 'ideas'       && <IdeasSection ideas={data.valuations.ideas} />}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[11px] text-white/15">
          <span>ServiceLink Intelligence Portal</span>
          <span>Ankit Shukla · Powered by Claude</span>
        </div>
      </footer>
    </div>
  )
}
