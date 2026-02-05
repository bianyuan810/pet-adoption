import { NextRequest, NextResponse } from 'next/server';
import { authLogger } from '@/app/lib';
import { verifyToken } from '@/app/lib/auth'
import { UserService } from '@/app/services/user.service'
import { getFormData } from '@/app/lib/params'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
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

    // 获取表单数据，包括文件
    const formData = await getFormData(request);
    const avatar = formData.avatar;

    if (!avatar) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '请选择要上传的头像文件'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 验证文件类型
    if (!avatar.type.startsWith('image/')) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '只能上传图片文件'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 验证文件大小
    if (avatar.size > 5 * 1024 * 1024) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '图片大小不能超过5MB'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 使用 UserService 上传头像
    const updatedUser = await UserService.uploadAvatar(payload.userId, avatar);

    if (!updatedUser) {
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '上传头像失败，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    // 返回成功响应
    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '上传头像成功',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar_url: updatedUser.avatar_url,
          phone: updatedUser.phone,
          wechat: updatedUser.wechat,
          role: updatedUser.role,
          created_at: updatedUser.created_at,
          updated_at: updatedUser.updated_at
        }
      }
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    authLogger.error('上传头像接口错误:', error);
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
