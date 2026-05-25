import type { ScenarioRepository, Scenario, StockKey } from '@graeseo/domain'
import { STATIC_SCENARIOS } from '../staticData'

export class StaticScenarioRepository implements ScenarioRepository {
  async getByEventId(eventId: string, stock: StockKey): Promise<Scenario | null> {
    return STATIC_SCENARIOS.find(s => s.eventId === eventId && s.stock === stock) ?? null
  }

  async getByEventIdForAllStocks(eventId: string): Promise<Scenario[]> {
    return STATIC_SCENARIOS.filter(s => s.eventId === eventId)
  }
}
