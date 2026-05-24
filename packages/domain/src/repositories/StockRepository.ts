import type { Stock, StockKey } from '../entities/Stock'
import type { StockNarrative } from '../entities/StockNarrative'

export interface StockRepository {
  getAll(): Promise<Stock[]>
  getByKey(key: StockKey): Promise<Stock | null>
  getNarratives(): Promise<StockNarrative[]>
  getOrder(): StockKey[]
}
