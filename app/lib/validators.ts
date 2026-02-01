import { z } from 'zod';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 验证必填项
 * @param value 要验证的值
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === undefined || value === null || value === '') {
    return {
      isValid: false,
      errors: [`${fieldName} 不能为空`]
    };
  }
  return { isValid: true, errors: [] };
}

/**
 * 验证最小长度
 * @param value 要验证的值
 * @param minLength 最小长度
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  if (value.length < minLength) {
    return {
      isValid: false,
      errors: [`${fieldName} 长度不能少于 ${minLength} 位`]
    };
  }
  return { isValid: true, errors: [] };
}

/**
 * 验证最大长度
 * @param value 要验证的值
 * @param maxLength 最大长度
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      errors: [`${fieldName} 长度不能超过 ${maxLength} 位`]
    };
  }
  return { isValid: true, errors: [] };
}

/**
 * 验证邮箱
 * @param email 邮箱地址
 * @returns 验证结果
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errors: ['邮箱格式不正确']
    };
  }
  return { isValid: true, errors: [] };
}

/**
 * 验证手机号
 * @param phone 手机号码
 * @returns 验证结果
 */
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      errors: ['手机号格式不正确']
    };
  }
  return { isValid: true, errors: [] };
}

/**
 * 组合验证器
 * @param validators 验证器数组
 * @returns 组合后的验证器
 */
export function composeValidators(...validators: ((value: any) => ValidationResult)[]): (value: any) => ValidationResult {
  return (value: any) => {
    const errors: string[] = [];
    
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
}

// 常用 zod 验证 schema
export const schemas = {
  // 邮箱 schema
  email: z.string()
    .email('邮箱格式不正确'),
  
  // 手机号 schema
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  
  // 密码 schema
  password: z.string()
    .min(6, '密码长度至少 6 位')
    .max(20, '密码长度最多 20 位'),
  
  // 用户名 schema
  username: z.string()
    .min(2, '用户名长度至少 2 位')
    .max(20, '用户名长度最多 20 位'),
  
  // URL schema
  url: z.string()
    .url('请输入有效的 URL 地址'),
  
  // 整数 schema
  integer: z.number()
    .int('请输入整数'),
  
  // 正整数 schema
  positiveInteger: z.number()
    .int('请输入整数')
    .positive('请输入正数'),
  
  // 非负数 schema
  nonNegative: z.number()
    .min(0, '请输入非负数'),
};

/**
 * 使用 zod schema 验证
 * @param schema zod schema
 * @param value 要验证的值
 * @returns 验证结果
 */
export function validateWithSchema<T>(schema: z.ZodSchema<T>, value: any): ValidationResult {
  const result = schema.safeParse(value);
  
  if (!result.success) {
    // 提取 Zod 错误信息 (Zod v4+)
    const errors = result.error.issues.map(err => err.message);
    return {
      isValid: false,
      errors
    };
  }
  
  return { isValid: true, errors: [] };
}

/**
 * 验证对象字段
 * @param data 要验证的数据
 * @param validations 验证规则
 * @returns 验证结果
 */
export function validateObject(
  data: Record<string, any>,
  validations: Record<string, (value: any) => ValidationResult>
): ValidationResult {
  const errors: string[] = [];
  
  Object.entries(validations).forEach(([field, validator]) => {
    const result = validator(data[field]);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}


