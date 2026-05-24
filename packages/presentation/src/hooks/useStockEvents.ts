import { useState, useEffect, useMemo } from 'react'
import { GetStockEventsUseCase } from '@graeseo/domain'
import type { StockEvent, EventFilter } from '@graeseo/domain'
import { useRepositories } from '../context/RepositoryContext'

export interface UseStockEventsResult {
  events: StockEvent[]
  isLoading: boolean
}

export const useStockEvents = (filter: EventFilter): UseStockEventsResult => {
  const { stockEventRepository } = useRepositories()
  const useCase = useMemo(() => new GetStockEventsUseCase(stockEventRepository), [stockEventRepository])
  const [events, setEvents] = useState<StockEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    useCase.execute(filter).then(result => {
      setEvents(result)
      setIsLoading(false)
    })
  }, [useCase, filter])

  return { events, isLoading }
}
