import type { StockRepository, Stock, StockKey, StockNarrative } from '@graeseo/domain'
import { STATIC_STOCKS, STATIC_NARRATIVES, STOCK_ORDER } from '../staticData'

export class StaticStockRepository implements StockRepository {
  async getAll(): Promise<Stock[]> {
    return STATIC_STOCKS
  }

  async getByKey(key: StockKey): Promise<Stock | null> {
    return STATIC_STOCKS.find(s => s.key === key) ?? null
  }

  async getNarratives(): Promise<StockNarrative[]> {
    return STATIC_NARRATIVES
  }

  getOrder(): StockKey[] {
    return STOCK_ORDER
  }
}
