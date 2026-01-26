import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '请求数据格式错误', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, password, role, phone, wechat, created_at')
      .eq('email', email)
      .single()

    if (fetchError) {
      console.error('查询用户时出错:', fetchError)
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 使用下划线约定表示故意不使用的变量，并禁用ESLint警告
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json(
      {
        message: '登录成功',
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('登录接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
