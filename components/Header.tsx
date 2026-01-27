'use client'

import Link from 'next/link';
import { Button } from './ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">🐾</span>
          <span className="text-xl font-bold text-foreground">宠物领养平台</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary font-medium transition-colors">
            首页
          </Link>
          <Link href="/pets" className="text-foreground hover:text-primary font-medium transition-colors">
            宠物列表
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/publish" className="text-foreground hover:text-primary font-medium transition-colors">
                发布宠物
              </Link>
              <Link href="/my-applications" className="text-foreground hover:text-primary font-medium transition-colors">
                我的申请
              </Link>
              <Link href="/applications" className="text-foreground hover:text-primary font-medium transition-colors">
                申请管理
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={handleMenuToggle}
          aria-label="切换导航菜单"
        >
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium">
                欢迎, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                退出登录
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  注册
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMounted && isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/pets"
              className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              宠物列表
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/publish"
                  className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  发布宠物
                </Link>
                <Link
                  href="/my-applications"
                  className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  我的申请
                </Link>
                <Link
                  href="/applications"
                  className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  申请管理
                </Link>
              </>
            )}
            <div className="pt-4 border-t border-border">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  退出登录
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      登录
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      注册
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}