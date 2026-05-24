import type { MarketTopic, MarketTopicRepository } from '@graeseo/domain'

export class HttpMarketTopicRepository implements MarketTopicRepository {
  constructor(private readonly baseUrl: string) {}

  async get(): Promise<MarketTopic> {
    const res = await fetch(`${this.baseUrl}/api/market-topic`)
    if (!res.ok) throw new Error(`market-topic fetch failed: ${res.status}`)
    return res.json()
  }
}
