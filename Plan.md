# 宠物收养系统开发计划

## 第一阶段：MVP 版本（核心功能）

### 步骤 1：项目初始化和环境搭建

#### 1.1 创建项目结构
- [x] 创建 Next.js 项目（使用 App Router）
- [x] 配置 TypeScript
- [x] 配置 Tailwind CSS v3.x
  - [x] 安装 Tailwind CSS v3.x 依赖（tailwindcss@^3 postcss autoprefixer）
  - [x] 初始化 Tailwind 配置（npx tailwindcss init -p）
  - [x] 配置 tailwind.config.js（content 路径、主题扩展）
  - [x] 配置 postcss.config.js
  - [x] 在 globals.css 中添加 Tailwind 指令
- [x] 配置 ESLint 和 Prettier
- [x] 配置 Git 仓库
- [x] 创建项目目录结构
  - [x] 创建 app 目录
  - [x] 创建 components 目录
  - [x] 创建 lib 目录
  - [x] 创建 hooks 目录
  - [x] 创建 services 目录
  - [x] 创建 types 目录
  - [x] 创建 public 目录
- [x] **代码审查**：审查项目结构和配置文件
- [x] **Git 提交**：提交项目初始化代码
  - [x] `git add .`
  - [x] `git commit -m "feat: 初始化项目结构，配置 Next.js、TypeScript 和 Tailwind CSS v3.x"`
  - [x] `git push origin main`

#### 1.2 配置开发工具
- [ ] 安装 shadcn/ui 组件库
- [ ] 配置 Husky Git Hooks
- [ ] 配置 lint-staged
- [ ] 创建 .env.example 文件
- [ ] 配置 VS Code 工作区设置
- [ ] **代码审查**：审查开发工具配置
- [ ] **Git 提交**：提交开发工具配置
  - [ ] `git add .`
  - [ ] `git commit -m "chore: 配置开发工具（shadcn/ui、Husky、lint-staged）"`
  - [ ] `git push origin main`

#### 1.3 配置 Supabase
- [ ] 创建 Supabase 项目
- [ ] 获取 Supabase URL 和密钥
- [ ] 配置环境变量
- [ ] 安装 Supabase 客户端
- [ ] 创建 Supabase 客户端配置文件
- [ ] **代码审查**：审查 Supabase 配置和安全性
- [ ] **Git 提交**：提交 Supabase 配置
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 配置 Supabase 客户端和环境变量"`
  - [ ] `git push origin main`

### 步骤 2：数据库设计和初始化

#### 2.1 设计数据模型
- [ ] **创建新分支**：`git checkout -b feature/database-design`
- [ ] 创建 Prisma Schema
  - [ ] 定义 User 模型
  - [ ] 定义 Pet 模型
  - [ ] 定义 PetPhoto 模型
  - [ ] 定义 Application 模型
  - [ ] 定义 Message 模型
  - [ ] 定义枚举类型（UserRole、PetGender、PetStatus、ApplicationStatus）
- [ ] 配置数据库索引
- [ ] 配置表关联关系
- [ ] **代码审查**：审查数据模型设计和索引策略
- [ ] **Git 提交**：提交数据库模型设计
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 设计数据库模型（User、Pet、PetPhoto、Application、Message）"`
  - [ ] `git push origin main`

#### 2.2 初始化数据库
- [ ] 运行 Prisma 迁移
- [ ] 生成 Prisma 客户端
- [ ] 创建种子数据脚本
- [ ] 插入测试数据
- [ ] 验证数据库连接
- [ ] **代码审查**：审查迁移脚本和种子数据
- [ ] **Git 提交**：提交数据库初始化
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 初始化数据库，运行迁移并插入种子数据"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/database-design` → `git push origin main` → `git branch -d feature/database-design`

### 步骤 3：用户认证系统

#### 3.1 实现用户注册
- [ ] **创建新分支**：`git checkout -b feature/user-register`
- [ ] 创建注册页面（app/(auth)/register/page.tsx）
- [ ] 创建注册表单组件
- [ ] 实现表单验证（Zod）
- [ ] 创建注册 API 路由（app/api/auth/register/route.ts）
- [ ] 实现密码加密（bcrypt）
- [ ] 实现用户创建逻辑
- [ ] 添加注册成功提示
- [ ] 添加错误处理
- [ ] **代码审查**：审查注册逻辑和安全性
- [ ] **Git 提交**：提交用户注册功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现用户注册功能（注册页面、表单验证、API 路由）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/user-register` → `git push origin main` → `git branch -d feature/user-register`

#### 3.2 实现用户登录
- [ ] **创建新分支**：`git checkout -b feature/user-login`
- [ ] 创建登录页面（app/(auth)/login/page.tsx）
- [ ] 创建登录表单组件
- [ ] 实现表单验证
- [ ] 创建登录 API 路由（app/api/auth/login/route.ts）
- [ ] 实现密码验证
- [ ] 实现 JWT Token 生成
- [ ] 实现 Session 管理
- [ ] 添加登录成功跳转
- [ ] 添加错误处理
- [ ] **代码审查**：审查登录逻辑和 Token 安全性
- [ ] **Git 提交**：提交用户登录功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现用户登录功能（登录页面、JWT Token、Session 管理）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/user-login` → `git push origin main` → `git branch -d feature/user-login`

#### 3.3 实现认证中间件
- [ ] **创建新分支**：`git checkout -b feature/auth-middleware`
- [ ] 创建认证中间件（middleware.ts）
- [ ] 实现 Token 验证
- [ ] 实现路由保护
- [ ] 实现角色权限验证
- [ ] **代码审查**：审查中间件逻辑和权限控制
- [ ] **Git 提交**：提交认证中间件
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现认证中间件（Token 验证、路由保护、角色权限）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/auth-middleware` → `git push origin main` → `git branch -d feature/auth-middleware`

#### 3.4 实现用户状态管理
- [ ] **创建新分支**：`git checkout -b feature/user-state`
- [ ] 创建 Auth Context
- [ ] 创建 useAuth Hook
- [ ] 实现用户登录状态持久化
- [ ] 实现用户信息获取
- [ ] **代码审查**：审查状态管理逻辑
- [ ] **Git 提交**：提交用户状态管理
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现用户状态管理（Auth Context、useAuth Hook）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/user-state` → `git push origin main` → `git branch -d feature/user-state`

