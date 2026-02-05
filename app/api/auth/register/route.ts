import { NextRequest, NextResponse } from 'next/server';
import { authLogger } from '@/app/lib';
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabase } from '@/app/lib/supabase'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  wechat: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '请求数据格式错误',
        data: { details: validationResult.error.issues }
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    const { name, email, password, phone, wechat } = validationResult.data

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      authLogger.error('检查用户时出错:', checkError)
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '服务器错误，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    if (existingUser) {
      const response: ApiResponse = {
        code: HttpStatus.CONFLICT,
        msg: '该邮箱已被注册'
      };
      return NextResponse.json(response, { status: HttpStatus.CONFLICT });
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        wechat: wechat || null,
        role: 'user',
      })
      .select('id, email, name, role')
      .single()

    if (insertError) {
      authLogger.error('创建用户时出错:', insertError)
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '创建用户失败，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.CREATED,
      msg: '注册成功',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
    };
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    authLogger.error('注册接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
