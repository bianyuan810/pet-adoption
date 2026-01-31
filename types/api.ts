// 前后端数据传输格式接口
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// 状态码枚举
export enum HttpStatus {
  OK = 200,              // 成功
  CREATED = 201,         // 创建成功
  BAD_REQUEST = 400,     // 客户端参数错误
  UNAUTHORIZED = 401,    // 未授权 / Token 过期
  FORBIDDEN = 403,       // 禁止访问 / 权限不足
  NOT_FOUND = 404,       // 资源不存在
  CONFLICT = 409,        // 资源冲突
  TOO_MANY_REQUESTS = 429, // 请求过于频繁
  INTERNAL_SERVER_ERROR = 500, // 服务器内部错误
}
