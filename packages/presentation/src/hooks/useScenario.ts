import { useState, useEffect, useMemo } from 'react'
import { GetScenariosForEventUseCase } from '@graeseo/domain'
import type { Scenario, StockKey } from '@graeseo/domain'
import { useRepositories } from '../context/RepositoryContext'

export interface UseScenarioResult {
  scenario: Scenario | null
  isLoading: boolean
}

export const useScenario = (eventId: string, stock: StockKey): UseScenarioResult => {
  const { scenarioRepository } = useRepositories()
  const useCase = useMemo(() => new GetScenariosForEventUseCase(scenarioRepository), [scenarioRepository])
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    ;(async () => {
      try {
        const result = await useCase.execute(eventId, stock)
        if (!cancelled) setScenario(result)
      } catch {
        if (!cancelled) setScenario(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [useCase, eventId, stock])

  return { scenario, isLoading }
}
