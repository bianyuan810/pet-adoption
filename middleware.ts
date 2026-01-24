import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register']

const adminPaths = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyToken(token)

  if (!payload) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Token 无效或已过期' },
        { status: 401 }
      )
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (payload.role !== 'admin') {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: '权限不足' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-user-id', payload.userId)
  response.headers.set('x-user-email', payload.email)
  response.headers.set('x-user-role', payload.role)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
