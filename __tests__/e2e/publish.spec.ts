import { test, expect } from '@playwright/test';

test('发布宠物流程测试', async ({ page }) => {
  // 生成随机邮箱以避免重复注册
  const randomEmail = `test_${Date.now()}@example.com`;
  // 生成带有随机后缀的宠物名称
  const petName = `测试宠物_${Date.now()}`;
  
  // 1. 先注册一个新用户
  await page.goto('/register');
  await page.fill('#name', '测试用户');
  await page.fill('#email', randomEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  // 勾选同意协议
  await page.check('input[type="checkbox"]');
  await page.click('button[type="submit"]');
  
  // 验证注册成功后显示成功消息
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  
  // 点击前往登录按钮
  await page.click('a:has-text("前往登录")');
  
  // 登录
  await page.fill('#email', randomEmail);
  await page.fill('#password', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 等待跳转到首页
  await expect(page).toHaveURL('/');
  
  // 2. 访问发布宠物页面
  await page.goto('/publish');
  // 验证页面加载成功，检查是否存在标题元素
  await expect(page.locator('h2')).toBeVisible();
  
  // 3. 填写第一步：基本信息
  await page.fill('input[name="name"]', petName);
  await page.selectOption('select[name="breed"]', '中华田园犬');
  await page.fill('input[name="age"]', '2');
  await page.selectOption('select[name="gender"]', 'male');
  await page.fill('input[name="location"]', '测试位置');
  
  // 点击下一步进入照片上传
  await page.click('button:has-text("下一步")');
  
  // 4. 第二步：照片上传
  // 模拟上传一张照片（使用Playwright内置的测试图片）
  // 只选择第一个文件输入框，因为页面上有多个
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles({
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  });
  
  // 点击下一步进入详细描述
  await page.click('button:has-text("下一步")');
  
  // 5. 第三步：详细描述
  await page.fill('textarea[name="description"]', '这是一只非常可爱的测试宠物，性格温顺，适合家庭领养。');
  
  // 点击发布按钮
  await page.click('button:has-text("发布")');
  
  // 6. 验证发布成功，跳转到我的宠物页面
  await expect(page).toHaveURL('/my-pets');
  
  // 7. 验证页面加载成功
  await page.waitForLoadState('networkidle');
  // 验证页面标题或内容，确保我们在正确的页面
  await expect(page.locator('h1, h2')).toBeVisible();
});
