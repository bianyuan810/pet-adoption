'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 定义Application接口
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

// 申请详情页面
export default function ApplicationDetailPage() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 获取当前用户信息
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // 调用auth函数获取当前用户信息
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.user.id);
        }
      } catch (error) {
        console.error('获取当前用户信息失败:', error);
      }
    };

    getCurrentUser();
  }, []);

  // 获取申请详情
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const response = await fetch(`/api/applications/${params.id}`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          setApplication(data);
        } else {
          console.error('获取申请详情失败');
        }
      } catch (error) {
        console.error('获取申请详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchApplicationDetail();
    }
  }, [params.id]);

  // 同意申请
  const handleApprove = async () => {
    if (!application?.id) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/applications/${application.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '申请已同意' });
        // 更新本地状态
        setApplication(prev => prev ? { ...prev, status: 'approved' } : null);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || '同意申请失败' });
      }
    } catch (error) {
      console.error('同意申请失败:', error);
      setMessage({ type: 'error', text: '同意申请失败' });
    } finally {
      setIsProcessing(false);
    }
  };

  // 拒绝申请
  const handleReject = async () => {
    if (!application?.id) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/applications/${application.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '申请已拒绝' });
        // 更新本地状态
        setApplication(prev => prev ? { ...prev, status: 'rejected' } : null);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || '拒绝申请失败' });
      }
    } catch (error) {
      console.error('拒绝申请失败:', error);
      setMessage({ type: 'error', text: '拒绝申请失败' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">申请不存在</h1>
          <p className="text-gray-600">您访问的申请信息不存在或已被删除</p>
        </div>
      </div>
    );
  }

  // 状态标签和颜色映射
  const statusLabels = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  // 性别标签映射
  const genderLabels = {
    male: '公',
    female: '母',
    unknown: '未知'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/applications" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回申请列表
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">申请详情</h1>
          <p className="text-gray-600">查看完整的宠物收养申请信息</p>
        </div>

        {/* 申请卡片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 顶部状态条 */}
          <div className="bg-indigo-50 border-b border-indigo-100 p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  申请编号: {application.id}
                </h2>
                <p className="text-sm text-gray-600">
                  创建时间: {new Date(application.created_at).toLocaleString()}
                </p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
                {statusLabels[application.status]}
              </span>
            </div>
          </div>

          {/* 宠物信息 */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">宠物信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">宠物名称</span>
                <span className="text-base font-medium text-gray-900">{application.pet.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">品种</span>
                <span className="text-base font-medium text-gray-900">{application.pet.breed}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">年龄</span>
                <span className="text-base font-medium text-gray-900">{application.pet.age}岁</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">性别</span>
                <span className="text-base font-medium text-gray-900">{genderLabels[application.pet.gender]}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">位置</span>
                <span className="text-base font-medium text-gray-900">{application.pet.location}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">状态</span>
                <span className="text-base font-medium text-gray-900">
                  {application.pet.status === 'available' ? '可领养' : 
                   application.pet.status === 'adopted' ? '已领养' : '待领养'}
                </span>
              </div>
            </div>
          </div>

          {/* 申请人信息 */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">申请人信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">姓名</span>
                <span className="text-base font-medium text-gray-900">{application.applicant.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">邮箱</span>
                <span className="text-base font-medium text-gray-900">{application.applicant.email}</span>
              </div>
              {application.applicant.phone && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">电话</span>
                  <span className="text-base font-medium text-gray-900">{application.applicant.phone}</span>
                </div>
              )}
              {application.applicant.wechat && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">微信</span>
                  <span className="text-base font-medium text-gray-900">{application.applicant.wechat}</span>
                </div>
              )}
            </div>
          </div>

          {/* 申请消息 */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">申请消息</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-base text-gray-800 whitespace-pre-wrap">{application.message}</p>
            </div>
          </div>

          {/* 审核按钮 - 只有发布者且申请状态为待审核时显示 */}
          {currentUserId === application.publisher_id && application.status === 'pending' && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">审核申请</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </>
                  ) : (
                    '同意申请'
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </>
                  ) : (
                    '拒绝申请'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 消息提示 */}
          {message && (
            <div className={`m-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}