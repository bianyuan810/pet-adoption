import { test, expect } from '@playwright/test';

test('用户注册流程测试', async ({ page }) => {
  // 生成随机邮箱以避免重复注册
  const randomEmail = `test_${Date.now()}@example.com`;
  
  // 访问注册页面
  await page.goto('/register');
  
  // 验证页面内容
  await expect(page.locator('h1')).toContainText('创建账户');
  
  // 填写注册表单
  await page.fill('#name', '测试用户');
  await page.fill('#email', randomEmail);
  await page.fill('#password', 'Test123!');
  await page.fill('#confirmPassword', 'Test123!');
  
  // 提交表单
  await page.click('button[type="submit"]');
  
  // 验证注册成功后显示成功消息（而不是直接跳转到首页）
  await expect(page.locator('h2')).toContainText('注册成功！', { timeout: 10000 });
  await expect(page.getByText('您的账户已创建成功，现在可以登录了')).toBeVisible();
  await expect(page.getByText('前往登录')).toBeVisible();
});
