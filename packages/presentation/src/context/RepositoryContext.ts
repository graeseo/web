import { createContext, useContext } from 'react'
import type { StockEventRepository, ScenarioRepository, MarketTopicRepository, StockRepository } from '@graeseo/domain'

export interface Repositories {
  stockEventRepository: StockEventRepository
  scenarioRepository: ScenarioRepository
  marketTopicRepository: MarketTopicRepository
  stockRepository: StockRepository
}

export const RepositoryContext = createContext<Repositories | null>(null)

export const useRepositories = (): Repositories => {
  const ctx = useContext(RepositoryContext)
  if (ctx === null) throw new Error('useRepositories must be used within RepositoryContext.Provider')
  return ctx
}
