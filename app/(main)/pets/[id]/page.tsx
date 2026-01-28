'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Pet } from '@/types/supabase';
import { Home, MapPin, Heart, Share2, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';

// 宠物详情类型定义
interface PetDetail extends Pet {
  photos?: string[];
  publisher?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    wechat?: string;
  };
  health_status?: string;
  vaccine_status?: boolean;
  sterilized?: boolean;
}

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/pets/${params.id}`);
        const data = await response.json();
        
        if (data.pet) {
          setPet({
            ...data.pet,
            photos: data.photos || []
          });
        }
      } catch (error) {
        console.error('获取宠物详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetDetail();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 获取表单数据
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const reason = formData.get('reason') as string;
      
      // 调用申请API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: params.id,
          message: reason
        }),
      });
      
      if (response.ok) {
        // 申请成功后跳转到我的申请页面
        router.push('/my-applications');
      } else {
        const errorData = await response.json();
        alert(`申请失败: ${errorData.error || '请稍后重试'}`);
      }
    } catch (error) {
      console.error('提交申请失败:', error);
      alert('提交申请失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 mb-2">宠物不存在</h1>
          <p className="text-gray-600">您访问的宠物信息不存在或已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 mb-6 text-sm">
        <button onClick={() => router.push('/')} className="text-[#8c6c5f] hover:text-primary font-medium flex items-center gap-1">
          <Home size={14} /> 首页
        </button>
        <span className="text-[#8c6c5f]">/</span>
        <button onClick={() => router.push('/pets')} className="text-[#8c6c5f] hover:text-primary font-medium">宠物列表</button>
        <span className="text-[#8c6c5f]">/</span>
        <span className="text-zinc-900 dark:text-white font-medium">{pet.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="w-full bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm group relative">
            <img alt={pet.name} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" src={pet.photos?.[0] || 'https://via.placeholder.com/800x500?text=No+Image'} />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">新发布</span>
              <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">健康</span>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-xl p-6 shadow-sm border border-[#f5f1f0] dark:border-white/10">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">{pet.name}</h2>
                <div className="flex items-center gap-2 text-secondary font-semibold">
                  <MapPin size={20} />
                  <span>{pet.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-[#f5f1f0] dark:bg-white/10 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                  <Heart />
                </button>
                <button className="p-3 bg-[#f5f1f0] dark:bg-white/10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                  <Share2 />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {
                [
                  { label: '品种', value: pet.breed },
                  { label: '年龄', value: `${pet.age}岁` },
                  { label: '性别', value: pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '未知' },
                  { label: '状态', value: pet.status === 'available' ? '待领养' : pet.status === 'adopted' ? '已领养' : '审核中' }
                ].map((attr) => (
                  <div key={attr.label} className="bg-background-light dark:bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">{attr.label}</p>
                    <p className="text-zinc-900 dark:text-white font-bold">{attr.value}</p>
                  </div>
                ))
              }
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">关于它的故事</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pet.description || `${pet.name} 是一个可爱的宠物，正在寻找一个温暖的家。它性格温顺，非常适合作为家庭伙伴。`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  pet.vaccine_status && '接种过疫苗',
                  pet.sterilized && '已绝育',
                  '会定点排便',
                  '与其他宠物友好',
                  '对小孩友好'
                ].filter((item): item is string => Boolean(item)).map((trait, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-secondary" />
                    <span className="font-medium text-zinc-700 dark:text-gray-300">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-xl border border-primary/10">
            <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">对 {pet.name} 感兴趣吗？</h3>
            <p className="text-sm text-[#8c6c5f] dark:text-gray-400 mb-6">请填写下方的咨询表开始领养流程。</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-white mb-1.5">姓名</label>
                <input className="w-full bg-background-light dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm h-11" placeholder="您的真实姓名" type="text" name="name" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-white mb-1.5">邮箱</label>
                <input className="w-full bg-background-light dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm h-11" placeholder="example@email.com" type="email" name="email" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-white mb-1.5">领养原因</label>
                <textarea className="w-full bg-background-light dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm resize-none p-3" placeholder="告诉我们一些关于您的家庭情况和养宠经验..." rows={4} name="reason" required></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                申请领养 <ArrowRight />
              </button>
            </form>
          </div>
          
          <div className="mt-6 bg-secondary/5 rounded-xl p-5 border border-secondary/10">
            <div className="flex gap-3">
              <ShieldAlert className="text-secondary" />
              <div>
                <h5 className="text-sm font-bold text-secondary mb-1">领养安全提示</h5>
                <p className="text-xs text-zinc-600 dark:text-gray-400 leading-relaxed">务必亲自线下见面，在实地考察或签署正式合同前，切勿支付任何领养费用。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}