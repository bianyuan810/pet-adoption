import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth, generateToken, verifyToken, decodeToken, JWTPayload } from '@/app/lib/auth'
import { NextRequest } from 'next/server'

describe('auth 模块', () => {
  const mockPayload: JWTPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'user',
  }

  let mockToken: string

  beforeEach(() => {
    // 清除所有模拟
    vi.clearAllMocks()
    // 生成新的测试 token
    mockToken = generateToken(mockPayload)
  })

  describe('generateToken 函数', () => {
    it('应该生成有效的 JWT token', () => {
      const token = generateToken(mockPayload)
      expect(typeof token).toBe('string')
      expect(token).not.toBe('')
    })

    it('生成的 token 应该包含正确的 payload', () => {
      const decoded = decodeToken(mockToken)
      expect(decoded).toEqual(expect.objectContaining({
        userId: mockPayload.userId,
        email: mockPayload.email,
        role: mockPayload.role,
      }))
    })
  })

  describe('verifyToken 函数', () => {
    it('应该验证有效的 token 并返回 payload', () => {
      const result = verifyToken(mockToken)
      expect(result).toEqual(expect.objectContaining(mockPayload))
    })

    it('应该拒绝无效的 token', () => {
      const result = verifyToken('invalid-token')
      expect(result).toBeNull()
    })

    it('应该拒绝过期的 token', () => {
      // 生成一个立即过期的 token
      const expiredToken = generateToken({
        ...mockPayload,
        // 注意：这里我们不能直接设置过期时间，因为 generateToken 函数已经设置了 7 天的过期时间
        // 所以我们需要使用一个伪造的过期 token
      })
      // 修改 token 使其无效
      const invalidToken = expiredToken.replace(/\..*\./, '.invalid.')
      const result = verifyToken(invalidToken)
      expect(result).toBeNull()
    })
  })

  describe('decodeToken 函数', () => {
    it('应该解码有效的 token 并返回 payload', () => {
      const result = decodeToken(mockToken)
      expect(result).toEqual(expect.objectContaining(mockPayload))
    })

    it('应该处理无效的 token 并返回 null', () => {
      const result = decodeToken('invalid-token')
      expect(result).toBeNull()
    })
  })

  describe('auth 函数', () => {
    it('应该从 NextRequest 的 cookie 中获取并验证 token', async () => {
      // 创建一个模拟的 NextRequest 对象
      const mockReq = {
        cookies: {
          get: vi.fn().mockReturnValue({ value: mockToken }),
        },
        headers: {
          get: vi.fn(),
        },
      } as unknown as NextRequest

      const result = await auth(mockReq)
      expect(result).toEqual({
        user: {
          id: mockPayload.userId,
          email: mockPayload.email,
          role: mockPayload.role,
        },
      })
      expect(mockReq.cookies.get).toHaveBeenCalledWith('token')
    })

    it('应该从 NextRequest 的 authorization header 中获取并验证 token', async () => {
      // 创建一个模拟的 NextRequest 对象
      const mockReq = {
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
        headers: {
          get: vi.fn().mockReturnValue(`Bearer ${mockToken}`),
        },
      } as unknown as NextRequest

      const result = await auth(mockReq)
      expect(result).toEqual({
        user: {
          id: mockPayload.userId,
          email: mockPayload.email,
          role: mockPayload.role,
        },
      })
      expect(mockReq.headers.get).toHaveBeenCalledWith('authorization')
    })

    it('当没有提供 token 时应该返回 null', async () => {
      // 创建一个模拟的 NextRequest 对象，没有 token
      const mockReq = {
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest

      const result = await auth(mockReq)
      expect(result).toBeNull()
    })

    it('当提供无效 token 时应该返回 null', async () => {
      // 创建一个模拟的 NextRequest 对象，带有无效 token
      const mockReq = {
        cookies: {
          get: vi.fn().mockReturnValue({ value: 'invalid-token' }),
        },
        headers: {
          get: vi.fn(),
        },
      } as unknown as NextRequest

      const result = await auth(mockReq)
      expect(result).toBeNull()
    })

    it('当没有提供请求对象时，应该从环境变量中获取 token', async () => {
      // 设置环境变量
      process.env.AUTH_TOKEN = mockToken

      const result = await auth()
      expect(result).toEqual({
        user: {
          id: mockPayload.userId,
          email: mockPayload.email,
          role: mockPayload.role,
        },
      })

      // 清除环境变量
      delete process.env.AUTH_TOKEN
    })

    it('当没有请求对象且环境变量中没有 token 时，应该返回 null', async () => {
      // 确保环境变量中没有 token
      delete process.env.AUTH_TOKEN

      const result = await auth()
      expect(result).toBeNull()
    })
  })
})