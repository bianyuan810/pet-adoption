import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// 检查是否在服务端环境中运行
const isServer = typeof window === 'undefined'

// 只在服务端环境中检查 JWT_SECRET
const JWT_SECRET = isServer ? process.env.JWT_SECRET : ''

if (isServer && !JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未配置')
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

interface Session {
  user: {
    id: string
    email: string
    role: string
  }
}

// 认证函数，用于获取用户信息
export async function auth(req?: NextRequest): Promise<Session | null> {
  let token: string | null = null
  
  // 从请求中获取 token，优先从 cookie 中获取，其次从 authorization header 中获取
  if (req) {
    token = (req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')) || null
    
  } else {
    // 在非请求环境下，从环境变量中获取 token
    token = process.env.AUTH_TOKEN || null
  }
  
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return null
  }
  
  return {
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    }
  }
}

export function generateToken(payload: JWTPayload): string {
  if (!isServer) {
    throw new Error('generateToken 只能在服务端环境中使用')
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): JWTPayload | null {
  if (!isServer) {
    // 在客户端环境中，我们无法验证 token 的有效性，因为 JWT_SECRET 是服务端专用的
    // 这里我们可以尝试解码 token 来获取基本信息，但不能验证其有效性
    try {
      return jwt.decode(token) as JWTPayload
    } catch {
      return null
    }
  }
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch {
    return null
  }
}


