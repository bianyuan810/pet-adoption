import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">🐾</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                宠物领养平台
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              我们致力于为每一只流浪宠物找到温暖的家，让爱不再流浪。通过我们的平台，您可以轻松找到合适的宠物伙伴。
            </p>
            <div className="flex gap-6 pt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <span className="sr-only">微信</span>
                <span className="text-2xl">💬</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <span className="sr-only">微博</span>
                <span className="text-2xl">📱</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <span className="sr-only">抖音</span>
                <span className="text-2xl">🎵</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">快速链接</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/pets" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  宠物列表
                </Link>
              </li>
              <li>
                <Link href="/adoption" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  领养流程
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">支持与帮助</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">联系我们</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">📍</span>
                <span>北京市朝阳区宠物大街123号</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <span>📞</span>
                <span>400-123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <span>📧</span>
                <span>contact@petadopt.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border text-center text-muted-foreground">
          <p className="text-sm">© {new Date().getFullYear()} 宠物领养平台. 保留所有权利.</p>
          <p className="text-xs mt-2 opacity-70">用心连接每一个生命，用爱温暖每一个家庭</p>
        </div>
      </div>
    </footer>
  );
}