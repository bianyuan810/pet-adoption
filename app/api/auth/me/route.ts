import { NextRequest, NextResponse } from 'next/server';
import { authLogger } from '@/app/lib';
import { verifyToken } from '@/app/lib/auth'
import { supabase } from '@/app/lib/supabase'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    const payload = verifyToken(token)

    if (!payload) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Token 无效或已过期'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, phone, wechat, avatar_url, role, created_at, updated_at')
      .eq('id', payload.userId)
      .single()

    if (error || !user) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '用户不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取用户信息成功',
      data: { user }
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    authLogger.error('获取用户信息接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
