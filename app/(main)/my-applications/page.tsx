'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Calendar, Loader2 } from 'lucide-react';
import { HttpStatus } from '@/app/types/api';

// 申请状态类型
type ApplicationStatusType = 'pending' | 'approved' | 'rejected';

// 申请数据类型
interface Application {
  id: string;
  pet_id: string;
  applicant_id: string;
  publisher_id: string;
  message: string;
  status: ApplicationStatusType;
  created_at: string;
  updated_at: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: string;
    location: string;
    status: string;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  publisher: {
    id: string;
    name: string;
    email: string;
  };
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // 获取申请列表
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch('/api/applications');
        const data = await response.json();
        
        if (response.ok) {
          // 确保 applications 始终是数组
          if (data.code === HttpStatus.OK && Array.isArray(data.data)) {
            setApplications(data.data as Application[]);
          } else if (Array.isArray(data)) {
            // 兼容直接返回数组的情况
            setApplications(data as Application[]);
          } else {
            setApplications([]);
          }
        } else {
          setError(data.msg || '获取申请列表失败');
          setApplications([]);
        }
      } catch (err) {
        console.error('获取申请列表失败:', err);
        setError('获取申请列表失败，请稍后重试');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // 按状态筛选申请
  const getFilteredApplications = () => {
    if (activeTab === 'all') {
      return applications;
    } else if (activeTab === 'pending') {
      return applications.filter(app => app.status === 'pending');
    } else if (activeTab === 'approved') {
      return applications.filter(app => app.status === 'approved');
    } else if (activeTab === 'rejected') {
      return applications.filter(app => app.status === 'rejected');
    }
    return applications;
  };

  const getStatusStyle = (status: ApplicationStatusType) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: ApplicationStatusType) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      case 'pending': return '审核中';
      default: return '未知';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black leading-tight text-zinc-900 dark:text-white">我的领养申请</h1>
          <p className="text-zinc-500 dark:text-gray-400 mt-2">追踪您与未来毛孩子伙伴的领养进度。</p>
        </div>
        <button onClick={() => router.push('/pets')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
          <PawPrint /> 寻找更多宠物
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-white/10 px-6 gap-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('all')}
            className={`pb-3 pt-4 font-bold text-sm transition-colors ${activeTab === 'all' ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-gray-500 hover:text-zinc-800'}`}
          >
            全部申请 ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`pb-3 pt-4 font-bold text-sm transition-colors ${activeTab === 'pending' ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-gray-500 hover:text-zinc-800'}`}
          >
            待审核
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`pb-3 pt-4 font-bold text-sm transition-colors ${activeTab === 'approved' ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-gray-500 hover:text-zinc-800'}`}
          >
            已通过
          </button>
          <button 
            onClick={() => setActiveTab('rejected')}
            className={`pb-3 pt-4 font-bold text-sm transition-colors ${activeTab === 'rejected' ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-gray-500 hover:text-zinc-800'}`}
          >
            已拒绝
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20 text-red-500">
            <span>{error}</span>
          </div>
        ) : getFilteredApplications().length === 0 ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <span>暂无申请记录</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {getFilteredApplications().map((app) => (
              <div key={app.id} className="flex flex-wrap items-center gap-6 p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shadow-sm">
                  <PawPrint className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-zinc-900 dark:text-white text-xl font-bold">{app.pet?.name || '未知宠物'}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Calendar size={18} />
                    <span>申请时间：{formatDate(app.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <span>ID: {app.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${getStatusStyle(app.status)}`}>
                    {getStatusLabel(app.status)}
                  </span>
                  <button onClick={() => router.push(`/applications/${app.id}`)} className="w-full bg-gray-100 dark:bg-white/10 text-zinc-800 dark:text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                    查看进度
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}