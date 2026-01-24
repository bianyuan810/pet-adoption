# 组件使用文档

## 1. 概述

本文档介绍了宠物领养平台应用中使用的 UI 组件，包括组件的功能、使用方法和最佳实践。

## 2. 组件库

### 2.1 按钮组件

#### 功能描述
用于触发用户操作的交互元素，支持多种样式和状态。

#### 使用示例
```tsx
// 主要按钮
<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
  主要按钮
</button>

// 次要按钮
<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
  次要按钮
</button>

// 危险按钮
<button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
  危险按钮
</button>

// 禁用按钮
<button className="bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-4 rounded-lg opacity-60">
  禁用按钮
</button>
```

#### 最佳实践
- 主要按钮用于最重要的操作，如提交表单、确认操作
- 次要按钮用于次要操作，如取消、返回
- 危险按钮用于具有破坏性的操作，如删除、取消
- 确保按钮文本清晰明了，描述按钮的功能

### 2.2 输入框组件

#### 功能描述
用于接收用户输入的表单元素，支持多种状态。

#### 使用示例
```tsx
// 默认状态
<input
  type="text"
  placeholder="请输入内容"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
/>

// 聚焦状态
<input
  type="text"
  placeholder="请输入内容"
  className="w-full px-4 py-3 border-2 border-orange-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
/>

// 错误状态
<input
  type="text"
  placeholder="请输入内容"
  className="w-full px-4 py-3 border-2 border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
/>

// 禁用状态
<input
  type="text"
  placeholder="请输入内容"
  disabled
  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed opacity-60"
/>
```

#### 最佳实践
- 为输入框添加清晰的占位符文本
- 提供即时的表单验证反馈
- 使用适当的输入类型（如 email、password、number）
- 确保输入框有足够的宽度和高度，方便用户输入

### 2.3 卡片组件

#### 功能描述
用于展示结构化信息的容器组件，支持多种内容布局。

#### 使用示例
```tsx
// 宠物卡片
<div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <div className="relative h-48 bg-gray-200">
    {/* 图片 */}
    <Image src="pet.jpg" alt="宠物" fill className="object-cover" />
    {/* 状态标签 */}
    <span className="absolute top-3 right-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
      可领养
    </span>
  </div>
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">宠物名称</h3>
    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
      <span>品种</span>
      <span>•</span>
      <span>年龄</span>
      <span>•</span>
      <span>性别</span>
    </div>
    <p className="text-sm text-gray-500 line-clamp-2 mb-3">宠物描述</p>
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">地点</span>
      <span className="text-gray-400">浏览量</span>
    </div>
  </div>
</div>
```

#### 最佳实践
- 卡片内容保持简洁，突出重点信息
- 使用适当的阴影和圆角，营造层次感
- 添加悬停效果，提高交互体验
- 确保卡片在不同屏幕尺寸下都能良好显示

### 2.4 模态框组件

#### 功能描述
用于显示重要信息或请求用户操作的弹窗组件，支持自定义内容和样式。

#### 使用示例
```tsx
'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'

export default function Example() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>打开模态框</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="模态框标题"
        size="md"
      >
        <div className="space-y-4">
          <p>模态框内容</p>
          {/* 表单或其他内容 */}
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
            取消
          </button>
          <button onClick={() => setIsOpen(false)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            确认
          </button>
        </div>
      </Modal>
    </div>
  )
}
```

#### 最佳实践
- 模态框用于重要的操作确认，如删除、提交表单
- 保持模态框内容简洁，避免过长的表单
- 提供明确的关闭按钮和操作按钮
- 实现键盘 ESC 键关闭模态框的功能

### 2.5 提示框组件

#### 功能描述
用于显示操作反馈或提示信息的组件，支持多种状态。

#### 使用示例
```tsx
import Alert from '@/components/ui/Alert'

// 成功提示
<Alert type="success" message="操作成功！" />

// 错误提示
<Alert type="error" message="操作失败，请重试。" />

// 警告提示
<Alert type="warning" message="请注意，这是一个警告信息。" />

// 信息提示
<Alert type="info" message="这是一个信息提示。" />

// 带关闭按钮的提示
<Alert type="success" message="操作成功！" onClose={() => console.log('关闭提示')} />
```

#### 最佳实践
- 成功提示用于确认操作完成
- 错误提示用于显示操作失败的原因
- 警告提示用于提醒用户注意潜在问题
- 信息提示用于提供额外的说明或指引

### 2.6 加载组件

#### 功能描述
用于显示加载状态的组件，包括加载动画和骨架屏。

#### 使用示例
```tsx
// 旋转加载动画
<div className="flex items-center justify-center py-8">
  <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
</div>

// 骨架屏
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {Array.from({ length: 8 }).map((_, index) => (
    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-16 bg-gray-200 rounded" />
      </div>
    </div>
  ))}
</div>
```

#### 最佳实践
- 在数据加载过程中显示加载状态
- 骨架屏用于模拟真实内容的布局，提供更好的用户体验
- 确保加载动画流畅，避免过于复杂的动画影响性能
- 在加载时间较长时，提供取消操作的选项

### 2.7 空状态组件

#### 功能描述
用于在没有数据时显示友好的提示信息。

#### 使用示例
```tsx
import EmptyState from '@/components/ui/EmptyState'

<EmptyState
  title="暂无数据"
  description="目前没有相关数据，请稍后再试或调整筛选条件。"
  action={
    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
      刷新数据
    </button>
  }
/>
```

#### 最佳实践
- 提供清晰的空状态提示，说明为什么没有数据
- 提供有帮助的操作建议，如刷新、调整筛选条件
- 使用友好的图标或插图，缓解用户的挫败感

## 3. 组件命名规范

1. 组件名称使用 PascalCase 命名法，如 `PetCard`、`Modal`
2. 组件文件名称与组件名称保持一致，如 `PetCard.tsx`
3. 相关组件放在同一个目录下，如 `components/pet/`、`components/ui/`
4. 通用组件放在 `components/ui/` 目录下，业务组件放在对应业务目录下

## 4. 最佳实践

1. **组件复用**：尽可能复用已有的组件，避免重复开发
2. **单一职责**：每个组件只负责一个功能，保持组件的简洁性
3. **可扩展性**：设计组件时考虑未来的扩展需求，提供足够的 props 配置
4. **性能优化**：避免不必要的渲染，使用 React.memo 或 useMemo 优化性能
5. **可访问性**：确保组件符合 WCAG 可访问性标准，支持键盘导航和屏幕阅读器
6. **响应式设计**：确保组件在不同屏幕尺寸下都能良好显示

## 5. 更新记录

| 日期 | 版本 | 更新内容 | 作者 |
|------|------|---------|------|
| 2026-01-24 | 1.0 | 初始创建 | AI Assistant |
