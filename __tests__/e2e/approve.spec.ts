import { test, expect } from '@playwright/test';

test('审核申请流程测试', async ({ page }) => {
  // 生成随机邮箱以避免重复注册
  const publisherEmail = `publisher_${Date.now()}@example.com`;
  const applicantEmail = `applicant_${Date.now()}@example.com`;
  const petName = `测试宠物_${Date.now()}`;
  console.log(petName);
  
  // 1. 注册发布者用户
  await page.goto('/register');
  await page.fill('#name', '发布者用户');
  await page.fill('#email', publisherEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 验证注册成功后显示成功消息
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  
  // 点击前往登录按钮
  await page.click('a:has-text("前往登录")');
  
  // 登录发布者用户
  await page.fill('#email', publisherEmail);
  await page.fill('#password', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 等待跳转到首页
  await expect(page).toHaveURL('/');
  
  // 2. 发布者发布宠物
  await page.goto('/publish');
  
  // 填写第一步：基本信息
  await page.fill('#name', petName);
  await page.fill('#breed', '测试品种');
  await page.fill('#age', '2');
  await page.click('input[name="gender"][value="male"]');
  await page.click('input[name="status"][value="available"]');
  await page.fill('#location', '测试位置');
  await page.fill('#health_status', '健康');
  await page.click('div:nth-child(8) input[type="checkbox"]'); // 疫苗状态
  await page.click('div:nth-child(9) input[type="checkbox"]'); // 绝育状态
  
  // 点击下一步进入照片上传
  await page.click('button:has-text("下一步")');
  
  // 上传测试图片
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles({
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  });
  
  // 点击下一步进入详细描述
  await page.click('button:has-text("下一步")');
  
  // 填写详细描述
  await page.fill('#description', '这是一只非常可爱的测试宠物，性格温顺，适合家庭领养。');
  
  // 点击发布按钮
  await page.click('button:has-text("发布")');
  
  // 等待跳转到宠物列表页
  await expect(page).toHaveURL('/pets');
  
  // 3. 注册申请者用户
  await page.goto('/register');
  await page.fill('#name', '申请者用户');
  await page.fill('#email', applicantEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 验证注册成功后显示成功消息
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  
  // 点击前往登录按钮
  await page.click('a:has-text("前往登录")');
  
  // 登录申请者用户
  await page.fill('#email', applicantEmail);
  await page.fill('#password', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 等待跳转到首页
  await expect(page).toHaveURL('/');
  
  // 4. 申请者浏览宠物列表，找到刚发布的宠物
  await page.goto('/pets');
  
  // 等待宠物列表加载
  await page.waitForLoadState('networkidle');
  
  // 找到刚发布的宠物并点击进入详情页
  await page.click(`text=${petName}`);
  // 等待后端处理
  await page.waitForTimeout(2000);
  
  // 验证是否进入了正确的宠物详情页
  await expect(page).toHaveURL(/\/pets\/[0-9a-fA-F-]+/, { timeout: 10000 });
  await expect(page.locator('h1')).toContainText(petName);
  
  // 提交领养申请
  await page.click('button:has-text("申请收养")');
  await page.fill('textarea', '我非常喜欢这只宠物，有足够的时间和精力照顾它。');
  await page.click('button:has-text("提交申请")');
  // 等待后端处理
  await page.waitForTimeout(2000);
  
  // 验证申请提交成功
  await expect(page.locator('div.bg-green-50')).toContainText('申请提交成功', { timeout: 10000 });
  await page.waitForTimeout(3000);
  // 登出申请者用户
  await page.click('button:has-text("退出登录")');
  
  // 5. 发布者登录并审核申请
  await page.goto('/login');
  await page.fill('#email', publisherEmail);
  await page.fill('#password', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 等待跳转到首页
  await expect(page).toHaveURL('/');
  
  // 6. 访问申请管理页面
  await page.goto('/applications');
  // 验证是否显示申请管理标题
  await expect(page.locator('h1')).toContainText('申请管理', { timeout: 10000 });
  
  // 找到对应宠物的申请卡片并点击进入详情页面
  //点击整个卡片进入详情页面  
  await page.click(`.bg-white:has-text("${petName}")`);
  
  // 验证是否进入了申请详情页面
  await expect(page.locator('h1')).toContainText('申请详情', { timeout: 10000 });
  
  // 在详情页面点击同意按钮
  await page.click('button:has-text("同意申请")');
  
  // 7. 验证审核成功
  await expect(page.locator('div.bg-green-50')).toContainText('申请已同意', { timeout: 10000 });
  
  // 8. 验证宠物状态变为已领养
  await page.goto('/pets');

  await page.click(`text=${petName}`);
  // 等待后端处理
  await page.waitForTimeout(2000);
  await expect(page.locator('.pet-status')).toContainText('已领养');
});
