import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

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

    const { data: pet, error: insertError } = await supabase
      .from('pets')
      .insert({
        publisher_id: payload.userId,
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
        view_count: 0,
      })
      .select('id, name, breed')
      .single()

    if (insertError || !pet) {
      console.error('创建宠物时出错:', insertError)
      return NextResponse.json(
        { error: '创建宠物失败，请稍后重试' },
        { status: 500 }
      )
    }

    const photoEntries = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('photo_'))
      .map(([key, value]) => ({
        file: value as File,
        index: parseInt(key.split('_')[1]),
      }))

    for (const { file, index } of photoEntries) {
      const fileName = `${pet.id}_${Date.now()}_${index}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, file)

      if (uploadError) {
        console.error('上传照片时出错:', uploadError)
        continue
      }

      const { error: photoError } = await supabase
        .from('pet_photos')
        .insert({
          pet_id: pet.id,
          photo_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-photos/${fileName}`,
          is_primary: index === 0,
        })

      if (photoError) {
        console.error('保存照片记录时出错:', photoError)
      }
    }

    return NextResponse.json(
      {
        message: '发布成功',
        pet: { id: pet.id, name: pet.name, breed: pet.breed },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('发布宠物接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

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
      .eq('id', params.id)
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
      .eq('id', params.id)
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
