'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import Alert from '@/app/components/ui/Alert'
import { Card } from '@/app/components/ui/Card'
import { UserService } from '@/app/services/user.service'
import type { User } from '@/app/types/supabase'
import { Camera } from 'lucide-react'

interface ProfileFormData {
  name: string
  phone?: string
  wechat?: string
  avatar_url?: string
}

export default function ProfilePage() {
  const { user, token, isLoading: authLoading, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    wechat: '',
    avatar_url: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
        wechat: user.wechat || '',
        avatar_url: user.avatar_url || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件')
      return
    }

    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB')
      return
    }

    if (!user || !token) {
      setError('用户信息不存在')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || '上传头像失败')
      }

      setSuccess('头像上传成功')
      await refreshUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请稍后重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!user) {
      setError('用户信息不存在')
      setIsLoading(false)
      return
    }

    try {
      const updatedUser = await UserService.updateUser(user.id, {
        name: formData.name,
        phone: formData.phone || undefined,
        wechat: formData.wechat || undefined,
        avatar_url: formData.avatar_url || undefined
      })

      if (!updatedUser) {
        throw new Error('更新个人资料失败')
      }

      setSuccess('个人资料更新成功')
      setIsEditing(false)
      await refreshUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">请先登录</h2>
          <a href="/login" className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] shadow-sm hover:shadow-md active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary dark:hover:bg-primary/80 h-11 px-4 py-2 text-base gap-2">
            去登录
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">个人中心</h1>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}

      <Card className="max-w-2xl mx-auto p-6">
        {/* 头像部分 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="用户头像" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl font-bold text-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
          {isUploading && (
            <div className="text-sm text-gray-500">上传中...</div>
          )}
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* 编辑资料按钮 */}
        {!isEditing && (
          <div className="mb-6">
            <Button 
              type="button" 
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              编辑资料
            </Button>
          </div>
        )}

        {/* 个人资料表单 */}
        {isEditing && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  手机号
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="wechat" className="block text-sm font-medium text-gray-700 mb-1">
                  微信号
                </label>
                <Input
                  id="wechat"
                  name="wechat"
                  value={formData.wechat}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
                  头像URL
                </label>
                <div className="relative">
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pr-10"
                    placeholder="输入头像图片URL"
                  />
                  {isEditing && formData.avatar_url && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      清除
                    </button>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? '保存中...' : '保存'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false)
                    if (user) {
                      setFormData({
                        name: user.name,
                        phone: user.phone || '',
                        wechat: user.wechat || '',
                        avatar_url: user.avatar_url || ''
                      })
                    }
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
