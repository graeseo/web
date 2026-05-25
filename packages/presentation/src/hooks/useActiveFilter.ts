import { useState } from 'react'
import type { EventFilter } from '@graeseo/domain'

export interface UseActiveFilterResult {
  filter: EventFilter
  setFilter: (filter: EventFilter) => void
}

export const useActiveFilter = (initial: EventFilter = 'all'): UseActiveFilterResult => {
  const [filter, setFilter] = useState<EventFilter>(initial)
  return { filter, setFilter }
}