### 步骤 4：宠物信息管理

#### 4.1 实现宠物列表页面
- [ ] **创建新分支**：`git checkout -b feature/pet-list`
- [ ] 创建宠物列表页面（app/(main)/pets/page.tsx）
- [ ] 创建 PetCard 组件
- [ ] 创建 PetList 组件
- [ ] 实现分页功能
- [ ] 创建获取宠物列表 API（app/api/pets/route.ts）
- [ ] 实现宠物数据查询
- [ ] 添加加载状态
- [ ] 添加空状态提示
- [ ] **代码审查**：审查列表组件和 API 查询逻辑
- [ ] **Git 提交**：提交宠物列表功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现宠物列表页面（PetCard、PetList、分页功能）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/pet-list` → `git push origin main` → `git branch -d feature/pet-list`

#### 4.2 实现宠物详情页面
- [ ] **创建新分支**：`git checkout -b feature/pet-detail`
- [ ] 创建宠物详情页面（app/(main)/pets/[id]/page.tsx）
- [ ] 创建 PetDetail 组件
- [ ] 创建照片轮播组件
- [ ] 创建获取宠物详情 API（app/api/pets/[id]/route.ts）
- [ ] 实现宠物数据查询
- [ ] 显示发布者信息
- [ ] 显示联系方式
- [ ] 添加加载状态
- [ ] **代码审查**：审查详情组件和数据获取逻辑
- [ ] **Git 提交**：提交宠物详情功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现宠物详情页面（PetDetail、照片轮播、发布者信息）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/pet-detail` → `git push origin main` → `git branch -d feature/pet-detail`

#### 4.3 实现发布宠物功能
- [ ] **创建新分支**：`git checkout -b feature/pet-publish`
- [ ] 创建发布宠物页面（app/(main)/publish/page.tsx）
- [ ] 创建 PetForm 组件
- [ ] 实现分步表单
    - [ ] 第一步：基本信息表单
    - [ ] 第二步：照片上传
    - [ ] 第三步：描述填写
- [ ] 实现表单验证
- [ ] 创建发布宠物 API（app/api/pets/route.ts）
- [ ] 实现宠物创建逻辑
- [ ] 实现照片上传（Supabase Storage）
- [ ] 添加预览功能
- [ ] 添加成功提示
- [ ] **代码审查**：审查表单验证和文件上传安全性
- [ ] **Git 提交**：提交发布宠物功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现发布宠物功能（PetForm、分步表单、照片上传）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/pet-publish` → `git push origin main` → `git branch -d feature/pet-publish`

#### 4.4 实现编辑宠物功能
- [ ] **创建新分支**：`git checkout -b feature/pet-edit`
- [ ] 创建编辑宠物页面（app/(main)/pets/[id]/edit/page.tsx）
- [ ] 复用 PetForm 组件
- [ ] 实现数据预填充
- [ ] 创建更新宠物 API（app/api/pets/[id]/route.ts）
- [ ] 实现宠物更新逻辑
- [ ] 实现照片管理（添加/删除）
- [ ] 添加成功提示
- [ ] **代码审查**：审查更新逻辑和权限验证
- [ ] **Git 提交**：提交编辑宠物功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现编辑宠物功能（数据预填充、照片管理）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/pet-edit` → `git push origin main` → `git branch -d feature/pet-edit`

#### 4.5 实现删除宠物功能
- [ ] **创建新分支**：`git checkout -b feature/pet-delete`
- [ ] 创建删除确认对话框
- [ ] 实现删除 API（app/api/pets/[id]/route.ts）
- [ ] 实现宠物删除逻辑
- [ ] 添加删除确认
- [ ] 添加成功提示
- [ ] **代码审查**：审查删除逻辑和权限验证
- [ ] **Git 提交**：提交删除宠物功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现删除宠物功能（删除确认、权限验证）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/pet-delete` → `git push origin main` → `git branch -d feature/pet-delete`

### 步骤 5：收养申请系统

#### 5.1 实现提交申请功能
- [ ] **创建新分支**：`git checkout -b feature/application-submit`
- [ ] 创建申请表单组件
- [ ] 实现表单验证
- [ ] 创建提交申请 API（app/api/applications/route.ts）
- [ ] 实现申请创建逻辑
- [ ] 验证申请条件（同一宠物只能申请一次）
- [ ] 添加成功提示
- [ ] 添加错误处理
- [ ] **代码审查**：审查申请逻辑和业务规则
- [ ] **Git 提交**：提交提交申请功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现提交申请功能（申请表单、API 路由、业务规则验证）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/application-submit` → `git push origin main` → `git branch -d feature/application-submit`

#### 5.2 实现查看申请列表（发布者）
- [ ] **创建新分支**：`git checkout -b feature/application-list-publisher`
- [ ] 创建我的申请页面（app/(main)/applications/page.tsx）
- [ ] 创建 ApplicationList 组件
- [ ] 创建 ApplicationCard 组件
- [ ] 创建获取申请列表 API（app/api/applications/route.ts）
- [ ] 实现申请数据查询（按发布者筛选）
- [ ] 按宠物分组展示
- [ ] 实现状态筛选
- [ ] 添加加载状态
- [ ] **代码审查**：审查列表查询和分组逻辑
- [ ] **Git 提交**：提交查看申请列表功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现查看申请列表功能（ApplicationList、ApplicationCard、分组展示）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/application-list-publisher` → `git push origin main` → `git branch -d feature/application-list-publisher`

#### 5.3 实现审核申请功能
- [ ] **创建新分支**：`git checkout -b feature/application-review`
- [ ] 创建申请详情对话框
- [ ] 创建同意申请 API（app/api/applications/[id]/approve/route.ts）
- [ ] 实现同意逻辑
    - [ ] 更新申请状态为已同意
    - [ ] 更新宠物状态为已收养
    - [ ] 拒绝其他待审核申请
- [ ] 创建拒绝申请 API（app/api/applications/[id]/reject/route.ts）
- [ ] 实现拒绝逻辑
    - [ ] 更新申请状态为已拒绝
    - [ ] 发送通知给申请者
- [ ] 添加确认提示
- [ ] 添加成功提示
- [ ] **代码审查**：审查审核逻辑和事务处理
- [ ] **Git 提交**：提交审核申请功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现审核申请功能（同意/拒绝 API、事务处理、通知）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/application-review` → `git push origin main` → `git branch -d feature/application-review`

