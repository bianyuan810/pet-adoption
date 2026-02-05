'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Eye, MessageSquare, Heart, Edit, Archive, Plus } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { petLogger, logger } from '@/app/lib';
import { HttpStatus } from '@/app/types/api';
import { api } from '@/app/lib/request';

// 定义宠物类型
type FilterStatus = 'all' | 'available' | 'adopted' | 'processing';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  location: string;
  status: 'available' | 'adopted' | 'pending';
  photos?: string[];
  views?: number;
  publishDate?: string;
  applicationsCount?: number;
}

// API返回的宠物数据类型
interface PetData {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  location: string;
  status: string;
  photos: string[];
  created_at: string;
  view_count?: number;
  applications_count?: number;
}

// 我发布的宠物列表页面
export default function MyPetsPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取我发布的宠物数据
  const fetchMyPets = useCallback(async () => {
    try {
      
      // 检查认证状态
      if (!isAuthenticated || !token) {
        setError('请先登录');
        setPets([]);
        setIsLoading(false);
        // 跳转到登录页面
        router.push('/login?redirect=/my-pets');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      // 调用 API 获取当前用户发布的宠物
        const data = await api.get('/pets?&isPublisher=true');
        
        if (data.code !== HttpStatus.OK) {
          throw new Error(data.msg || '获取宠物数据失败');
        }
        
        // 转换 API 返回的数据格式以匹配前端期望的结构
        let formattedPets: Pet[] = [];
        
        // 确保 data.data 是一个数组
        if (Array.isArray(data.data)) {
          formattedPets = data.data.map((pet: PetData) => ({
            id: pet.id,
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            gender: (pet.gender === 'male' || pet.gender === 'female' || pet.gender === 'unknown') ? pet.gender : 'unknown',
            location: pet.location,
            status: (pet.status === 'pending' || pet.status === 'available' || pet.status === 'adopted') ? pet.status : 'available',
            photos: pet.photos || ['/images/no-image.png'],
            views: pet.view_count || 0,
            publishDate: pet.created_at,
            applicationsCount: pet.applications_count || 0
          }));
        }
        
        logger.debug('格式化后的宠物数据:', formattedPets);
        setPets(formattedPets);
      } catch (err) {
        setError('获取数据失败，请稍后重试');
        petLogger.error('获取宠物数据失败:', err);
      } finally {
          setIsLoading(false);
        }
  }, [isAuthenticated, token, router]);

  // 组件挂载时获取数据，认证状态变化时重新获取
  useEffect(() => {
    fetchMyPets();
  }, [fetchMyPets]);

  // 过滤宠物
  const filteredPets = pets.filter(pet => {
    if (filter === 'all') return true;
    if (filter === 'available') return pet.status === 'available';
    if (filter === 'adopted') return pet.status === 'adopted';
    if (filter === 'processing') return pet.status === 'pending';
    return true;
  });



  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 页面标题及操作 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">我发布的宠物</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">管理您发布的所有待领养宠物信息</p>
        </div>
        <button
          onClick={() => router.push('/publish')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>发布新宠物</span>
        </button>
      </div>

      {/* 状态切换 Tabs */}
      <div className="mb-8 border-b border-gray-200 dark:border-white/10">
        <div className="flex gap-8 overflow-x-auto">
          {
            [
              { id: 'all', label: '全部', count: pets.length },
              { id: 'available', label: '待领养', count: pets.filter(pet => pet.status === 'available').length },
              { id: 'adopted', label: '已领养', count: pets.filter(pet => pet.status === 'adopted').length },
              { id: 'processing', label: '审核中', count: pets.filter(pet => pet.status === 'pending').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterStatus)}
                className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                  filter === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  filter === tab.id ? 'bg-primary/10' : 'bg-gray-100 dark:bg-white/5'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))
          }
        </div>
      </div>

      {/* 宠物列表 */}
      <div className="space-y-6 min-h-[400px]">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="group flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-transparent hover:border-primary/20 hover:shadow-xl transition-all"
            >
              {/* 宠物图片 */}
              <div className="w-full md:w-56 h-40 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={pet.photos?.[0] || '/images/no-image.png'}
                  width={224}
                  height={160}
                  alt={pet.name}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    pet.status === 'adopted' ? 'grayscale' : ''
                  }`}
                />
              </div>

              {/* 核心信息 */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{pet.name}</h3>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    pet.status === 'available' ? 'bg-primary/10 text-primary' :
                    pet.status === 'adopted' ? 'bg-gray-100 text-gray-500' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {pet.status === 'available' ? '待领养' : pet.status === 'adopted' ? '已领养' : '审核中'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} className="text-gray-400" />
                    {pet.breed} | {pet.age}岁
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={18} className="text-gray-400" />
                    发布日期: {pet.publishDate || '未知'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={18} className="text-gray-400" />
                    {pet.views || 0} 浏览
                  </div>
                  {pet.applicationsCount && pet.applicationsCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={18} className="text-gray-400" />
                      {pet.applicationsCount} 申请
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col gap-2 w-full md:w-48">
                {pet.status === 'available' ? (
                  <>
                    <button
                      onClick={() => router.push(`/applications?petId=${pet.id}`)}
                      className="w-full flex items-center justify-center gap-2 h-10 bg-primary text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-md shadow-primary/20"
                    >
                      <MessageSquare size={18} />
                      查看申请
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/pets/${pet.id}/edit`)}
                        className="flex-1 flex items-center justify-center gap-1 h-10 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                      >
                        <Edit size={16} />
                        编辑
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 h-10 bg-gray-100 dark:bg-white/5 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <Archive size={16} />
                        下架
                      </button>
                    </div>
                  </>
                ) : pet.status === 'adopted' ? (
                  <div className="w-full h-10 flex items-center justify-center text-gray-400 text-xs font-bold bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                    已领养
                  </div>
                ) : (
                  <div className="w-full h-10 flex items-center justify-center text-gray-400 text-xs font-bold bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                    等待平台审核
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={64} className="text-gray-200 mb-4" />
            <p className="text-gray-500">暂无相关宠物信息</p>
            <button
              onClick={() => router.push('/publish')}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              <Plus size={18} />
              发布第一个宠物
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
