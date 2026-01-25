'use client'

import Link from 'next/link'

// 定义与 ApplicationList 组件一致的 Application 接口
interface Application {
  id: string;
  pet_id: string;
  applicant_id: string;
  publisher_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  updated_at: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: 'male' | 'female' | 'unknown';
    status: 'available' | 'adopted' | 'pending';
    location: string;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    wechat?: string;
  };
}

interface ApplicationCardProps {
  application: Application;
  isPublisher: boolean;
}

export default function ApplicationCard({ application, isPublisher }: ApplicationCardProps) {
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
              {application.pet.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">申请人：{application.applicant.name}</p>
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
