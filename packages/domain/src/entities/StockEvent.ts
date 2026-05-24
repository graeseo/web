import type { StockKey } from './Stock'

export type EventFilter = 'all' | StockKey

export interface StockEvent {
  id: string
  title: string
  date: string
  day: string
  daysLeft: number
  /** null이면 거시 이벤트 (FOMC, PCE 등) */
  stock: StockKey | null
  concept: string
  why: string
  importance: 'high' | 'medium'
}
