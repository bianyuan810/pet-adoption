import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/app/types/api';

/**
 * 请求选项接口
 */
export interface RequestOptions extends Omit<AxiosRequestConfig, 'url'> {
  params?: Record<string, any>;
  timeout?: number;
}

/**
 * 创建 axios 实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从 cookie 中获取 token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      // 如果有 token 则添加到请求头
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 处理响应错误
      if (error.response) {
        // 服务器返回错误状态码
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // 未授权，跳转到登录页
            window.location.href = '/login';
            break;
          case 403:
            // 禁止访问
            console.error('禁止访问该资源');
            break;
          case 404:
            // 资源不存在
            console.error('请求的资源不存在');
            break;
          case 500:
            // 服务器内部错误
            console.error('服务器内部错误');
            break;
          default:
            console.error(data?.msg || '请求失败');
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('网络错误，服务器未响应');
      } else {
        // 请求配置出错
        console.error('请求配置错误:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// 创建 axios 实例
const axiosInstance = createAxiosInstance();

/**
 * 发送 API 请求
 * @param url 请求地址
 * @param options 请求选项
 * @returns API 响应数据
 */
export async function fetchApi<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, timeout, ...config } = options;

  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance({
      url,
      params,
      timeout: timeout || 10000,
      ...config
    });

    return response.data;
  } catch (error) {
    // 抛出错误，让调用方处理
    throw error;
  }
}

// API 方法集合
export const api = {
  /**
   * GET 请求
   * @param url 请求地址
   * @param options 请求选项
   * @returns API 响应数据
   */
  get: <T>(url: string, options?: RequestOptions) =>
    fetchApi<T>(url, {
      ...options,
      method: 'GET'
    }),

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   * @returns API 响应数据
   */
  post: <T>(url: string, data?: any, options?: RequestOptions) =>
    fetchApi<T>(url, {
      ...options,
      method: 'POST',
      data
    }),

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   * @returns API 响应数据
   */
  put: <T>(url: string, data?: any, options?: RequestOptions) =>
    fetchApi<T>(url, {
      ...options,
      method: 'PUT',
      data
    }),

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param options 请求选项
   * @returns API 响应数据
   */
  delete: <T>(url: string, options?: RequestOptions) =>
    fetchApi<T>(url, {
      ...options,
      method: 'DELETE'
    }),

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   * @returns API 响应数据
   */
  patch: <T>(url: string, data?: any, options?: RequestOptions) =>
    fetchApi<T>(url, {
      ...options,
      method: 'PATCH',
      data
    })
};

// 默认导出 axios 实例
export default axiosInstance;


