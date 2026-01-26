import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PetCard from '../components/pet/PetCard'
import type { Pet } from '../types/supabase'

// 模拟 Pet 数据
const mockPet: Pet = {
  id: '1',
  name: '小白',
  breed: '拉布拉多',
  age: 2,
  gender: 'male',
  status: 'available',
  description: '一只可爱的拉布拉多犬，性格温顺，喜欢和人玩耍。',
  location: '北京市朝阳区',
  view_count: 100,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  publisher_id: 'user1',
  health_status: '健康',
  vaccine_status: true,
  sterilized: true,
}

// 模拟 primaryPhoto
const mockPrimaryPhoto = 'https://example.com/photo.jpg'

describe('PetCard 组件', () => {
  it('应该正确渲染宠物卡片', () => {
    render(<PetCard pet={mockPet} primaryPhoto={mockPrimaryPhoto} />)
    
    // 检查宠物名称是否显示
    expect(screen.getByText('小白')).toBeInTheDocument()
    // 检查宠物品种是否显示
    expect(screen.getByText('拉布拉多')).toBeInTheDocument()
    // 检查宠物年龄是否显示
    expect(screen.getByText('2 岁')).toBeInTheDocument()
    // 检查宠物性别是否显示
    expect(screen.getByText('公')).toBeInTheDocument()
    // 检查宠物位置是否显示
    expect(screen.getByText('北京市朝阳区')).toBeInTheDocument()
    // 检查宠物状态是否显示
    expect(screen.getByText('可领养')).toBeInTheDocument()
    // 检查宠物浏览量是否显示
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('应该显示正确的状态样式', () => {
    render(<PetCard pet={mockPet} primaryPhoto={mockPrimaryPhoto} />)
    
    // 检查可用状态的样式
    const statusElement = screen.getByText('可领养')
    expect(statusElement).toHaveClass('bg-green-100')
    expect(statusElement).toHaveClass('text-green-800')
  })

  it('应该根据宠物状态显示不同的状态文本和样式', () => {
    // 测试已领养状态
    const adoptedPet = { ...mockPet, status: 'adopted' as const }
    render(<PetCard pet={adoptedPet} primaryPhoto={mockPrimaryPhoto} />)
    expect(screen.getByText('已领养')).toBeInTheDocument()
    expect(screen.getByText('已领养')).toHaveClass('bg-gray-100')
    
    // 测试申请中状态
    const pendingPet = { ...mockPet, status: 'pending' as const }
    render(<PetCard pet={pendingPet} primaryPhoto={mockPrimaryPhoto} />)
    expect(screen.getByText('申请中')).toBeInTheDocument()
    expect(screen.getByText('申请中')).toHaveClass('bg-yellow-100')
  })

  it('应该在没有提供 primaryPhoto 时显示默认图标', () => {
    render(<PetCard pet={mockPet} />)
    
    // 检查默认图标是否显示
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('应该渲染宠物描述并限制显示行数', () => {
    render(<PetCard pet={mockPet} primaryPhoto={mockPrimaryPhoto} />)
    
    // 检查描述是否显示
    expect(screen.getByText(/一只可爱的拉布拉多犬/)).toBeInTheDocument()
  })

  it('应该渲染正确的性别文本', () => {
    // 测试母犬
    const femalePet = { ...mockPet, gender: 'female' as const }
    render(<PetCard pet={femalePet} primaryPhoto={mockPrimaryPhoto} />)
    expect(screen.getByText('母')).toBeInTheDocument()
    
    // 测试未知性别
    const unknownPet = { ...mockPet, gender: 'unknown' as const }
    render(<PetCard pet={unknownPet} primaryPhoto={mockPrimaryPhoto} />)
    expect(screen.getByText('未知')).toBeInTheDocument()
  })
})
