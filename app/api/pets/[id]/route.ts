import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

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
      .eq('id', params.id)
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

    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('publisher_id')
      .eq('id', params.id)
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
      .eq('id', params.id)

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
