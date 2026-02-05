import { NextRequest } from 'next/server';

/**
 * 解析查询参数
 * @param request Next.js 请求对象
 * @returns 解析后的查询参数对象
 */
export function parseQueryParams(request: NextRequest): Record<string, string | number | boolean> {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string | number | boolean> = {};

  searchParams.forEach((value, key) => {
    // 尝试转换为数字
    if (!isNaN(Number(value))) {
      params[key] = Number(value);
    }
    // 尝试转换为布尔值
    else if (value === 'true' || value === 'false') {
      params[key] = value === 'true';
    }
    // 保持字符串类型
    else {
      params[key] = value;
    }
  });

  return params;
}

/**
 * 构建查询字符串
 * @param params 查询参数对象
 * @returns 构建的查询字符串
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * 获取请求体数据
 * @param request Next.js 请求对象
 * @returns 解析后的请求体数据
 */
export async function getRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch {
    return {} as T;
  }
}

/**
 * 获取表单数据
 * @param request Next.js 请求对象
 * @returns 解析后的表单数据
 */
export async function getFormData(request: NextRequest): Promise<Record<string, string | number | boolean | File>> {
  const formData = await request.formData();
  const data: Record<string, string | number | boolean | File> = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      data[key] = value;
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else if (!isNaN(Number(value))) {
      data[key] = Number(value);
    } else {
      data[key] = value;
    }
  });

  return data;
}

/**
 * 验证必填参数
 * @param params 参数对象
 * @param requiredFields 必填字段列表
 * @returns 验证结果
 */
export function validateRequiredParams(
  params: Record<string, string | number | boolean | undefined | null>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    if (params[field] === undefined || params[field] === null || params[field] === '') {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}


