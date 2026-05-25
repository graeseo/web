import type { StockEventRepository } from '../repositories/StockEventRepository'
import type { StockEvent, EventFilter } from '../entities/StockEvent'

export class GetStockEventsUseCase {
  constructor(private readonly repository: StockEventRepository) {}

  async execute(filter: EventFilter): Promise<StockEvent[]> {
    return this.repository.getByFilter(filter)
  }
}
