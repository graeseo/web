import type { StockKey, ScenarioCard, ScenarioSignal, ScenarioDirection } from '@graeseo/domain'
import { useStocks, useStockScenario } from '@graeseo/presentation'

interface Props {
  stockKey: StockKey
  activeEventId: string | null
}

export function StockSection({ stockKey, activeEventId }: Props) {
  const { stocks, narratives } = useStocks()
  const { scenario, scenarioEventId } = useStockScenario(activeEventId ?? '', stockKey)

  const stock = stocks.find(s => s.key === stockKey)
  const narrative = narratives.find(n => n.stock === stockKey)

  if (!stock) return null

  const changeUp = stock.changePercent >= 0

  return (
    <section className="stock-section">
      <div className="stock-sticky-header">
        <div className="stock-mark">
          <StockLogo stockKey={stockKey} mark={stock.mark} />
        </div>
        <div>
          <div className="stock-name">{stock.name}</div>
          <div className="stock-ticker">{stock.ticker}</div>
        </div>
        <div className="stock-price-col">
          <div className="stock-price">${stock.priceUSD.toFixed(2)}</div>
          <div className={`stock-change ${changeUp ? 'up' : 'down'}`}>
            {changeUp ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
          </div>
        </div>
      </div>

      {narrative && (
        <div className="stock-narrative">
          <div className="narrative-eyebrow">요즘 이 종목은</div>
          <p className="narrative-text">{narrative.today}</p>
        </div>
      )}

      {scenario && (
        <div className="scenario-section">
          <div className="scenario-section-header">
            <h3 className="scenario-section-title">{scenarioEventId}에서 나올 수 있는 모습</h3>
          </div>
          <div className="scenario-cards-scroll hide-scroll snap-x">
            <div className="scenario-cards-inner">
              {scenario.cards.map((card, i) => (
                <ScenarioCardItem
                  key={card.kind}
                  card={card}
                  index={i}
                />
              ))}
              <div style={{ flexShrink: 0, width: 8 }} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

interface ScenarioCardItemProps {
  card: ScenarioCard
  index: number
}

function ScenarioCardItem({ card, index }: ScenarioCardItemProps) {
  return (
    <article className="scenario-card snap-start">
      <div className="scenario-card-top">
        <span className="case-label">CASE {String.fromCharCode(65 + index)}</span>
        <span className={`direction-chip ${card.kind}`}>
          <DirectionArrow kind={card.kind} />
          {card.impact}
        </span>
      </div>
      <h4 className="scenario-card-title">{card.title}</h4>
      <p className="scenario-card-oneline">{card.oneLine}</p>
      <div className="card-divider" />
      <div className="card-sub-label">왜 이렇게 봐요?</div>
      <p className="scenario-why-text">{card.why}</p>
      <div className="card-sub-label">지금 보이는 신호</div>
      <div className="signals-list">
        {card.signals.map((sig, i) => (
          <SignalItem key={sig.title} signal={sig} index={i + 1} />
        ))}
      </div>
      <div className="prob-footer">
        <span className="prob-label">이 정도 가능성</span>
        <span className="prob-value">{card.probability}%</span>
      </div>
    </article>
  )
}

interface SignalItemProps {
  signal: ScenarioSignal
  index: number
}

function SignalItem({ signal, index }: SignalItemProps) {
  return (
    <div className="signal-item">
      <span className="signal-num">{index}</span>
      <div>
        <div className="signal-title">{signal.title}</div>
        <div className="signal-desc">{signal.description}</div>
      </div>
    </div>
  )
}

const STOCK_LOGO_DOMAINS: Record<string, string> = {
  tsla: 'tesla.com',
  pltr: 'palantir.com',
}

function StockLogo({ stockKey, mark }: { stockKey: string; mark: string }) {
  const domain = STOCK_LOGO_DOMAINS[stockKey]
  if (!domain) return <span>{mark}</span>
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={stockKey}
      width={28}
      height={28}
      style={{ borderRadius: 6, objectFit: 'contain', background: '#fff' }}
      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'block' }}
    />
  )
}

function DirectionArrow({ kind }: { kind: ScenarioDirection }) {
  if (kind === 'up') return <span style={{ fontSize: 12, lineHeight: 1 }}>↑</span>
  if (kind === 'down') return <span style={{ fontSize: 12, lineHeight: 1 }}>↓</span>
  return <span style={{ fontSize: 12, lineHeight: 1 }}>→</span>
}
