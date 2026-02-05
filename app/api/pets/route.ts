import { NextRequest, NextResponse } from 'next/server';
import { petLogger } from '@/app/lib';
import { supabaseAdmin } from '@/app/lib/supabase'
import { verifyToken } from '@/app/lib/auth'
import { parseQueryParams, getFormData } from '@/app/lib/params'
import { PetService } from '@/app/services/pet.service'
import type { ApiResponse } from '@/app/types/api'
import { HttpStatus } from '@/app/types/api'

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

    // 使用getFormData解析表单数据
    const formData = await getFormData(request);

    const name = formData.name as string;
    const breed = formData.breed as string;
    const age = formData.age as number;
    const gender = formData.gender as 'male' | 'female' | 'unknown';
    const status = formData.status as 'available' | 'adopted' | 'pending';
    const description = formData.description as string;
    const location = formData.location as string;
    const health_status = formData.health_status as string | null;
    const vaccine_status = formData.vaccine_status as boolean;
    const dewormed = formData.dewormed as boolean;
    const sterilized = formData.sterilized as boolean;

    // 使用PetService创建宠物
    const pet = await PetService.createPet({
      name,
      breed,
      age,
      gender,
      status,
      description,
      location,
      health_status: health_status || undefined,
      vaccine_status,
      dewormed,
      sterilized
    }, payload.userId);

    if (!pet) {
      const response: ApiResponse = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '创建宠物失败，请稍后重试'
      };
      return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    // 上传宠物照片
    const photoEntries = Object.entries(formData)
      .filter(([key, value]) => key.startsWith('photo_') && value instanceof File)
      .map(([key, value]) => ({
        file: value as File,
        index: parseInt(key.split('_')[1]) || 0,
      }));

    for (const { file, index } of photoEntries) {
      await PetService.uploadPetPhoto(pet.id, file, index === 0);
    }

    const response: ApiResponse = {
      code: HttpStatus.CREATED,
      msg: '发布成功',
      data: {
        pet: { id: pet.id, name: pet.name, breed: pet.breed },
        message: '发布成功'
      }
    };
    return NextResponse.json(response, { status: HttpStatus.CREATED });
  } catch (error) {
    petLogger.error('发布宠物接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}



// 设置API路由缓存配置 - 禁用缓存以确保数据实时性
export const revalidate = 0 // 禁用缓存
export const fetchCache = 'force-no-store' // 强制不存储缓存

// 获取宠物列表，支持筛选
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证（可选，仅用于发布者视角）
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    let payload = null
    
    if (token) {
      payload = verifyToken(token)
    }

    // 即使没有token也允许访问，因为宠物列表是公开的

    // 使用parseQueryParams解析查询参数
    const queryParams = parseQueryParams(request);
    
    // 获取筛选参数、搜索关键词和排序方式
    const keyword = queryParams.keyword;
    const breed = queryParams.breed;
    const age = queryParams.age;
    const genderParam = queryParams.gender;
    const location = queryParams.location;
    const status = queryParams.status;
    const sortBy = queryParams.sortBy || 'newest';
    const isPublisher = queryParams.isPublisher;
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;

    // 映射中文性别到英文
    const genderMap: Record<string, 'male' | 'female' | 'unknown'> = {
      '公': 'male',
      '母': 'female',
      '未知': 'unknown'
    }

    // 处理性别参数
    const gender = genderParam && genderMap[genderParam] ? genderMap[genderParam] : undefined

    // 使用PetService获取宠物列表
    const { pets: petsData, total } = await PetService.getPets({
      keyword: keyword || undefined,
      breed: breed || undefined,
      age: age || undefined,
      gender: gender || undefined,
      location: location || undefined,
      status: status || undefined,
      sortBy: sortBy || 'newest',
      limit,
      page,
      isPublisher,
      publisherId: isPublisher && payload ? payload.userId : undefined
    });

    // 如果有宠物数据，获取对应的照片数据
    const petsWithPhotos = await Promise.all(petsData.map(async (pet) => {
      const photos = await PetService.getPetPhotos(pet.id);
      const photoUrls = photos
        .sort((a, b) => (b.is_primary ? 1 : -1))
        .map(photo => photo.photo_url);
      
      return {
        ...pet,
        photos: photoUrls.length > 0 ? photoUrls : ['/images/用户未上传.png']
      };
    }));

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取宠物列表成功',
      data: petsWithPhotos,
      meta: {
        total,
        page,
        limit
      }
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    petLogger.error('获取宠物列表接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
