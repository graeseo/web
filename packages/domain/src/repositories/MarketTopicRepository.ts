import type { MarketTopic } from '../entities/MarketTopic'

export interface MarketTopicRepository {
  get(): Promise<MarketTopic>
}
