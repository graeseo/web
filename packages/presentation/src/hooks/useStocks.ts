import { useState, useEffect } from 'react'
import type { Stock, StockKey, StockNarrative } from '@graeseo/domain'
import { useRepositories } from '../context/RepositoryContext'

export interface UseStocksResult {
  stocks: Stock[]
  narratives: StockNarrative[]
  stockOrder: StockKey[]
  isLoading: boolean
}

export const useStocks = (): UseStocksResult => {
  const { stockRepository } = useRepositories()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [narratives, setNarratives] = useState<StockNarrative[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    ;(async () => {
      try {
        const [allStocks, allNarratives] = await Promise.all([
          stockRepository.getAll(),
          stockRepository.getNarratives(),
        ])
        if (!cancelled) {
          setStocks(allStocks)
          setNarratives(allNarratives)
        }
      } catch {
        if (!cancelled) {
          setStocks([])
          setNarratives([])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [stockRepository])

  return { stocks, narratives, stockOrder: stockRepository.getOrder(), isLoading }
}
