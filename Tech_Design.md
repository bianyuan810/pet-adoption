# 宠物收养系统技术设计文档

## 1. 技术栈选择

### 1.1 前端技术栈

#### 核心框架
- **React 18+**：主流前端框架，组件化开发，生态丰富
- **TypeScript**：类型安全，提高代码质量和开发效率
- **Vite**：快速构建工具，开发体验好，HMR 速度快

#### UI 和样式
- **shadcn/ui**：基于 Radix UI 的组件库，可定制性强
- **Tailwind CSS v3.x**：实用优先的 CSS 框架，快速构建响应式界面
- **Lucide React**：图标库，轻量且美观

#### 状态管理和路由
- **React Context API**：全局状态管理（用户信息、主题等）
- **Zustand**：轻量级状态管理库（可选，用于复杂状态）
- **React Router v6**：客户端路由，支持懒加载

#### 表单和数据处理
- **React Hook Form**：高性能表单处理
- **Zod**：Schema 验证，与 React Hook Form 集成良好
- **TanStack Query (React Query)**：服务端状态管理，缓存和同步

#### HTTP 客户端
- **Axios**：HTTP 请求库，支持拦截器和取消请求

#### 工具库
- **date-fns**：日期处理
- **clsx / tailwind-merge**：类名合并
- **lodash-es**：工具函数库

### 1.2 后端技术栈

#### 核心框架
- **Next.js 14+ (App Router)**：全栈框架，支持 API Routes 和服务端渲染
- **TypeScript**：类型安全

#### 认证和授权
- **Supabase Auth**：开箱即用的认证服务
- **NextAuth.js**：可选，用于更复杂的认证场景

#### 数据库和 ORM
- **Supabase PostgreSQL**：托管数据库服务
- **Prisma**：类型安全的 ORM，提供类型生成和迁移

#### 文件存储
- **Supabase Storage**：对象存储服务，用于存储宠物照片

#### 实时通信
- **Supabase Realtime**：实时订阅，用于消息通知

#### API 设计
- **RESTful API**：标准的 REST 接口设计
- **OpenAPI (Swagger)**：API 文档生成

### 1.3 数据库技术栈

#### 数据库
- **PostgreSQL 15+**：关系型数据库，支持 JSON、全文搜索等高级特性

#### 托管服务
- **Supabase**：提供 PostgreSQL、认证、存储、实时等一体化服务

#### 数据库工具
- **Prisma Studio**：数据库可视化管理工具
- **pgAdmin**：PostgreSQL 管理工具（可选）

### 1.4 开发工具

#### 代码编辑器
- **VS Code**：主流代码编辑器

#### 版本控制
- **Git**：版本控制
- **GitHub**：代码托管

#### 代码质量
- **ESLint**：代码检查
- **Prettier**：代码格式化
- **Husky**：Git hooks
- **lint-staged**：暂存文件检查

#### 测试
- **Vitest**：单元测试
- **Playwright**：端到端测试
- **React Testing Library**：组件测试

#### 部署
- **Vercel**：Next.js 部署平台
- **Supabase**：数据库和存储部署

## 2. 项目结构

### 2.1 整体架构

```
pet-adoption/
├── apps/
│   ├── web/                    # Next.js 全栈应用
│   │   ├── app/                # App Router 页面
│   │   ├── components/         # 共享组件
│   │   ├── lib/                # 工具函数
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── services/           # 业务逻辑层
│   │   ├── types/              # TypeScript 类型定义
│   │   └── public/             # 静态资源
│   └── admin/                  # 管理后台（可选）
├── packages/
│   ├── ui/                     # UI 组件库
│   ├── config/                 # 共享配置
│   └── database/               # 数据库相关
├── prisma/                     # Prisma 配置和迁移
├── docs/                       # 文档
└── package.json
```

### 2.2 前端项目结构

