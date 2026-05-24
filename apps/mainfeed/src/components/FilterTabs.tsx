import type { EventFilter, StockKey } from '@graeseo/domain'

const toLabel = (stock: StockKey): string => stock.toUpperCase()

interface Props {
  stocks: StockKey[]
  active: EventFilter
  onChange: (filter: EventFilter) => void
}

export function FilterTabs({ stocks, active, onChange }: Props) {
  return (
    <nav className="filter-tabs" aria-label="종목 필터">
      <button
        className={`filter-tab ${active === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
        aria-pressed={active === 'all'}
      >
        전체
      </button>
      {stocks.map(stock => (
        <button
          key={stock}
          className={`filter-tab ${active === stock ? 'active' : ''}`}
          onClick={() => onChange(stock)}
          aria-pressed={active === stock}
        >
          {toLabel(stock)}
        </button>
      ))}
    </nav>
  )
}
