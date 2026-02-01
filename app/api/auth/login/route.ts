import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabase } from '@/app/lib/supabase'
import { generateToken } from '@/app/lib/auth'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '请求数据格式错误',
        data: { details: validationResult.error.issues }
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    const { email, password } = validationResult.data

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, password, role, phone, wechat, created_at')
      .eq('email', email)
      .single()

    if (fetchError) {
      console.error('查询用户时出错:', fetchError)
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '邮箱或密码错误'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    if (!user) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '邮箱或密码错误'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '邮箱或密码错误'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
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
        code: HttpStatus.OK,
        msg: '登录成功',
        data: {
          token,
          user: userWithoutPassword,
          message: '登录成功'
        }
      },
      { status: HttpStatus.OK }
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
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
