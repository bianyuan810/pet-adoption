'use client'

import Link from 'next/link'
import type { Application } from '@/types/supabase'

interface ApplicationCardProps {
  application: Application
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link href={`/pets/${application.pet_id}`} className="hover:text-orange-500 transition-colors">
              {application.pet_name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">申请人：{application.adopter_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
          {statusLabels[application.status]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">申请时间：</span>
          <span className="text-sm text-gray-800">{new Date(application.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">申请状态：</span>
          <span className="text-sm font-medium text-gray-900">{statusLabels[application.status]}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
      </div>
    </div>
  )
}
