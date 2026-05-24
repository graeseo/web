import type { ScenarioCard, ScenarioDirection } from '@graeseo/domain'

interface KindConfig {
  label: string
  arrow: string
}

const KIND: Record<ScenarioDirection, KindConfig> = {
  up:   { label: '상승', arrow: '↑' },
  flat: { label: '횡보', arrow: '→' },
  down: { label: '하락', arrow: '↓' },
}

interface Props {
  card: ScenarioCard
}

export function ScenarioCardView({ card }: Props) {
  const config = KIND[card.kind]

  return (
    <article className={`scenario-card scenario-card--${card.kind}`}>
      <div className="scenario-card-header">
        <span className={`scenario-kind-badge scenario-kind-badge--${card.kind}`}>
          {config.arrow} {config.label}
        </span>
        <span className="scenario-probability">{card.probability}%</span>
      </div>
      <h3 className="scenario-card-title">{card.title}</h3>
      <p className="scenario-oneline">{card.oneLine}</p>
      <p className="scenario-why">{card.why}</p>
      {card.signals.length > 0 && (
        <ul className="scenario-signals">
          {card.signals.map((signal, i) => (
            <li key={i} className="scenario-signal">
              <span className="signal-title">{signal.title}</span>
              <span className="signal-desc">{signal.description}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
