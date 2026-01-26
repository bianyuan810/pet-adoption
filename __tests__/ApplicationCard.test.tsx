import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ApplicationCard from '../components/pet/ApplicationCard'

// 创建mockPush引用
const mockPush = vi.fn()

// 模拟 useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// 模拟 Application 数据
const mockApplication = {
  id: '1',
  pet_id: 'pet1',
  applicant_id: 'user1',
  publisher_id: 'user2',
  status: 'pending' as 'pending' | 'approved' | 'rejected',
  message: '我非常喜欢这只狗狗，家里有足够的空间和时间照顾它，希望能给它一个温暖的家。',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  pet: {
    id: 'pet1',
    name: '小白',
    breed: '拉布拉多',
    age: 2,
    gender: 'male' as 'male' | 'female' | 'unknown',
    status: 'pending' as 'available' | 'adopted' | 'pending',
    location: '北京市朝阳区',
  },
  applicant: {
    id: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    wechat: 'zhangsan_wechat',
  },
}

describe('ApplicationCard 组件', () => {
  it('应该正确渲染申请卡片', () => {
    render(<ApplicationCard application={mockApplication} isPublisher={false} />)
    
    // 检查宠物名称是否显示
    expect(screen.getByText('小白')).toBeInTheDocument()
    // 检查申请人名称是否显示
    expect(screen.getByText('申请人：张三')).toBeInTheDocument()
    // 检查申请状态是否显示（使用getAllByText获取所有状态元素，然后检查至少有一个存在）
    expect(screen.getAllByText('审核中').length).toBeGreaterThan(0)
    // 检查申请时间是否显示
    expect(screen.getByText(new Date(mockApplication.created_at).toLocaleDateString())).toBeInTheDocument()
    // 检查申请消息是否显示
    expect(screen.getByText(/我非常喜欢这只狗狗/)).toBeInTheDocument()
  })

  it('应该显示正确的状态样式', () => {
    render(<ApplicationCard application={mockApplication} isPublisher={false} />)
    
    // 检查审核中状态的样式（获取所有状态元素，然后找到带有bg-yellow-100类的那个）
    const statusElements = screen.getAllByText('审核中')
    const styledStatusElement = statusElements.find(el => el.classList.contains('bg-yellow-100'))
    expect(styledStatusElement).toBeInTheDocument()
    expect(styledStatusElement).toHaveClass('bg-yellow-100')
    expect(styledStatusElement).toHaveClass('text-yellow-800')
  })

  it('应该根据申请状态显示不同的状态文本和样式', () => {
    // 测试已通过状态
    const approvedApplication = { ...mockApplication, status: 'approved' as const }
    render(<ApplicationCard application={approvedApplication} isPublisher={false} />)
    const approvedElements = screen.getAllByText('已通过')
    expect(approvedElements.length).toBeGreaterThan(0)
    
    // 测试已拒绝状态
    const rejectedApplication = { ...mockApplication, status: 'rejected' as const }
    render(<ApplicationCard application={rejectedApplication} isPublisher={false} />)
    const rejectedElements = screen.getAllByText('已拒绝')
    expect(rejectedElements.length).toBeGreaterThan(0)
  })

  it('应该在点击卡片时跳转到申请详情页面', () => {
    // 重置mockPush的调用记录
    mockPush.mockClear()
    
    render(<ApplicationCard application={mockApplication} isPublisher={false} />)
    
    // 点击卡片 - 获取内部有onClick事件的div元素
    const cardElement = screen.getByText('小白').closest('div')?.parentElement?.parentElement
    fireEvent.click(cardElement!)
    
    // 检查是否调用了 push 函数
    expect(mockPush).toHaveBeenCalledWith('/applications/1')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('应该正确显示申请消息并限制显示行数', () => {
    render(<ApplicationCard application={mockApplication} isPublisher={false} />)
    
    // 检查申请消息是否显示
    const messageElement = screen.getByText(/我非常喜欢这只狗狗/)
    expect(messageElement).toBeInTheDocument()
    // 检查是否应用了 line-clamp-2 类
    expect(messageElement).toHaveClass('line-clamp-2')
  })

  it('应该显示正确的申请时间格式', () => {
    render(<ApplicationCard application={mockApplication} isPublisher={false} />)
    
    // 检查申请时间是否显示为本地日期格式
    const expectedDate = new Date(mockApplication.created_at).toLocaleDateString()
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
  })
})
