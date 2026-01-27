import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  // 基础样式 - ensure minimum touch target size of 48px
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]';

  // 变体样式 - using theme colors
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary dark:hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary dark:hover:bg-secondary/80',
    outline: 'border border-input bg-background text-foreground hover:bg-muted focus:ring-primary dark:border-border dark:bg-card dark:text-card-foreground dark:hover:bg-muted/80',
    ghost: 'bg-transparent text-foreground hover:bg-muted focus:ring-primary dark:text-card-foreground dark:hover:bg-muted/80',
  };

  // 尺寸样式 - ensure adequate padding for touch targets
  const sizeStyles = {
    sm: 'h-10 px-3 text-sm', // Increased from h-9 to h-10 for better touch target
    md: 'h-11 px-4 py-2 text-base', // Increased from h-10 to h-11
    lg: 'h-12 px-6 text-lg', // Increased from h-11 to h-12
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}