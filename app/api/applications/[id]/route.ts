import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 获取单个申请详情
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // params是Promise，需要await解包
    const { id: applicationId } = await params;

    // 查询申请详情
    const { data: application, error } = await supabase
      .from('applications')
      .select('*, pet:pet_id(*), applicant:applicant_id(*)')
      .eq('id', applicationId)
      .single();

    if (error) {
      console.error('获取申请详情失败:', error);
      return NextResponse.json({ error: '获取申请详情失败' }, { status: 500 });
    }

    if (!application) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 });
    }

    // 验证当前用户是否有权限查看该申请
    if (application.publisher_id !== session.user.id && application.applicant_id !== session.user.id) {
      return NextResponse.json({ error: '您没有权限查看该申请' }, { status: 403 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}