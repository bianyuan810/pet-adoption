'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PetForm from '@/app/components/pet/PetForm'
import type { Pet } from '@/app/types/supabase'
import { petLogger } from '@/app/lib';
import { api } from '@/app/lib/request';

export default function EditPetPage() {
  const params = useParams()
  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const data = await api.get<{ pet: unknown, photos?: string[] }>(`/pets/${params.id}`)

        if (data.code === 200 && data.data && data.data.pet) {
          setPet(data.data.pet as Pet)
        }
      } catch (error) {
        petLogger.error('获取宠物详情失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPetDetail()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">宠物不存在</h1>
          <p className="text-gray-600">您访问的宠物信息不存在或已被删除</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑宠物</h1>
          <p className="text-gray-600">修改宠物信息</p>
        </div>

        <PetForm initialData={pet} isEdit={true} />
      </div>
    </div>
  )
}
