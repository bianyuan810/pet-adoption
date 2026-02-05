'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, X, Clock, UserX } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { HttpStatus } from '@/app/types/api';

// 申请数据类型定义
interface Application {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar?: string;
  submitDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  experience: string;
  environment: string;
}

// API返回的申请数据类型
interface AppData {
  id: string;
  pet_id: string;
  pet?: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: string;
    location: string;
    status: string;
    photos: string[];
  } | null;
  applicant?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
  created_at: string;
  status: string;
  message: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 获取申请列表数据
  const fetchApplications = useCallback(async () => {
    try {
      
      // 检查认证状态
      if (!isAuthenticated || !token) {
        setError('请先登录');
        setApplications([]);
        setIsLoading(false);
        // 跳转到登录页面
        router.push('/login?redirect=/applications');
        return;
      }

      setIsLoading(true);
      setError('');
      
      // 调用申请列表 API
      const response = await fetch('/api/applications?&isPublisher=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 响应错误:', errorText);
        throw new Error(`获取申请列表失败: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.code !== HttpStatus.OK) {
        throw new Error(data.msg || '获取申请列表失败');
      }
      
      // 转换申请数据格式以匹配前端期望的结构
      let formattedApplications = [];
      
      // 确保 data.data 是一个数组
      if (Array.isArray(data.data)) {
        formattedApplications = data.data.map((app: AppData) => ({
          id: app.id,
          petId: app.pet_id,
          petName: app.pet?.name || '未知宠物',
          petImage: app.pet?.photos && app.pet.photos.length > 0 ? app.pet.photos[0] : '/images/no-image.png',
          applicantName: app.applicant?.name || '未知申请人',
          applicantEmail: app.applicant?.email || '未知邮箱',
          applicantAvatar: app.applicant?.avatar_url,
          submitDate: app.created_at,
          status: app.status.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED',
          reason: app.message || '',
          experience: '',
          environment: ''
        }));
      }
      
      setApplications(formattedApplications);
    } catch (err) {
      console.error('获取申请列表错误:', err);
      setError(err instanceof Error ? err.message : '获取申请列表失败');
      // 显示空状态，不使用模拟数据
      setApplications([]);
    } finally {
    setIsLoading(false);
  }
}, [isAuthenticated, token, user, router]);

  // 组件挂载时获取数据，认证状态变化时重新获取
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '未知日期';
    }
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-zinc-900 dark:text-white">
            收到的申请 
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">{applications.length} 条</span>
          </h2>
          <p className="text-gray-500 mt-1">管理并审核来自爱心人士的领养请求。</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl font-bold text-sm hover:border-primary transition-all">筛选</button>
          <button className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl font-bold text-sm hover:border-primary transition-all">导出</button>
        </div>
      </div>

      <div className="mb-6 flex border-b border-gray-100 dark:border-white/10 gap-8">
        <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm">全部申请</button>
        <button className="pb-4 border-b-2 border-transparent text-gray-500 font-bold text-sm hover:text-zinc-900">待审核</button>
        <button className="pb-4 border-b-2 border-transparent text-gray-500 font-bold text-sm hover:text-zinc-900">已通过</button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // 加载状态
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-center gap-4 animate-pulse">
              <div className="flex items-center gap-4 w-64 shrink-0">
                <div className="size-14 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="w-40">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="w-32">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-28"></div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
                <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))
        ) : error ? (
          // 错误状态
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-4">
            <Clock className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
            <button 
              onClick={fetchApplications} 
              className="ml-auto px-4 py-2 bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700/50 transition-colors"
            >
              重试
            </button>
          </div>
        ) : applications.length > 0 ? (
          // 申请列表
          applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-center hover:shadow-md transition-all gap-4">
              <div className="flex items-center gap-4 w-64 shrink-0 ">
                <div className="size-14 rounded-xl overflow-hidden shadow-sm">
                  <Image src={app.petImage} width={56} height={56} alt={app.petName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">{app.petName}</h3>
                  <p className="text-xs text-gray-500">申请对象</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200 border border-white dark:border-white/10 overflow-hidden flex items-center justify-center">
                  {app.applicantAvatar ? (
                    <Image 
                      src={app.applicantAvatar} 
                      width={40} 
                      height={40} 
                      alt={app.applicantName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <UserX className="size-5 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{app.applicantName}</p>
                  <p className="text-xs text-gray-500">纽约，布鲁克林</p>
                </div>
              </div>
              <div className="w-40">
                <p className="text-xs text-gray-400 mb-1">提交日期</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{formatDate(app.submitDate)}</p>
              </div>
              <div className="w-32">
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase ${
                  app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                  app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status === 'PENDING' ? '待审核' : 
                   app.status === 'APPROVED' ? '已通过' : '已拒绝'}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button onClick={() => router.push(`/applications/${app.id}`)} className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">查看详情</button>
   
              </div>
            </div>
          ))
        ) : (
          // 空状态
          <div className="bg-gray-50 dark:bg-gray-900/50 p-12 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
            <div className="inline-flex items-center justify-center size-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Clock className="text-gray-400 dark:text-gray-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">暂无申请</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">还没有收到任何领养申请，当有人提交申请时会显示在这里。</p>
            <button 
              onClick={fetchApplications} 
              className="px-5 py-2.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm hover:border-primary transition-all"
            >
              刷新列表
            </button>
          </div>
        )}
      </div>
    </div>
  );
}