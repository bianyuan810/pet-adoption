import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Pet } from '@/types/supabase'

interface PetWithPhotos extends Pet {
  pet_photos: Array<{
    id: string
    photo_url: string
    is_primary: boolean
  }>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const breed = searchParams.get('breed')
    const location = searchParams.get('location')

    const offset = (page - 1) * limit

    let query = supabase
      .from('pets')
      .select(`
        *,
        pet_photos (
          id,
          photo_url,
          is_primary
        )
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (breed) {
      query = query.ilike('breed', `%${breed}%`)
    }

    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    const { data: pets, error: petsError, count } = await query
      .range(offset, offset + limit - 1)

    if (petsError) {
      console.error('查询宠物列表时出错:', petsError)
      return NextResponse.json(
        { error: '获取宠物列表失败' },
        { status: 500 }
      )
    }

    const photosMap: Record<string, string[]> = {}
    pets?.forEach((pet: PetWithPhotos) => {
      if (pet.pet_photos) {
        photosMap[pet.id] = pet.pet_photos
      }
    })

    const petsWithoutPhotos = pets?.map((pet: PetWithPhotos) => {
      const { pet_photos, ...petData } = pet
      return petData
    })

    return NextResponse.json(
      {
        pets: petsWithoutPhotos || [],
        photos: photosMap,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('宠物列表接口错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