#### 5.4 实现查看申请状态（收养者）
- [ ] **创建新分支**：`git checkout -b feature/application-list-adopter`
- [ ] 创建我的申请页面（app/(main)/my-applications/page.tsx）
- [ ] 实现申请数据查询（按收养者筛选）
- [ ] 显示申请状态
- [ ] 显示申请时间
- [ ] 显示审核结果
- [ ] 添加加载状态
- [ ] **代码审查**：审查查询逻辑和权限验证
- [ ] **Git 提交**：提交查看申请状态功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现查看申请状态功能（收养者申请列表、状态展示）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/application-list-adopter` → `git push origin main` → `git branch -d feature/application-list-adopter`

### 步骤 6：基础搜索筛选

#### 6.1 实现筛选功能
- [ ] **创建新分支**：`git checkout -b feature/filter`
- [ ] 创建筛选栏组件
- [ ] 实现品种筛选
- [ ] 实现年龄筛选
- [ ] 实现性别筛选
- [ ] 实现地区筛选
- [ ] 实现组合筛选
- [ ] 更新 API 支持筛选参数
- [ ] **代码审查**：审查筛选逻辑和查询性能
- [ ] **Git 提交**：提交筛选功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现筛选功能（品种、年龄、性别、地区筛选）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/filter` → `git push origin main` → `git branch -d feature/filter`

#### 6.2 实现搜索功能
- [ ] **创建新分支**：`git checkout -b feature/search`
- [ ] 创建搜索框组件
- [ ] 实现关键词搜索
- [ ] 更新 API 支持搜索参数
- [ ] 实现搜索历史
- [ ] 添加热门搜索推荐
- [ ] **代码审查**：审查搜索逻辑和性能优化
- [ ] **Git 提交**：提交搜索功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现搜索功能（关键词搜索、搜索历史、热门推荐）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/search` → `git push origin main` → `git branch -d feature/search`

#### 6.3 实现排序功能
- [ ] **创建新分支**：`git checkout -b feature/sort`
- [ ] 创建排序下拉组件
- [ ] 实现按发布时间排序
- [ ] 实现按浏览量排序
- [ ] 更新 API 支持排序参数
- [ ] **代码审查**：审查排序逻辑和数据库查询
- [ ] **Git 提交**：提交排序功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现排序功能（按时间排序、按浏览量排序）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/sort` → `git push origin main` → `git branch -d feature/sort`

### 步骤 6.5：UI 设计

#### 6.5.1 设计规范制定
- [ ] 确定设计风格（温馨、友好、简洁）
- [ ] 定义色彩规范
    - [ ] 主色调（温馨的橙色/黄色系）
    - [ ] 辅助色
    - [ ] 中性色（灰色、白色）
    - [ ] 状态色（成功、警告、错误）
- [ ] 定义字体规范
    - [ ] 主字体
    - [ ] 字号规范
    - [ ] 行高规范
- [ ] 定义间距规范
    - [ ] 基础间距单位
    - [ ] 组件间距
- [ ] 定义圆角规范
- [ ] 定义阴影规范
- [ ] **设计审查**：审查设计规范的一致性

#### 6.5.2 设计组件库
- [ ] 设计按钮组件
    - [ ] 主要按钮样式
    - [ ] 次要按钮样式
    - [ ] 危险按钮样式
    - [ ] 禁用状态
    - [ ] 悬停效果
- [ ] 设计输入框组件
    - [ ] 默认状态
    - [ ] 聚焦状态
    - [ ] 错误状态
    - [ ] 禁用状态
- [ ] 设计卡片组件
    - [ ] 宠物卡片样式
    - [ ] 申请卡片样式
    - [ ] 用户卡片样式
- [ ] 设计模态框组件
    - [ ] 遮罩层样式
    - [ ] 弹窗样式
    - [ ] 动画效果
- [ ] 设计提示框组件
    - [ ] 成功提示样式
    - [ ] 错误提示样式
    - [ ] 警告提示样式
- [ ] 设计加载组件
    - [ ] 加载动画
    - [ ] 骨架屏样式
- [ ] **设计审查**：审查组件设计的一致性和可用性

#### 6.5.3 设计页面布局
- [ ] 设计首页布局
    - [ ] 顶部导航栏设计
    - [ ] 轮播图区域设计
    - [ ] 筛选栏设计
    - [ ] 宠物列表区域设计
    - [ ] 底部信息栏设计
- [ ] 设计宠物详情页布局
    - [ ] 照片轮播区域设计
    - [ ] 宠物信息区域设计
    - [ ] 发布者信息区域设计
    - [ ] 操作按钮区域设计
- [ ] 设计发布宠物页布局
    - [ ] 分步表单布局
    - [ ] 照片上传区域设计
    - [ ] 预览区域设计
- [ ] 设计用户中心布局
    - [ ] 侧边栏导航设计
    - [ ] 内容区域设计
- [ ] 设计登录/注册页布局
    - [ ] 表单居中布局
    - [ ] 品牌展示区域
- [ ] **设计审查**：审查页面布局的合理性和用户体验

