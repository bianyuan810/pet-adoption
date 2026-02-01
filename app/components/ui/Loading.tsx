interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  className?: string;
}

export function Loading({ size = 'md', color = 'blue', className = '' }: LoadingProps) {
  // 尺寸样式
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  // 颜色样式
  const colorStyles = {
    blue: 'border-blue-500 border-t-blue-600',
    gray: 'border-gray-500 border-t-gray-600',
    white: 'border-white border-t-transparent',
  };
  
  return (
    <div 
      className={`animate-spin rounded-full border-4 ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">加载中..</span>
    </div>
  );
}


