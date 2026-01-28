# Supabase Storage 权限配置指南

## 错误分析

错误信息：
```
上传照片时出错: Error [StorageApiError]: new row violates row-level security policy
status: 400, statusCode: '403'
```

**原因**：当前Supabase Storage的`pet-photos`存储桶没有正确的权限策略，导致认证用户无法上传文件。

## 解决方案

### 步骤1：在Supabase控制台设置存储桶权限

1. **登录Supabase控制台**
2. **选择你的项目**
3. **进入Storage** → **Buckets**
4. **找到或创建`pet-photos`存储桶**

### 步骤2：设置存储桶访问权限

**存储桶设置**：
- **名称**：`pet-photos`
- **Public**：✅ 勾选（设为公开存储桶）

### 步骤3：配置存储策略

**添加策略**：

1. **上传策略**
   - **名称**：`Allow authenticated uploads`
   - **操作**：`INSERT`
   - **条件**：`(storage.foldername(name))[0] = 'pet-photos'`
   - **已认证**：✅ 勾选

2. **读取策略**
   - **名称**：`Allow public reads`
   - **操作**：`SELECT`
   - **条件**：`(storage.foldername(name))[0] = 'pet-photos'`
   - **公开**：✅ 勾选

3. **更新策略**（可选）
   - **名称**：`Allow authenticated updates`
   - **操作**：`UPDATE`
   - **条件**：`(storage.foldername(name))[0] = 'pet-photos'`
   - **已认证**：✅ 勾选

4. **删除策略**（可选）
   - **名称**：`Allow authenticated deletes`
   - **操作**：`DELETE`
   - **条件**：`(storage.foldername(name))[0] = 'pet-photos'`
   - **已认证**：✅ 勾选

### 步骤4：测试上传功能

设置完成后，重新测试发布宠物功能：
1. 访问 `/publish` 页面
2. 填写基本信息
3. 上传宠物照片
4. 提交发布

## 技术说明

**权限原理**：
- **公开读取**：允许任何人访问照片URL
- **认证上传**：只允许登录用户上传照片
- **行级安全策略**：确保用户只能操作自己的文件

**文件路径**：
- 存储路径：`pet-photos/${pet_id}_${timestamp}_${index}.jpg`
- 访问URL：`${SUPABASE_URL}/storage/v1/object/public/pet-photos/${filename}`

## 故障排除

如果仍然出现权限错误：

1. **检查JWT令牌**：确保前端传递了有效的认证令牌
2. **检查存储桶名称**：确保代码中使用的存储桶名称与控制台一致
3. **检查策略顺序**：确保更具体的策略优先于通用策略
4. **查看详细日志**：在Supabase控制台的日志中查看具体错误信息

## 其他注意事项

- 确保存储桶的CORS设置允许你的前端域名
- 考虑设置文件大小限制，防止恶意上传大文件
- 定期清理不再使用的照片文件，优化存储成本