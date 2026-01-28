# 项目页面统计

## 1. 首页相关

### `app/page.tsx` - 根路由首页
- **功能**：显示轮播图、推荐宠物列表
- **数据来源**：通过 API `/api/pets?sortBy=newest&limit=4` 获取真实数据
- **作用**：网站的主要入口页面
- **依赖接口**：
  - `GET /api/pets` - 获取宠物列表数据

## 2. 认证相关

### `app/(auth)/login/page.tsx` - 登录页
- **功能**：用户登录表单
- **作用**：用户身份认证
- **依赖接口**：
  - `POST /api/auth/login` - 用户登录验证

### `app/(auth)/register/page.tsx` - 注册页
- **功能**：用户注册表单
- **作用**：新用户注册
- **依赖接口**：
  - `POST /api/auth/register` - 用户注册

### `app/change-password/page.tsx` - 修改密码页
- **功能**：密码修改表单
- **作用**：用户密码管理
- **依赖接口**：
  - `POST /api/auth/change-password` - 修改密码

## 3. 宠物相关

### `app/(main)/pets/page.tsx` - 宠物列表页
- **功能**：宠物列表展示、筛选、排序
- **数据来源**：通过 API `/api/pets` 获取真实数据
- **作用**：浏览和查找宠物
- **依赖接口**：
  - `GET /api/pets` - 获取宠物列表数据（支持筛选和排序参数）

### `app/(main)/pets/[id]/page.tsx` - 宠物详情页
- **功能**：宠物详细信息展示
- **作用**：查看宠物详情
- **依赖接口**：
  - `GET /api/pets/[id]` - 获取单个宠物详情

### `app/(main)/pets/[id]/edit/page.tsx` - 宠物编辑页
- **功能**：编辑宠物信息表单
- **作用**：更新宠物信息
- **依赖接口**：
  - `GET /api/pets/[id]` - 获取现有宠物信息
  - `PUT /api/pets/[id]` - 更新宠物信息

### `app/(main)/publish/page.tsx` - 发布宠物页
- **功能**：发布新宠物表单
- **作用**：添加新宠物
- **依赖接口**：
  - `POST /api/pets` - 创建新宠物

## 4. 申请相关

### `app/(main)/applications/page.tsx` - 收到的申请列表
- **功能**：展示收到的领养申请（发布者视角）
- **数据来源**：通过 API `/api/applications?&isPublisher=true` 获取真实数据
- **作用**：管理和审核领养申请
- **依赖接口**：
  - `GET /api/applications` - 获取申请列表（支持 isPublisher 参数）
  - `POST /api/applications/[id]/approve` - 批准申请
  - `POST /api/applications/[id]/reject` - 拒绝申请

### `app/(main)/my-applications/page.tsx` - 我的申请列表
- **功能**：展示用户提交的领养申请（申请者视角）
- **数据来源**：通过 API `/api/applications` 获取真实数据
- **作用**：追踪领养申请状态
- **依赖接口**：
  - `GET /api/applications` - 获取申请列表

### `app/(main)/applications/[id]/page.tsx` - 申请详情页
- **功能**：申请详细信息展示
- **作用**：查看申请详情
- **依赖接口**：
  - `GET /api/applications/[id]` - 获取单个申请详情

## 5. 消息相关

### `app/(main)/messages/page.tsx` - 消息列表页
- **功能**：展示消息列表
- **作用**：查看系统消息
- **依赖接口**：
  - `GET /api/messages` - 获取消息列表
  - `POST /api/messages/[id]/read` - 标记消息为已读

## 6. 页面功能矩阵

| 页面路径 | 主要功能 | 数据来源 | 核心接口 |
|---------|---------|---------|---------|
| `/` | 首页展示 | API | `GET /api/pets` |
| `/login` | 用户登录 | 无 | `POST /api/auth/login` |
| `/register` | 用户注册 | 无 | `POST /api/auth/register` |
| `/change-password` | 修改密码 | 无 | `POST /api/auth/change-password` |
| `/pets` | 宠物列表 | API | `GET /api/pets` |
| `/pets/[id]` | 宠物详情 | API | `GET /api/pets/[id]` |
| `/pets/[id]/edit` | 编辑宠物 | API | `GET /api/pets/[id]`, `PUT /api/pets/[id]` |
| `/publish` | 发布宠物 | 无 | `POST /api/pets` |
| `/applications` | 收到的申请 | API | `GET /api/applications` |
| `/my-applications` | 我的申请 | API | `GET /api/applications` |
| `/applications/[id]` | 申请详情 | API | `GET /api/applications/[id]` |
| `/messages` | 消息列表 | API | `GET /api/messages` |
