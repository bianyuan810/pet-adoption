'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Carousel } from '@/components/ui/Carousel';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

// 轮播图数据
const carouselItems = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=400&fit=crop',
    title: '领养一只宠物，给它一个温暖的家',
    description: '每一只流浪动物都值得被爱',
    link: '/pets'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&h=400&fit=crop',
    title: '宠物是人类最好的朋友',
    description: '选择领养，选择爱',
    link: '/pets'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200&h=400&fit=crop',
    title: '加入我们的领养计划',
    description: '一起为流浪动物创造更美好的未来',
    link: '/publish'
  }
];

// 推荐宠物数据
const recommendedPets = [
  {
    id: 1,
    name: '小白',
    type: 'dog',
    breed: '金毛',
    age: 2,
    gender: 'male',
    imageUrl: '/dog1.jpg',
    description: '性格温顺，喜欢与人互动'
  },
  {
    id: 2,
    name: '咪咪',
    type: 'cat',
    breed: '英短',
    age: 1,
    gender: 'female',
    imageUrl: '/cat1.jpg',
    description: '活泼可爱，喜欢玩耍'
  },
  {
    id: 3,
    name: '小黑',
    type: 'dog',
    breed: '拉布拉多',
    age: 3,
    gender: 'male',
    imageUrl: '/dog2.jpg',
    description: '聪明伶俐，易于训练'
  },
  {
    id: 4,
    name: '花花',
    type: 'cat',
    breed: '布偶',
    age: 1,
    gender: 'female',
    imageUrl: '/cat2.jpg',
    description: '温柔可人，喜欢被抚摸'
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 轮播图 */}
      <section className="w-full py-6">
        <div className="container mx-auto px-4">
          <Carousel items={carouselItems} />
        </div>
      </section>

      {/* 快速筛选入口 */}
      <section className="w-full py-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">快速筛选</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/pets?type=dog" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-3xl">🐕</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">狗狗</span>
            </Link>
            <Link href="/pets?type=cat" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-3xl">🐱</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">猫咪</span>
            </Link>
            <Link href="/pets?type=rabbit" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-3xl">🐰</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">兔子</span>
            </Link>
            <Link href="/pets?type=bird" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-3xl">🐦</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">鸟类</span>
            </Link>
            <Link href="/pets?type=other" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-3xl">🐹</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">其他</span>
            </Link>
            <Link href="/pets" className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <span className="text-3xl">🔍</span>
              <span className="text-blue-700 dark:text-blue-400 font-medium">查看全部</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 推荐宠物 */}
      <section className="w-full py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">推荐宠物</h2>
            <Link href="/pets" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              查看全部 →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={pet.imageUrl} 
                    alt={pet.name} 
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 right-2 bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                    {pet.type === 'dog' ? '🐕 狗狗' : '🐱 猫咪'}
                  </div>
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pet.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{pet.age}岁</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{pet.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/pets/${pet.id}`} className="w-full">
                    <Button variant="primary" className="w-full">
                      查看详情
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}