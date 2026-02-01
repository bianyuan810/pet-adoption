import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary'} bg-background text-foreground ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}


