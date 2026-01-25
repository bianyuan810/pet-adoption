'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ type, message, duration = 3000, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      const hideTimer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(hideTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // 类型样式
  const typeStyles = {
    success: 'bg-green-500 border-green-600 text-white',
    error: 'bg-red-500 border-red-600 text-white',
    warning: 'bg-yellow-500 border-yellow-600 text-white',
    info: 'bg-blue-500 border-blue-600 text-white',
  };

  // 图标
  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      ref={toastRef}
      className={`fixed top-4 right-4 z-50 max-w-md w-full border rounded-lg shadow-lg p-4 flex items-center gap-3 transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'} ${typeStyles[type]}`}
      role="alert"
    >
      <span className="text-xl">{typeIcons[type]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }}
        className="text-white/90 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Toast 容器，用于管理多个 Toast
export function ToastContainer() {
  // 这里只是基础实现，实际项目中应该使用状态管理库
  return null;
}