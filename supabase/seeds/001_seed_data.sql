-- 插入测试用户数据
INSERT INTO users (id, email, password, name, phone, wechat, avatar_url, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理员', '13800138000', 'admin_wx', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '张三', '13800138001', 'user1_wx', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', 'user'),
('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '李四', '13800138002', 'user2_wx', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', 'user'),
('550e8400-e29b-41d4-a716-446655440003', 'user3@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '王五', '13800138003', 'user3_wx', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', 'user');

-- 插入测试宠物数据
INSERT INTO pets (id, publisher_id, name, breed, age, gender, status, description, location, health_status, vaccine_status, sterilized, view_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '小白', '金毛寻回犬', 2, 'male', 'available', '性格温顺，喜欢和人玩耍，已学会基本指令', '北京市朝阳区', '健康', true, true, 15),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '小黑', '拉布拉多', 1, 'female', 'available', '活泼好动，需要大量运动', '北京市海淀区', '健康', true, false, 23),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '花花', '英短蓝猫', 3, 'female', 'available', '安静乖巧，适合公寓饲养', '上海市浦东新区', '健康', true, true, 8),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '大黄', '中华田园犬', 2, 'male', 'pending', '忠诚可靠，看家护院的好帮手', '广州市天河区', '健康', true, true, 12),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '咪咪', '布偶猫', 1, 'female', 'adopted', '性格温和，毛发柔软，需要定期梳理', '深圳市南山区', '健康', true, true, 45);

-- 插入宠物照片数据
INSERT INTO pet_photos (id, pet_id, photo_url, is_primary) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', true),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800', false),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800', true),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800', true),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800', true),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5c?w=800', true);

-- 插入申请数据
INSERT INTO applications (id, pet_id, applicant_id, publisher_id, status, message) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'pending', '我很喜欢这只狗狗，希望能给它一个温暖的家'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'approved', '我有养狗经验，家里有院子'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'rejected', '抱歉，暂时无法领养');

-- 插入消息数据
INSERT INTO messages (id, sender_id, receiver_id, pet_id, content, is_read) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '你好，请问这只狗狗还在吗？', false),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '在的，你什么时候方便来看？', true),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '这周末可以吗？', false),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '请问猫咪多大了？', false),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '3岁了，已经打过疫苗', true);
