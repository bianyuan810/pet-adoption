# 宠物收养系统 AI 代理指令

## 项目概述

### 项目名称
宠物收养系统 (Pet Adoption System)

### 项目目标
开发一个连接宠物发布者和收养者的在线平台，为流浪宠物寻找温暖的家庭。

### 技术栈
- **前端**：React 18+ + TypeScript + Vite + shadcn/ui + Tailwind CSS v3.x
- **后端**：Next.js 14+ (App Router) + Supabase Auth
- **数据库**：Supabase PostgreSQL + Prisma ORM
- **状态管理**：React Context API / Zustand + TanStack Query
- **表单处理**：React Hook Form + Zod
- **路由**：React Router v6

### 项目结构
```
pet-adoption/
├── apps/
│   └── web/                    # Next.js 全栈应用
│       ├── app/                # App Router 页面
│       ├── components/         # 共享组件
│       ├── lib/                # 工具函数
│       ├── hooks/              # 自定义 Hooks
│       ├── services/           # 业务逻辑层
│       └── types/              # TypeScript 类型定义
├── prisma/                     # Prisma 配置和迁移
└── docs/                       # 文档
```

## 开发规范

### 1. 代码风格

#### 1.1 命名规范
- **变量和函数**：使用 camelCase（如：userName、getUserInfo）
- **常量**：使用 UPPER_SNAKE_CASE（如：MAX_UPLOAD_SIZE）
- **类和组件**：使用 PascalCase（如：UserProfile、PetCard）
- **文件名**：使用 kebab-case（如：user-profile.tsx、pet-card.tsx）
- **接口和类型**：使用 PascalCase（如：User、PetInfo）

#### 1.2 代码格式
- 使用 2 空格缩进
- 使用单引号
- 语句末尾加分号
- 每行最大长度 100 字符
- 函数之间空一行
- 对象和数组最后一个元素后加逗号

#### 1.3 注释规范
- 关键逻辑必须添加中文注释
- 函数必须添加 JSDoc 注释，说明参数和返回值
- 复杂算法添加详细说明
- 避免无意义的注释
- 注释应该解释"为什么"，而不是"做什么"

#### 1.4 TypeScript 规范
- 优先使用 TypeScript，避免使用 any
- 为所有函数参数和返回值添加类型
- 使用 interface 定义对象类型
- 使用 type 定义联合类型、交叉类型等
- 使用泛型提高代码复用性

### 2. 组件开发规范

#### 2.1 组件结构
```tsx
// 1. 导入依赖
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// 2. 定义类型
interface PetCardProps {
  pet: Pet;
  onEdit?: (id: string) => void;
}

// 3. 组件定义
export function PetCard({ pet, onEdit }: PetCardProps) {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);

  // 5. 事件处理函数
  const handleEdit = () => {
    if (onEdit) {
      onEdit(pet.id);
    }
  };

  // 6. 渲染
  return (
    <div className="pet-card">
      {/* 组件内容 */}
    </div>
  );
}
```

#### 2.2 组件命名
- 组件使用 PascalCase 命名
- 组件文件名与组件名一致
- 页面组件放在 app 目录下
- 可复用组件放在 components 目录下

#### 2.3 Props 设计
- 使用 interface 定义 Props 类型
- Props 必须有明确的类型
- 可选 Props 使用 ? 标记
- 为 Props 添加 JSDoc 注释

#### 2.4 状态管理
- 优先使用 useState 管理本地状态
- 复杂状态使用 useReducer
- 全局状态使用 Context API 或 Zustand
- 服务端状态使用 TanStack Query

### 3. API 开发规范

#### 3.1 API 路由结构
```
app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── pets/
│   ├── route.ts           # GET /api/pets, POST /api/pets
│   └── [id]/route.ts      # GET /api/pets/:id, PUT /api/pets/:id, DELETE /api/pets/:id
├── applications/
│   └── route.ts
└── messages/
    └── route.ts
```

#### 3.2 API 响应格式
```typescript
// 成功响应
{
  success: true,
  data: { /* 数据 */ },
  message: "操作成功"
}

// 错误响应
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "错误信息"
  }
}
```

#### 3.3 HTTP 方法使用
- GET：获取资源
- POST：创建资源
- PUT：更新资源（完整更新）
- PATCH：更新资源（部分更新）
- DELETE：删除资源

#### 3.4 错误处理
- 统一的错误处理中间件
- 返回友好的错误信息
- 记录错误日志
- 使用适当的 HTTP 状态码

### 4. 数据库开发规范

#### 4.1 Prisma Schema
- 使用 Prisma 定义数据模型
- 为表和字段添加注释
- 合理设置索引
- 使用枚举类型定义固定值
- 设置适当的关联关系

