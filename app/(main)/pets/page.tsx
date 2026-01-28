'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Pet } from '@/types/supabase';
import { Search, ChevronDown, MapPin, ArrowUpDown, Heart } from 'lucide-react';

// 宠物类型定义
interface PetWithPhotos extends Pet {
  photos?: string[];
  category?: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<PetWithPhotos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState<string>('');
  const [filters, setFilters] = useState({
    breed: '',
    age: '',
    gender: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        // 构建查询参数
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.append('keyword', keyword);
        if (filters.breed) queryParams.append('breed', filters.breed);
        if (filters.age) queryParams.append('age', filters.age);
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.location) queryParams.append('location', filters.location);
        if (sortBy) queryParams.append('sortBy', sortBy);

        const response = await fetch(`/api/pets?${queryParams.toString()}`);
        const data = await response.json();
        
        if (data.pets) {
          // 处理宠物数据，添加照片信息
          const petsWithPhotos = data.pets.map((pet: any) => ({
            ...pet,
            photos: data.photos[pet.id]?.map((photo: any) => photo.photo_url) || [],
            category: pet.breed.includes('犬') || pet.breed.includes('狗') ? 'dog' : 
                     pet.breed.includes('猫') ? 'cat' : 'other'
          }));
          setPets(petsWithPhotos);
        }
      } catch (error) {
        console.error('获取宠物列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [keyword, filters, sortBy]);

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-6 py-12">
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 tracking-tight text-zinc-900 dark:text-white">寻找你的新朋友</h2>
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <Search className="text-2xl" />
          </div>
          <input
            className="w-full h-18 pl-14 pr-6 bg-white dark:bg-white/5 border-none rounded-2xl shadow-xl shadow-black/5 focus:ring-2 focus:ring-primary/20 text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 py-5"
            placeholder="搜索品种、位置、性格..."
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </section>

      <section className="sticky top-20 z-40 mb-10 p-4 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {['品种', '年龄', '性别'].map((filter) => (
            <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all">
              <span>{filter}</span>
              <ChevronDown size={14} />
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all">
            <MapPin size={14} className="text-primary" />
            <span>地区</span>
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">排序方式</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all">
            <span>最新发布</span>
            <ArrowUpDown size={14} />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          // 加载状态
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-white dark:bg-white/5 rounded-xl border border-[#f5f1f0] dark:border-white/10">
              <div className="aspect-square bg-gray-200 dark:bg-white/10"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet.id} className="pet-card group bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-[#f5f1f0] dark:border-white/10 transition-all hover:shadow-2xl hover:shadow-black/10">
              <div className="relative aspect-square overflow-hidden">
                <img alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={pet.photos?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">{pet.status === 'available' ? '待领养' : pet.status === 'adopted' ? '已领养' : '审核中'}</span>
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link href={`/pets/${pet.id}`} className="px-6 py-3 bg-primary text-white font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">查看详情</Link>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{pet.name}</h3>
                  <Heart className="text-gray-300 hover:text-primary cursor-pointer transition-colors" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{pet.breed} • {pet.age}岁</p>
                <div className="mt-4 flex items-center gap-1 text-gray-400">
                  <MapPin size={14} />
                  <span className="text-xs">{pet.location}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // 无数据状态
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">暂无符合条件的宠物</p>
          </div>
        )}
      </div>
    </div>
  );
}