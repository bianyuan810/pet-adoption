import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { parseQueryParams, getRequestBody } from '@/app/lib/params'
import { MessageService } from '@/app/services/message.service'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

// 获取用户消息列表
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    const payload = verifyToken(token);

    if (!payload) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Token 无效或已过期'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // 使用parseQueryParams解析查询参数
    const queryParams = parseQueryParams(request);
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;

    // 使用MessageService获取消息列表
    const { messages, total } = await MessageService.getMessages({
      senderId: payload.userId,
      page,
      limit
    });
      console.log("查询数据:",messages);
      
    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取消息列表成功',
      data: messages,
      meta: {
        total,
        page,
        limit
      }
    };
    
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('获取消息接口错误:', error);
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}

// 发送新消息
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

    // 使用getRequestBody解析请求体
    const body = await getRequestBody<{ receiver_id: string; content: string; pet_id?: string | null }>(request);
    const { receiver_id, content, pet_id } = body;

    if (!receiver_id || !content) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '接收者ID和消息内容不能为空'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 使用MessageService创建消息
    console.log("sender_id", payload.userId);
    console.log("receiver_id",receiver_id);
    
    const message = await MessageService.createMessage({
      sender_id: payload.userId,
      receiver_id,
      content,
      pet_id: pet_id || undefined
    });

    if (!message) {
      console.error('发送消息失败');
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '发送消息失败，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.CREATED,
      msg: '发送成功',
      data: message
    };
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    console.error('发送消息接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
