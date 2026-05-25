import { useState, useEffect, useMemo } from 'react'
import { GetScenariosForEventUseCase } from '@graeseo/domain'
import type { Scenario } from '@graeseo/domain'
import { useRepositories } from '../context/RepositoryContext'

export interface UseScenariosResult {
  scenarios: Scenario[]
  isLoading: boolean
}

export const useScenarios = (eventId: string): UseScenariosResult => {
  const { scenarioRepository } = useRepositories()
  const useCase = useMemo(() => new GetScenariosForEventUseCase(scenarioRepository), [scenarioRepository])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    ;(async () => {
      try {
        const all = await scenarioRepository.getByEventIdForAllStocks(eventId)
        if (!cancelled) setScenarios(all)
      } catch {
        if (!cancelled) setScenarios([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [useCase, eventId, scenarioRepository])

  return { scenarios, isLoading }
}
