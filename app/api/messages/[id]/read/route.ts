import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'
import { HttpStatus } from '@/types/api'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    const { id } = await params

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

    // 检查消息是否存在，并且接收者是当前用户
    const { data: message, error: checkError } = await supabase
      .from('messages')
      .select('id, receiver_id')
      .eq('id', id)
      .eq('receiver_id', payload.userId)
      .single()

    if (checkError || !message) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '消息不存在或无权操作'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    // 更新消息状态为已读
    const { error: updateError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)

    if (updateError) {
      console.error('标记消息已读失败:', updateError)
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '标记消息已读失败，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '标记成功'
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('标记消息已读接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
