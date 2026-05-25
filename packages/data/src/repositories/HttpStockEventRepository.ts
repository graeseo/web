import type { EventFilter, StockEvent, StockEventRepository } from '@graeseo/domain'

export class HttpStockEventRepository implements StockEventRepository {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<StockEvent[]> {
    return this.getByFilter('all')
  }

  async getByFilter(filter: EventFilter): Promise<StockEvent[]> {
    const res = await fetch(`${this.baseUrl}/api/events?filter=${filter}`)
    if (!res.ok) throw new Error(`events fetch failed: ${res.status}`)
    return res.json()
  }

  async getById(id: string): Promise<StockEvent | null> {
    const res = await fetch(`${this.baseUrl}/api/events/${encodeURIComponent(id)}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`event fetch failed: ${res.status}`)
    return res.json()
  }
}