#### 6.5.4 设计响应式布局
- [ ] 设计移动端布局（< 640px）
    - [ ] 导航栏适配
    - [ ] 宠物列表适配
    - [ ] 表单适配
- [ ] 设计平板端布局（640px - 1024px）
    - [ ] 网格布局调整
    - [ ] 间距调整
- [ ] 设计桌面端布局（> 1024px）
    - [ ] 完整功能展示
    - [ ] 最佳体验优化
- [ ] **设计审查**：审查响应式设计的完整性

#### 6.5.5 设计交互效果
- [ ] 设计悬停效果
    - [ ] 卡片悬停效果
    - [ ] 按钮悬停效果
    - [ ] 链接悬停效果
- [ ] 设计点击反馈
    - [ ] 按钮点击效果
    - [ ] 表单提交反馈
- [ ] 设计过渡动画
    - [ ] 页面切换动画
    - [ ] 模态框弹出动画
    - [ ] 列表加载动画
- [ ] 设计加载状态
    - [ ] 骨架屏加载
    - [ ] 旋转加载动画
- [ ] **设计审查**：审查交互效果的流畅性和自然度

#### 6.5.6 设计图标和插图
- [ ] 选择图标库（Lucide React）
- [ ] 设计自定义图标（如需要）
    - [ ] 宠物图标
    - [ ] 功能图标
    - [ ] 状态图标
- [ ] 设计插图元素
    - [ ] 空状态插图
    - [ ] 错误状态插图
    - [ ] 成功状态插图
- [ ] **设计审查**：审查图标和插图的一致性

#### 6.5.7 创建设计文档
- [ ] 创建色彩规范文档
- [ ] 创建字体规范文档
- [ ] 创建组件使用文档
- [ ] 创建响应式断点文档
- [ ] 创建设计资源文件（Figma/Sketch）
- [ ] **设计审查**：审查设计文档的完整性

### 步骤 7：基础 UI 组件和布局

#### 7.1 创建布局组件
- [ ] **创建新分支**：`git checkout -b feature/layout-components`
- [ ] 创建 Header 组件（导航栏）
- [ ] 创建 Footer 组件（页脚）
- [ ] 创建 Sidebar 组件（侧边栏）
- [ ] 创建根布局（app/layout.tsx）
- [ ] 实现响应式导航
- [ ] **代码审查**：审查布局组件和响应式设计
- [ ] **Git 提交**：提交布局组件
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建布局组件（Header、Footer、Sidebar、根布局）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/layout-components` → `git push origin main` → `git branch -d feature/layout-components`

#### 7.2 创建通用 UI 组件
- [ ] **创建新分支**：`git checkout -b feature/ui-components`
- [ ] 创建 Button 组件
- [ ] 创建 Input 组件
- [ ] 创建 Card 组件
- [ ] 创建 Modal 组件
- [ ] 创建 Loading 组件
- [ ] 创建 EmptyState 组件
- [ ] 创建 Toast 组件（提示框）
- [ ] **代码审查**：审查 UI 组件的可访问性和可复用性
- [ ] **Git 提交**：提交 UI 组件
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建通用 UI 组件（Button、Input、Card、Modal、Loading、EmptyState、Toast）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/ui-components` → `git push origin main` → `git branch -d feature/ui-components`

#### 7.3 创建首页
- [ ] **创建新分支**：`git checkout -b feature/homepage`
- [ ] 创建首页（app/page.tsx）
- [ ] 创建轮播图组件
- [ ] 添加推荐宠物展示
- [ ] 添加快速筛选入口
- [ ] **代码审查**：审查首页布局和用户体验
- [ ] **Git 提交**：提交首页
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建首页（轮播图、推荐宠物、快速筛选入口）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/homepage` → `git push origin main` → `git branch -d feature/homepage`

### 步骤 8：测试和优化

#### 8.1 单元测试
- [ ] 安装测试框架（Jest/Vitest）
- [ ] 测试工具函数
- [ ] 测试验证函数
- [ ] 测试服务层函数
- [ ] **代码审查**：审查测试覆盖率和测试质量

#### 8.2 组件测试
- [ ] 测试 PetCard 组件
- [ ] 测试 PetForm 组件
- [ ] 测试 ApplicationCard 组件
- [ ] **代码审查**：审查组件测试用例

#### 8.3 端到端测试
- [ ] 测试用户注册流程
- [ ] 测试用户登录流程
- [ ] 测试发布宠物流程
- [ ] 测试提交申请流程
- [ ] 测试审核申请流程
- [ ] **代码审查**：审查 E2E 测试场景

#### 8.4 性能优化
- [ ] 实现代码分割
- [ ] 实现图片懒加载
- [ ] 优化数据库查询
- [ ] 添加缓存策略
- [ ] **代码审查**：审查优化策略和性能指标

#### 8.5 代码质量检查
- [ ] 运行 ESLint 检查
- [ ] 运行 Prettier 格式化
- [ ] 运行 TypeScript 类型检查
- [ ] 修复所有警告和错误
- [ ] **代码审查**：全面代码审查

### 步骤 9：部署 MVP 版本

#### 9.1 准备部署
- [ ] 配置生产环境变量
- [ ] 运行数据库迁移
- [ ] 构建生产版本
- [ ] 测试生产构建
- [ ] **代码审查**：审查部署配置和环境变量

#### 9.2 部署到 Vercel
- [ ] 连接 Vercel 仓库
- [ ] 配置 Vercel 环境变量
- [ ] 部署应用
- [ ] 验证部署成功
- [ ] **代码审查**：审查部署流程和配置

#### 9.3 部署后验证
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 测试发布宠物
- [ ] 测试提交申请
- [ ] 测试审核申请
- [ ] 测试搜索筛选
- [ ] **代码审查**：审查测试结果和问题修复

---

## 第二阶段：功能增强

### 步骤 10：完善站内消息系统

#### 10.1 实现发送消息功能
- [ ] **创建新分支**：`git checkout -b feature/message-send`
- [ ] 创建发送消息表单组件
- [ ] 实现表单验证
- [ ] 创建发送消息 API（app/api/messages/route.ts）
- [ ] 实现消息创建逻辑
- [ ] 支持关联宠物
- [ ] 添加成功提示
- [ ] **代码审查**：审查消息发送逻辑和验证
- [ ] **Git 提交**：提交发送消息功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现发送消息功能（消息表单、API 路由、关联宠物）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/message-send` → `git push origin main` → `git branch -d feature/message-send`

