import { useActiveFilter, useStockEvents, useAvailableStocks } from '@graeseo/presentation'
import { FilterTabs } from './FilterTabs'
import { EventCard } from './EventCard'

export function EventList() {
  const { filter, setFilter } = useActiveFilter()
  const { events, isLoading } = useStockEvents(filter)
  const availableStocks = useAvailableStocks()

  return (
    <main className="event-list-container">
      <FilterTabs stocks={availableStocks} active={filter} onChange={setFilter} />
      {isLoading ? (
        <p className="loading-text">불러오는 중...</p>
      ) : (
        <ul className="event-list">
          {events.map(event => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
