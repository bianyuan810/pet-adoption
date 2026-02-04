'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, PawPrint, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

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
    photos?: string[];
  };
  applicant: {
    id: string;
    name: string;
    email: string;
  };
}

// 申请详情页面
export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 检查当前用户是否是宠物发布者
  const isPublisher = () => {
    if (!user || !application) return false;
    return user.id === application.publisher_id;
  };

  // 获取申请详情
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/applications/${params.id}`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          
          // 检查API响应是否成功且包含数据
          if (data.code === 200 && data.data) {
            setApplication(data.data);
          } else {
            setError('获取申请详情失败');
            console.error('获取申请详情失败:', data);
          }
        } else {
          setError('获取申请详情失败');
          console.error('获取申请详情失败');
        }
      } catch (error) {
        setError('获取申请详情失败，请稍后重试');
        console.error('获取申请详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchApplicationDetail();
    }
  }, [params.id]);

  // 处理申请审核
  const handleReviewApplication = async (action: 'approve' | 'reject') => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/applications/${params.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 刷新页面数据
        const data = await response.json();
        setApplication(data);
        // 显示成功提示
        alert(action === 'approve' ? '申请已通过' : '申请已拒绝');
      } else {
        const errorData = await response.json();
        alert('操作失败: ' + (errorData.error || '未知错误'));
      }
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">申请不存在</h1>
          <p className="text-gray-600">{error || '您访问的申请信息不存在或已被删除'}</p>
          <button 
            onClick={() => router.push('/applications')} 
            className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
          >
            返回申请列表
          </button>
        </div>
      </div>
    );
  }

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 dark:bg-white/10 border-orange-200 text-orange-700';
      case 'approved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 text-green-700';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 dark:bg-white/10 border-gray-200 text-gray-700';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '审核中';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col min-h-screen">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-8 pb-32">
        <div className="lg:w-[66.666%] space-y-8 flex flex-col">
          <header className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight">申请编号 #{application.id}</h2>
              <p className="text-gray-500 text-sm">提交日期：{new Date(application.created_at).toLocaleDateString('zh-CN')} • 申请人：{application.applicant?.name || '未知申请人'}</p>
            </div>
            <div className={`${getStatusStyle(application.status)} px-4 py-2 rounded-full flex items-center gap-2 border`}>
              {application.status === 'pending' && <div className="size-2 rounded-full bg-orange-500 animate-pulse"></div>}
              {application.status === 'approved' && <CheckCircle size={16} className="text-green-500" />}
              {application.status === 'rejected' && <XCircle size={16} className="text-red-500" />}
              <span className="text-sm font-bold">{getStatusText(application.status)}</span>
            </div>
          </header>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col flex-1">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PawPrint className="text-primary" />
              申请人档案
            </h3>
            <div className="space-y-4 mb-8 flex-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">申请理由</label>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-gray-300">{application.message || '暂无申请理由'}</p>
            </div>
            <div className="border-t border-gray-100 dark:border-white/10 pt-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-gray-400 uppercase">联系方式</label>
                {application.status !== 'approved' && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">通过审核后解锁</span>
                )}
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${application.status !== 'approved' ? 'opacity-70' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">📧</span>
                  <span className="text-sm">{application.applicant?.email || '未知邮箱'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">📞</span>
                  <span className="text-sm">{application.status === 'approved' ? '138****1234' : '*******'}</span>
                </div>
              </div>
              {application.status !== 'approved' && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500">通过申请后将显示完整联系方式</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-[33.333%] space-y-6 flex flex-col justify-between">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
            <div className="w-full h-48 bg-gray-100 dark:bg-white/10 overflow-hidden">
              {application.pet?.photos && application.pet.photos.length > 0 ? (
                <img 
                  src={application.pet.photos[0]} 
                  alt={application.pet.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PawPrint className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold text-primary uppercase mb-1">申请对象</p>
              <h4 className="text-xl font-bold">{application.pet?.name || '未知宠物'}</h4>
              <p className="text-gray-500 text-sm mb-4">{application.pet?.breed || '未知品种'} • {application.pet?.age || 0} 岁</p>
              <Link href={`/pets/${application.pet?.id}`} className="w-full py-2 rounded-full border border-gray-100 dark:border-white/10 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                查看详细档案 <span className="text-sm">→</span>
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase">申请流程进度</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold">已提交</p>
                  <p className="text-[11px] text-gray-500">{new Date(application.created_at).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className={`size-6 rounded-full ${application.status === 'pending' ? 'bg-primary text-white ring-4 ring-primary/10' : application.status === 'approved' || application.status === 'rejected' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {application.status === 'pending' ? <Clock size={14} /> : <CheckCircle size={14} />}
                </div>
                <div>
                  <p className="text-sm font-bold">初步审核</p>
                  <p className="text-[11px] text-gray-500">{application.status === 'pending' ? '进行中' : new Date(application.updated_at).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className={`size-6 rounded-full ${application.status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {application.status === 'approved' && <CheckCircle size={14} />}
                </div>
                <div>
                  <p className="text-sm font-bold">最终决定</p>
                  <p className="text-[11px] text-gray-500">{application.status === 'approved' || application.status === 'rejected' ? new Date(application.updated_at).toLocaleDateString('zh-CN') : '等待中'}</p>
                </div>
              </div>
            </div>
            
            {/* 发送消息按钮 */}
            <div className="mt-8">
              <button 
                onClick={() => {
                  // 确定对话的另一方用户ID
                  const otherUserId = user?.id === application.publisher_id 
                    ? application.applicant_id 
                    : application.publisher_id;
                  
                  // 跳转到消息中心并传递对话用户ID
                  router.push(`/messages?userId=${otherUserId}&userName=${encodeURIComponent(application.applicant?.name || '未知用户')}`);
                }}
                className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                发送消息
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 只有当当前用户是发布者且申请状态为待审核时，才显示底部操作栏 */}
      {application.status === 'pending' && isPublisher() && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-gray-100 dark:border-white/10 p-6 flex justify-center z-[60]">
          <div className="w-full max-w-7xl flex items-center justify-between">
            <div className="hidden sm:flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase">当前决策</p>
              <p className="text-xs font-medium">待完成初步筛选</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => handleReviewApplication('reject')} 
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-10 py-3 rounded-full border border-red-500 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                拒绝申请
              </button>
              <button 
                onClick={() => handleReviewApplication('approve')} 
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-12 py-3 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                通过申请
              </button>
            </div>
          </div>
        </footer>
      )}
      
      <div className="mt-8 flex justify-between pt-6 border-t border-gray-100 dark:border-white/10 max-w-7xl mx-auto px-6">
        <button onClick={() => router.push('/applications')} className="text-primary font-bold flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} /> 返回列表
        </button>
      </div>


    </div>
  );
}