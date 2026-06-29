import { NextResponse } from 'next/server'
import { runNewsAgent } from '@/lib/agents/newsAgent'
import { runCompetitorAgent } from '@/lib/agents/competitorAgent'
import { runIdeasAgent } from '@/lib/agents/ideasAgent'
import { IntelligenceData } from '@/lib/types'

export const maxDuration = 60

export async function GET() {
  try {
    // Run news and competitor agents in parallel
    const [news, competitors] = await Promise.all([
      runNewsAgent(),
      runCompetitorAgent(),
    ])

    // Ideas agent consumes output from both
    const ideas = await runIdeasAgent(news, competitors)

    const data: IntelligenceData = {
      news,
      competitors,
      ideas,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Intelligence pipeline error:', error)
    return NextResponse.json(
      { error: 'Failed to run intelligence pipeline' },
      { status: 500 }
    )
  }
}
