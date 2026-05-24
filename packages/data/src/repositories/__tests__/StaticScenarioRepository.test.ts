import { describe, it, expect, beforeEach } from 'vitest'
import { StaticScenarioRepository } from '../StaticScenarioRepository'

describe('StaticScenarioRepository', () => {
  let repo: StaticScenarioRepository

  beforeEach(() => {
    repo = new StaticScenarioRepository()
  })

  describe('getByEventId', () => {
    it('이벤트 id와 종목으로 시나리오를 조회할 수 있다', async () => {
      const scenario = await repo.getByEventId('테슬라 주주총회', 'tsla')
      expect(scenario).not.toBeNull()
      expect(scenario?.eventId).toBe('테슬라 주주총회')
      expect(scenario?.stock).toBe('tsla')
    })

    it('시나리오 카드는 up / flat / down 3개다', async () => {
      const scenario = await repo.getByEventId('테슬라 주주총회', 'tsla')
      expect(scenario?.cards).toHaveLength(3)
      const kinds = scenario?.cards.map(c => c.kind) ?? []
      expect(kinds).toContain('up')
      expect(kinds).toContain('flat')
      expect(kinds).toContain('down')
    })

    it('카드 확률의 합은 100이다 — tsla 주주총회', async () => {
      const scenario = await repo.getByEventId('테슬라 주주총회', 'tsla')
      const total = scenario?.cards.reduce((sum, c) => sum + c.probability, 0) ?? 0
      expect(total).toBe(100)
    })

    it('카드 확률의 합은 100이다 — pltr AIPCon', async () => {
      const scenario = await repo.getByEventId('AIPCon 5 (AIP 컨퍼런스)', 'pltr')
      const total = scenario?.cards.reduce((sum, c) => sum + c.probability, 0) ?? 0
      expect(total).toBe(100)
    })

    it('매크로 이벤트도 종목별 시나리오를 조회할 수 있다', async () => {
      const tslaPce = await repo.getByEventId('美 4월 PCE 발표', 'tsla')
      const pltrPce = await repo.getByEventId('美 4월 PCE 발표', 'pltr')
      expect(tslaPce).not.toBeNull()
      expect(pltrPce).not.toBeNull()
    })

    it('이벤트 id는 일치하지만 종목이 다르면 null을 반환한다', async () => {
      const scenario = await repo.getByEventId('테슬라 주주총회', 'pltr')
      expect(scenario).toBeNull()
    })

    it('존재하지 않는 이벤트 id는 null을 반환한다', async () => {
      const scenario = await repo.getByEventId('nonexistent', 'tsla')
      expect(scenario).toBeNull()
    })

    it('각 시나리오 카드는 signals를 가진다', async () => {
      const scenario = await repo.getByEventId('테슬라 주주총회', 'tsla')
      expect(scenario?.cards.every(c => c.signals.length > 0)).toBe(true)
    })
  })

  describe('getByEventIdForAllStocks', () => {
    it('단일 종목 이벤트는 1개의 시나리오를 반환한다', async () => {
      const scenarios = await repo.getByEventIdForAllStocks('테슬라 주주총회')
      expect(scenarios).toHaveLength(1)
      expect(scenarios[0]?.stock).toBe('tsla')
    })

    it('매크로 이벤트는 종목별 시나리오 2개를 반환한다', async () => {
      const scenarios = await repo.getByEventIdForAllStocks('美 4월 PCE 발표')
      expect(scenarios).toHaveLength(2)
      const stocks = scenarios.map(s => s.stock)
      expect(stocks).toContain('tsla')
      expect(stocks).toContain('pltr')
    })

    it('존재하지 않는 이벤트 id는 빈 배열을 반환한다', async () => {
      const scenarios = await repo.getByEventIdForAllStocks('nonexistent')
      expect(scenarios).toHaveLength(0)
    })
  })
})
