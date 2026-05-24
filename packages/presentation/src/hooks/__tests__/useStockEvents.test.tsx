import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import React from 'react'
import { RepositoryContext } from '../../context/RepositoryContext'
import { useStockEvents } from '../useStockEvents'
import type { StockEventRepository, StockEvent, EventFilter } from '@graeseo/domain'

const makeEvent = (overrides: Partial<StockEvent> = {}): StockEvent => ({
  id: 'evt-1',
  title: '테슬라 주주총회',
  date: '5/27',
  day: '화',
  daysLeft: 3,
  stock: 'tsla',
  concept: '머스크 연간 계획 공개',
  why: '발언 한 줄로 주가가 움직임',
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
    return this.events.filter(e => e.stock === filter)
  }

  async getById(id: string): Promise<StockEvent | null> {
    return this.events.find(e => e.id === id) ?? null
  }
}

class FakeErrorStockEventRepository implements StockEventRepository {
  async getAll(): Promise<StockEvent[]> { throw new Error('network error') }
  async getByFilter(): Promise<StockEvent[]> { throw new Error('network error') }
  async getById(): Promise<StockEvent | null> { throw new Error('network error') }
}

const tslaEvent = makeEvent({ id: 'tsla-1', stock: 'tsla' })
const pltrEvent = makeEvent({ id: 'pltr-1', stock: 'pltr', title: 'AIPCon 5' })
const macroEvent = makeEvent({ id: 'macro-1', stock: null, title: 'FOMC 6월 회의' })

const makeWrapper = (repo: StockEventRepository) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(RepositoryContext.Provider, {
      value: { stockEventRepository: repo, scenarioRepository: null as never, marketTopicRepository: null as never, stockRepository: null as never },
      children,
    })

describe('useStockEvents', () => {
  it('초기 상태에서 isLoading이 true다', () => {
    const repo = new FakeStockEventRepository([tslaEvent])
    const { result } = renderHook(() => useStockEvents('all'), { wrapper: makeWrapper(repo) })
    expect(result.current.isLoading).toBe(true)
  })

  it('데이터 로드 후 isLoading이 false다', async () => {
    const repo = new FakeStockEventRepository([tslaEvent])
    const { result } = renderHook(() => useStockEvents('all'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('filter가 all이면 전체 이벤트를 반환한다', async () => {
    const repo = new FakeStockEventRepository([tslaEvent, pltrEvent, macroEvent])
    const { result } = renderHook(() => useStockEvents('all'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.events).toHaveLength(3)
  })

  it('filter가 tsla이면 tsla 이벤트만 반환한다', async () => {
    const repo = new FakeStockEventRepository([tslaEvent, pltrEvent, macroEvent])
    const { result } = renderHook(() => useStockEvents('tsla'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0]?.stock).toBe('tsla')
  })

  it('filter가 pltr이면 pltr 이벤트만 반환한다', async () => {
    const repo = new FakeStockEventRepository([tslaEvent, pltrEvent, macroEvent])
    const { result } = renderHook(() => useStockEvents('pltr'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0]?.stock).toBe('pltr')
  })

  it('빈 저장소에서는 빈 배열을 반환한다', async () => {
    const repo = new FakeStockEventRepository([])
    const { result } = renderHook(() => useStockEvents('all'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.events).toHaveLength(0)
  })

  it('저장소에서 에러가 발생하면 isLoading이 false이고 events는 빈 배열이다', async () => {
    const repo = new FakeErrorStockEventRepository()
    const { result } = renderHook(() => useStockEvents('all'), { wrapper: makeWrapper(repo) })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.events).toHaveLength(0)
  })
})
