'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Pet } from '@/types/supabase';
import { Search, ChevronDown, MapPin, ArrowUpDown, Heart } from 'lucide-react';

// 宠物类型定义
interface PetWithPhotos extends Pet {
  photos?: string[];
  category?: string;
}

export default function PetsPage() {
  const router = useRouter();
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
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSort, setOpenSort] = useState(false);
  const [refresh, setRefresh] = useState<string>('');

  // 筛选选项数据源
  const filterOptions = {
    breed: ['金毛寻回犬', '中华田园犬', '英短蓝猫', '美短', '布偶猫', '泰迪'],
    age: ['0-1岁', '1-3岁', '3-5岁', '5岁以上'],
    gender: ['公', '母', '未知'],
    location: ['北京', '上海', '广州', '深圳', '杭州', '成都']
  };

  // 排序选项
  const sortOptions = [
    { value: 'newest', label: '最新发布' },
    { value: 'age_asc', label: '年龄从小到大' },
    { value: 'age_desc', label: '年龄从大到小' }
  ];

  // 处理筛选条件变化
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setOpenFilter(null);
  };

  // 处理排序变化
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setOpenSort(false);
  };

  // 获取当前排序标签
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : '最新发布';
  };

  // 获取宠物列表数据
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

      // 添加时间戳参数，确保每次请求都刷新缓存
      queryParams.append('timestamp', Date.now().toString());

      const response = await fetch(`/api/pets?${queryParams.toString()}`);
      const data = await response.json();
      
      console.log('API 响应数据:', data);
      
      if (data.success && data.data) {
        // 处理宠物数据，添加分类信息
        const petsWithCategory = data.data.map((pet: any) => ({
          ...pet,
          category: pet.breed.includes('犬') || pet.breed.includes('狗') ? 'dog' : 
                   pet.breed.includes('猫') ? 'cat' : 'other'
        }));
        setPets(petsWithCategory);
      }
    } catch (error) {
      console.error('获取宠物列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听 URL 中的 timestamp 参数变化
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const timestamp = urlParams.get('timestamp');
    if (timestamp) {
      // 移除 URL 中的 timestamp 参数，保持 URL 干净
      urlParams.delete('timestamp');
      const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
      // 强制刷新数据
      fetchPets();
    }
  }, []);

  // 监听筛选条件和排序变化
  useEffect(() => {
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
          {/* 品种筛选 */}
          <div className="relative">
            <button 
              onClick={() => setOpenFilter(openFilter === 'breed' ? null : 'breed')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all"
            >
              <span>{filters.breed || '品种'}</span>
              <ChevronDown size={14} className={`transition-transform ${openFilter === 'breed' ? 'rotate-180' : ''}`} />
            </button>
            {openFilter === 'breed' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-[#f5f1f0] dark:border-white/10 z-50 max-h-60 overflow-y-auto">
                {filterOptions.breed.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('breed', option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${filters.breed === option ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('breed', '')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  清除
                </button>
              </div>
            )}
          </div>

          {/* 年龄筛选 */}
          <div className="relative">
            <button 
              onClick={() => setOpenFilter(openFilter === 'age' ? null : 'age')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all"
            >
              <span>{filters.age || '年龄'}</span>
              <ChevronDown size={14} className={`transition-transform ${openFilter === 'age' ? 'rotate-180' : ''}`} />
            </button>
            {openFilter === 'age' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-[#f5f1f0] dark:border-white/10 z-50">
                {filterOptions.age.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('age', option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${filters.age === option ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('age', '')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  清除
                </button>
              </div>
            )}
          </div>

          {/* 性别筛选 */}
          <div className="relative">
            <button 
              onClick={() => setOpenFilter(openFilter === 'gender' ? null : 'gender')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all"
            >
              <span>{filters.gender || '性别'}</span>
              <ChevronDown size={14} className={`transition-transform ${openFilter === 'gender' ? 'rotate-180' : ''}`} />
            </button>
            {openFilter === 'gender' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-[#f5f1f0] dark:border-white/10 z-50">
                {filterOptions.gender.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('gender', option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${filters.gender === option ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('gender', '')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  清除
                </button>
              </div>
            )}
          </div>

          {/* 地区筛选 */}
          <div className="relative">
            <button 
              onClick={() => setOpenFilter(openFilter === 'location' ? null : 'location')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all"
            >
              <MapPin size={14} className="text-primary" />
              <span>{filters.location || '地区'}</span>
              <ChevronDown size={14} className={`transition-transform ${openFilter === 'location' ? 'rotate-180' : ''}`} />
            </button>
            {openFilter === 'location' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-[#f5f1f0] dark:border-white/10 z-50 max-h-60 overflow-y-auto">
                {filterOptions.location.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('location', option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${filters.location === option ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('location', '')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  清除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 排序选项 */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">排序方式</span>
          <div className="relative">
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-[#f5f1f0] dark:border-white/5 rounded-xl text-sm font-medium hover:bg-background-light transition-all"
            >
              <span>{getCurrentSortLabel()}</span>
              <ArrowUpDown size={14} className={`transition-transform ${openSort ? 'rotate-180' : ''}`} />
            </button>
            {openSort && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-[#f5f1f0] dark:border-white/10 z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${sortBy === option.value ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
            <Link key={pet.id} href={`/pets/${pet.id}`} className="pet-card group bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-[#f5f1f0] dark:border-white/10 transition-all hover:shadow-2xl hover:shadow-black/10">
              <div className="relative aspect-square overflow-hidden">
                <img alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={pet.photos?.[0] || '/images/用户未上传.png'} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">{pet.status === 'available' ? '待领养' : pet.status === 'adopted' ? '已领养' : '审核中'}</span>
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
            </Link>
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