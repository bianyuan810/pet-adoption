'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, PawPrint } from 'lucide-react';

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
  };
}

// 申请详情页面
export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setApplication(data);
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

  // 构建时间线
  const buildTimeline = () => {
    if (!application) return [];

    const timeline = [
      {
        title: '已提交',
        date: new Date(application.created_at).toLocaleDateString('zh-CN'),
        desc: '您的申请已成功提交至平台。',
        done: true,
      },
      {
        title: '初步审核',
        date: application.status === 'pending' ? '进行中' : new Date(application.updated_at).toLocaleDateString('zh-CN'),
        desc: '我们的团队正在核实您的领养环境和背景。',
        active: application.status === 'pending',
        done: application.status !== 'pending',
      },
      {
        title: '电话面试',
        date: application.status === 'pending' ? '尚未安排' : application.status === 'approved' ? new Date(application.updated_at).toLocaleDateString('zh-CN') : '未进行',
        desc: '通过初审后，我们将联系您进行简短沟通。',
        active: false,
        done: application.status === 'approved',
        pending: application.status === 'pending',
      },
      {
        title: '最终决定',
        date: application.status === 'approved' ? new Date(application.updated_at).toLocaleDateString('zh-CN') : application.status === 'rejected' ? new Date(application.updated_at).toLocaleDateString('zh-CN') : '等待中',
        desc: '根据面试和资料核实做出的最终选择。',
        active: false,
        done: application.status === 'approved' || application.status === 'rejected',
        pending: application.status === 'pending',
      },
    ];

    return timeline;
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
            onClick={() => router.push('/my-applications')} 
            className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
          >
            返回申请列表
          </button>
        </div>
      </div>
    );
  }

  const timeline = buildTimeline();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">申请追踪</h1>
        <p className="text-gray-500 text-sm">Case ID: {application.id}</p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-6 flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4 text-yellow-800 dark:text-yellow-200">
          <Clock className="w-8 h-8" />
          <div>
            <p className="font-bold">等待审核中</p>
            <p className="text-sm opacity-80">您的申请目前正在处理。通常需要 3-5 个工作日。</p>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all">联系客服</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-white/10">
          <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">宠物摘要</p>
          <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shadow-sm mb-4">
            <PawPrint className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{application.pet?.name || '未知宠物'}</h3>
          <p className="text-sm text-gray-500">{application.pet?.breed || '未知品种'} • {application.pet?.gender === 'male' ? '雄性' : application.pet?.gender === 'female' ? '雌性' : '未知'} • {application.pet?.age || 0}岁</p>
          <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={16} />
            <span>申请时间：{new Date(application.created_at).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-gray-100 dark:border-white/10">
          <p className="text-xs font-bold text-gray-400 uppercase mb-8 tracking-widest">当前进度</p>
          <div className="space-y-10">
            {timeline.map((step, idx) => (
              <div key={idx} className={`flex gap-4 ${step.pending ? 'opacity-40' : ''}`}>
                <div className="flex flex-col items-center">
                  <div className={`size-8 rounded-full flex items-center justify-center transition-all ${step.done ? 'bg-green-500 text-white' : step.active ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400 border border-gray-200 dark:border-white/10'}`}>
                    {step.done ? '✓' : step.active ? '…' : idx + 1}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className={`w-[2px] h-full my-2 transition-all ${step.done ? 'bg-green-500' : 'bg-gray-100 dark:bg-white/5'}`}></div>
                  )}
                </div>
                <div>
                  <p className={`font-bold ${step.active ? 'text-primary' : 'text-zinc-900 dark:text-white'}`}>{step.title}</p>
                  <p className="text-xs text-gray-400 mb-1">{step.date}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex justify-between pt-6 border-t border-gray-100 dark:border-white/10">
        <button onClick={() => router.push('/my-applications')} className="text-primary font-bold flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} /> 返回列表
        </button>
        <button className="text-red-500 font-medium hover:underline">撤回申请</button>
      </div>
    </div>
  );
}