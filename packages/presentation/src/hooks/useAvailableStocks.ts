import { useMemo } from 'react'
import type { StockKey } from '@graeseo/domain'
import { useStockEvents } from './useStockEvents'

export const useAvailableStocks = (): StockKey[] => {
  const { events } = useStockEvents('all')
  return useMemo(() => {
    const seen = new Set<StockKey>()
    for (const e of events) {
      if (e.stock !== null) seen.add(e.stock)
    }
    return [...seen]
  }, [events])
}
