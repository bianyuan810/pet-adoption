'use client'

import { useState } from 'react'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">创建账户</h1>
            <p className="text-gray-600">加入我们，开始您的宠物领养之旅</p>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                注册成功！
              </h2>
              <p className="text-gray-600 mb-6">
                您的账户已创建成功，现在可以登录了
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                前往登录
              </Link>
            </div>
          ) : (
            <>
              <RegisterForm onSuccess={() => setIsSuccess(true)} />
              <p className="text-center mt-6 text-gray-600">
                已有账户？{' '}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  立即登录
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
