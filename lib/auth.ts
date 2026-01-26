import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置')
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

// 从请求中获取并验证 token，返回用户信息
export async function auth(req?: NextRequest): Promise<Session | null> {
  let token: string | null = null
  
  // 如果提供了请求对象，从 cookie 或 authorization header 中获取 token
  if (req) {
    token = (req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')) || null
    
  } else {
    // 从环境变量或其他来源获取 token（适用于服务端调用）
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
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): JWTPayload | null {
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
