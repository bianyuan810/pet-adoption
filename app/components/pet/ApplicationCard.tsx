'use client'

import { useRouter } from 'next/navigation'

// 从 ApplicationList 组件中获取的 Application 类型
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
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: '待处理',
    approved: '已批准',
    rejected: '已拒绝'
  }

  // 点击卡片跳转到申请详情页
  const handleClick = () => {
    router.push(`/applications/${application.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow hover:bg-gray-50 cursor-pointer">
      {/* 使用 onClick 事件代替 Link 组件，因为需要整个卡片可点击 */}
      <div 
        onClick={handleClick}
        className="h-full"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {/* 使用span代替Link组件，因为整个卡片已经可点击 */}
              <span className="text-gray-900 hover:text-orange-500 transition-colors">
                {application.pet.name}
              </span>
            </h3>
            <p className="text-sm text-gray-500">申请人：{application.applicant.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
            {statusLabels[application.status]}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">申请时间</span>
            <span className="text-sm text-gray-800">{new Date(application.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">申请状态</span>
            <span className="text-sm font-medium text-gray-900">{statusLabels[application.status]}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
        </div>
      </div>
    </div>
  )
}


