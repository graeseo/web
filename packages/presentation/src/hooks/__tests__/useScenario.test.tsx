import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { RepositoryContext } from '../../context/RepositoryContext'
import { useScenario } from '../useScenario'
import type { ScenarioRepository, Scenario, StockKey } from '@graeseo/domain'

const makeScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  eventId: '테슬라 주주총회',
  stock: 'tsla',
  cards: [
    {
      kind: 'up',
      title: '긍정적',
      oneLine: '주가 상승',
      why: '머스크 발언',
      signals: [{ title: '신호 1', description: '설명 1' }],
      probability: 50,
    },
    {
      kind: 'flat',
      title: '중립',
      oneLine: '보합',
      why: '불확실',
      signals: [{ title: '신호 2', description: '설명 2' }],
      probability: 30,
    },
    {
      kind: 'down',
      title: '부정적',
      oneLine: '주가 하락',
      why: '악재 발언',
      signals: [{ title: '신호 3', description: '설명 3' }],
      probability: 20,
    },
  ],
  ...overrides,
})

class FakeScenarioRepository implements ScenarioRepository {
  private readonly scenarios: Scenario[]
  constructor(scenarios: Scenario[]) {
    this.scenarios = scenarios
  }

  async getByEventId(eventId: string, stock: StockKey): Promise<Scenario | null> {
    return this.scenarios.find(s => s.eventId === eventId && s.stock === stock) ?? null
  }

  async getByEventIdForAllStocks(eventId: string): Promise<Scenario[]> {
    return this.scenarios.filter(s => s.eventId === eventId)
  }
}

class FakeErrorScenarioRepository implements ScenarioRepository {
  async getByEventId(): Promise<Scenario | null> { throw new Error('network error') }
  async getByEventIdForAllStocks(): Promise<Scenario[]> { throw new Error('network error') }
}

const tslaScenario = makeScenario()
const pltrScenario = makeScenario({ eventId: 'AIPCon 5', stock: 'pltr' })

const makeWrapper = (repo: ScenarioRepository) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(RepositoryContext.Provider, {
      value: { stockEventRepository: null as never, scenarioRepository: repo },
      children,
    })

describe('useScenario', () => {
  it('초기 상태에서 isLoading이 true다', () => {
    const repo = new FakeScenarioRepository([tslaScenario])
    const { result } = renderHook(() => useScenario('테슬라 주주총회', 'tsla'), { wrapper: makeWrapper(repo) })
    expect(result.current.isLoading).toBe(true)
  })

  it('데이터 로드 후 isLoading이 false다', async () => {
    const repo = new FakeScenarioRepository([tslaScenario])
    const { result } = renderHook(() => useScenario('테슬라 주주총회', 'tsla'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('올바른 eventId와 stock으로 시나리오를 반환한다', async () => {
    const repo = new FakeScenarioRepository([tslaScenario, pltrScenario])
    const { result } = renderHook(() => useScenario('테슬라 주주총회', 'tsla'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.scenario).not.toBeNull()
    expect(result.current.scenario?.stock).toBe('tsla')
  })

  it('존재하지 않는 이벤트면 scenario가 null이다', async () => {
    const repo = new FakeScenarioRepository([tslaScenario])
    const { result } = renderHook(() => useScenario('없는이벤트', 'tsla'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.scenario).toBeNull()
  })

  it('stock이 다르면 scenario가 null이다', async () => {
    const repo = new FakeScenarioRepository([tslaScenario])
    const { result } = renderHook(() => useScenario('테슬라 주주총회', 'pltr'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.scenario).toBeNull()
  })

  it('시나리오 카드가 3개다', async () => {
    const repo = new FakeScenarioRepository([tslaScenario])
    const { result } = renderHook(() => useScenario('테슬라 주주총회', 'tsla'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.scenario?.cards).toHaveLength(3)
  })

  it('저장소에서 에러가 발생하면 isLoading이 false이고 scenario는 null이다', async () => {
    const repo = new FakeErrorScenarioRepository()
    const { result } = renderHook(() => useScenario('테슬라 주주총회', 'tsla'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.scenario).toBeNull()
  })
})
