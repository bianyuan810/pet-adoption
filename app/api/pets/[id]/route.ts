import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
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
      return NextResponse.json(
        { error: '宠物不存在' },
        { status: 404 }
      )
    }

    const photos = pet.pet_photos || []
    const { pet_photos: _photos, ...petData } = pet

    return NextResponse.json(
      {
        pet: petData,
        photos: photos.map((p: { photo_url: string }) => p.photo_url),
        publisher: pet.publisher,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取宠物详情接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token 无效或已过期' },
        { status: 401 }
      )
    }

    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('publisher_id')
      .eq('id', id)
      .single()

    if (petError || !pet) {
      return NextResponse.json(
        { error: '宠物不存在' },
        { status: 404 }
      )
    }

    if (pet.publisher_id !== payload.userId) {
      return NextResponse.json(
        { error: '无权删除此宠物' },
        { status: 403 }
      )
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

    return NextResponse.json(
      { message: '删除成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除宠物接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token 无效或已过期' },
        { status: 401 }
      )
    }

    const { data: existingPet, error: fetchError } = await supabase
      .from('pets')
      .select('publisher_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingPet) {
      return NextResponse.json(
        { error: '宠物不存在' },
        { status: 404 }
      )
    }

    if (existingPet.publisher_id !== payload.userId) {
      return NextResponse.json(
        { error: '无权编辑此宠物' },
        { status: 403 }
      )
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

    return NextResponse.json(
      {
        message: '更新成功',
        pet: { id: pet.id, name: pet.name, breed: pet.breed },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('更新宠物接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
