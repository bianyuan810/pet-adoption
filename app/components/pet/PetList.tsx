'use client'

import { useState } from 'react'
import PetCard from './PetCard'
import { Button } from '@/app/components/ui/Button'
import type { Pet } from '@/app/types/supabase'

interface PetListProps {
  pets: Pet[]
  photos: Record<string, Array<{ photo_url: string; is_primary: boolean }>>
  isLoading?: boolean
}

export default function PetList({ pets, photos, isLoading }: PetListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const totalPages = Math.ceil(pets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPets = pets.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-card rounded-xl shadow-sm overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-16 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-24 h-24 mx-auto text-muted-foreground mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-foreground mb-2">暂无宠物</h3>
        <p className="text-muted-foreground">还没有发布任何宠物，快来添加吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentPets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            primaryPhoto={photos[pet.id]?.find((photo) => photo.is_primary)?.photo_url}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </Button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
}


