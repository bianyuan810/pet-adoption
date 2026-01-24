'use client'

import PetForm from '@/components/pet/PetForm'

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发布宠物</h1>
          <p className="text-gray-600">填写宠物信息，帮助它们找到温暖的家</p>
        </div>

        <PetForm />
      </div>
    </div>
  )
}
