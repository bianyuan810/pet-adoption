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
    available: 'bg-green-100 text-green-800',
    adopted: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
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
    <Link href={`/pets/${pet.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative h-48 bg-gray-200">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto}
              alt={pet.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${statusColors[pet.status]}`}
          >
            {statusLabels[pet.status]}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{pet.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{pet.breed}</span>
            <span>•</span>
            <span>{pet.age} 岁</span>
            <span>•</span>
            <span>{genderLabels[pet.gender]}</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {pet.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
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
            <span className="text-gray-400 flex items-center gap-1">
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
