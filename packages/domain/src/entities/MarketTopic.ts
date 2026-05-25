import type { StockKey } from './Stock'

export interface MarketTopicImplication {
  stock: StockKey
  verdict: string
  /** -2(강한 악재) ~ +2(강한 호재) */
  strength: -2 | -1 | 0 | 1 | 2
  note: string
}

export interface MarketTopic {
  oneLine: string
  headline: string
  why: string
  implications: MarketTopicImplication[]
}
