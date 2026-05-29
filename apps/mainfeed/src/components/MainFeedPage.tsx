import { useState, useMemo, useRef, useEffect } from 'react'
import type { EventFilter } from '@graeseo/domain'
import { useMarketTopic, useStockEvents, useStocks } from '@graeseo/presentation'
import { MarketTopicSection } from './MarketTopicSection'
import { TimelineSection } from './TimelineSection'
import { StockSection } from './StockSection'

function getNextUpdateInfo() {
  const now = new Date()
  const kstOffset = 9 * 60
  const kstNow = new Date(now.getTime() + (kstOffset - now.getTimezoneOffset()) * 60000)
  const h = kstNow.getHours()
  const m = kstNow.getMinutes()
  const totalMin = h * 60 + m

  const schedules: number[] = [0, 18 * 60] // 00:00, 18:00 KST
  const nextMin = schedules.find(s => s > totalMin) ?? (schedules[0]! + 24 * 60)
  const diffMin = nextMin - totalMin
  const diffH = Math.floor(diffMin / 60)
  const diffM = diffMin % 60

  const lastMin = [...schedules].reverse().find(s => s <= totalMin) ?? schedules[schedules.length - 1]!
  const lastH = Math.floor(lastMin / 60)
  const lastM = lastMin % 60
  const mo = kstNow.getMonth() + 1
  const d = lastMin === 0 && totalMin < 60 ? kstNow.getDate() : kstNow.getDate()
  const lastStr = `${mo}/${d} ${String(lastH).padStart(2, '0')}:${String(lastM).padStart(2, '0')}`

  return {
    lastStr,
    countdown: diffH > 0 ? `${diffH}시간 ${diffM}분 후` : `${diffM}분 후`,
  }
}

export function MainFeedPage() {
  const { marketTopic, isLoading: topicLoading } = useMarketTopic()
  const { stocks, stockOrder, isLoading: stocksLoading } = useStocks()
  const [filter, setFilter] = useState<EventFilter>('all')
  const { events, isLoading: eventsLoading } = useStockEvents(filter)
  const [refreshKey, setRefreshKey] = useState(0)

  const isLoading = topicLoading || stocksLoading || eventsLoading
  const hasError = !isLoading && events.length === 0 && stocks.length === 0 && !marketTopic

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

  // Pull to refresh
  const touchStartY = useRef(0)
  const [pulling, setPulling] = useState(false)
  const [pullDist, setPullDist] = useState(0)
  const THRESHOLD = 72

  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) touchStartY.current = e.touches[0]!.clientY
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === 0) return
    const dist = e.touches[0]!.clientY - touchStartY.current
    if (dist > 0) {
      setPulling(true)
      setPullDist(Math.min(dist, THRESHOLD + 20))
    }
  }
  const onTouchEnd = () => {
    if (pullDist >= THRESHOLD) {
      setRefreshKey(k => k + 1)
      window.location.reload()
    }
    setPulling(false)
    setPullDist(0)
    touchStartY.current = 0
  }

  const { lastStr, countdown } = getNextUpdateInfo()

  return (
    <div
      className="page"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {pulling && pullDist > 12 && (
        <div className="pull-indicator" style={{ height: Math.min(pullDist, THRESHOLD) }}>
          <span className="pull-indicator-text">
            {pullDist >= THRESHOLD ? '↑ 놓으면 새로고침' : '↓ 당겨서 새로고침'}
          </span>
        </div>
      )}

      <header className="app-header">
        <h1 className="app-title">그래서</h1>
        <button className="bell-btn" aria-label="알림">
          <BellIcon />
          <span className="bell-dot" />
        </button>
      </header>

      <div className="update-status-bar">
        <span>최근 갱신 {lastStr} KST</span>
        <span className="update-next">다음 갱신 {countdown}</span>
      </div>

      {isLoading && <LoadingState />}

      {hasError && (
        <ErrorState onRetry={() => window.location.reload()} />
      )}

      {!isLoading && !hasError && (
        <>
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
              key={`${stockKey}-${refreshKey}`}
              stockKey={stockKey}
              activeEventId={activeEvent?.id ?? null}
            />
          ))}
        </>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="feed-loading">
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="feed-error">
      <p className="feed-error-msg">데이터를 불러오지 못했어요</p>
      <button className="retry-btn" onClick={onRetry}>다시 시도</button>
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
