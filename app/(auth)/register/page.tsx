'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/'); // 注册成功后跳转到首页
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 bg-primary/10 rounded-2xl mb-4">
            <UserPlus className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">创建账号</h2>
          <p className="text-gray-500 mt-2">开启您的宠物领养之旅</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">全名</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text" 
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="张三"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">电子邮箱</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="email" 
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">设置密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="不少于 8 位字符"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary" required />
            <p className="text-xs text-gray-500 leading-relaxed">
              我已阅读并同意 <button type="button" className="text-primary font-bold">服务协议</button> 与 <button type="button" className="text-primary font-bold">隐私政策</button>
            </p>
          </div>

          <button type="submit" className="w-full bg-primary text-white h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all mt-4">
            立即注册
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          已经有账号了？ <Link href="/login" className="text-primary font-bold hover:underline">点此登录</Link>
        </p>
      </div>
    </div>
  );
}