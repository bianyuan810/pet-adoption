import { test, expect } from '@playwright/test';

test('提交申请流程测试', async ({ page }) => {
  // 生成随机邮箱以避免重复注册
  const publisherEmail = `publisher_${Date.now()}@example.com`;
  const applicantEmail = `applicant_${Date.now()}@example.com`;
  const petName = `测试宠物_${Date.now()}`;
  
  // 1. 注册发布者用户
  await page.goto('/register');
  await page.fill('#name', '发布者用户');
  await page.fill('#email', publisherEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  // 勾选同意协议
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("立即注册")');
  
  // 验证注册成功后显示成功消息
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  
  // 等待自动跳转到登录页
  await expect(page).toHaveURL('/login', { timeout: 5000 });
  
  // 登录发布者用户
  await page.fill('#email', publisherEmail);
  await page.fill('#password', 'Test123!');
  await page.click('button:has-text("登录")');
  
  // 等待跳转到首页
  await expect(page).toHaveURL('/', { timeout: 5000 });
  
  // 2. 发布者发布宠物
  await page.goto('/publish');
  
  // 填写第一步：基本信息
  await page.fill('input[name="name"]', petName);
  await page.selectOption('select[name="breed"]', '中华田园犬');
  await page.fill('input[name="age"]', '2');
  await page.selectOption('select[name="gender"]', 'male');
  await page.fill('input[name="location"]', '测试位置');
  
  // 点击下一步进入照片上传
  await page.click('button:has-text("下一步")');
  
  // 上传测试图片
  await page.click('label[for="file-upload"]');
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles({
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  });
  
  // 等待图片上传
  await page.waitForTimeout(1000);
  
  // 点击下一步进入详细描述
  await page.click('button:has-text("下一步")');
  
  // 填写详细描述
  await page.fill('textarea[name="description"]', '这是一只非常可爱的测试宠物，性格温顺，适合家庭领养。');
  
  // 点击发布按钮
  await page.click('button:has-text("提交发布")');
  //等待时间，等后端处理
  await page.waitForTimeout(2000);
  // 等待跳转到我的宠物页面
  await expect(page).toHaveURL('/my-pets', { timeout: 5000 });
  
  // 2. 注册申请人用户
  await page.goto('/register');
  await page.fill('#name', '申请人用户');
  await page.fill('#email', applicantEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  // 勾选同意协议
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("立即注册")');
  
  // 验证注册成功后显示成功消息
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  
  // 等待自动跳转到登录页
  await expect(page).toHaveURL('/login', { timeout: 5000 });
  
  // 登录申请者用户
  await page.fill('#email', applicantEmail);
  await page.fill('#password', 'Test123!');
  await page.click('button:has-text("登录")');
  
  // 等待跳转到首页
  await expect(page).toHaveURL('/', { timeout: 5000 });
  
  // 4. 申请者浏览宠物列表，找到刚发布的宠物
  await page.goto('/pets');
  
  // 等待宠物列表加载
  await page.waitForLoadState('networkidle');
  
  // 等待宠物卡片出现
  await page.waitForSelector('.pet-card', { timeout: 10000 });
  
  // 尝试找到刚发布的宠物并点击进入详情页
  // 使用更宽松的选择器，只匹配宠物名称的一部分
  const petCard = page.locator('.pet-card').filter({ hasText: '测试宠物_' });
  await petCard.first().click();
  
  // 要等一下，等后端处理
  await page.waitForTimeout(2000);
  
  // 验证是否进入了正确的宠物详情页
  await expect(page).toHaveURL(/\/pets\/\d+/, { timeout: 10000 });
  await expect(page.locator('h2')).toContainText('测试宠物_', { timeout: 5000 });
  
  // 5. 提交领养申请
  // 填写申请表单
  await page.fill('input[name="name"]', '申请人用户');
  await page.fill('input[name="email"]', applicantEmail);
  await page.fill('textarea[name="reason"]', '我非常喜欢这只宠物，有足够的时间和精力照顾它。');
  
  // 点击申请领养按钮
  await page.click('button:has-text("申请领养")');
  
  //要等一下，等后端处理
  await page.waitForTimeout(2000);
  
  // 6. 验证申请成功，跳转到我的申请页面
  await expect(page).toHaveURL('/my-applications', { timeout: 5000 });
  
  // 7. 验证申请出现在我的申请列表中
  await expect(page.locator('h1')).toContainText('我的领养申请');
  await expect(page.locator('text=测试宠物_')).toBeVisible();
});
