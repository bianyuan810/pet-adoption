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
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}