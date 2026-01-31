import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import { HttpStatus } from '@/types/api';

// 获取所有申请（根据用户角色返回不同数据）
export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
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
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '获取申请列表失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取申请列表成功',
      data,
      meta: {
        total: data.length,
        page: 1,
        limit: data.length
      }
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

// 创建新申请
export async function POST(req: NextRequest) {
  try {
    
    const session = await auth(req);

    if (!session?.user?.id) {
      const response: ApiResponse = {
        code: HttpStatus.UNAUTHORIZED,
        msg: '未授权访问'
      };
      return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
    }

    const { petId, message } = await req.json();

    // 验证输入
    if (!petId) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '宠物ID不能为空'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 获取宠物信息，验证宠物是否存在以及状态是否为可收养
    const { data: pet, error: petError } = await supabase.from('pets')
      .select('id, publisher_id, status')
      .eq('id', petId)
      .single();

    if (petError) {
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '获取宠物信息失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    if (!pet) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '宠物不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    if (pet.status !== 'available') {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '该宠物已被收养或不可申请'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 检查是否已经申请过该宠物
    const { data: existingApplication, error: existingError } = await supabase.from('applications')
      .select('id')
      .eq('pet_id', petId)
      .eq('applicant_id', session.user.id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 表示未找到记录
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '检查申请记录失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    if (existingApplication) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '您已经申请过该宠物'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
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
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '创建申请失败'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    const response: ApiResponse = {
      code: HttpStatus.CREATED,
      msg: '申请提交成功',
      data: {
        application: newApplication
      }
    };
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    console.error('服务器错误:', error);
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}