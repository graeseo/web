import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveFilter } from '../useActiveFilter'

describe('useActiveFilter', () => {
  it('초기 필터는 all이다', () => {
    const { result } = renderHook(() => useActiveFilter())
    expect(result.current.filter).toBe('all')
  })

  it('초기값을 지정할 수 있다', () => {
    const { result } = renderHook(() => useActiveFilter('tsla'))
    expect(result.current.filter).toBe('tsla')
  })

  it('setFilter로 tsla로 변경할 수 있다', () => {
    const { result } = renderHook(() => useActiveFilter())
    act(() => result.current.setFilter('tsla'))
    expect(result.current.filter).toBe('tsla')
  })

  it('setFilter로 pltr로 변경할 수 있다', () => {
    const { result } = renderHook(() => useActiveFilter())
    act(() => result.current.setFilter('pltr'))
    expect(result.current.filter).toBe('pltr')
  })

  it('setFilter로 all로 되돌릴 수 있다', () => {
    const { result } = renderHook(() => useActiveFilter('tsla'))
    act(() => result.current.setFilter('all'))
    expect(result.current.filter).toBe('all')
  })
})
