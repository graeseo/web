import type { StockEvent, EventFilter } from '../entities/StockEvent'

export interface StockEventRepository {
  getAll(): Promise<StockEvent[]>
  getByFilter(filter: EventFilter): Promise<StockEvent[]>
  getById(id: string): Promise<StockEvent | null>
}
