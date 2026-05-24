import type { StockEvent, EventFilter } from '@graeseo/domain'

interface Props {
  filter: EventFilter
  onFilterChange: (f: EventFilter) => void
  activeEventId: string | null
  onSelectEvent: (id: string) => void
  events: StockEvent[]
  activeEvent: StockEvent | null
}

const FILTERS: { id: EventFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'tsla', label: '테슬라' },
  { id: 'pltr', label: '팔란티어' },
]

const TICKER_LABEL: Record<string, string> = { tsla: 'TSLA', pltr: 'PLTR' }

const COL = 110
const LEFT_PAD = 20
const DOT_TOP = 14
const DOT_R_INACTIVE = 6
const DOT_R_ACTIVE = 8

export function TimelineSection({ filter, onFilterChange, activeEventId, onSelectEvent, events, activeEvent }: Props) {
  const totalWidth = LEFT_PAD * 2 + COL * events.length

  return (
    <section className="timeline-section">
      <h2 className="section-title">주요 일정</h2>

      <div className="filter-chips">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : 'inactive'}`}
            onClick={() => onFilterChange(f.id)}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="timeline-scroll-wrap hide-scroll">
        <div style={{ position: 'relative', width: totalWidth, padding: `${DOT_TOP - 4}px 0 6px` }}>
          {/* Connecting line between first and last dot centers */}
          <div style={{
            position: 'absolute',
            left: LEFT_PAD + COL / 2,
            right: LEFT_PAD + COL / 2,
            top: DOT_TOP + DOT_R_INACTIVE,
            height: 2,
            background: 'var(--line2)',
            borderRadius: 1,
          }} />

          {events.map((e, i) => {
            const isActive = e.id === activeEventId
            const isMacro = !e.stock
            const ticker = isMacro ? '거시' : (TICKER_LABEL[e.stock!] ?? e.stock!.toUpperCase())
            const dotR = isActive ? DOT_R_ACTIVE : DOT_R_INACTIVE
            const dotTop = DOT_TOP + DOT_R_INACTIVE - dotR
            const dotLeft = LEFT_PAD + i * COL + COL / 2 - dotR
            const dotColor = isMacro
              ? (isActive ? 'var(--ink3)' : 'var(--bg)')
              : e.stock === 'tsla'
                ? (isActive ? 'var(--up)' : 'var(--bg)')
                : (isActive ? 'var(--down)' : 'var(--bg)')
            const dotBorder = isMacro
              ? 'var(--ink3)'
              : e.stock === 'tsla' ? 'var(--up)' : 'var(--down)'

            return (
              <button
                key={e.id}
                onClick={() => onSelectEvent(e.id)}
                aria-pressed={isActive}
                style={{
                  position: 'absolute',
                  left: LEFT_PAD + i * COL,
                  top: 0,
                  width: COL,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'center',
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: dotLeft - (LEFT_PAD + i * COL),
                  top: dotTop,
                  width: dotR * 2,
                  height: dotR * 2,
                  borderRadius: '50%',
                  background: dotColor,
                  border: `2px solid ${dotBorder}`,
                  boxShadow: '0 0 0 3px var(--bg)',
                  transition: 'all .15s',
                }} />

                {/* Text below dot */}
                <div style={{ paddingTop: DOT_TOP + DOT_R_INACTIVE * 2 + 12 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800,
                    color: isActive ? 'var(--ink)' : 'var(--ink3)',
                    letterSpacing: 0.4,
                    whiteSpace: 'nowrap',
                  }}>
                    {ticker} · D−{e.daysLeft}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: isActive ? 'var(--ink2)' : 'var(--ink3)',
                    letterSpacing: 0.2,
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--mono)',
                  }}>
                    {e.date}
                  </div>
                  <div className="clamp-2" style={{
                    fontSize: 12.5,
                    fontWeight: isActive ? 900 : 800,
                    color: isActive ? 'var(--ink)' : 'var(--ink2)',
                    letterSpacing: -0.2,
                    lineHeight: 1.3,
                    marginTop: 6,
                    textWrap: 'pretty',
                    padding: '0 4px',
                    textAlign: 'center',
                  }}>
                    {e.title}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Spacer so parent gets proper height from absolute children */}
          <div style={{ height: DOT_TOP + DOT_R_INACTIVE * 2 + 12 + 72 }} />
        </div>
      </div>

      {activeEvent && <EventConceptPanel key={activeEvent.id} event={activeEvent} />}
    </section>
  )
}

function EventConceptPanel({ event }: { event: StockEvent }) {
  const isMacro = !event.stock
  const ticker = isMacro ? '거시' : (TICKER_LABEL[event.stock!] ?? event.stock!.toUpperCase())
  const badgeBg = isMacro
    ? 'var(--flat-bg)'
    : event.stock === 'tsla' ? 'var(--up-bg)' : 'var(--down-bg)'
  const badgeColor = isMacro
    ? 'var(--ink2)'
    : event.stock === 'tsla' ? 'var(--up)' : 'var(--down)'

  return (
    <div className="event-concept-panel" style={{ animation: 'fadeIn .2s ease' }}>
      <div className="concept-badge-row">
        <span style={{
          fontSize: 10, fontWeight: 800,
          color: badgeColor, background: badgeBg,
          padding: '3px 7px', borderRadius: 4, letterSpacing: 0.4,
        }}>
          {ticker}
        </span>
        <span className="concept-days">D−{event.daysLeft} · {event.date} {event.day}</span>
      </div>
      <h3 className="concept-title">{event.title}</h3>
      <div style={{ marginTop: 14 }}>
        <div className="concept-sub-label">이게 뭐예요?</div>
        <p className="concept-text">{event.concept}</p>
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="concept-sub-label">내 종목엔 왜 중요해요?</div>
        <p className="concept-text">{event.why}</p>
      </div>
    </div>
  )
}
