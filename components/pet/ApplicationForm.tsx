'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ApplicationFormProps {
  petId: string;
  onSuccess?: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ petId, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 获取认证状态、token和路由
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  // 打开申请模态框
  const handleOpen = () => {
    // 检查用户是否已登录，未登录则跳转到登录页面
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setIsOpen(true);
    setError(null);
    setSuccess(null);
  };

  // 关闭申请模态框
  const handleClose = () => {
    setIsOpen(false);
    setMessage('');
    setError(null);
    setSuccess(null);
  };

  // 提交申请
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('请填写申请理由');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('token',token);
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 添加认证头
        },
        body: JSON.stringify({
          petId,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '申请提交失败');
      }

      setSuccess(data.message || '申请提交成功');
      setMessage('');
      
      // 调用成功回调
      if (onSuccess) {
        onSuccess();
      }
      
      // 3秒后自动关闭模态框
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '申请提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 申请按钮 */}
      <button 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        onClick={handleOpen}
      >
        申请收养
      </button>

      {/* 申请模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">申请收养</h2>
              
              {/* 错误提示 */}
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              {/* 成功提示 */}
              {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                  {success}
                </div>
              )}
              
              {/* 申请表单 */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    申请理由
                  </label>
                  <textarea
                    placeholder="请详细说明您的收养原因、饲养经验和生活条件..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting || !!success}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    className="text-gray-600 hover:text-gray-900 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !!success}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '提交中...' : '提交申请'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;