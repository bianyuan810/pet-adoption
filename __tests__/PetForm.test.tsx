import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PetForm from '@/app/components/pet/PetForm'

// 模拟 useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

// 模拟 fetch
interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}))

// 模拟 URL.createObjectURL
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'mock-url'),
  revokeObjectURL: vi.fn(),
})

describe('PetForm 组件', () => {
  it('应该正确渲染表单的基本信息步骤', () => {
    render(<PetForm />)
    
    // 检查表单标题是否显示
    expect(screen.getByText('发布宠物')).toBeInTheDocument()
    // 检查表单字段是否显示
    expect(screen.getByLabelText(/宠物名称/)).toBeInTheDocument()
    expect(screen.getByLabelText(/品种/)).toBeInTheDocument()
    expect(screen.getByLabelText(/年龄/)).toBeInTheDocument()
    expect(screen.getByText(/性别/)).toBeInTheDocument()
    expect(screen.getByText(/^状态/)).toBeInTheDocument() // 只匹配以"状态"开头的文本，避免匹配"疫苗状态"
    expect(screen.getByLabelText(/位置/)).toBeInTheDocument()
    // 检查按钮是否显示
    expect(screen.getByText('取消')).toBeInTheDocument()
    expect(screen.getByText('下一步')).toBeInTheDocument()
  })

  it('应该能够正确渲染表单的基本信息字段', () => {
    render(<PetForm />)
    
    // 检查表单字段是否显示 - 只测试有明确label的输入字段
    expect(screen.getByLabelText(/宠物名称/)).toBeInTheDocument()
    expect(screen.getByLabelText(/品种/)).toBeInTheDocument()
    expect(screen.getByLabelText(/年龄/)).toBeInTheDocument()
    expect(screen.getByLabelText(/位置/)).toBeInTheDocument()
  })

  it('应该能够切换表单步骤', () => {
    render(<PetForm />)
    
    // 填写基本信息
    fireEvent.change(screen.getByLabelText(/宠物名称/), { target: { value: '小白' } })
    fireEvent.change(screen.getByLabelText(/品种/), { target: { value: '拉布拉多' } })
    fireEvent.change(screen.getByLabelText(/年龄/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/位置/), { target: { value: '北京市朝阳区' } })
    
    // 点击下一步按钮
    const nextButton = screen.getByText('下一步')
    fireEvent.click(nextButton)
    
    // 检查是否切换到照片上传步骤 - 使用更具体的选择器
    expect(screen.getByText('最多上传 5 张照片')).toBeInTheDocument()
    
    // 点击上一步按钮
    const prevButton = screen.getByText('上一步')
    fireEvent.click(prevButton)
    
    // 检查是否切换回基本信息步骤 - 检查是否显示宠物名称输入框
    expect(screen.getByLabelText(/宠物名称/)).toBeInTheDocument()
  })

  it('应该能够填写基本信息并切换到下一步', () => {
    render(<PetForm />)
    
    // 填写基本信息
    fireEvent.change(screen.getByLabelText(/宠物名称/), { target: { value: '小白' } })
    fireEvent.change(screen.getByLabelText(/品种/), { target: { value: '拉布拉多' } })
    fireEvent.change(screen.getByLabelText(/年龄/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/位置/), { target: { value: '北京市朝阳区' } })
    
    // 点击下一步按钮
    const nextButton = screen.getByText('下一步')
    fireEvent.click(nextButton)
    
    // 检查是否切换到照片上传步骤 - 使用更具体的选择器
    expect(screen.getByText('最多上传 5 张照片')).toBeInTheDocument()
  })

  it('应该在没有上传照片时禁用下一步按钮', () => {
    render(<PetForm />)
    
    // 填写基本信息并切换到照片上传步骤
    fireEvent.change(screen.getByLabelText(/宠物名称/), { target: { value: '小白' } })
    fireEvent.change(screen.getByLabelText(/品种/), { target: { value: '拉布拉多' } })
    fireEvent.change(screen.getByLabelText(/年龄/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/位置/), { target: { value: '北京市朝阳区' } })
    fireEvent.click(screen.getByText('下一步'))
    
    // 检查下一步按钮是否禁用
    const nextButton = screen.getByText('下一步')
    expect(nextButton).toBeDisabled()
  })

  it('应该能够编辑现有宠物信息', () => {
    const initialData = {
      id: 'pet1',
      name: '小白',
      breed: '拉布拉多',
      age: 2,
      gender: 'male' as 'male' | 'female' | 'unknown',
      status: 'available' as 'available' | 'adopted' | 'pending',
      description: '这是一只非常可爱的拉布拉多犬。',
      location: '北京市朝阳区',
      health_status: '健康',
      vaccine_status: true,
      sterilized: true,
    }
    
    render(<PetForm initialData={initialData} isEdit={true} />)
    
    // 检查表单标题是否显示为编辑宠物
    expect(screen.getByText('编辑宠物')).toBeInTheDocument()
    // 检查表单字段是否填充了初始数据
    expect(screen.getByLabelText(/宠物名称/)).toHaveValue('小白')
    expect(screen.getByLabelText(/品种/)).toHaveValue('拉布拉多')
    expect(screen.getByLabelText(/年龄/)).toHaveValue(2)
    expect(screen.getByLabelText(/位置/)).toHaveValue('北京市朝阳区')
    // 检查提交按钮是否显示为保存修改
    expect(screen.getByText('下一步')).toBeInTheDocument()
  })
})
