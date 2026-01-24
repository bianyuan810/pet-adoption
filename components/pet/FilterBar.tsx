'use client'

import { useState } from 'react'

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void
}

export interface FilterValues {
  breed?: string
  age?: string
  gender?: 'male' | 'female'
  location?: string
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({})

  // 模拟筛选选项数据，实际项目中应从 API 获取
  const breedOptions = ['所有品种', '金毛', '拉布拉多', '柯基', '泰迪', '英短', '美短', '布偶', '暹罗']
  const ageOptions = ['所有年龄', '0-1岁', '1-3岁', '3-5岁', '5岁以上']
  const genderOptions = ['所有性别', '公', '母']
  const locationOptions = ['所有地区', '北京', '上海', '广州', '深圳', '成都', '杭州']

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === '所有' || value === '所有品种' || value === '所有年龄' || value === '所有性别' || value === '所有地区' ? undefined : value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 品种筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">品种</label>
          <select
            value={filters.breed || '所有品种'}
            onChange={(e) => handleFilterChange('breed', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {breedOptions.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        {/* 年龄筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
          <select
            value={filters.age || '所有年龄'}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {ageOptions.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        {/* 性别筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <select
            value={filters.gender || '所有性别'}
            onChange={(e) => handleFilterChange('gender', e.target.value as 'male' | 'female')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {genderOptions.map((gender) => (
              <option key={gender} value={gender === '公' ? 'male' : gender === '母' ? 'female' : '所有性别'}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* 地区筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
          <select
            value={filters.location || '所有地区'}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {locationOptions.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
