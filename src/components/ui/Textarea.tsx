import { cn } from '../../core/utils/cn';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-h-0">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</label>
      )}
      <textarea
        {...props}
        className={cn(
          'flex-1 min-h-0 w-full resize-none rounded-md border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors font-mono',
          'dark:bg-zinc-900 dark:border-zinc-700/50',
          'light:bg-white light:border-zinc-200 light:text-zinc-900 light:placeholder:text-zinc-400',
          error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-zinc-700/50',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
