import { useState, useEffect } from 'react'
import type { MarketTopic } from '@graeseo/domain'
import { useRepositories } from '../context/RepositoryContext'

export interface UseMarketTopicResult {
  marketTopic: MarketTopic | null
  isLoading: boolean
}

export const useMarketTopic = (): UseMarketTopicResult => {
  const { marketTopicRepository } = useRepositories()
  const [marketTopic, setMarketTopic] = useState<MarketTopic | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    ;(async () => {
      try {
        const topic = await marketTopicRepository.get()
        if (!cancelled) setMarketTopic(topic)
      } catch {
        if (!cancelled) setMarketTopic(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [marketTopicRepository])

  return { marketTopic, isLoading }
}
