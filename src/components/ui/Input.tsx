import { cn } from '../../core/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</label>
      )}
      <input
        {...props}
        className={cn(
          'h-9 w-full rounded-md border bg-surface px-3 text-sm text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors font-mono',
          error ? 'border-red-500/50' : 'border/50',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
