import { useState, useEffect } from 'react'
import type { Scenario, StockKey } from '@graeseo/domain'
import { useRepositories } from '../context/RepositoryContext'

export interface UseStockScenarioResult {
  scenario: Scenario | null
  scenarioEventId: string
  isLoading: boolean
}

export const useStockScenario = (activeEventId: string, stockKey: StockKey): UseStockScenarioResult => {
  const { scenarioRepository, stockEventRepository } = useRepositories()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [scenarioEventId, setScenarioEventId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    ;(async () => {
      try {
        let sc = await scenarioRepository.getByEventId(activeEventId, stockKey)
        let usedId = activeEventId

        if (!sc) {
          const stockEvents = await stockEventRepository.getByFilter(stockKey)
          const fallbackId = stockEvents[0]?.id ?? ''
          if (fallbackId) {
            sc = await scenarioRepository.getByEventId(fallbackId, stockKey)
            usedId = fallbackId
          }
        }

        if (!cancelled) {
          setScenario(sc ?? null)
          setScenarioEventId(sc ? usedId : '')
        }
      } catch {
        if (!cancelled) {
          setScenario(null)
          setScenarioEventId('')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [activeEventId, stockKey, scenarioRepository, stockEventRepository])

  return { scenario, scenarioEventId, isLoading }
}
