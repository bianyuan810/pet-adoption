'use client';

import React from 'react';
import Link from 'next/link';
import { PawPrint, MessageCircle } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
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

        <LoginForm />

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