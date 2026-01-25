import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 获取所有申请（根据用户角色返回不同数据）
export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const url = new URL(req.url);
    const isPublisher = url.searchParams.get('isPublisher') === 'true';
    const petId = url.searchParams.get('petId');

    let query = supabase.from('applications').select('*, pet:pet_id(*), applicant:applicant_id(*), publisher:publisher_id(*)')
      .order('created_at', { ascending: false });

    // 根据用户角色筛选
    if (isPublisher) {
      query = query.eq('publisher_id', session.user.id);
    } else {
      query = query.eq('applicant_id', session.user.id);
    }

    // 如果提供了宠物ID，筛选特定宠物的申请
    if (petId) {
      query = query.eq('pet_id', petId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取申请列表失败:', error);
      return NextResponse.json({ error: '获取申请列表失败' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 创建新申请
export async function POST(req: NextRequest) {
  try {
    
    const session = await auth(req);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const { petId, message } = await req.json();

    // 验证输入
    if (!petId) {
      return NextResponse.json({ error: '宠物ID不能为空' }, { status: 400 });
    }

    // 获取宠物信息，验证宠物是否存在以及状态是否为可收养
    const { data: pet, error: petError } = await supabase.from('pets')
      .select('id, publisher_id, status')
      .eq('id', petId)
      .single();

    if (petError) {
      return NextResponse.json({ error: '获取宠物信息失败' }, { status: 500 });
    }

    if (!pet) {
      return NextResponse.json({ error: '宠物不存在' }, { status: 404 });
    }

    if (pet.status !== 'available') {
      return NextResponse.json({ error: '该宠物已被收养或不可申请' }, { status: 400 });
    }

    // 检查是否已经申请过该宠物
    const { data: existingApplication, error: existingError } = await supabase.from('applications')
      .select('id')
      .eq('pet_id', petId)
      .eq('applicant_id', session.user.id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 表示未找到记录
      return NextResponse.json({ error: '检查申请记录失败' }, { status: 500 });
    }

    if (existingApplication) {
      return NextResponse.json({ error: '您已经申请过该宠物' }, { status: 400 });
    }

    // 创建申请
    const { data: newApplication, error: createError } = await supabase.from('applications').insert({
      pet_id: petId,
      applicant_id: session.user.id,
      publisher_id: pet.publisher_id,
      message,
      status: 'pending'
    }).select('*, pet:pet_id(*), applicant:applicant_id(*), publisher:publisher_id(*)').single();

    if (createError) {
      console.error('创建申请失败:', createError);
      return NextResponse.json({ error: '创建申请失败' }, { status: 500 });
    }

    return NextResponse.json({ data: newApplication, message: '申请提交成功' }, { status: 201 });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}