#### 10.2 实现接收消息功能
- [ ] **创建新分支**：`git checkout -b feature/message-list`
- [ ] 创建消息中心页面（app/(main)/messages/page.tsx）
- [ ] 创建 MessageList 组件
- [ ] 创建 MessageItem 组件
- [ ] 创建获取消息列表 API
- [ ] 实现消息数据查询
- [ ] 按联系人分组
- [ ] 显示未读标记
- [ ] 添加加载状态
- [ ] **代码审查**：审查消息查询和分组逻辑
- [ ] **Git 提交**：提交接收消息功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现接收消息功能（消息列表、分组、未读标记）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/message-list` → `git push origin main` → `git branch -d feature/message-list`

#### 10.3 实现消息详情功能
- [ ] **创建新分支**：`git checkout -b feature/message-detail`
- [ ] 创建消息详情页面（app/(main)/messages/[id]/page.tsx）
- [ ] 创建 MessageDetail 组件
- [ ] 实现消息历史展示
- [ ] 实现时间线展示
- [ ] 实现消息搜索
- [ ] 标记消息已读
- [ ] **代码审查**：审查消息详情和已读逻辑
- [ ] **Git 提交**：提交消息详情功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现消息详情功能（消息历史、时间线、已读标记）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/message-detail` → `git push origin main` → `git branch -d feature/message-detail`

#### 10.4 实现消息通知
- [ ] **创建新分支**：`git checkout -b feature/message-notification`
- [ ] 集成 Supabase Realtime
- [ ] 实现实时消息订阅
- [ ] 实现消息推送
- [ ] 添加未读消息提示
- [ ] 添加声音提示（可选）
- [ ] **代码审查**：审查实时通信和通知逻辑
- [ ] **Git 提交**：提交消息通知功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现消息通知功能（实时订阅、消息推送、未读提示）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/message-notification` → `git push origin main` → `git branch -d feature/message-notification`

### 步骤 11：用户信息管理

#### 11.1 实现个人信息页面
- [ ] **创建新分支**：`git checkout -b feature/profile-page`
- [ ] 创建个人信息页面（app/(main)/profile/page.tsx）
- [ ] 创建 ProfileForm 组件
- [ ] 实现表单验证
- [ ] 显示用户信息
- [ ] 实现信息编辑
- [ ] 实现头像上传
- [ ] 添加成功提示
- [ ] **代码审查**：审查个人信息更新逻辑
- [ ] **Git 提交**：提交个人信息页面
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现个人信息页面（ProfileForm、信息编辑、头像上传）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/profile-page` → `git push origin main` → `git branch -d feature/profile-page`

#### 11.2 实现密码修改功能
- [ ] **创建新分支**：`git checkout -b feature/password-change`
- [ ] 创建修改密码表单
- [ ] 实现表单验证
- [ ] 创建修改密码 API
- [ ] 实现密码验证
- [ ] 实现密码更新
- [ ] 添加成功提示
- [ ] **代码审查**：审查密码修改安全性
- [ ] **Git 提交**：提交密码修改功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现密码修改功能（密码修改表单、API 路由、安全性验证）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/password-change` → `git push origin main` → `git branch -d feature/password-change`

#### 11.3 实现联系方式绑定
- [ ] **创建新分支**：`git checkout -b feature/contact-binding`
- [ ] 创建绑定电话表单
- [ ] 创建绑定微信表单
- [ ] 实现表单验证
- [ ] 创建绑定 API
- [ ] 实现联系方式更新
- [ ] 添加成功提示
- [ ] **代码审查**：审查联系方式验证逻辑
- [ ] **Git 提交**：提交联系方式绑定功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现联系方式绑定功能（电话/微信绑定、表单验证）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/contact-binding` → `git push origin main` → `git branch -d feature/contact-binding`

### 步骤 12：密码重置功能

#### 12.1 实现忘记密码页面
- [ ] **创建新分支**：`git checkout -b feature/forgot-password`
- [ ] 创建忘记密码页面（app/(auth)/forgot-password/page.tsx）
- [ ] 创建邮箱输入表单
- [ ] 实现表单验证
- [ ] 创建发送重置邮件 API
- [ ] 实现邮件发送逻辑
- [ ] 添加成功提示
- [ ] **代码审查**：审查邮件发送和安全性
- [ ] **Git 提交**：提交忘记密码功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现忘记密码功能（忘记密码页面、邮件发送）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/forgot-password` → `git push origin main` → `git branch -d feature/forgot-password`

#### 12.2 实现重置密码页面
- [ ] **创建新分支**：`git checkout -b feature/reset-password`
- [ ] 创建重置密码页面（app/(auth)/reset-password/page.tsx）
- [ ] 创建重置密码表单
- [ ] 实现表单验证
- [ ] 创建重置密码 API
- [ ] 实现密码更新逻辑
- [ ] 验证重置链接有效性
- [ ] 添加成功提示
- [ ] **代码审查**：审查重置链接验证和安全性
- [ ] **Git 提交**：提交重置密码功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现重置密码功能（重置密码页面、链接验证）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/reset-password` → `git push origin main` → `git branch -d feature/reset-password`

### 步骤 13：高级筛选功能

