import createLogger, { LogLevelNames } from 'console-log-level';

// 获取日志级别从环境变量
const getLogLevel = (): LogLevelNames => {
  const level = process.env.LOG_LEVEL;
  const validLevels: LogLevelNames[] = ['error', 'warn', 'info', 'debug', 'trace'];
  
  if (level && validLevels.includes(level as LogLevelNames)) {
    return level as LogLevelNames;
  }
  
  return 'info';
};

// 创建默认日志实例
export const logger = createLogger({
  level: getLogLevel(),
  prefix: 'APP'
});

// 创建带前缀的日志实例
export const createNamedLogger = (prefix: string): ReturnType<typeof createLogger> => {
  return createLogger({
    level: getLogLevel(),
    prefix
  });
};

// 导出常用的命名日志实例
export const authLogger = createNamedLogger('AUTH');
export const petLogger = createNamedLogger('PET');
export const messageLogger = createNamedLogger('MESSAGE');
export const applicationLogger = createNamedLogger('APPLICATION');

export default logger;
