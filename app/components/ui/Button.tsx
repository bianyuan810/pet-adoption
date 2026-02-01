import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
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
  // Base styles with improved accessibility and touch targets
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] shadow-sm hover:shadow-md active:scale-[0.98]';

  // Enhanced variant styles with better visual hierarchy
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary dark:hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary dark:hover:bg-secondary/80',
    outline: 'border border-input bg-background text-foreground hover:bg-muted focus:ring-primary dark:border-border dark:bg-card dark:text-card-foreground dark:hover:bg-muted/80',
    ghost: 'bg-transparent text-foreground hover:bg-muted/50 focus:ring-primary dark:text-card-foreground dark:hover:bg-muted/60',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive dark:hover:bg-destructive/80',
  };

  // Size styles with consistent spacing
  const sizeStyles = {
    sm: 'h-10 px-3 text-sm gap-2',
    md: 'h-11 px-4 py-2 text-base gap-2',
    lg: 'h-12 px-6 text-lg gap-3',
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


