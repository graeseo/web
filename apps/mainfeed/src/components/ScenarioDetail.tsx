import { useState } from 'react'
import type { StockEvent, StockKey } from '@graeseo/domain'
import { useScenario, useScenarios } from '@graeseo/presentation'
import { ScenarioCardView } from './ScenarioCardView'

interface Props {
  event: StockEvent
  onBack: () => void
}

export function ScenarioDetail({ event, onBack }: Props) {
  const isMacro = event.stock === null

  // 매크로 이벤트: 해당 이벤트의 종목별 시나리오 목록을 먼저 가져와 종목 탭 구성
  const { scenarios: allScenarios } = useScenarios(event.id)
  const availableStocks = allScenarios.map(s => s.stock)

  const defaultStock: StockKey = isMacro
    ? (availableStocks[0] ?? 'tsla')
    : (event.stock as StockKey)

  const [activeStock, setActiveStock] = useState<StockKey>(defaultStock)

  const { scenario, isLoading } = useScenario(event.id, activeStock)

  return (
    <div className="scenario-detail">
      <header className="scenario-detail-header">
        <button className="back-btn" onClick={onBack} aria-label="뒤로가기">←</button>
        <div className="scenario-detail-event-info">
          <span className="scenario-detail-date">{event.date} · D-{event.daysLeft}</span>
          <h1 className="scenario-detail-title">{event.title}</h1>
        </div>
      </header>

      {isMacro && availableStocks.length > 1 && (
        <nav className="stock-picker" aria-label="종목 선택">
          {availableStocks.map(stock => (
            <button
              key={stock}
              className={`stock-picker-btn ${activeStock === stock ? 'active' : ''} ${stock}`}
              onClick={() => setActiveStock(stock)}
              aria-pressed={activeStock === stock}
            >
              {stock.toUpperCase()}
            </button>
          ))}
        </nav>
      )}

      <div className="scenario-cards-container">
        {isLoading ? (
          <p className="loading-text">시나리오 불러오는 중...</p>
        ) : scenario === null ? (
          <p className="loading-text">시나리오 데이터가 없습니다</p>
        ) : (
          <div className="scenario-cards">
            {scenario.cards.map(card => (
              <ScenarioCardView key={card.kind} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