```
apps/web/
├── app/                        # App Router
│   ├── (auth)/                 # 认证相关页面组
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                 # 主页面组
│   │   ├── pets/
│   │   │   ├── page.tsx        # 宠物列表
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 宠物详情
│   │   ├── publish/
│   │   │   └── page.tsx        # 发布宠物
│   │   ├── applications/
│   │   │   └── page.tsx        # 我的申请
│   │   ├── messages/
│   │   │   └── page.tsx        # 消息中心
│   │   └── profile/
│   │       └── page.tsx        # 个人中心
│   ├── (admin)/                # 管理员页面组
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── pets/
│   │   │   │   └── page.tsx
│   │   │   └── stats/
│   │   │       └── page.tsx
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/                 # 组件
│   ├── ui/                     # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                 # 布局组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── pet/                    # 宠物相关组件
│   │   ├── pet-card.tsx
│   │   ├── pet-list.tsx
│   │   ├── pet-detail.tsx
│   │   └── pet-form.tsx
│   ├── application/            # 申请相关组件
│   │   ├── application-card.tsx
│   │   └── application-list.tsx
│   ├── message/                # 消息相关组件
│   │   ├── message-list.tsx
│   │   └── message-item.tsx
│   └── common/                 # 通用组件
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       └── empty-state.tsx
├── lib/                        # 工具函数
│   ├── supabase/               # Supabase 客户端
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── auth.ts
│   ├── utils.ts                # 通用工具函数
│   ├── validators.ts           # 验证函数
│   └── constants.ts            # 常量定义
├── hooks/                      # 自定义 Hooks
│   ├── use-auth.ts             # 认证 Hook
│   ├── use-pets.ts             # 宠物数据 Hook
│   ├── use-applications.ts     # 申请数据 Hook
│   └── use-messages.ts         # 消息数据 Hook
├── services/                   # 业务逻辑层
│   ├── pet.service.ts          # 宠物服务
│   ├── application.service.ts  # 申请服务
│   ├── message.service.ts      # 消息服务
│   └── user.service.ts         # 用户服务
├── types/                      # TypeScript 类型
│   ├── pet.ts
│   ├── user.ts
│   ├── application.ts
│   └── message.ts
├── public/                     # 静态资源
│   ├── images/
│   └── icons/
├── middleware.ts               # Next.js 中间件
├── next.config.js              # Next.js 配置
├── tailwind.config.ts          # Tailwind 配置
└── tsconfig.json               # TypeScript 配置
```

### 2.3 数据库项目结构

```
packages/database/
├── prisma/
│   ├── schema.prisma           # Prisma Schema
│   ├── migrations/             # 数据库迁移
│   └── seed.ts                 # 种子数据
└── index.ts                    # Prisma 客户端导出
```

## 3. 数据模型

### 3.1 用户表 (User)

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  username      String    @unique
  role          UserRole  @default(ADOPTER)
  phone         String?
  wechat        String?
  avatarUrl     String?   @map("avatar_url")
  isBanned      Boolean   @default(false) @map("is_banned")
  banReason     String?   @map("ban_reason")
  bannedAt      DateTime? @map("banned_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // 关联关系
  pets          Pet[]
  applications  Application[]
  sentMessages  Message[]  @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")

  @@map("users")
}

enum UserRole {
  PUBLISHER
  ADOPTER
  ADMIN
}
```

### 3.2 宠物表 (Pet)

```prisma
model Pet {
  id                  String      @id @default(uuid())
  publisherId         String      @map("publisher_id")
  breed               String
  age                 String
  gender              PetGender
  healthStatus        String      @map("health_status")
  vaccineStatus       String      @map("vaccine_status")
  sterilizationStatus String      @map("sterilization_status")
  region              String
  description         String      @db.Text
  status              PetStatus   @default(AVAILABLE)
  viewCount           Int         @default(0) @map("view_count")
  createdAt           DateTime    @default(now()) @map("created_at")
  updatedAt           DateTime    @updatedAt @map("updated_at")

  // 关联关系
  publisher           User        @relation(fields: [publisherId], references: [id], onDelete: Cascade)
  photos              PetPhoto[]
  applications        Application[]
  messages            Message[]

  @@index([publisherId])
  @@index([status])
  @@index([region])
  @@map("pets")
}

