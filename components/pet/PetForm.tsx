'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import Image from 'next/image'

const petSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '请输入宠物名称').max(50, '名称不能超过50个字符'),
  breed: z.string().min(1, '请输入品种').max(50, '品种不能超过50个字符'),
  age: z.number().min(0, '年龄不能为负数').max(30, '年龄不能超过30岁'),
  gender: z.enum(['male', 'female', 'unknown']).describe('请选择性别'),
  status: z.enum(['available', 'adopted', 'pending']).describe('请选择状态'),
  description: z.string().min(10, '描述至少需要10个字符').max(1000, '描述不能超过1000个字符'),
  location: z.string().min(1, '请输入位置').max(100, '位置不能超过100个字符'),
  health_status: z.string().optional(),
  vaccine_status: z.boolean().optional(),
  sterilized: z.boolean().optional(),
})

type PetFormData = z.infer<typeof petSchema>

interface PetFormProps {
  initialData?: Partial<PetFormData> & { id?: string }
  isEdit?: boolean
  onSuccess?: () => void
}

export default function PetForm({ initialData, isEdit = false, onSuccess }: PetFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    breed: '',
    age: 1,
    gender: 'unknown',
    status: 'available',
    description: '',
    location: '',
    health_status: '',
    vaccine_status: false,
    sterilized: false,
    ...initialData,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>(
    {}
  )
  const [photos, setPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateField = (field: keyof PetFormData, value: string | number | boolean) => {
    try {
      petSchema.parse({ ...formData, [field]: value })
      setErrors((prev) => ({ ...prev, [field]: '' }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((e) => e.path[0] === field)
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }))
          return false
        }
      }
      return true
    }
  }

  const handleChange = (field: keyof PetFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).slice(0, 5 - photos.length)
      setPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    try {
      petSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof PetFormData, string>> = {}
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof PetFormData
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      }
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value))
      })

      photos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo)
      })

      const url = isEdit ? `/api/pets/${initialData?.id}` : '/api/pets'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '提交失败，请稍后重试')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/pets')
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { title: '基本信息', description: '填写宠物的基本信息' },
    { title: '照片上传', description: '上传宠物的照片（最多5张）' },
    { title: '详细描述', description: '填写宠物的详细描述' },
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? '编辑宠物' : '发布宠物'}
          </h1>
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 ${
                  currentStep === index + 1 ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {submitError}
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                宠物名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入宠物名称"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                品种 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="breed"
                value={formData.breed}
                onChange={(e) => handleChange('breed', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.breed ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入品种"
              />
              {errors.breed && <p className="mt-1 text-sm text-red-600">{errors.breed}</p>}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                年龄 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入年龄"
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'male', label: '公' },
                  { value: 'female', label: '母' },
                  { value: 'unknown', label: '未知' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'available', label: '可领养' },
                  { value: 'adopted', label: '已领养' },
                  { value: 'pending', label: '申请中' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                位置 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入位置"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="health_status" className="block text-sm font-medium text-gray-700 mb-2">
                  健康状况
                </label>
                <input
                  type="text"
                  id="health_status"
                  value={formData.health_status}
                  onChange={(e) => handleChange('health_status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="请输入健康状况"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  疫苗状态
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vaccine_status}
                    onChange={(e) => handleChange('vaccine_status', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>已接种</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sterilized}
                  onChange={(e) => handleChange('sterilized', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span>已绝育</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">照片上传</h2>
            <p className="text-gray-600 mb-4">最多上传 5 张照片</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
                >
                  {photos[index] ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(photos[index])}
                        alt={`照片 ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover rounded-lg"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H8m8 8v16m4-8h-4m4 8v16"
                        />
                      </svg>
                    </label>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={photos.length === 0}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">详细描述</h2>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={8}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请详细描述宠物的性格、习惯、健康状况等信息"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                上一步
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : isEdit ? '保存修改' : '发布'}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
