import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    const { id } = await params

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

    // 检查消息是否存在，并且接收者是当前用户
    const { data: message, error: checkError } = await supabase
      .from('messages')
      .select('id, receiver_id')
      .eq('id', id)
      .eq('receiver_id', payload.userId)
      .single()

    if (checkError || !message) {
      return NextResponse.json(
        { error: '消息不存在或无权操作' },
        { status: 404 }
      )
    }

    // 更新消息状态为已读
    const { error: updateError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)

    if (updateError) {
      console.error('标记消息已读失败:', updateError)
      return NextResponse.json(
        { error: '标记消息已读失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '标记成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('标记消息已读接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
