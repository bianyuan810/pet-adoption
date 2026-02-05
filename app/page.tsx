'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { HttpStatus } from '@/app/types/api';
import { petLogger } from '@/app/lib';
import { api } from '@/app/lib/request';

// 宠物类型定义
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  location: string;
  status: 'available' | 'adopted' | 'pending';
  category?: string;
}

interface PetWithPhotos extends Pet {
  photos?: string[];
}



export default function Home() {
  const router = useRouter();
  const [pets, setPets] = useState<PetWithPhotos[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedPets = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<unknown[]>('/pets?sortBy=newest&limit=4&status=available');
        
        if (data.code === HttpStatus.OK && data.data) {
          // 处理宠物数据，添加照片信息
          const petsWithPhotos = data.data.map((pet: unknown) => {
              // 确保 pet 是一个对象
              if (typeof pet !== 'object' || pet === null) {
                return null;
              }
              
              return {
                  ...(pet as PetWithPhotos),
                  photos: Array.isArray((pet as Record<string, unknown>).photos) ? (pet as Record<string, unknown>).photos : [],
                  category: (() => {
                      const breed = (pet as Record<string, unknown>).breed;
                      const breedStr = typeof breed === 'string' ? breed : '';
                      return breedStr.includes('犬') || breedStr.includes('狗') ? 'dog' :
                             breedStr.includes('猫') ? 'cat' : 'other';
                  })()
              } as PetWithPhotos;
          }).filter((pet) => pet !== null);
          setPets(petsWithPhotos);
        }
      } catch (error) {
        petLogger.error('获取推荐宠物失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedPets();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-pet.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-lg">遇见你的新伙伴</h1>
              <p className="text-lg mb-8 max-w-md opacity-90">通过简单且充满关怀的领养流程，为可爱的宠物找到永远的家。</p>
              <button onClick={() => router.push('/pets')} className="w-fit px-8 py-4 bg-primary text-white font-bold rounded-xl text-lg hover:scale-105 transition-transform shadow-lg">寻找你的伙伴</button>
            </div>
          </div>
        </section>



        {/* Recommendations */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">推荐宠物</h2>
            <Link href="/pets" className="text-primary font-bold hover:underline flex items-center gap-1">
              查看更多 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // 加载状态
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="relative h-[224px] w-full bg-gray-200 dark:bg-white/10"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : pets.length > 0 ? (
              pets.map((pet) => (
                <Link key={pet.id} href={`/pets/${pet.id}`} className="group bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-[224px] w-full">
                    <Image alt={pet.name} className="w-full h-full object-cover" src={pet.photos?.[0] || '/images/用户未上传.png'} width={300} height={224} />
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-zinc-800 dark:text-white">
                      {pet.category === 'dog' ? '狗狗 🐕' : pet.category === 'cat' ? '猫咪 🐈' : '宠物'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{pet.name}</h3>
                      <span className="flex items-center text-xs text-secondary font-bold">{pet.status === 'available' ? '待领养' : pet.status === 'adopted' ? '已领养' : '审核中'}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{pet.breed} • {pet.age}岁 • {pet.gender === 'male' ? '雄性' : pet.gender === 'female' ? '雌性' : '未知'}</p>
                    <div className="flex justify-between items-center border-t border-[#e6dedb] dark:border-white/10 pt-4 mt-2">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <MapPin size={14} />
                        <span className="text-xs">{pet.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // 无数据状态
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">暂无推荐宠物</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}