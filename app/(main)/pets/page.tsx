'use client'

import { useState, useEffect } from 'react'
import PetList from '@/components/pet/PetList'
import type { Pet } from '@/types/supabase'

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [photos, setPhotos] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets')
        const data = await response.json()

        if (response.ok) {
          setPets(data.pets)
          setPhotos(data.photos)
        }
      } catch (error) {
        console.error('获取宠物列表失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPets()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">宠物领养</h1>
          <p className="text-gray-600">发现您的完美伙伴，给它们一个温暖的家</p>
        </div>

        <PetList pets={pets} photos={photos} isLoading={isLoading} />
      </div>
    </div>
  )
}
