'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PetDetail from '@/components/pet/PetDetail'
import type { Pet } from '@/types/supabase'

export default function PetDetailPage() {
  const params = useParams()
  const [pet, setPet] = useState<Pet | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [publisher, setPublisher] = useState<{
    id: string
    name: string
    email?: string
    phone?: string
    wechat?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const response = await fetch(`/api/pets/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setPet(data.pet)
          setPhotos(data.photos)
          setPublisher(data.publisher)
        }
      } catch (error) {
        console.error('获取宠物详情失败:', error)
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
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7 7"
            />
          </svg>
          返回列表
        </button>

        {publisher && <PetDetail pet={pet} photos={photos} publisher={publisher} />}
      </div>
    </div>
  )
}
