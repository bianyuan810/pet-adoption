'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UnlockIcon, Lock, Shield, Info, Eye, EyeOff } from 'lucide-react';
import { authLogger } from '@/app/lib';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除错误信息
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError('新密码长度至少为8位');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // 调用修改密码API
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      if (response.ok) {
        setSuccess('密码修改成功，请重新登录');
        // 重置表单
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || '修改密码失败，请稍后重试');
      }
    } catch (error) {
      authLogger.error('修改密码失败:', error);
      setError('修改密码失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8 md:p-10">
        <header className="mb-10">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 text-sm font-bold uppercase tracking-wider group"
          >
            <ArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" /> 返回
          </button>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">修改登录密码</h2>
          <p className="text-sm text-gray-500 mt-2">为了您的账号安全，请定期更换密码。</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex gap-3 border border-red-200 dark:border-red-800">
              <Info className="text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed font-medium">
                {error}
              </p>
            </div>
          )}
          
          {/* 成功提示 */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex gap-3 border border-green-200 dark:border-green-800">
              <Info className="text-green-500" />
              <p className="text-sm text-green-600 dark:text-green-400 leading-relaxed font-medium">
                {success}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">当前密码</label>
            <div className="relative">
              <UnlockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type={showCurrentPassword ? 'text' : 'password'} 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="请输入旧密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showCurrentPassword ? '隐藏密码' : '显示密码'}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-white/5 my-4"></div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">新密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type={showNewPassword ? 'text' : 'password'} 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="请输入新密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showNewPassword ? '隐藏密码' : '显示密码'}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">确认新密码</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="请再次输入新密码"
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

          <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl flex gap-3 mb-6 border border-primary/10">
            <Info className="text-primary" />
            <p className="text-xs text-primary/80 dark:text-primary/90 leading-relaxed font-medium">
              提示：密码长度需在 8-16 位之间，且包含字母和数字，以提高安全性。
            </p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all"
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '保存修改'}
          </button>
        </form>
      </div>
    </div>
  );
}