import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'
import { HttpStatus } from '@/types/api'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
})

export async function POST(request: NextRequest) {
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

    const body = await request.json()

    const validationResult = changePasswordSchema.safeParse(body)

    if (!validationResult.success) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '请求数据格式错误',
        data: { details: validationResult.error.issues }
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    const { currentPassword, newPassword } = validationResult.data

    // 获取用户当前密码
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, password')
      .eq('id', payload.userId)
      .single()

    if (fetchError || !user) {
      console.error('获取用户信息失败:', fetchError)
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '获取用户信息失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    // 验证当前密码
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '当前密码错误'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // 哈希新密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // 更新密码
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', payload.userId)

    if (updateError) {
      console.error('更新密码失败:', updateError)
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '更新密码失败，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '密码修改成功'
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('修改密码接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
