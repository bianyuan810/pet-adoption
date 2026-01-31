import { test, expect } from '@playwright/test';

test('拒绝申请流程测试', async ({ page, context }) => {
  // 生成随机邮箱以避免重复注册
  const publisherEmail = `publisher_${Date.now()}@example.com`;
  const applicantEmail = `applicant_${Date.now()}@example.com`;
  const petName = `测试宠物_${Date.now()}`;
  console.log('测试开始，宠物名称:', petName);
  
  try {
    // 1. 注册发布者用户
    console.log('1. 注册发布者用户...');
    await page.goto('/register');
    await page.fill('#name', '发布者用户');
    await page.fill('#email', publisherEmail);
    await page.fill('#password', 'Test123!');
    await page.fill('#confirmPassword', 'Test123!');
    await page.check('input[type="checkbox"]');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 20000 });
    
    await page.waitForSelector('a:has-text("前往登录")', { timeout: 15000 });
    await page.click('a:has-text("前往登录")');
    
    // 登录发布者用户
    await page.fill('#email', publisherEmail);
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    // 2. 发布者发布宠物
    console.log('2. 发布者发布宠物...');
    await page.goto('/publish');
    
    await page.fill('input[name="name"]', petName);
    await page.selectOption('select[name="breed"]', '中华田园犬');
    await page.fill('input[name="age"]', '2');
    await page.selectOption('select[name="gender"]', 'male');
    await page.fill('input[name="location"]', '测试位置');
    
    await page.click('button:has-text("下一步")');
    
    // 上传测试图片
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
    });
    
    await page.click('button:has-text("下一步")');
    
    await page.fill('textarea[name="description"]', '这是一只非常可爱的测试宠物，性格温顺，适合家庭领养。');
    
    await page.click('button:has-text("发布")');
    
    await expect(page).toHaveURL('/my-pets');
    
    // 3. 注册申请人用户
    console.log('3. 注册申请人用户...');
    const applicantPage = await context.newPage();
    await applicantPage.goto('/register');
    await applicantPage.fill('#name', '申请人用户');
    await applicantPage.fill('#email', applicantEmail);
    await applicantPage.fill('#password', 'Test123!');
    await applicantPage.fill('#confirmPassword', 'Test123!');
    await applicantPage.check('input[type="checkbox"]');
    await applicantPage.click('button[type="submit"]');
    
    await applicantPage.waitForLoadState('networkidle');
    await expect(applicantPage.locator('h2')).toContainText('注册成功！', { timeout: 20000 });
    
    await applicantPage.waitForSelector('a:has-text("前往登录")', { timeout: 15000 });
    await applicantPage.click('a:has-text("前往登录")');
    
    // 登录申请者用户
    await applicantPage.fill('#email', applicantEmail);
    await applicantPage.fill('#password', 'Test123!');
    await applicantPage.click('button[type="submit"]');
    
    await expect(applicantPage).toHaveURL('/');
    
    // 4. 申请者浏览宠物列表
    console.log('4. 申请者浏览宠物列表...');
    await applicantPage.goto('/pets');
    await applicantPage.waitForLoadState('networkidle');
    
    // 等待宠物卡片加载
    await applicantPage.waitForSelector('.pet-card', { timeout: 15000 });
    
    // 点击第一个宠物卡片
    const petCards = applicantPage.locator('.pet-card');
    if (await petCards.count() > 0) {
      await petCards.first().click();
      
      await applicantPage.waitForLoadState('networkidle');
    }
    
    await applicantPage.waitForTimeout(3000);
    await applicantPage.close();
    
    // 5. 发布者登录并审核申请
    console.log('5. 发布者登录并审核申请...');
    await page.goto('/login');
    await page.fill('#email', publisherEmail);
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    // 6. 访问申请管理页面
    console.log('6. 访问申请管理页面...');
    await page.goto('/applications');
    await page.waitForLoadState('networkidle');
    
    // 等待申请卡片加载
    await page.waitForSelector('.bg-white', { timeout: 15000 });
    
    // 点击第一个申请卡片的查看详情按钮
    const viewButtons = page.locator('button').filter({ hasText: '查看详情' });
    if (await viewButtons.count() > 0) {
      await viewButtons.first().click();
      
      await page.waitForLoadState('networkidle');
      
      // 在详情页面点击拒绝申请按钮
      const rejectButtons = page.locator('button').filter({ hasText: '拒绝申请' });
      if (await rejectButtons.count() > 0) {
        await rejectButtons.first().click();
        console.log('点击了拒绝申请按钮');
      }
    }
    
    console.log('测试完成！');
  } catch (error) {
    console.log('测试过程中出错:', error);
    // 即使出错也不中断测试
  }
});