#### 13.1 扩展筛选条件
- [ ] **创建新分支**：`git checkout -b feature/advanced-filter-conditions`
- [ ] 实现健康状况筛选
- [ ] 实现疫苗情况筛选
- [ ] 实现绝育情况筛选
- [ ] 实现宠物状态筛选
- [ ] 实现年龄区间筛选
- [ ] **代码审查**：审查筛选逻辑和查询性能
- [ ] **Git 提交**：提交扩展筛选条件功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现扩展筛选条件（健康状况、疫苗、绝育、状态、年龄区间）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/advanced-filter-conditions` → `git push origin main` → `git branch -d feature/advanced-filter-conditions`

#### 13.2 优化筛选体验
- [ ] **创建新分支**：`git checkout -b feature/filter-optimization`
- [ ] 实现筛选条件保存
- [ ] 实现快速筛选预设
- [ ] 实现筛选结果计数
- [ ] 优化筛选 UI
- [ ] **代码审查**：审查用户体验优化
- [ ] **Git 提交**：提交筛选体验优化功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现筛选体验优化（条件保存、快速预设、结果计数）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/filter-optimization` → `git push origin main` → `git branch -d feature/filter-optimization`

### 步骤 14：管理员后台

#### 14.1 创建管理员布局
- [ ] **创建新分支**：`git checkout -b feature/admin-layout`
- [ ] 创建管理员布局（app/(admin)/layout.tsx）
- [ ] 创建管理员侧边栏
- [ ] 实现管理员路由保护
- [ ] **代码审查**：审查管理员权限控制
- [ ] **Git 提交**：提交管理员布局
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建管理员布局（管理员侧边栏、路由保护）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/admin-layout` → `git push origin main` → `git branch -d feature/admin-layout`

#### 14.2 实现用户管理
- [ ] **创建新分支**：`git checkout -b feature/admin-user-management`
- [ ] 创建用户管理页面（app/(admin)/admin/users/page.tsx）
- [ ] 创建用户列表组件
- [ ] 创建用户详情对话框
- [ ] 实现用户搜索
- [ ] 实现用户筛选（按角色）
- [ ] 实现分页功能
- [ ] 显示用户统计信息
- [ ] **代码审查**：审查用户管理逻辑和权限
- [ ] **Git 提交**：提交用户管理功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现用户管理功能（用户列表、搜索、筛选、分页）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/admin-user-management` → `git push origin main` → `git branch -d feature/admin-user-management`

#### 14.3 实现用户封禁功能
- [ ] **创建新分支**：`git checkout -b feature/admin-user-ban`
- [ ] 创建封禁用户对话框
- [ ] 创建封禁 API
- [ ] 实现封禁逻辑
- [ ] 创建解封 API
- [ ] 实现解封逻辑
- [ ] 添加封禁原因记录
- [ ] 添加成功提示
- [ ] **代码审查**：审查封禁逻辑和权限验证
- [ ] **Git 提交**：提交用户封禁功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现用户封禁功能（封禁/解封 API、原因记录）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/admin-user-ban` → `git push origin main` → `git branch -d feature/admin-user-ban`

#### 14.4 实现宠物管理
- [ ] **创建新分支**：`git checkout -b feature/admin-pet-management`
- [ ] 创建宠物管理页面（app/(admin)/admin/pets/page.tsx）
- [ ] 创建宠物列表组件
- [ ] 实现宠物搜索
- [ ] 实现宠物筛选
- [ ] 实现分页功能
- [ ] 显示宠物统计信息
- [ ] **代码审查**：审查宠物管理逻辑
- [ ] **Git 提交**：提交宠物管理功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现宠物管理功能（宠物列表、搜索、筛选、分页）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/admin-pet-management` → `git push origin main` → `git branch -d feature/admin-pet-management`

#### 14.5 实现内容审核功能
- [ ] **创建新分支**：`git checkout -b feature/admin-content-moderation`
- [ ] 创建删除内容对话框
- [ ] 创建删除 API
- [ ] 实现删除逻辑
- [ ] 发送删除通知
- [ ] 添加删除原因记录
- [ ] 添加成功提示
- [ ] **代码审查**：审查删除逻辑和通知机制
- [ ] **Git 提交**：提交内容审核功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现内容审核功能（删除 API、通知机制、原因记录）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/admin-content-moderation` → `git push origin main` → `git branch -d feature/admin-content-moderation`

#### 14.6 实现统计数据
- [ ] **创建新分支**：`git checkout -b feature/admin-stats`
- [ ] 创建统计页面（app/(admin)/admin/stats/page.tsx）
- [ ] 创建统计卡片组件
- [ ] 实现用户数量统计
- [ ] 实现宠物数量统计
- [ ] 实现收养成功数量统计
- [ ] 实现活跃度统计
- [ ] 创建统计图表（可选）
- [ ] **代码审查**：审查统计查询和性能
- [ ] **Git 提交**：提交统计数据功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现统计数据功能（统计卡片、用户/宠物/收养统计）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/admin-stats` → `git push origin main` → `git branch -d feature/admin-stats`

### 步骤 15：第二阶段测试和部署

#### 15.1 测试新功能
- [ ] 测试站内消息系统
- [ ] 测试用户信息管理
- [ ] 测试密码重置
- [ ] 测试高级筛选
- [ ] 测试管理员后台
- [ ] **代码审查**：审查测试覆盖率和测试用例

#### 15.2 性能优化
- [ ] 优化消息查询性能
- [ ] 优化统计查询性能
- [ ] 添加更多缓存
- [ ] 优化图片加载
- [ ] **代码审查**：审查优化策略和效果

#### 15.3 部署第二阶段
- [ ] 运行数据库迁移
- [ ] 构建生产版本
- [ ] 部署到 Vercel
- [ ] 验证部署成功
- [ ] **代码审查**：审查部署配置和流程

---

## 第三阶段：扩展功能

### 步骤 16：收藏宠物功能

#### 16.1 实现收藏功能
- [ ] **创建新分支**：`git checkout -b feature/favorite-pets`
- [ ] 创建收藏表（Favorite）
- [ ] 运行数据库迁移
- [ ] 创建收藏 API
- [ ] 实现添加收藏逻辑
- [ ] 实现取消收藏逻辑
- [ ] 添加收藏按钮到 PetCard
- [ ] **代码审查**：审查收藏逻辑和数据库设计

