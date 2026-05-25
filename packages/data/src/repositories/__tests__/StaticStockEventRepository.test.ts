import { describe, it, expect, beforeEach } from 'vitest'
import { StaticStockEventRepository } from '../StaticStockEventRepository'

describe('StaticStockEventRepository', () => {
  let repo: StaticStockEventRepository

  beforeEach(() => {
    repo = new StaticStockEventRepository()
  })

  describe('getAll', () => {
    it('8개 이벤트를 반환한다', async () => {
      const events = await repo.getAll()
      expect(events).toHaveLength(8)
    })

    it('모든 이벤트는 유효한 importance를 가진다', async () => {
      const events = await repo.getAll()
      expect(events.every(e => e.importance === 'high' || e.importance === 'medium')).toBe(true)
    })

    it('모든 이벤트는 id와 title을 가진다', async () => {
      const events = await repo.getAll()
      expect(events.every(e => e.id.length > 0 && e.title.length > 0)).toBe(true)
    })
  })

  describe('getByFilter', () => {
    it('"all" 필터는 8개 전체 이벤트를 반환한다', async () => {
      const events = await repo.getByFilter('all')
      expect(events).toHaveLength(8)
    })

    it('"tsla" 필터는 tsla 이벤트 3개만 반환한다', async () => {
      const events = await repo.getByFilter('tsla')
      expect(events).toHaveLength(3)
      expect(events.every(e => e.stock === 'tsla')).toBe(true)
    })

    it('"pltr" 필터는 pltr 이벤트 2개만 반환한다', async () => {
      const events = await repo.getByFilter('pltr')
      expect(events).toHaveLength(2)
      expect(events.every(e => e.stock === 'pltr')).toBe(true)
    })

    it('tsla + pltr + 매크로 이벤트 수의 합은 전체와 같다', async () => {
      const all = await repo.getByFilter('all')
      const tsla = await repo.getByFilter('tsla')
      const pltr = await repo.getByFilter('pltr')
      const macroCount = all.filter(e => e.stock === null).length
      expect(tsla.length + pltr.length + macroCount).toBe(all.length)
    })
  })

  describe('getById', () => {
    it('존재하는 id로 이벤트를 조회할 수 있다', async () => {
      const event = await repo.getById('테슬라 주주총회')
      expect(event).not.toBeNull()
      expect(event?.title).toBe('테슬라 주주총회')
      expect(event?.stock).toBe('tsla')
    })

    it('매크로 이벤트 id로 조회하면 stock이 null이다', async () => {
      const event = await repo.getById('美 4월 PCE 발표')
      expect(event).not.toBeNull()
      expect(event?.stock).toBeNull()
    })

    it('존재하지 않는 id는 null을 반환한다', async () => {
      const event = await repo.getById('nonexistent')
      expect(event).toBeNull()
    })
  })
})
