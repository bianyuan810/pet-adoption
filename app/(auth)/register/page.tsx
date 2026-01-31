'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // 客户端验证
    if (!name || !email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 8) {
      setError('密码长度至少为8位');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // 调用注册API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }

      // 注册成功
      setSuccess('注册成功！');
      
      // 3秒后跳转到登录页
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 显示成功消息
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8 md:p-10 text-center">
          <div className="inline-flex items-center justify-center size-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">注册成功！</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">您的账户已创建成功，现在可以登录了</p>
          <Link 
            href="/login" 
            className="inline-block px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:brightness-110 transition-all"
          >
            前往登录
          </Link>
        </div>
      </div>
    );
  }

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">全名</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text" 
                id="name"
                name="name"
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
                id="email"
                name="email"
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
                id="password"
                name="password"
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">确认密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirmPassword"
                name="confirmPassword"
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="请再次输入密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary" required />
            <p className="text-xs text-gray-500 leading-relaxed">
              我已阅读并同意 <button type="button" className="text-primary font-bold">服务协议</button> 与 <button type="button" className="text-primary font-bold">隐私政策</button>
            </p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all mt-4"
            disabled={isLoading}
          >
            {isLoading ? '注册中...' : '立即注册'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          已经有账号了？ <Link href="/login" className="text-primary font-bold hover:underline">点此登录</Link>
        </p>
      </div>
    </div>
  );
}