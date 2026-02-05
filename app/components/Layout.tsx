"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PawPrint, Bell, LogIn, Lock, LogOut, Globe, Share2, Mail, User, UserX } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "首页", path: "/" },
    { label: "宠物列表", path: "/pets" },
    { label: "我的发布", path: "/my-pets" },
    { label: "我的申请", path: "/my-applications" },
    { label: "申请管理", path: "/applications" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6dedb] dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-primary">
              <PawPrint className="text-3xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              宠物领养中心
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap ${
                    pathname === link.path
                      ? 'text-primary relative after:content-[""] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-primary'
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="/messages"
                className="relative p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                <Bell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
              </Link>

              <div className="relative">
                <div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-9 w-9 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden cursor-pointer border border-[#e6dedb] dark:border-white/20 hover:ring-2 hover:ring-primary/20 transition-all"
                  >
                    {user?.avatar_url ? (
                      <Image
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        src={user.avatar_url}
                        width={36}
                        height={36}
                      />
                    ) : user ? (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/10">
                        <UserX className="size-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 py-2 z-50">
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <User className="text-sm" /> 个人中心
                        </Link>
                        <Link
                          href="/change-password"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Lock className="text-sm" /> 修改密码
                        </Link>
                        <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2"></div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="text-sm" /> 退出登录
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <LogIn className="text-sm" /> 登录/注册
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-white/5 border-t border-[#e6dedb] dark:border-white/10 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <PawPrint className="text-primary text-3xl" />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              宠物领养中心
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed max-w-xs">
            我们致力于为每一只宠物找到温暖的家，为每一个家庭找到合适的伙伴。
            让我们一起传递爱心，让更多的生命感受到关怀。
          </p>
          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Globe className="text-lg" />
            </button>
            <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Share2 className="text-lg" />
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">关于我们</h4>
          <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <button className="hover:text-primary transition-colors">关于我们</button>
            </li>
            <li>
              <button className="hover:text-primary transition-colors">联系我们</button>
            </li>
            <li>
              <button className="hover:text-primary transition-colors">领养指南</button>
            </li>
          </ul>
        </div>

      </div>
      <div className="border-t border-[#e6dedb] dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 宠物领养中心 保留所有权利
        </p>
        <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-400">
          <button className="hover:text-primary">隐私政策</button>
          <button className="hover:text-primary">Cookie 政策</button>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;


