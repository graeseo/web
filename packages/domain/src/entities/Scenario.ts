import type { StockKey } from './Stock'

export type ScenarioDirection = 'up' | 'flat' | 'down'

export interface ScenarioSignal {
  title: string
  description: string
}

export interface ScenarioCard {
  kind: ScenarioDirection
  title: string
  impact: string
  oneLine: string
  why: string
  signals: ScenarioSignal[]
  probability: number
}

export interface Scenario {
  eventId: string
  stock: StockKey
  cards: ScenarioCard[]
}
