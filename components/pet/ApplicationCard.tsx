'use client';

import React, { useState } from 'react';

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

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, isPublisher }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 状态样式映射
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  // 状态标签映射
  const statusLabels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  };

  // 审核申请（同意/拒绝）
  const handleReview = async (action: 'approve' | 'reject') => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/applications/${application.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `审核失败`);
      }

      setSuccess(data.message || `申请已${action === 'approve' ? '同意' : '拒绝'}`);
      
      // 更新本地状态
      // 注意：在实际应用中，可能需要重新获取申请列表或使用乐观更新
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '审核失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* 申请者信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-gray-900">{application.applicant.name}</h4>
            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[application.status]}`}>
              {statusLabels[application.status]}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {application.applicant.email}
            {application.applicant.phone && ` · ${application.applicant.phone}`}
            {application.applicant.wechat && ` · 微信: ${application.applicant.wechat}`}
          </div>
        </div>

        {/* 申请时间和状态 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDate(application.created_at)}</span>
          </div>
        </div>
      </div>

      {/* 申请信息 */}
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>{isExpanded ? '收起申请理由' : '查看申请理由'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-2">申请理由:</h5>
            <p className="text-gray-600 whitespace-pre-wrap">{application.message}</p>
          </div>
        )}
      </div>

      {/* 错误和成功提示 */}
      {error && (
        <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* 审核按钮 - 仅当发布者且状态为待审核时显示 */}
      {isPublisher && application.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleReview('approve')}
            disabled={isProcessing}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '处理中...' : '同意申请'}
          </button>
          <button
            onClick={() => handleReview('reject')}
            disabled={isProcessing}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '处理中...' : '拒绝申请'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;