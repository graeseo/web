import type { Stock, StockKey, StockNarrative, StockRepository } from '@graeseo/domain'

export class HttpStockRepository implements StockRepository {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<Stock[]> {
    const res = await fetch(`${this.baseUrl}/api/stocks`)
    if (!res.ok) throw new Error(`stocks fetch failed: ${res.status}`)
    return res.json()
  }

  async getByKey(key: StockKey): Promise<Stock | null> {
    const res = await fetch(`${this.baseUrl}/api/stocks/${key}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`stock fetch failed: ${res.status}`)
    return res.json()
  }

  async getNarratives(): Promise<StockNarrative[]> {
    const res = await fetch(`${this.baseUrl}/api/stocks/narratives`)
    if (!res.ok) throw new Error(`narratives fetch failed: ${res.status}`)
    return res.json()
  }

  getOrder(): StockKey[] {
    return ['tsla', 'pltr']
  }
}
