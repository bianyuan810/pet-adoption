import { test, expect } from '@playwright/test';

test('用户登录流程测试', async ({ page }) => {
  // 生成随机邮箱以避免重复注册
  const randomEmail = `test_${Date.now()}@example.com`;
  
  // 先注册一个新用户
  await page.goto('/register');
  await page.fill('#name', '测试用户');
  await page.fill('#email', randomEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  await page.click('button[type="submit"]');
  
  // 验证注册成功后显示成功消息
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  
  // 点击前往登录按钮
  await page.click('a:has-text("前往登录")');
  
  // 访问登录页面
  await page.goto('/login');
  
  // 验证页面内容
  await expect(page.locator('h1')).toContainText('欢迎回来');
  
  // 填写登录表单
  await page.fill('#email', randomEmail);
  await page.fill('#password', 'Test123!');
  
  // 提交表单
  await page.click('button[type="submit"]');
  
  // 验证登录成功后跳转到首页
  await expect(page).toHaveURL('/');
  
  // 验证登录成功后，登录按钮变为个人中心或其他登录状态的标识
  // 目前Header组件是静态的，没有显示用户信息，所以只验证页面跳转成功
  await expect(page.locator('button:has-text("登录")')).not.toBeVisible();
});
