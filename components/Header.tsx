import Link from 'next/link';
import { Button } from './ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">🐾</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">宠物领养平台</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium">
            首页
          </Link>
          <Link href="/pets" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium">
            宠物列表
          </Link>
          <Link href="/adoption" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium">
            领养流程
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium">
            关于我们
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            登录
          </Button>
          <Button size="sm">
            注册
          </Button>
        </div>
      </div>
    </header>
  );
}