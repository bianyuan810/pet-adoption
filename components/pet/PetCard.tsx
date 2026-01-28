'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Pet } from '@/types/supabase'

interface PetCardProps {
  pet: Pet
  primaryPhoto?: string
}

export default function PetCard({ pet, primaryPhoto }: PetCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    adopted: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  }

  const statusLabels = {
    available: '可领养',
    adopted: '已领养',
    pending: '申请中',
  }

  const genderLabels = {
    male: '公',
    female: '母',
    unknown: '未知',
  }

  return (
    <Link href={`/pets/${pet.id}`} className="block">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col">
        <div className="relative h-56 bg-muted overflow-hidden">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto}
              alt={pet.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg
                className="w-16 h-16 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <span
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[pet.status]}`}
          >
            {statusLabels[pet.status]}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {pet.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="font-medium">{pet.breed}</span>
            <span>•</span>
            <span>{pet.age} 岁</span>
            <span>•</span>
            <span>{genderLabels[pet.gender]}</span>
          </div>
          <p className="text-sm text-foreground/80 line-clamp-3 mb-4 flex-1">
            {pet.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {pet.location}
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2 8h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2h2zm2-4h6a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v2a2 2 0 002 2z"
                />
              </svg>
              {pet.view_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
