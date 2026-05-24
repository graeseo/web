import type { StockEvent } from '@graeseo/domain'

interface Props {
  event: StockEvent
}

const IMPORTANCE_LABEL: Record<StockEvent['importance'], string> = {
  high: '중요',
  medium: '관심',
}

export function EventCard({ event }: Props) {
  const stockLabel = event.stock ? event.stock.toUpperCase() : '매크로'

  return (
    <article className="event-card">
      <div className="event-meta">
        <span className={`event-stock-badge ${event.stock ?? 'macro'}`}>{stockLabel}</span>
        <span className="event-date">{event.date} · D-{event.daysLeft}</span>
        <span className={`event-importance ${event.importance}`}>
          {IMPORTANCE_LABEL[event.importance]}
        </span>
      </div>
      <h2 className="event-title">{event.title}</h2>
      <p className="event-concept">{event.concept}</p>
    </article>
  )
}
