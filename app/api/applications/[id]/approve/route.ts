import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 同意收养申请
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const applicationId = params.id;

    // 1. 获取申请信息，验证权限
    const { data: application, error: getAppError } = await supabase
      .from('applications')
      .select('id, pet_id, publisher_id, status')
      .eq('id', applicationId)
      .single();

    if (getAppError) {
      return NextResponse.json({ error: '获取申请信息失败' }, { status: 500 });
    }

    if (!application) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 });
    }

    // 验证是否为发布者
    if (application.publisher_id !== session.user.id) {
      return NextResponse.json({ error: '无权操作此申请' }, { status: 403 });
    }

    // 验证申请状态
    if (application.status !== 'pending') {
      return NextResponse.json({ error: '申请已处理' }, { status: 400 });
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

    return NextResponse.json({ message: '申请已同意' });
  } catch (error) {
    console.error('同意申请失败:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '同意申请失败' }, { status: 500 });
  }
}