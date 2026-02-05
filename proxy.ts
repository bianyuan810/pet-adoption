import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { rateLimitCheck } from '@/app/lib/rate-limit'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

const publicPaths = ['/login', '/register', '/auth/login', '/auth/register','/images']

const adminPaths = ['/admin']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 对所有API请求进行限流检查
  if (pathname.startsWith('/api')) {
    const rateLimitResult = await rateLimitCheck(request)
    if (rateLimitResult) {
      return rateLimitResult
    }
  }

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    if (pathname.startsWith('/api')) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyToken(token)

  if (!payload) {
    if (pathname.startsWith('/api')) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Token 无效或已过期'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (payload.role !== 'admin') {
      if (pathname.startsWith('/api')) {
        const response: ApiResponse = {
          code: HttpStatus.FORBIDDEN,
          msg: '权限不足'
        };
        return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
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
