import { cn } from '../../core/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'default' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-zinc-800 dark:hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100',
  outline: 'border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100',
  danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-2',
  lg: 'h-10 px-4 text-sm gap-2',
};

export function Button({ variant = 'default', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
}
