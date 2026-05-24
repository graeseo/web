import type { MarketTopic, MarketTopicImplication, StockKey } from '@graeseo/domain'
import { useStocks } from '@graeseo/presentation'

interface Props {
  topic: MarketTopic
}

export function MarketTopicSection({ topic }: Props) {
  const { stocks } = useStocks()
  const getStockName = (key: StockKey) => stocks.find(s => s.key === key)?.name ?? key

  return (
    <section className="market-topic">
      <div className="section-eyebrow">
        <span className="dot-live" />
        오늘 시장의 분위기
      </div>
      <h1 className="market-headline">"{topic.headline}"</h1>
      <p className="market-why">{topic.why}</p>

      <div className="implications-box">
        <div className="implications-label">
          <span className="implications-label-icon">→</span>
          그래서 내 종목엔 어떨까요?
        </div>
        {topic.implications.map(imp => (
          <ImplicationRow
            key={imp.stock}
            implication={imp}
            stockName={getStockName(imp.stock)}
          />
        ))}
      </div>
    </section>
  )
}

interface ImplicationRowProps {
  implication: MarketTopicImplication
  stockName: string
}

function ImplicationRow({ implication, stockName }: ImplicationRowProps) {
  const dir = strengthToDir(implication.strength)
  return (
    <div className="implication-row">
      <div className={`implication-arrow-box ${dir}`}>
        {strengthToArrow(implication.strength)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="implication-stock-name">{stockName}</span>
          <span className={`implication-verdict ${dir}`}>{implication.verdict}</span>
        </div>
        <p className="implication-note">{implication.note}</p>
      </div>
    </div>
  )
}

function strengthToDir(strength: number): 'up' | 'flat' | 'down' {
  if (strength > 0) return 'up'
  if (strength < 0) return 'down'
  return 'flat'
}

function strengthToArrow(strength: number): string {
  if (strength >= 2) return '↑↑'
  if (strength === 1) return '↑'
  if (strength === 0) return '→'
  if (strength === -1) return '↓'
  return '↓↓'
}
