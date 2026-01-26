'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CarouselItem {
  id: number
  imageUrl: string
  title: string
  description?: string
  link?: string
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export function Carousel({ items, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自动播放功能
  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, items.length])

  // 切换到下一张
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  // 切换到上一张
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  // 切换到指定幻灯片
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md">
      <div className="relative h-64 sm:h-80 md:h-96">
        {/* 幻灯片内容 */}
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            {item.link ? (
              <a
                href={item.link}
                className="absolute inset-0 z-10"
                aria-label={`了解更多关于${item.title}`}
              />
            ) : null}
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h2>
              {item.description && (
                <p className="text-sm sm:text-base opacity-90">{item.description}</p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  className="inline-block mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm relative z-30"
                >
                  了解更多
                </a>
              )}
            </div>
          </div>
        ))}

        {/* 导航按钮 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm z-50"
          aria-label="上一张"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm z-50"
          aria-label="下一张"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 指示器 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50'}`}
            aria-label={`前往幻灯片 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
