import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">🐾</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">宠物领养平台</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              我们致力于为每一只流浪宠物找到温暖的家，让爱不再流浪。
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                <span className="sr-only">微信</span>
                <span className="text-xl">💬</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                <span className="sr-only">微博</span>
                <span className="text-xl">📱</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                <span className="sr-only">抖音</span>
                <span className="text-xl">🎵</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">首页</Link></li>
              <li><Link href="/pets" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">宠物列表</Link></li>
              <li><Link href="/adoption" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">领养流程</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">关于我们</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">支持与帮助</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">常见问题</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">联系我们</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">服务条款</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">隐私政策</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-gray-500">📍</span>
                <span>北京市朝阳区宠物大街123号</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-gray-500">📞</span>
                <span>400-123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-gray-500">📧</span>
                <span>contact@petadopt.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 宠物领养平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}