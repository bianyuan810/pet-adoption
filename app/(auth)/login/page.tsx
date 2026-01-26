'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

// 动态导入LoginForm组件，实现代码分割
const LoginForm = dynamic(() => import('@/components/auth/LoginForm'), {
  loading: () => (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
  ssr: false
})

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
            <p className="text-gray-600">登录您的账户，继续宠物领养之旅</p>
          </div>

          <LoginForm />

          <p className="text-center mt-6 text-gray-600">
            还没有账户？{' '}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
