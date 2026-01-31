import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'
import { HttpStatus } from '@/types/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 在 Next.js 16 中，params 是一个 Promise，需要使用 await 获取实际参数
    const { id } = await params

    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select(`
        *, 
        publisher:users!inner(
          id,
          name,
          email,
          phone,
          wechat
        ),
        pet_photos (
          id,
          photo_url,
          is_primary
        )
      `)
      .eq('id', id)
      .single()

    if (petError || !pet) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '宠物不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    // 直接提取照片，不使用解构
    const photos = (pet.pet_photos || []).map((p: { photo_url: string }) => p.photo_url)

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '获取宠物详情成功',
      data: {
        pet: {
          ...pet,
          // 移除 pet_photos 字段，不使用额外变量
          pet_photos: undefined
        },
        photos,
        publisher: pet.publisher,
      }
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('获取宠物详情接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    // 在 Next.js 16 中，params 是一个 Promise，需要使用 await 获取实际参数
    const { id } = await params

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

    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('publisher_id')
      .eq('id', id)
      .single()

    if (petError || !pet) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '宠物不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    if (pet.publisher_id !== payload.userId) {
      const response: ApiResponse = {
        code: HttpStatus.FORBIDDEN,
        msg: '无权删除此宠物'
      };
      return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
    }

    const { error: deleteError } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('删除宠物时出错:', deleteError)
      return NextResponse.json(
        { error: '删除失败，请稍后重试' },
        { status: 500 }
      )
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '删除成功'
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('删除宠物接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    // 在 Next.js 16 中，params 是一个 Promise，需要使用 await 获取实际参数
    const { id } = await params

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

    const { data: existingPet, error: fetchError } = await supabase
      .from('pets')
      .select('publisher_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingPet) {
      const response: ApiResponse = {
        code: HttpStatus.NOT_FOUND,
        msg: '宠物不存在'
      };
      return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
    }

    if (existingPet.publisher_id !== payload.userId) {
      const response: ApiResponse = {
        code: HttpStatus.FORBIDDEN,
        msg: '无权编辑此宠物'
      };
      return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
    }

    const formData = await request.formData()

    const name = formData.get('name') as string
    const breed = formData.get('breed') as string
    const age = parseInt(formData.get('age') as string)
    const gender = formData.get('gender') as 'male' | 'female' | 'unknown'
    const status = formData.get('status') as 'available' | 'adopted' | 'pending'
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const health_status = formData.get('health_status') as string | null
    const vaccine_status = formData.get('vaccine_status') === 'true'
    const sterilized = formData.get('sterilized') === 'true'

    const { data: pet, error: updateError } = await supabase
      .from('pets')
      .update({
        name,
        breed,
        age,
        gender,
        status,
        description,
        location,
        health_status,
        vaccine_status,
        sterilized,
      })
      .eq('id', id)
      .select('id, name, breed')
      .single()

    if (updateError || !pet) {
      console.error('更新宠物时出错:', updateError)
      return NextResponse.json(
        { error: '更新宠物失败，请稍后重试' },
        { status: 500 }
      )
    }

    const response: ApiResponse = {
      code: HttpStatus.OK,
      msg: '更新成功',
      data: {
        pet: { id: pet.id, name: pet.name, breed: pet.breed },
      }
    };
    return NextResponse.json(response, { status: HttpStatus.OK });
  } catch (error) {
    console.error('更新宠物接口错误:', error)
    const response: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器错误，请稍后重试'
    };
    return NextResponse.json(response, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
