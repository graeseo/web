import type { ScenarioRepository } from '../repositories/ScenarioRepository'
import type { Scenario } from '../entities/Scenario'
import type { StockKey } from '../entities/Stock'

export class GetScenariosForEventUseCase {
  constructor(private readonly repository: ScenarioRepository) {}

  async execute(eventId: string, stock: StockKey): Promise<Scenario | null> {
    return this.repository.getByEventId(eventId, stock)
  }
}
