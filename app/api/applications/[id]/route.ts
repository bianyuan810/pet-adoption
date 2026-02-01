import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { ApplicationService } from '@/app/services/application.service';
import type { ApiResponse } from '@/app/types/api';
import { HttpStatus } from '@/app/types/api';

// 获取单个申请详情
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // params是Promise，需要await解包
    const { id: applicationId } = await params;

    // 使用ApplicationService获取申请详情
    const application = await ApplicationService.getApplicationById(applicationId);

    if (!application) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '申请不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    // 验证当前用户是否有权限查看该申请
    if (application.publisher_id !== session.user.id && application.applicant_id !== session.user.id) {
      const response: ApiResponse = {
        code: HttpStatus.FORBIDDEN,
        msg: '您没有权限查看该申请'
      };
      return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取申请详情成功',
      data: application
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('服务器错误:', error);
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}