enum PetGender {
  MALE
  FEMALE
  UNKNOWN
}

enum PetStatus {
  AVAILABLE
  ADOPTED
  REMOVED
}
```

### 3.3 宠物照片表 (PetPhoto)

```prisma
model PetPhoto {
  id        String   @id @default(uuid())
  petId     String   @map("pet_id")
  photoUrl  String   @map("photo_url")
  isPrimary Boolean  @default(false) @map("is_primary")
  order     Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")

  // 关联关系
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)

  @@index([petId])
  @@map("pet_photos")
}
```

### 3.4 收养申请表 (Application)

```prisma
model Application {
  id          String           @id @default(uuid())
  petId       String           @map("pet_id")
  adopterId   String           @map("adopter_id")
  publisherId String           @map("publisher_id")
  status      ApplicationStatus @default(PENDING)
  note        String?          @db.Text
  createdAt   DateTime         @default(now()) @map("created_at")
  updatedAt   DateTime         @updatedAt @map("updated_at")

  // 关联关系
  pet         Pet              @relation(fields: [petId], references: [id], onDelete: Cascade)
  adopter     User             @relation(fields: [adopterId], references: [id], onDelete: Cascade)
  publisher   User             @relation(fields: [publisherId], references: [id], onDelete: Cascade)

  @@unique([petId, adopterId])
  @@index([petId])
  @@index([adopterId])
  @@index([publisherId])
  @@index([status])
  @@map("applications")
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### 3.5 消息表 (Message)

```prisma
model Message {
  id        String   @id @default(uuid())
  senderId  String   @map("sender_id")
  receiverId String  @map("receiver_id")
  petId     String?  @map("pet_id")
  content   String   @db.Text
  isRead    Boolean  @default(false) @map("is_read")
  createdAt DateTime @default(now()) @map("created_at")

  // 关联关系
  sender    User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiver  User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  pet       Pet?     @relation(fields: [petId], references: [id], onDelete: SetNull)

  @@index([senderId])
  @@index([receiverId])
  @@index([petId])
  @@index([createdAt])
  @@map("messages")
}
```

### 3.6 数据库索引策略

```prisma
// 用户表索引
@@index([email])
@@index([username])
@@index([role])
@@index([isBanned])

// 宠物表索引
@@index([publisherId])
@@index([status])
@@index([region])
@@index([createdAt])

// 申请表索引
@@index([petId])
@@index([adopterId])
@@index([publisherId])
@@index([status])
@@index([createdAt])

// 消息表索引
@@index([senderId])
@@index([receiverId])
@@index([petId])
@@index([createdAt])
```

## 4. 关键技术点

### 4.1 认证和授权

#### 4.1.1 Supabase Auth 集成
- 使用 Supabase Auth 进行用户认证
- JWT Token 存储和验证
- Session 管理
- 密码加密（bcrypt）

#### 4.1.2 角色权限控制
- 基于角色的访问控制（RBAC）
- 中间件验证用户角色
- API 路由权限保护

#### 4.1.3 技术难点
- Token 刷新机制
- 跨域认证处理
- 并发登录控制

### 4.2 文件上传和存储

#### 4.2.1 图片上传
- 使用 Supabase Storage 存储宠物照片
- 支持多图上传
- 图片压缩和优化
- 设置封面图

#### 4.2.2 技术难点
- 大文件上传优化（分片上传）
- 上传进度显示
- 图片格式和大小验证
- CDN 加速

### 4.3 实时通信

#### 4.3.1 消息通知
- 使用 Supabase Realtime 实现实时消息
- WebSocket 连接管理
- 消息推送

#### 4.3.2 技术难点
- 连接稳定性
- 消息去重
- 离线消息处理
- 消息顺序保证

### 4.4 搜索和筛选

#### 4.4.1 数据库查询优化
- 使用 PostgreSQL 全文搜索
- 复合索引优化
- 分页查询
- 缓存策略

#### 4.4.2 技术难点
- 大数据量查询性能
- 多条件组合筛选
- 搜索结果排序
- 搜索建议和联想

### 4.5 状态管理

#### 4.5.1 服务端状态管理
- 使用 TanStack Query 管理服务端状态
- 自动缓存和重新验证
- 乐观更新

#### 4.5.2 技术难点
- 缓存失效策略
- 并发更新处理
- 离线数据同步

### 4.6 表单处理

#### 4.6.1 表单验证
- 使用 React Hook Form + Zod
- 客户端验证
- 服务端验证

#### 4.6.2 技术难点
- 复杂表单状态管理
- 动态表单字段
- 表单数据持久化

### 4.7 性能优化

#### 4.7.1 前端优化
- 代码分割和懒加载
- 图片懒加载
- 虚拟滚动（长列表）
- 防抖和节流

#### 4.7.2 后端优化
- 数据库查询优化
- API 响应缓存
- CDN 加速

#### 4.7.3 技术难点
- 首屏加载优化
- 大列表渲染性能
- 内存泄漏防护

### 4.8 安全防护

#### 4.8.1 数据安全
- SQL 注入防护（Prisma 参数化查询）
- XSS 攻击防护（React 自动转义）
- CSRF 攻击防护（CSRF Token）

#### 4.8.2 文件安全
- 文件类型验证
- 文件大小限制
- 病毒扫描（可选）

#### 4.8.3 技术难点
- 敏感信息脱敏
- API 限流
- 恶意请求检测

### 4.9 错误处理

#### 4.9.1 统一错误处理
- 全局错误边界
- API 错误拦截
- 友好的错误提示

#### 4.9.2 技术难点
- 错误日志记录
- 错误监控和告警
- 错误恢复机制

### 4.10 数据一致性

#### 4.10.1 事务处理
- 使用数据库事务保证数据一致性
- 关键操作的事务管理

#### 4.10.2 技术难点
- 并发冲突处理
- 分布式事务（如果需要）
- 数据同步

### 4.11 部署和运维

#### 4.11.1 部署流程
- CI/CD 自动化部署
- 环境变量管理
- 数据库迁移

#### 4.11.2 技术难点
- 零停机部署
- 回滚机制
- 监控和日志

### 4.12 测试策略

#### 4.12.1 测试类型
- 单元测试（Vitest）
- 组件测试（React Testing Library）
- 端到端测试（Playwright）

#### 4.12.2 技术难点
- 测试数据管理
- Mock 外部依赖
- 测试覆盖率

## 5. 技术选型理由

### 5.1 为什么选择 Next.js
- 全栈框架，前后端统一
- App Router 提供更好的性能
- 服务端渲染（SSR）提升 SEO
- API Routes 简化后端开发
- Vercel 部署简单

### 5.2 为什么选择 Supabase
- 开箱即用的认证服务
- PostgreSQL 数据库功能强大
- Storage 服务方便文件存储
- Realtime 支持实时通信
- 免费额度适合小项目

### 5.3 为什么选择 shadcn/ui
- 基于 Radix UI，可访问性好
- 组件可定制，不依赖外部样式
- 与 Tailwind CSS 完美集成
- 代码复制到项目中，完全可控

### 5.4 为什么选择 Prisma
- 类型安全，自动生成类型
- 迁移管理方便
- 查询构建器简洁
- 支持多种数据库

## 6. 开发规范

### 6.1 Git 工作流
- 使用 Git Flow 分支策略
- 主分支：main
- 开发分支：develop
- 功能分支：feature/xxx
- 修复分支：fix/xxx

### 6.2 代码审查
- 所有代码需要经过 Code Review
- 使用 Pull Request 进行审查
- 至少一人批准才能合并

### 6.3 提交规范
- 使用 Conventional Commits 规范
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建/工具

### 6.4 版本管理
- 使用语义化版本（Semantic Versioning）
- 主版本号.次版本号.修订号
- 例如：1.0.0, 1.1.0, 2.0.0
