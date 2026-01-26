import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('cn 函数', () => {
  it('应该正确合并类名', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('应该正确合并冲突的 Tailwind 类', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('应该忽略假值', () => {
    expect(cn('a', null, undefined, false, 0, '')).toBe('a')
  })

  it('应该处理条件类名', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })

  it('应该处理复杂的类名组合', () => {
    expect(cn('a', { b: true, c: false }, 'd', ['e', 'f'])).toBe('a b d e f')
  })
})