#### 4.2 数据库迁移
- 使用 Prisma Migrate 管理迁移
- 迁移文件必须有描述性名称
- 迁移前备份数据
- 测试迁移脚本

#### 4.3 查询优化
- 使用索引优化查询
- 避免全表扫描
- 使用分页查询
- 合理使用 include 和 select

### 5. 文件上传规范

#### 5.1 图片上传
- 使用 Supabase Storage 存储图片
- 限制文件大小（最大 5MB）
- 验证文件类型（仅支持图片）
- 压缩和优化图片
- 支持多图上传

#### 5.2 文件命名
- 使用 UUID 作为文件名
- 保留原始文件扩展名
- 添加时间戳前缀（可选）

## 测试要求

### 1. 测试类型

#### 1.1 单元测试
- 使用 Vitest 进行单元测试
- 测试工具函数和纯函数
- 测试覆盖率 > 80%
- 测试文件与源文件同名，添加 .test.ts 后缀

#### 1.2 组件测试
- 使用 React Testing Library 进行组件测试
- 测试用户交互行为
- 测试组件渲染
- 测试 Props 传递

#### 1.3 端到端测试
- 使用 Playwright 进行 E2E 测试
- 测试关键用户流程
- 测试跨页面交互
- 测试表单提交

### 2. 测试规范

#### 2.1 测试文件组织
```
__tests__/
├── unit/
│   ├── utils.test.ts
│   └── validators.test.ts
├── components/
│   ├── PetCard.test.tsx
│   └── PetForm.test.tsx
└── e2e/
    ├── login.spec.ts
    └── adoption.spec.ts
```

#### 2.2 测试命名
- 测试文件：*.test.ts / *.test.tsx
- 测试套件：describe('功能描述', () => {})
- 测试用例：it('应该做什么', () => {})

#### 2.3 测试编写原则
- 测试应该独立运行
- 测试应该快速执行
- 测试应该易于理解
- 测试应该覆盖边界情况

### 3. 测试覆盖率
- 核心业务逻辑覆盖率 > 90%
- 工具函数覆盖率 > 80%
- 组件覆盖率 > 70%

## 代码风格

### 1. ESLint 规则
- 使用 ESLint 进行代码检查
- 遵循 Airbnb JavaScript 风格指南
- 启用 TypeScript 规则
- 启用 React 规则

### 2. Prettier 规则
- 使用 Prettier 进行代码格式化
- 统一代码风格
- 自动格式化保存的文件

### 3. Git Hooks
- 使用 Husky 管理 Git Hooks
- 提交前运行 ESLint 和 Prettier
- 提交前运行测试
- 使用 lint-staged 只检查暂存文件

### 4. 代码审查
- 所有代码需要经过 Code Review
- 使用 Pull Request 进行审查
- 至少一人批准才能合并
- 审查重点：代码质量、安全性、性能

## 注意事项

### 1. 安全注意事项

#### 1.1 认证和授权
- 所有 API 必须验证用户身份
- 使用 JWT 或 Session 进行认证
- 基于角色的访问控制（RBAC）
- 敏感操作需要二次验证

#### 1.2 数据安全
- 密码必须加密存储（bcrypt）
- SQL 查询使用参数化查询（Prisma 自动处理）
- 避免在前端存储敏感信息
- 使用 HTTPS 加密传输

#### 1.3 XSS 防护
- React 自动转义 HTML
- 避免使用 dangerouslySetInnerHTML
- 验证和过滤用户输入
- 使用 CSP（内容安全策略）

#### 1.4 CSRF 防护
- 使用 CSRF Token
- 验证请求来源
- 使用 SameSite Cookie

#### 1.5 文件上传安全
- 验证文件类型
- 限制文件大小
- 扫描病毒（可选）
- 重命名上传文件

### 2. 性能注意事项

#### 2.1 前端性能
- 使用代码分割和懒加载
- 图片懒加载
- 虚拟滚动（长列表）
- 防抖和节流
- 避免不必要的重渲染

#### 2.2 后端性能
- 优化数据库查询
- 使用缓存（Redis 或内存缓存）
- 分页查询
- CDN 加速静态资源

#### 2.3 图片优化
- 压缩图片
- 使用 WebP 格式
- 响应式图片
- 图片懒加载

### 3. 可访问性注意事项

#### 3.1 语义化 HTML
- 使用正确的 HTML 标签
- 添加 alt 属性到图片
- 使用 label 关联表单元素
- 使用 ARIA 属性

#### 3.2 键盘导航
- 所有交互元素支持键盘操作
- 添加焦点样式
- 合理的 Tab 顺序

