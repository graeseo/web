import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { RepositoryContext } from '../../context/RepositoryContext'
import { useStockScenario } from '../useStockScenario'
import type {
  ScenarioRepository,
  StockEventRepository,
  Scenario,
  ScenarioCard,
  StockEvent,
  StockKey,
  EventFilter,
} from '@graeseo/domain'

// ── Fixtures ──────────────────────────────────────────────────

const makeCard = (overrides: Partial<ScenarioCard> = {}): ScenarioCard => ({
  kind: 'up',
  title: '급등 시나리오',
  impact: '+5~8%',
  oneLine: '예상보다 강한 지표',
  why: '시장 기대 상회',
  signals: [{ title: '신호1', description: '설명1' }],
  probability: 60,
  ...overrides,
})

const makeScenario = (eventId: string, stock: StockKey): Scenario => ({
  eventId,
  stock,
  cards: [makeCard({ kind: 'up' }), makeCard({ kind: 'down', title: '하락 시나리오', probability: 40 })],
})

const makeEvent = (overrides: Partial<StockEvent> = {}): StockEvent => ({
  id: 'tsla-evt-1',
  title: '테슬라 주주총회',
  date: '5/27',
  day: '화',
  daysLeft: 3,
  stock: 'tsla',
  concept: '개념',
  why: '이유',
  importance: 'high',
  ...overrides,
})

// ── Fake repositories ─────────────────────────────────────────

class FakeScenarioRepository implements ScenarioRepository {
  constructor(private readonly scenarios: Scenario[]) {}

  async getByEventId(eventId: string, stock: StockKey): Promise<Scenario | null> {
    return this.scenarios.find(s => s.eventId === eventId && s.stock === stock) ?? null
  }

  async getByEventIdForAllStocks(eventId: string): Promise<Scenario[]> {
    return this.scenarios.filter(s => s.eventId === eventId)
  }
}

class FakeStockEventRepository implements StockEventRepository {
  constructor(private readonly events: StockEvent[]) {}

  async getAll(): Promise<StockEvent[]> { return this.events }

  async getByFilter(filter: EventFilter): Promise<StockEvent[]> {
    if (filter === 'all') return this.events
    return this.events.filter(e => e.stock === filter)
  }

  async getById(id: string): Promise<StockEvent | null> {
    return this.events.find(e => e.id === id) ?? null
  }
}

class FakeErrorRepository implements ScenarioRepository {
  async getByEventId(): Promise<Scenario | null> { throw new Error('network error') }
  async getByEventIdForAllStocks(): Promise<Scenario[]> { throw new Error('network error') }
}

// ── Wrapper ───────────────────────────────────────────────────

const makeWrapper = (
  scenarioRepo: ScenarioRepository,
  eventRepo: StockEventRepository,
) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(RepositoryContext.Provider, {
      value: {
        scenarioRepository: scenarioRepo,
        stockEventRepository: eventRepo,
        marketTopicRepository: null as never,
        stockRepository: null as never,
      },
      children,
    })

// ── Tests ─────────────────────────────────────────────────────

const tslaEvent = makeEvent({ id: 'tsla-evt-1', stock: 'tsla' })
const pltrEvent = makeEvent({ id: 'pltr-evt-1', stock: 'pltr', title: 'AIPCon 5' })
const tslaScenario = makeScenario('tsla-evt-1', 'tsla')
const pltrScenario = makeScenario('pltr-evt-1', 'pltr')

