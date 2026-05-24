import type { StockEventRepository, StockEvent, EventFilter } from '@graeseo/domain'
import { STATIC_EVENTS } from '../staticData'

export class StaticStockEventRepository implements StockEventRepository {
  async getAll(): Promise<StockEvent[]> {
    return STATIC_EVENTS
  }

  async getByFilter(filter: EventFilter): Promise<StockEvent[]> {
    if (filter === 'all') return STATIC_EVENTS
    return STATIC_EVENTS.filter(e => e.stock === filter)
  }

  async getById(id: string): Promise<StockEvent | null> {
    return STATIC_EVENTS.find(e => e.id === id) ?? null
  }
}
