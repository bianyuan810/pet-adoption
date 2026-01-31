import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import { HttpStatus } from '@/types/api';

// 同意收养申请
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    // 在 Next.js 16 中，params 是一个 Promise，需要使用 await 获取实际参数
    const { id: applicationId } = await params;

    // 1. 获取申请信息，验证权限
    const { data: application, error: getAppError } = await supabase
      .from('applications')
      .select('id, pet_id, publisher_id, status')
      .eq('id', applicationId)
      .single();

    if (getAppError) {
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '获取申请信息失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    if (!application) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '申请不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    // 验证是否为发布者
    if (application.publisher_id !== session.user.id) {
      const response: ApiResponse = {
        code: HttpStatus.FORBIDDEN,
        msg: '无权操作此申请'
      };
      return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
    }

    // 验证申请状态
    if (application.status !== 'pending') {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '申请已处理'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 2. 开始事务处理
    // 2.1 更新申请状态为已同意
    const { error: updateAppError } = await supabase
      .from('applications')
      .update({ status: 'approved' })
      .eq('id', applicationId);

    if (updateAppError) {
      throw new Error('更新申请状态失败');
    }

    // 2.2 更新宠物状态为已收养
    const { error: updatePetError } = await supabase
      .from('pets')
      .update({ status: 'adopted' })
      .eq('id', application.pet_id);

    if (updatePetError) {
      throw new Error('更新宠物状态失败');
    }

    // 2.3 拒绝该宠物的其他待审核申请
    const { error: rejectOtherError } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('pet_id', application.pet_id)
      .eq('status', 'pending')
      .neq('id', applicationId);

    if (rejectOtherError) {
      throw new Error('拒绝其他申请失败');
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '申请已同意'
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('同意申请失败:', error);
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: error instanceof Error ? error.message : '同意申请失败'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}