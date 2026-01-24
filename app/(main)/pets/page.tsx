'use client'

import { useState, useEffect } from 'react'
import PetList from '@/components/pet/PetList'
import FilterBar, { FilterValues } from '@/components/pet/FilterBar'
import SearchBar from '@/components/pet/SearchBar'
import SortDropdown from '@/components/pet/SortDropdown'
import type { Pet } from '@/types/supabase'

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [photos, setPhotos] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterValues>({})
  const [keyword, setKeyword] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true)
        // 将筛选参数、搜索关键词和排序方式转换为 URL 查询字符串
        const searchParams = new URLSearchParams()
        if (keyword) searchParams.append('keyword', keyword)
        if (filters.breed) searchParams.append('breed', filters.breed)
        if (filters.age) searchParams.append('age', filters.age)
        if (filters.gender) searchParams.append('gender', filters.gender)
        if (filters.location) searchParams.append('location', filters.location)
        if (sortBy) searchParams.append('sortBy', sortBy)

        const response = await fetch(`/api/pets?${searchParams.toString()}`)
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
  }, [filters, keyword, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">宠物领养</h1>
          <p className="text-gray-600">发现您的完美伙伴，给它们一个温暖的家</p>
        </div>

        {/* 添加搜索栏 */}
        <SearchBar onSearch={setKeyword} />

        {/* 添加筛选栏 */}
        <FilterBar onFilterChange={setFilters} />

        {/* 添加排序下拉组件 */}
        <SortDropdown onSortChange={setSortBy} currentSort={sortBy} />

        <PetList pets={pets} photos={photos} isLoading={isLoading} />
      </div>
    </div>
  )
}
