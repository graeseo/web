import type { Scenario, ScenarioRepository, StockKey } from '@graeseo/domain'

export class HttpScenarioRepository implements ScenarioRepository {
  constructor(private readonly baseUrl: string) {}

  async getByEventId(eventId: string, stock: StockKey): Promise<Scenario | null> {
    const res = await fetch(`${this.baseUrl}/api/scenarios?eventId=${encodeURIComponent(eventId)}&stock=${stock}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`scenario fetch failed: ${res.status}`)
    return res.json()
  }

  async getByEventIdForAllStocks(eventId: string): Promise<Scenario[]> {
    const res = await fetch(`${this.baseUrl}/api/scenarios?eventId=${encodeURIComponent(eventId)}`)
    if (!res.ok) throw new Error(`scenarios fetch failed: ${res.status}`)
    return res.json()
  }
}
