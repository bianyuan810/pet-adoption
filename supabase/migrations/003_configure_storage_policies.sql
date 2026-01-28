-- Supabase Storage 策略配置脚本
-- 在Supabase SQL编辑器中执行此脚本

-- 步骤1：更新pet-photos存储桶设置
UPDATE storage.buckets
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png']
WHERE id = 'pet-photos' OR name = 'pet-photos';

-- 确保存储桶存在
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pet-photos', 'pet-photos', true, 5242880, ARRAY['image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- 步骤2：设置存储对象的行级安全策略

-- 首先检查storage.objects表的结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'objects' AND table_schema = 'storage';

-- 然后创建策略（使用正确的列名）

-- 允许认证用户上传文件
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

-- 允许公开读取文件
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (
  true
);

-- 允许认证用户更新文件
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated'
);

-- 允许认证用户删除文件
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated'
);

-- 步骤3：验证配置

-- 首先检查存储桶表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'buckets' AND table_schema = 'storage';

-- 然后查询存储桶信息（使用实际的列名）
SELECT * FROM storage.buckets WHERE name = 'pet-photos';

-- 检查策略配置
SELECT * FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 输出配置结果
DO $$
BEGIN
    RAISE NOTICE 'Storage bucket and policies configured successfully!';
END $$;