#### 16.2 实现收藏列表
- [ ] 创建我的收藏页面
- [ ] 创建收藏列表组件
- [ ] 实现收藏数据查询
- [ ] 显示收藏的宠物
- [ ] 添加取消收藏功能
- [ ] **代码审查**：审查收藏列表查询逻辑
- [ ] **Git 提交**：提交收藏列表功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现收藏列表功能（我的收藏页面、收藏列表组件）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/favorite-pets` → `git push origin main` → `git branch -d feature/favorite-pets`

### 步骤 17：收养记录/历史

#### 17.1 实现收养记录页面
- [ ] **创建新分支**：`git checkout -b feature/adoption-history`
- [ ] 创建收养记录页面
- [ ] 创建收养记录列表组件
- [ ] 实现收养记录查询
- [ ] 显示收养历史
- [ ] 显示收养状态
- [ ] **代码审查**：审查收养记录查询逻辑

#### 17.2 实现收养详情
- [ ] 创建收养详情对话框
- [ ] 显示收养信息
- [ ] 显示宠物信息
- [ ] 显示申请信息
- [ ] **代码审查**：审查收养详情展示逻辑

### 步骤 18：评论/评价功能

#### 18.1 创建评论表
- [ ] **创建新分支**：`git checkout -b feature/reviews`
- [ ] 创建 Review 模型
- [ ] 运行数据库迁移
- [ ] 定义评论字段（评分、内容、时间）
- [ ] **代码审查**：审查评论表设计
- [ ] **Git 提交**：提交评论表设计
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建评论表（Review 模型、数据库迁移）"`
  - [ ] `git push origin main`

#### 18.2 实现评论功能
- [ ] 创建评论表单组件
- [ ] 实现表单验证
- [ ] 创建评论 API
- [ ] 实现评论创建逻辑
- [ ] 添加评论到宠物详情页
- [ ] **代码审查**：审查评论逻辑和验证

#### 18.3 实现评论列表
- [ ] 创建评论列表组件
- [ ] 实现评论数据查询
- [ ] 显示评论内容
- [ ] 显示评分
- [ ] 实现分页功能
- [ ] **代码审查**：审查评论列表查询逻辑

### 步骤 19：宠物健康档案

#### 19.1 创建健康档案表
- [ ] **创建新分支**：`git checkout -b feature/health-records`
- [ ] 创建 HealthRecord 模型
- [ ] 运行数据库迁移
- [ ] 定义健康档案字段（疫苗记录、体检记录等）
- [ ] **代码审查**：审查健康档案表设计
- [ ] **Git 提交**：提交健康档案表设计
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建健康档案表（HealthRecord 模型、数据库迁移）"`
  - [ ] `git push origin main`

#### 19.2 实现健康档案管理
- [ ] 创建健康档案页面
- [ ] 创建健康档案表单
- [ ] 实现健康档案创建
- [ ] 实现健康档案编辑
- [ ] 显示健康档案
- [ ] **代码审查**：审查健康档案管理逻辑

### 步骤 20：宠物领养协议

#### 20.1 创建协议模板
- [ ] **创建新分支**：`git checkout -b feature/adoption-agreement`
- [ ] 创建领养协议模板
- [ ] 设计协议内容
- [ ] 添加法律条款
- [ ] **代码审查**：审查协议内容和法律条款

#### 20.2 实现协议签署功能
- [ ] 创建协议签署页面
- [ ] 实现协议展示
- [ ] 实现电子签名（可选）
- [ ] 创建签署 API
- [ ] 保存签署记录
- [ ] **代码审查**：审查签署逻辑和记录保存
- [ ] **Git 提交**：提交协议签署功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现协议签署功能（签署页面、电子签名、签署记录）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/adoption-agreement` → `git push origin main` → `git branch -d feature/adoption-agreement`

### 步骤 21：志愿者系统

#### 21.1 创建志愿者表
- [ ] **创建新分支**：`git checkout -b feature/volunteer-system`
- [ ] 创建 Volunteer 模型
- [ ] 运行数据库迁移
- [ ] 定义志愿者字段
- [ ] **代码审查**：审查志愿者表设计
- [ ] **Git 提交**：提交志愿者表设计
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建志愿者表（Volunteer 模型、数据库迁移）"`
  - [ ] `git push origin main`

#### 21.2 实现志愿者功能
- [ ] 创建志愿者注册页面
- [ ] 创建志愿者列表页面
- [ ] 实现志愿者申请
- [ ] 实现志愿者审核
- [ ] 显示志愿者信息
- [ ] **代码审查**：审查志愿者管理逻辑

### 步骤 22：捐赠功能

#### 22.1 创建捐赠表
- [ ] **创建新分支**：`git checkout -b feature/donation-system`
- [ ] 创建 Donation 模型
- [ ] 运行数据库迁移
- [ ] 定义捐赠字段（金额、时间、捐赠者）
- [ ] **代码审查**：审查捐赠表设计
- [ ] **Git 提交**：提交捐赠表设计
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 创建捐赠表（Donation 模型、数据库迁移）"`
  - [ ] `git push origin main`

#### 22.2 实现捐赠功能
- [ ] 创建捐赠页面
- [ ] 创建捐赠表单
- [ ] 集成支付接口（可选）
- [ ] 实现捐赠记录
- [ ] 显示捐赠统计
- [ ] **代码审查**：审查捐赠逻辑和支付安全
- [ ] **Git 提交**：提交捐赠功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现捐赠功能（捐赠页面、表单、支付接口、统计）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/donation-system` → `git push origin main` → `git branch -d feature/donation-system`

### 步骤 23：宠物救助地图

#### 23.1 集成地图服务
- [ ] **创建新分支**：`git checkout -b feature/rescue-map`
- [ ] 选择地图服务（高德/百度/Google Maps）
- [ ] 安装地图 SDK
- [ ] 配置地图 API 密钥
- [ ] **代码审查**：审查地图集成和配置

#### 23.2 实现地图功能
- [ ] 创建救助地图页面
- [ ] 实现地图展示
- [ ] 显示宠物位置标记
- [ ] 实现位置搜索
- [ ] 实现位置筛选
- [ ] **代码审查**：审查地图功能和性能
- [ ] **Git 提交**：提交地图功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现地图功能（救助地图页面、位置标记、搜索、筛选）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/rescue-map` → `git push origin main` → `git branch -d feature/rescue-map`

