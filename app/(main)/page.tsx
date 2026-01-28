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
      {/* Hero Section */}
      <section className="w-full py-8">
        <div className="container mx-auto px-4">
          <Carousel items={carouselItems} />
        </div>
      </section>

      {/* Quick Filter Section */}
      <section className="w-full py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">快速筛选</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Link href="/pets?type=dog" className="flex flex-col items-center gap-4 p-6 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all duration-300 group border border-transparent hover:border-primary/30">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐕</span>
              <span className="text-foreground font-semibold text-lg">狗狗</span>
            </Link>
            <Link href="/pets?type=cat" className="flex flex-col items-center gap-4 p-6 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all duration-300 group border border-transparent hover:border-primary/30">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐱</span>
              <span className="text-foreground font-semibold text-lg">猫咪</span>
            </Link>
            <Link href="/pets?type=rabbit" className="flex flex-col items-center gap-4 p-6 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all duration-300 group border border-transparent hover:border-primary/30">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐰</span>
              <span className="text-foreground font-semibold text-lg">兔子</span>
            </Link>
            <Link href="/pets?type=bird" className="flex flex-col items-center gap-4 p-6 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all duration-300 group border border-transparent hover:border-primary/30">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐦</span>
              <span className="text-foreground font-semibold text-lg">鸟类</span>
            </Link>
            <Link href="/pets?type=other" className="flex flex-col items-center gap-4 p-6 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all duration-300 group border border-transparent hover:border-primary/30">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐹</span>
              <span className="text-foreground font-semibold text-lg">其他</span>
            </Link>
            <Link href="/pets" className="flex flex-col items-center gap-4 p-6 bg-primary/10 rounded-2xl hover:bg-primary/20 transition-all duration-300 group border border-transparent hover:border-primary/50">
              <span className="text-4xl text-primary group-hover:scale-110 transition-transform duration-300">🔍</span>
              <span className="text-primary font-semibold text-lg">查看全部</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="w-full py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">推荐宠物</h2>
            <Link href="/pets" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors flex items-center gap-2">
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {pet.type === 'dog' ? '🐕 狗狗' : '🐱 猫咪'}
                  </div>
                </div>
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">{pet.name}</h3>
                    <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{pet.age}岁</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pet.breed}</p>
                </CardHeader>
                <CardContent className="p-6 pt-2 flex-1">
                  <p className="text-sm text-foreground/80 line-clamp-3">{pet.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-2">
                  <Link href={`/pets/${pet.id}`} className="w-full">
                    <Button variant="primary" className="w-full font-semibold">
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