import { useState, useMemo } from 'react'
import type { EventFilter } from '@graeseo/domain'
import { useMarketTopic, useStockEvents, useStocks } from '@graeseo/presentation'
import { MarketTopicSection } from './MarketTopicSection'
import { TimelineSection } from './TimelineSection'
import { StockSection } from './StockSection'

export function MainFeedPage() {
  const { marketTopic } = useMarketTopic()
  const { stockOrder } = useStocks()
  const [filter, setFilter] = useState<EventFilter>('all')
  const { events } = useStockEvents(filter)

  const firstStockEvent = useMemo(() => events.find(e => e.stock) ?? events[0] ?? null, [events])
  const [activeEventId, setActiveEventId] = useState<string | null>(null)

  const activeEvent = useMemo(() => {
    const id = activeEventId ?? firstStockEvent?.id ?? null
    return events.find(e => e.id === id) ?? events[0] ?? null
  }, [activeEventId, firstStockEvent, events])

  const handleFilterChange = (f: EventFilter) => {
    setFilter(f)
    setActiveEventId(null)
  }

  return (
    <div className="page">
      <header className="app-header">
        <h1 className="app-title">그래서</h1>
        <button className="bell-btn" aria-label="알림">
          <BellIcon />
          <span className="bell-dot" />
        </button>
      </header>

      {marketTopic && <MarketTopicSection topic={marketTopic} />}

      <TimelineSection
        filter={filter}
        onFilterChange={handleFilterChange}
        activeEventId={activeEvent?.id ?? null}
        onSelectEvent={setActiveEventId}
        events={events}
        activeEvent={activeEvent}
      />

      {stockOrder.map(stockKey => (
        <StockSection
          key={stockKey}
          stockKey={stockKey}
          activeEventId={activeEvent?.id ?? null}
        />
      ))}
    </div>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M5 8a5 5 0 0110 0v4l1.5 2H3.5L5 12V8z" />
      <path d="M8 16.5a2 2 0 004 0" />
    </svg>
  )
}
