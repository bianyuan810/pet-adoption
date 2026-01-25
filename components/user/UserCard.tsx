'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@/types/supabase'

interface UserCardProps {
  user: User
  showActions?: boolean
}

export default function UserCard({ user, showActions = false }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* 用户头像 */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={`${user.name}的头像`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* 用户信息 */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-500">电话：{user.phone}</p>
            )}
            {user.wechat && (
              <p className="text-sm text-gray-500">微信：{user.wechat}</p>
            )}
          </div>

          {/* 操作按钮 */}
          {showActions && (
            <div className="flex gap-2">
              <Link
                href={`/users/${user.id}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
              >
                查看
              </Link>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors">
                联系
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
