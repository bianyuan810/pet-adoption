"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PawPrint, Bell, LogIn, Lock, LogOut, Globe, Share2, Mail } from "lucide-react";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { label: "首页", path: "/" },
    { label: "宠物列表", path: "/pets" },
    { label: "发布宠物", path: "/my-pets" },
    { label: "领养申请", path: "/my-applications" },
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
              宠物领养平台
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
                    <Image
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                      src="/images/user-avatar.png"
                      width={36}
                      height={36}
                    />
                  </div>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 py-2 z-50">
                    <Link
                      href="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <LogIn className="text-sm" /> 登录/注册
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
                        router.push("/login");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="text-sm" /> 退出登录
                    </button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <PawPrint className="text-primary text-3xl" />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              宠物领养平台
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            我们的使命是确保每只宠物都能找到一个充满爱的家，让每个家庭都能遇见完美的宠物伴侣。
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
        <div>
          <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">快速链接</h4>
          <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                首页
              </Link>
            </li>
            <li>
              <Link href="/pets" className="hover:text-primary transition-colors">
                宠物列表
              </Link>
            </li>
            <li>
              <Link href="/publish" className="hover:text-primary transition-colors">
                发布宠物
              </Link>
            </li>
            <li>
              <Link href="/my-applications" className="hover:text-primary transition-colors">
                领养申请
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">支持</h4>
          <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <button className="hover:text-primary transition-colors">帮助中心</button>
            </li>
            <li>
              <button className="hover:text-primary transition-colors">安全建议</button>
            </li>
            <li>
              <button className="hover:text-primary transition-colors">服务条款</button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">订阅邮件</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            加入我们的社区，获取宠物护理技巧和最新的领养动态。
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#f5f1f0] dark:bg-white/5 border-none rounded-xl text-sm focus:ring-primary h-11 px-4"
              placeholder="电子邮箱"
              type="email"
            />
            <button className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all h-11 flex items-center justify-center">
              <Mail className="text-sm" />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e6dedb] dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 宠物领养平台。自 2010 年起为宠物寻找温暖的家。
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
