import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { parseQueryParams, getRequestBody } from '@/app/lib/params';
import { ApplicationService } from '@/app/services/application.service';
import { PetService } from '@/app/services/pet.service';
import type { ApiResponse } from '@/app/types/api';
import { HttpStatus } from '@/app/types/api';

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

    // 使用parseQueryParams解析查询参数
    const queryParams = parseQueryParams(req);
    const isPublisher = queryParams.isPublisher;
    const petId = queryParams.petId;

    // 根据用户角色设置筛选参数
    const params = {
      petId: petId || undefined,
      applicantId: isPublisher ? undefined : session.user.id,
      publisherId: isPublisher ? session.user.id : undefined
    };

    // 使用ApplicationService获取申请列表
    const { applications, total } = await ApplicationService.getApplications(params);

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取申请列表成功',
      data: applications,
      meta: {
        total,
        page: 1,
        limit: applications.length
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

    // 使用getRequestBody解析请求体
    const body = await getRequestBody<{ petId: string; message: string }>(req);
    const { petId, message } = body;

    // 验证输入
    if (!petId) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '宠物ID不能为空'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 获取宠物信息，验证宠物是否存在以及状态是否为可收养
    const pet = await PetService.getPetById(petId);

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
    const exists = await ApplicationService.checkApplicationExists(petId, session.user.id);
    if (exists) {
      const response: ApiResponse = {
        code: HttpStatus.BAD_REQUEST,
        msg: '您已经申请过该宠物'
      };
      return NextResponse.json(response, { status: HttpStatus.BAD_REQUEST });
    }

    // 创建申请
    const newApplication = await ApplicationService.createApplication({
      pet_id: petId,
      applicant_id: session.user.id,
      publisher_id: pet.publisher_id,
      message,
      status: 'pending'
    });

    if (!newApplication) {
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