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



// 获取宠物列表，支持筛选
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取筛选参数、搜索关键词和排序方式
    const keyword = searchParams.get('keyword')
    const breed = searchParams.get('breed')
    const age = searchParams.get('age')
    const gender = searchParams.get('gender') as 'male' | 'female' | undefined
    const location = searchParams.get('location')
    const sortBy = searchParams.get('sortBy')

    // 构建查询
    let query = supabase
      .from('pets')
      .select('id, name, breed, age, gender, location, status, created_at, view_count')
    //  .eq('status', 'available') // 只返回可领养状态的宠物

    // 设置排序方式
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true })
    } else if (sortBy === 'most_viewed') {
      query = query.order('view_count', { ascending: false })
    } else if (sortBy === 'least_viewed') {
      query = query.order('view_count', { ascending: true })
    } else {
      // 默认按创建时间倒序
      query = query.order('created_at', { ascending: false })
    }

    // 添加关键词搜索
    if (keyword) {
      const keywordPattern = `%${keyword}%`
      query = query.or(`name.ilike.${keywordPattern},breed.ilike.${keywordPattern}`)
    }

    // 添加筛选条件
    if (breed) {
      query = query.eq('breed', breed)
    }
    
    if (age) {
      // 根据年龄范围筛选
      if (age === '0-1岁') {
        query = query.lt('age', 1)
      } else if (age === '1-3岁') {
        query = query.gte('age', 1).lte('age', 3)
      } else if (age === '3-5岁') {
        query = query.gte('age', 3).lte('age', 5)
      } else if (age === '5岁以上') {
        query = query.gt('age', 5)
      }
    }
    
    if (gender) {
      query = query.eq('gender', gender)
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    // 执行查询
    const { data: pets, error: petsError } = await query

    if (petsError) {
      console.error('获取宠物列表时出错:', petsError)
      return NextResponse.json(
        { error: '获取宠物列表失败' },
        { status: 500 }
      )
    }

    // 获取每张宠物的照片
    const petIds = pets.map(pet => pet.id)
    const { data: photos, error: photosError } = await supabase
      .from('pet_photos')
      .select('pet_id, photo_url, is_primary')
      .in('pet_id', petIds)

    if (photosError) {
      console.error('获取宠物照片时出错:', photosError)
    }

    // 整理照片数据
    interface PetPhoto {
      pet_id: string;
      photo_url: string;
      is_primary: boolean;
    }
    
    const photosByPetId: Record<string, PetPhoto[]> = {}
    if (photos) {
      for (const photo of photos) {
        if (!photosByPetId[photo.pet_id]) {
          photosByPetId[photo.pet_id] = []
        }
        photosByPetId[photo.pet_id].push(photo)
      }
    }

    return NextResponse.json(
      {
        pets: pets || [],
        photos: photosByPetId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取宠物列表接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
