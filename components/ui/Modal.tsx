'use client'

import { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  // 简化状态管理，直接使用isOpen控制显示/隐藏，通过CSS处理动画
  // 移除isVisible状态，使用isOpen直接控制

  // 处理模态框的显示和隐藏动画
  useEffect(() => {
    if (isOpen) {
      // 防止背景滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复背景滚动
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // 处理点击遮罩层关闭模态框
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // 处理 ESC 键关闭模态框
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscKey)
    return () => window.removeEventListener('keydown', handleEscKey)
  }, [isOpen, onClose])

  // 根据 size 属性设置模态框的宽度
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  // 如果不显示，直接返回null
  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'} ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 模态框头部 */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* 模态框内容 */}
        <div className="px-6 py-5">
          {children}
        </div>

        {/* 模态框底部 */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
