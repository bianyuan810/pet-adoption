import { NextRequest, NextResponse } from 'next/server'

// 内存存储实现
class MemoryStore {
  private data: Map<string, { count: number; timestamp: number }> = new Map()
  
  async get(key: string): Promise<{ count: number; timestamp: number } | undefined> {
    return this.data.get(key)
  }
  
  async set(key: string, value: { count: number; timestamp: number }): Promise<void> {
    this.data.set(key, value)
  }
  
  async delete(key: string): Promise<void> {
    this.data.delete(key)
  }
}

// 存储实例
const store = new MemoryStore()

// 配置
const CONFIG = {
  // 每个IP在指定时间窗口内的最大请求数
  limit: 10, // 测试用，设置为10个请求
  // 时间窗口（毫秒）
  window: 60 * 1000, // 1分钟
}

/**
 * 限流检查
 * @param request NextRequest对象
 * @returns 限流检查结果，返回NextResponse表示被限流，返回null表示通过
 */
export async function rateLimitCheck(request: NextRequest): Promise<NextResponse | null> {
  // 获取客户端IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  // 生成存储键
  const key = `rate-limit:${ip}`
  
  // 获取当前计数
  const now = Date.now()
  const entry = await store.get(key)
  
  if (entry) {
    // 检查是否在时间窗口内
    if (now - entry.timestamp < CONFIG.window) {
      // 检查是否超过限制
      if (entry.count >= CONFIG.limit) {
        return NextResponse.json(
          {
            success: false,
            error: '请求过于频繁，请稍后再试'
          },
          {
            status: 429
          }
        )
      }
      // 增加计数
      await store.set(key, {
        count: entry.count + 1,
        timestamp: entry.timestamp
      })
    } else {
      // 时间窗口已过，重置计数
      await store.set(key, {
        count: 1,
        timestamp: now
      })
    }
  } else {
    // 首次请求，初始化计数
    await store.set(key, {
      count: 1,
      timestamp: now
    })
  }
  
  return null
}

/**
 * 限流响应处理
 * @returns 429状态的响应
 */
export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: '请求过于频繁，请稍后再试'
    },
    {
      status: 429
    }
  )
}