#### 3.3 颜色对比度
- 确保文本和背景有足够的对比度
- 不依赖颜色传达信息
- 支持高对比度模式

### 4. 响应式设计注意事项

#### 4.1 断点设置
- 移动端：< 640px
- 平板：640px - 1024px
- 桌面：> 1024px

#### 4.2 布局适配
- 使用 Flexbox 和 Grid 布局
- 使用相对单位（rem、em、%）
- 媒体查询适配不同屏幕
- 移动优先设计

### 5. 错误处理注意事项

#### 5.1 前端错误处理
- 使用 Error Boundary 捕获组件错误
- 友好的错误提示
- 错误日志记录
- 错误恢复机制

#### 5.2 后端错误处理
- 统一的错误处理中间件
- 返回友好的错误信息
- 记录错误日志
- 监控和告警

### 6. 数据验证注意事项

#### 6.1 前端验证
- 使用 React Hook Form + Zod 进行表单验证
- 实时验证反馈
- 友好的错误提示

#### 6.2 后端验证
- 所有输入必须验证
- 使用 Zod 或类似库进行验证
- 验证失败返回详细错误信息

### 7. 日志记录注意事项

#### 7.1 日志级别
- ERROR：错误信息
- WARN：警告信息
- INFO：一般信息
- DEBUG：调试信息

#### 7.2 日志内容
- 记录关键操作
- 记录错误信息
- 记录性能指标
- 避免记录敏感信息

### 8. 版本控制注意事项

#### 8.1 Git 工作流
- 使用 Git Flow 分支策略
- 主分支：main
- 开发分支：develop
- 功能分支：feature/xxx
- 修复分支：fix/xxx

#### 8.2 提交规范
- 使用 Conventional Commits 规范
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建/工具

#### 8.3 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 9. 文档注意事项

#### 9.1 代码文档
- 为公共 API 添加文档
- 为复杂逻辑添加注释
- 保持文档与代码同步

#### 9.2 项目文档
- README.md：项目介绍和快速开始
- CONTRIBUTING.md：贡献指南
- CHANGELOG.md：变更日志

### 10. 部署注意事项

#### 10.1 环境变量
- 使用 .env 文件管理环境变量
- 不要提交 .env 文件到 Git
- 使用 .env.example 作为模板

#### 10.2 数据库迁移
- 部署前运行数据库迁移
- 备份数据库
- 测试迁移脚本

#### 10.3 监控
- 监控应用性能
- 监控错误率
- 设置告警

## AI 代理工作流程

### 1. 接收任务
- 仔细阅读用户需求
- 理解任务目标和范围
- 询问不清楚的地方

### 2. 分析任务
- 查看相关文档（PRD.md、Tech_Design.md）
- 查看现有代码
- 确定实现方案

### 3. 创建计划
- 使用 TodoWrite 工具创建任务列表
- 分解任务为小步骤
- 设置优先级

### 4. 执行任务
- 按照计划逐步实现
- 遵循代码规范
- 添加必要的注释
- 编写测试

### 5. 验证结果
- 运行测试
- 检查代码质量
- 确保功能正常

### 6. 提交代码
- 运行 lint 和 typecheck
- 提交代码（如果用户要求）
- 更新文档（如果需要）

## 常用命令

### 开发命令
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test

# 运行 lint
pnpm lint

# 运行 typecheck
pnpm typecheck

# 生成 Prisma 客户端
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate dev

# 重置数据库
pnpm prisma migrate reset
```

### Git 命令
```bash
# 创建新分支
git checkout -b feature/xxx

# 提交代码
git add .
git commit -m "feat: 添加宠物发布功能"

# 推送到远程
git push origin feature/xxx

# 合并到主分支
git checkout main
git merge feature/xxx
```

## 常见问题

### 1. 如何添加新功能？
1. 创建功能分支
2. 实现功能
3. 编写测试
4. 运行 lint 和 typecheck
5. 提交代码
6. 创建 Pull Request

### 2. 如何修复 Bug？
1. 创建修复分支
2. 定位问题
3. 修复问题
4. 编写测试
5. 运行测试
6. 提交代码

### 3. 如何添加新页面？
1. 在 app 目录下创建新页面
2. 实现页面组件
3. 添加路由（如果需要）
4. 测试页面

### 4. 如何添加新 API？
1. 在 app/api 目录下创建新路由
2. 实现 API 处理函数
3. 添加错误处理
4. 测试 API

### 5. 如何修改数据库？
1. 修改 Prisma Schema
2. 运行迁移命令
3. 更新相关代码
4. 测试迁移

## 联系方式

如有问题，请联系项目负责人或查看项目文档。
