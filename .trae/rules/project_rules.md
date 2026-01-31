使用AGENTS.md文件来定义项目的开发规范、测试要求、代码风格、注意事项等。
1. 框架版本：Next.js 16.1.4（Turbopack）
2. 完整构建命令：npm run build（或你实际执行的命令）
3. 完整未截断的构建错误日志：（粘贴 build-error.log 文件中的全部内容，或终端中红色/黄色的错误部分）
4. 报错相关的文件：（比如日志中提到的 xxx.js/xxx.tsx/next.config.js，可贴关键代码片段）
5. 执行 npm run dev 命令前 先检查命令是否已经执行，避免端口冲突  可以先停止再执行 npm run dev



# 1.api接口返回数据格式
"""
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
"""