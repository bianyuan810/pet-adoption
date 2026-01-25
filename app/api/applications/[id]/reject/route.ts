import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 拒绝收养申请
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 在 Next.js 16 中，params 是一个 Promise，需要使用 await 获取实际参数
    const { id: applicationId } = await params;

    // 1. 获取申请信息，验证权限
    const { data: application, error: getAppError } = await supabase
      .from('applications')
      .select('id, publisher_id, status')
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

    // 2. 更新申请状态为已拒绝
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);

    if (updateError) {
      console.error('拒绝申请失败:', updateError);
      return NextResponse.json({ error: '拒绝申请失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '申请已拒绝' });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}