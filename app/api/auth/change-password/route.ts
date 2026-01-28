import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
})

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token 无效或已过期' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const validationResult = changePasswordSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '请求数据格式错误', details: validationResult.error.issues },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: '获取用户信息失败' },
        { status: 500 }
      )
    }

    // 验证当前密码
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '当前密码错误' },
        { status: 401 }
      )
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
      return NextResponse.json(
        { error: '更新密码失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '密码修改成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('修改密码接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
