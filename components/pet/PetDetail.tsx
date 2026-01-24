'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PhotoCarousel from './PhotoCarousel'
import ApplicationForm from './ApplicationForm'
import type { Pet } from '@/types/supabase'

interface PetDetailProps {
  pet: Pet
  photos: string[]
  publisher: {
    id: string
    name: string
    email?: string
    phone?: string
    wechat?: string
  }
}

export default function PetDetail({ pet, photos, publisher }: PetDetailProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isOwner = user?.id === pet.publisher_id

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/pets')
      }
    } catch (error) {
      console.error('删除宠物失败:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    adopted: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }

  const statusLabels = {
    available: '可领养',
    adopted: '已领养',
    pending: '申请中',
  }

  const genderLabels = {
    male: '公',
    female: '母',
    unknown: '未知',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PhotoCarousel photos={photos} name={pet.name} />

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{pet.breed}</span>
              <span>•</span>
              <span>{pet.age} 岁</span>
              <span>•</span>
              <span>{genderLabels[pet.gender]}</span>
              <span>•</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[pet.status]}`}>
                {statusLabels[pet.status]}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/pets/${pet.id}/edit`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '删除中...' : '删除'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">基本信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">品种</span>
                <span className="font-medium">{pet.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">年龄</span>
                <span className="font-medium">{pet.age} 岁</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">性别</span>
                <span className="font-medium">{genderLabels[pet.gender]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">位置</span>
                <span className="font-medium">{pet.location}</span>
              </div>
              {pet.health_status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">健康状况</span>
                  <span className="font-medium">{pet.health_status}</span>
                </div>
              )}
              {pet.vaccine_status !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">疫苗状态</span>
                  <span className="font-medium">{pet.vaccine_status ? '已接种' : '未接种'}</span>
                </div>
              )}
              {pet.sterilized !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">绝育状态</span>
                  <span className="font-medium">{pet.sterilized ? '已绝育' : '未绝育'}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">发布者信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">姓名</span>
                <span className="font-medium">{publisher.name}</span>
              </div>
              {publisher.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">邮箱</span>
                  <span className="font-medium">{publisher.email}</span>
                </div>
              )}
              {publisher.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">电话</span>
                  <span className="font-medium">{publisher.phone}</span>
                </div>
              )}
              {publisher.wechat && (
                <div className="flex justify-between">
                  <span className="text-gray-600">微信</span>
                  <span className="font-medium">{publisher.wechat}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">详细描述</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {pet.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2 8h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2h2zm2-4h6a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v2a2 2 0 002 2z"
            />
          </svg>
          <span>浏览 {pet.view_count} 次</span>
        </div>

        {/* 申请表单 - 仅当不是发布者且宠物可领养时显示 */}
        {!isOwner && pet.status === 'available' && user && (
          <div className="mt-6">
            <ApplicationForm petId={pet.id} />
          </div>
        )}

        {/* 登录提示 - 如果用户未登录 */}
        {!isOwner && pet.status === 'available' && !user && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800">需要登录</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>请先登录账号，然后才能提交收养申请。</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  登录
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-600 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  注册
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">确认删除</h3>
            <p className="text-gray-600 mb-6">
              确定要删除宠物 &quot;{pet.name}&quot; 吗？此操作不可恢复。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
