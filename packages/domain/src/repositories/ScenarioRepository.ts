import type { Scenario } from '../entities/Scenario'
import type { StockKey } from '../entities/Stock'

export interface ScenarioRepository {
  getByEventId(eventId: string, stock: StockKey): Promise<Scenario | null>
  getByEventIdForAllStocks(eventId: string): Promise<Scenario[]>
}
