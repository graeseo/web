import type { MarketTopicRepository, MarketTopic } from '@graeseo/domain'
import { STATIC_MARKET_TOPIC } from '../staticData'

export class StaticMarketTopicRepository implements MarketTopicRepository {
  async get(): Promise<MarketTopic> {
    return STATIC_MARKET_TOPIC
  }
}
