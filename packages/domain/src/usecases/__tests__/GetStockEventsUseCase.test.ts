import { describe, it, expect, beforeEach } from 'vitest'
import { GetStockEventsUseCase } from '../GetStockEventsUseCase'
import type { StockEventRepository } from '../../repositories/StockEventRepository'
import type { StockEvent, EventFilter } from '../../entities/StockEvent'

const makeEvent = (overrides: Partial<StockEvent> = {}): StockEvent => ({
  id: 'evt-1',
  title: '테슬라 주주총회',
  date: '5/27',
  day: '화',
  daysLeft: 3,
  stock: 'tsla',
  concept: '머스크가 한 해 계획을 공개하는 자리',
  why: '발언 한 줄로 주가가 움직이는 자리',
  importance: 'high',
  ...overrides,
})

class FakeStockEventRepository implements StockEventRepository {
  constructor(private readonly events: StockEvent[]) {}

  async getAll(): Promise<StockEvent[]> {
    return this.events
  }

  async getByFilter(filter: EventFilter): Promise<StockEvent[]> {
    if (filter === 'all') return this.events
    return this.events.filter((e) => e.stock === filter)
  }

  async getById(id: string): Promise<StockEvent | null> {
    return this.events.find((e) => e.id === id) ?? null
  }
}

describe('GetStockEventsUseCase', () => {
  const tslaEvent = makeEvent({ id: 'tsla-1', stock: 'tsla', title: '테슬라 주주총회' })
  const pltrEvent = makeEvent({ id: 'pltr-1', stock: 'pltr', title: 'AIPCon 5' })
  const macroEvent = makeEvent({ id: 'macro-1', stock: null, title: 'FOMC 6월 회의' })

  let useCase: GetStockEventsUseCase

  beforeEach(() => {
    useCase = new GetStockEventsUseCase(
      new FakeStockEventRepository([tslaEvent, pltrEvent, macroEvent]),
    )
  })

  describe('전체 필터(all)', () => {
    it('모든 이벤트를 반환한다', async () => {
      const result = await useCase.execute('all')
      expect(result).toHaveLength(3)
    })

    it('테슬라, 팔란티어, 거시 이벤트를 모두 포함한다', async () => {
      const result = await useCase.execute('all')
      const ids = result.map((e) => e.id)
      expect(ids).toContain('tsla-1')
      expect(ids).toContain('pltr-1')
      expect(ids).toContain('macro-1')
    })
  })

  describe('종목 필터(tsla)', () => {
    it('테슬라 이벤트만 반환한다', async () => {
      const result = await useCase.execute('tsla')
      expect(result).toHaveLength(1)
      expect(result[0]?.stock).toBe('tsla')
    })

    it('팔란티어와 거시 이벤트는 제외한다', async () => {
      const result = await useCase.execute('tsla')
      expect(result.every((e) => e.stock === 'tsla')).toBe(true)
    })
  })

  describe('종목 필터(pltr)', () => {
    it('팔란티어 이벤트만 반환한다', async () => {
      const result = await useCase.execute('pltr')
      expect(result).toHaveLength(1)
      expect(result[0]?.stock).toBe('pltr')
    })
  })

  describe('이벤트가 없을 때', () => {
    it('빈 리스트를 반환한다', async () => {
      const emptyUseCase = new GetStockEventsUseCase(new FakeStockEventRepository([]))
      const result = await emptyUseCase.execute('all')
      expect(result).toHaveLength(0)
    })

    it('해당 종목 이벤트가 없으면 빈 리스트를 반환한다', async () => {
      const tslaOnlyUseCase = new GetStockEventsUseCase(
        new FakeStockEventRepository([tslaEvent]),
      )
      const result = await tslaOnlyUseCase.execute('pltr')
      expect(result).toHaveLength(0)
    })
  })
})
