import Link from 'next/link';
import { Button } from './ui/Button';

export function Sidebar({ className = '' }: { className?: string }) {
  return (
    <aside className={`w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">宠物分类</h2>
        
        <ul className="space-y-1">
          <li>
            <Link 
              href="/pets?type=dog" 
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">🐕</span>
              <span>狗狗</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/pets?type=cat" 
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">🐱</span>
              <span>猫咪</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/pets?type=rabbit" 
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">🐰</span>
              <span>兔子</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/pets?type=bird" 
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">🐦</span>
              <span>鸟类</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/pets?type=other" 
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">🐹</span>
              <span>其他宠物</span>
            </Link>
          </li>
        </ul>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速筛选</h2>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <span>🐶</span>
              <span>小型犬</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <span>🐕</span>
              <span>中型犬</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <span>🐕‍🦺</span>
              <span>大型犬</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <span>🐱</span>
              <span>短毛猫</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <span>🐱</span>
              <span>长毛猫</span>
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
          <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">领养指南</h3>
          <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">
            了解领养流程，准备好迎接新家庭成员吧！
          </p>
          <Button variant="primary" size="sm" className="w-full">
            查看领养指南
          </Button>
        </div>
      </div>
    </aside>
  );
}