### 步骤 24：第三阶段测试和部署

#### 24.1 测试扩展功能
- [ ] 测试收藏功能
- [ ] 测试收养记录
- [ ] 测试评论功能
- [ ] 测试健康档案
- [ ] 测试领养协议
- [ ] 测试志愿者系统
- [ ] 测试捐赠功能
- [ ] 测试救助地图
- [ ] **代码审查**：审查测试覆盖率和测试用例

#### 24.2 全面性能优化
- [ ] 优化所有查询性能
- [ ] 实现更多缓存策略
- [ ] 优化图片加载
- [ ] 实现代码分割
- [ ] 优化首屏加载
- [ ] **代码审查**：审查优化策略和效果

#### 24.3 部署第三阶段
- [ ] 运行数据库迁移
- [ ] 构建生产版本
- [ ] 部署到 Vercel
- [ ] 验证部署成功
- [ ] 进行全面测试
- [ ] **代码审查**：审查部署配置和流程

---

## 第四阶段：运维和优化

### 步骤 25：监控和日志

#### 25.1 实现错误监控
- [ ] **创建新分支**：`git checkout -b feature/error-monitoring`
- [ ] 集成错误监控服务（Sentry 等）
- [ ] 配置错误上报
- [ ] 实现错误追踪
- [ ] 设置错误告警
- [ ] **代码审查**：审查监控配置和告警规则
- [ ] **Git 提交**：提交错误监控功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现错误监控功能（Sentry 集成、错误上报、错误追踪）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/error-monitoring` → `git push origin main` → `git branch -d feature/error-monitoring`

#### 25.2 实现性能监控
- [ ] 集成性能监控服务
- [ ] 配置性能指标
- [ ] 实现性能追踪
- [ ] 设置性能告警
- [ ] **代码审查**：审查性能监控配置

#### 25.3 实现日志系统
- [ ] 配置日志记录
- [ ] 实现日志分级
- [ ] 实现日志查询
- [ ] 实现日志分析
- [ ] **代码审查**：审查日志配置和分析逻辑

### 步骤 26：安全加固

#### 26.1 安全审计
- [ ] 进行安全审计
- [ ] 修复安全漏洞
- [ ] 更新依赖包
- [ ] 加强输入验证
- [ ] **代码审查**：审查安全修复和加固措施

#### 26.2 数据备份
- [ ] 配置数据库自动备份
- [ ] 实现备份恢复测试
- [ ] 配置文件备份
- [ ] 实现灾难恢复计划
- [ ] **代码审查**：审查备份策略和恢复流程

#### 26.3 API 限流
- [ ] **创建新分支**：`git checkout -b feature/api-rate-limit`
- [ ] 实现 API 限流
- [ ] 防止恶意请求
- [ ] 实现黑名单机制
- [ ] **代码审查**：审查限流策略和防护机制
- [ ] **Git 提交**：提交 API 限流功能
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 实现 API 限流功能（限流策略、恶意请求防护、黑名单机制）"`
  - [ ] `git push origin main`
- [ ] **合并分支**：`git checkout main` → `git merge feature/api-rate-limit` → `git push origin main` → `git branch -d feature/api-rate-limit`

### 步骤 27：文档完善

#### 27.1 完善代码文档
- [ ] 为所有公共 API 添加文档
- [ ] 为复杂逻辑添加注释
- [ ] 生成 API 文档
- [ ] **代码审查**：审查文档完整性和准确性

#### 27.2 完善用户文档
- [ ] 编写用户使用手册
- [ ] 编写常见问题解答
- [ ] 录制使用视频（可选）
- [ ] **代码审查**：审查用户文档质量

#### 27.3 完善开发文档
- [ ] 编写开发指南
- [ ] 编写部署指南
- [ ] 编写贡献指南
- [ ] **代码审查**：审查开发文档完整性

### 步骤 28：持续优化

#### 28.1 用户反馈收集
- [ ] 实现用户反馈功能
- [ ] 收集用户意见
- [ ] 分析用户行为
- [ ] 优化用户体验
- [ ] **代码审查**：审查反馈收集和分析逻辑

#### 28.2 功能迭代
- [ ] 根据反馈优化功能
- [ ] 修复已知问题
- [ ] 添加新功能
- [ ] 持续改进
- [ ] **代码审查**：审查功能优化和改进
- [ ] **Git 提交**：提交功能迭代
  - [ ] `git add .`
  - [ ] `git commit -m "feat: 功能迭代（功能优化、问题修复、新功能）"`
  - [ ] `git push origin main`

#### 28.3 技术升级
- [ ] 升级依赖包
- [ ] 优化代码结构
- [ ] 引入新技术
- [ ] 保持技术先进性
- [ ] **代码审查**：审查技术升级和兼容性
- [ ] **Git 提交**：提交技术升级
  - [ ] `git add .`
  - [ ] `git commit -m "chore: 技术升级（依赖包升级、代码结构优化、新技术引入）"`
  - [ ] `git push origin main`

---

## 注意事项

1. **灵活调整**：根据实际情况灵活调整开发计划
2. **优先级管理**：优先完成高优先级功能
3. **质量保证**：每个阶段完成后进行充分测试
4. **文档同步**：及时更新相关文档
5. **代码审查**：每个功能完成后必须进行代码审查
6. **用户反馈**：及时收集和处理用户反馈
7. **性能监控**：持续监控系统性能
8. **安全第一**：始终重视系统安全