describe('useStockScenario', () => {
  describe('초기 상태', () => {
    it('isLoading이 true다', () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'tsla'),
        { wrapper: makeWrapper(new FakeScenarioRepository([tslaScenario]), new FakeStockEventRepository([tslaEvent])) },
      )
      expect(result.current.isLoading).toBe(true)
    })

    it('데이터 로드 후 isLoading이 false다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'tsla'),
        { wrapper: makeWrapper(new FakeScenarioRepository([tslaScenario]), new FakeStockEventRepository([tslaEvent])) },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
    })
  })

  describe('기본 조회 (폴백 없음)', () => {
    it('activeEventId에 해당 종목 시나리오가 있으면 그대로 반환한다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'tsla'),
        { wrapper: makeWrapper(new FakeScenarioRepository([tslaScenario]), new FakeStockEventRepository([tslaEvent])) },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenario).not.toBeNull()
      expect(result.current.scenario?.stock).toBe('tsla')
      expect(result.current.scenarioEventId).toBe('tsla-evt-1')
    })

    it('시나리오를 찾으면 scenarioEventId가 activeEventId와 같다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'tsla'),
        { wrapper: makeWrapper(new FakeScenarioRepository([tslaScenario]), new FakeStockEventRepository([tslaEvent])) },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenarioEventId).toBe('tsla-evt-1')
    })
  })

  describe('폴백 로직', () => {
    it('activeEventId에 해당 종목 시나리오가 없으면 종목 자체 이벤트의 시나리오로 폴백한다', async () => {
      // TSLA 이벤트가 active인데, PLTR 시나리오 조회 → PLTR 자체 이벤트(pltr-evt-1)로 폴백
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'pltr'),
        {
          wrapper: makeWrapper(
            new FakeScenarioRepository([tslaScenario, pltrScenario]),
            new FakeStockEventRepository([tslaEvent, pltrEvent]),
          ),
        },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenario).not.toBeNull()
      expect(result.current.scenario?.stock).toBe('pltr')
    })

    it('폴백 시 scenarioEventId는 폴백된 이벤트의 id다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'pltr'),
        {
          wrapper: makeWrapper(
            new FakeScenarioRepository([tslaScenario, pltrScenario]),
            new FakeStockEventRepository([tslaEvent, pltrEvent]),
          ),
        },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenarioEventId).toBe('pltr-evt-1')
    })

    it('폴백할 종목 이벤트가 없으면 scenario가 null이다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'pltr'),
        {
          wrapper: makeWrapper(
            new FakeScenarioRepository([tslaScenario]),
            new FakeStockEventRepository([]),  // pltr 이벤트 없음
          ),
        },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenario).toBeNull()
    })

    it('폴백할 이벤트는 있지만 그 이벤트의 시나리오도 없으면 scenario가 null이다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'pltr'),
        {
          wrapper: makeWrapper(
            new FakeScenarioRepository([tslaScenario]),  // pltr 시나리오 없음
            new FakeStockEventRepository([tslaEvent, pltrEvent]),
          ),
        },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenario).toBeNull()
    })

    it('종목 이벤트가 여러 개면 첫 번째 이벤트의 시나리오로 폴백한다', async () => {
      const pltrEvent2 = makeEvent({ id: 'pltr-evt-2', stock: 'pltr', title: 'PLTR Q2 실적' })
      const pltrScenario2 = makeScenario('pltr-evt-2', 'pltr')

      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'pltr'),
        {
          wrapper: makeWrapper(
            new FakeScenarioRepository([tslaScenario, pltrScenario, pltrScenario2]),
            new FakeStockEventRepository([tslaEvent, pltrEvent, pltrEvent2]),
          ),
        },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenarioEventId).toBe('pltr-evt-1')  // 첫 번째 pltr 이벤트
    })
  })

  describe('activeEventId 변경', () => {
    it('activeEventId가 바뀌면 새 시나리오를 다시 조회한다', async () => {
      const tslaEvent2 = makeEvent({ id: 'tsla-evt-2', stock: 'tsla', title: '테슬라 Q2 실적' })
      const tslaScenario2 = makeScenario('tsla-evt-2', 'tsla')

      const { result, rerender } = renderHook(
        ({ eventId }: { eventId: string }) => useStockScenario(eventId, 'tsla'),
        {
          initialProps: { eventId: 'tsla-evt-1' },
          wrapper: makeWrapper(
            new FakeScenarioRepository([tslaScenario, tslaScenario2]),
            new FakeStockEventRepository([tslaEvent, tslaEvent2]),
          ),
        },
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenarioEventId).toBe('tsla-evt-1')

      rerender({ eventId: 'tsla-evt-2' })
      await waitFor(() => expect(result.current.scenarioEventId).toBe('tsla-evt-2'))
    })
  })

  describe('에러 처리', () => {
    it('저장소 에러 시 scenario가 null이고 isLoading이 false다', async () => {
      const { result } = renderHook(
        () => useStockScenario('tsla-evt-1', 'tsla'),
        { wrapper: makeWrapper(new FakeErrorRepository(), new FakeStockEventRepository([tslaEvent])) },
      )
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.scenario).toBeNull()
      expect(result.current.scenarioEventId).toBe('')
    })
  })
})
