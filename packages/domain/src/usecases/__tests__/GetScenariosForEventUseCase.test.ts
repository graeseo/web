import { describe, it, expect, beforeEach } from 'vitest'
import { GetScenariosForEventUseCase } from '../GetScenariosForEventUseCase'
import type { ScenarioRepository } from '../../repositories/ScenarioRepository'
import type { Scenario } from '../../entities/Scenario'
import type { StockKey } from '../../entities/Stock'

const makeScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  eventId: 'tsla-agm',
  stock: 'tsla',
  cards: [
    {
      kind: 'up',
      impact: '+5~8%',
      title: '로보택시 10개 도시 추가 발표',
      oneLine: '머스크가 구체적인 도시 리스트와 일정을 들고 나오는 경우',
      why: '작년 발표 후 5거래일 +7.2%',
      signals: [{ title: '머스크 X 게시', description: '주총 직전 기대 트윗' }],
      probability: 30,
    },
    {
      kind: 'flat',
      impact: '−2~+2%',
      title: 'FSD v14 로드맵 재확인',
      oneLine: '컨센서스 그대로, 새 뉴스 없음',
      why: '단기 트레이더 차익 실현 패턴',
      signals: [{ title: '공시 의안', description: '신규 안건 없음' }],
      probability: 50,
    },
    {
      kind: 'down',
      impact: '−3~−5%',
      title: '잡담 위주, 발표 부재',
      oneLine: '머스크가 정치·AI 일반론으로 시간을 채우는 경우',
      why: '2023년 동일 패턴 시 5거래일 평균 -4.2%',
      signals: [{ title: 'X 활동', description: '정치 관련 게시 급증' }],
      probability: 20,
    },
  ],
  ...overrides,
})

class FakeScenarioRepository implements ScenarioRepository {
  constructor(private readonly scenarios: Scenario[]) {}

  async getByEventId(eventId: string, stock: StockKey): Promise<Scenario | null> {
    return this.scenarios.find((s) => s.eventId === eventId && s.stock === stock) ?? null
  }

  async getByEventIdForAllStocks(eventId: string): Promise<Scenario[]> {
    return this.scenarios.filter((s) => s.eventId === eventId)
  }
}

describe('GetScenariosForEventUseCase', () => {
  const tslaAgmScenario = makeScenario({ eventId: 'tsla-agm', stock: 'tsla' })
  const pltrAipconScenario = makeScenario({ eventId: 'pltr-aipcon', stock: 'pltr' })
  const fomcTslaScenario = makeScenario({ eventId: 'fomc-june', stock: 'tsla' })
  const fomcPltrScenario = makeScenario({ eventId: 'fomc-june', stock: 'pltr' })

  let useCase: GetScenariosForEventUseCase

  beforeEach(() => {
    useCase = new GetScenariosForEventUseCase(
      new FakeScenarioRepository([
        tslaAgmScenario,
        pltrAipconScenario,
        fomcTslaScenario,
        fomcPltrScenario,
      ]),
    )
  })

  describe('종목 이벤트 시나리오 조회', () => {
    it('테슬라 주총 이벤트의 테슬라 시나리오를 반환한다', async () => {
      const result = await useCase.execute('tsla-agm', 'tsla')
      expect(result).not.toBeNull()
      expect(result?.stock).toBe('tsla')
      expect(result?.eventId).toBe('tsla-agm')
    })

    it('시나리오 카드는 3개(상승/보합/하락)를 포함한다', async () => {
      const result = await useCase.execute('tsla-agm', 'tsla')
      expect(result?.cards).toHaveLength(3)
      const kinds = result?.cards.map((c) => c.kind)
      expect(kinds).toContain('up')
      expect(kinds).toContain('flat')
      expect(kinds).toContain('down')
    })

    it('시나리오 카드의 확률 합은 100이다', async () => {
      const result = await useCase.execute('tsla-agm', 'tsla')
      const total = result?.cards.reduce((sum, c) => sum + c.probability, 0)
      expect(total).toBe(100)
    })
  })

  describe('거시 이벤트 시나리오 조회', () => {
    it('FOMC 이벤트에서 테슬라 관점 시나리오를 반환한다', async () => {
      const result = await useCase.execute('fomc-june', 'tsla')
      expect(result?.stock).toBe('tsla')
    })

    it('FOMC 이벤트에서 팔란티어 관점 시나리오를 반환한다', async () => {
      const result = await useCase.execute('fomc-june', 'pltr')
      expect(result?.stock).toBe('pltr')
    })

    it('같은 이벤트라도 종목에 따라 다른 시나리오를 반환한다', async () => {
      const tslaResult = await useCase.execute('fomc-june', 'tsla')
      const pltrResult = await useCase.execute('fomc-june', 'pltr')
      expect(tslaResult?.stock).not.toBe(pltrResult?.stock)
    })
  })

  describe('시나리오가 없을 때', () => {
    it('매핑되지 않은 이벤트이면 null을 반환한다', async () => {
      const result = await useCase.execute('unknown-event', 'tsla')
      expect(result).toBeNull()
    })

    it('이벤트가 있어도 해당 종목 시나리오가 없으면 null을 반환한다', async () => {
      const result = await useCase.execute('tsla-agm', 'pltr')
      expect(result).toBeNull()
    })
  })
})
