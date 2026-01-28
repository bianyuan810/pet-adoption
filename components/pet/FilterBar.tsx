'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

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

  // 筛选选项数据
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

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">筛选条件</h3>
        {(filters.breed || filters.age || filters.gender || filters.location) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-destructive">
            清除筛选
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 品种筛选 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">品种</label>
          <select
            value={filters.breed || '所有品种'}
            onChange={(e) => handleFilterChange('breed', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground shadow-sm hover:shadow-md transition-shadow"
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
          <label className="block text-sm font-medium text-foreground mb-2">年龄</label>
          <select
            value={filters.age || '所有年龄'}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground shadow-sm hover:shadow-md transition-shadow"
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
          <label className="block text-sm font-medium text-foreground mb-2">性别</label>
          <select
            value={filters.gender || '所有性别'}
            onChange={(e) => handleFilterChange('gender', e.target.value as 'male' | 'female')}
            className="w-full px-4 py-2.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground shadow-sm hover:shadow-md transition-shadow"
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
          <label className="block text-sm font-medium text-foreground mb-2">地区</label>
          <select
            value={filters.location || '所有地区'}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground shadow-sm hover:shadow-md transition-shadow"
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
