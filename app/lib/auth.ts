import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
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


