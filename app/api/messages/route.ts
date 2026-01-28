import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

// 获取用户消息列表
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    let query = supabase
      .from('messages')
      .select(`
        id, content, sender_id, receiver_id, is_read, created_at,
        sender:users(sender_id) (name, avatar_url),
        receiver:users(receiver_id) (name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (chatId) {
      // 获取与特定用户的聊天记录
      const [userId1, userId2] = chatId.split('_').sort()
      // 使用正确的 in 方法语法，传递数组作为参数
      query = query
        .in('sender_id', [userId1, userId2])
        .in('receiver_id', [userId1, userId2])
    } else {
      // 获取用户的所有消息
      query = query
        .or(`sender_id.eq.${payload.userId},receiver_id.eq.${payload.userId}`)
    }

    const { data: messages, error: fetchError } = await query

    if (fetchError) {
      console.error('获取消息列表失败:', fetchError)
      return NextResponse.json(
        { error: '获取消息列表失败' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { messages },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取消息接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}

// 发送新消息
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
    const { receiver_id, content, pet_id } = body

    if (!receiver_id || !content) {
      return NextResponse.json(
        { error: '接收者ID和消息内容不能为空' },
        { status: 400 }
      )
    }

    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        sender_id: payload.userId,
        receiver_id,
        content,
        pet_id: pet_id || null,
        is_read: false
      })
      .select(`
        id, content, sender_id, receiver_id, is_read, created_at, pet_id,
        sender:users(sender_id) (name, avatar_url),
        receiver:users(receiver_id) (name, avatar_url)
      `)
      .single()

    if (insertError || !message) {
      console.error('发送消息失败:', insertError)
      return NextResponse.json(
        { error: '发送消息失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: '发送成功',
        data: message
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('发送消息接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
