import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// 模拟环境变量
process.env.JWT_SECRET = 'test-jwt-secret'

// 模拟 Next.js 相关的 API
vi.mock('next/cookies', () => ({
  cookies: {
    get: vi.fn(() => null),
  },
}))

// 简化 NextRequest 模拟
vi.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    cookies: { get: () => { value: string } | null }
    headers: { get: () => string | null }
    
    constructor() {
      this.cookies = { get: vi.fn(() => null) }
      this.headers = { get: vi.fn(() => null) }
    }
  },
}))