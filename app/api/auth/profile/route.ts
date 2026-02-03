import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { supabase } from '@/app/lib/supabase'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

interface UpdateProfileRequest {
  name: string
  phone?: string
  wechat?: string
  avatar_url?: string
}

export async function PUT(request: NextRequest) {
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

    const body: UpdateProfileRequest = await request.json()

    // 验证必填字段
    if (!body.name || body.name.trim() === '') {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '姓名不能为空'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 更新用户资料
    const { data: user, error } = await supabase
      .from('users')
      .update({
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        wechat: body.wechat?.trim() || null,
        avatar_url: body.avatar_url?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.userId)
      .select('id, email, name, phone, wechat, avatar_url, role, created_at, updated_at')
      .single()

    if (error) {
      console.error('更新用户资料失败:', error)
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '更新个人资料失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '更新个人资料成功',
      data: { user }
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('个人资料更新接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
