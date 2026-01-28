'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PawPrint, Mail, Lock, MessageCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 bg-primary/10 rounded-2xl mb-4">
            <PawPrint className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">欢迎回来</h2>
          <p className="text-gray-500 mt-2">继续寻找您的完美伙伴</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">密码</label>
              <Link href="/change-password" title="重置密码" className="text-xs text-primary font-bold hover:underline">忘记密码？</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="password" 
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
            登录
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-100 dark:bg-white/5 flex-1"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">或者通过</span>
            <div className="h-px bg-gray-100 dark:bg-white/5 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              <span className="text-sm font-bold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <MessageCircle className="text-lg" />
              <span className="text-sm font-bold">微信</span>
            </button>
          </div>

          <p className="mt-10 text-sm text-gray-500">
            还没有账号？ <Link href="/register" className="text-primary font-bold hover:underline">立即注册</Link>
          </p>
        </div>
      </div>
    </div>
  );
}