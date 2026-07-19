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
        <label className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</label>
      )}
      <textarea
        {...props}
        className={cn(
          'flex-1 min-h-0 w-full resize-none rounded-md border bg-surface px-3 py-2.5 text-sm text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors font-mono',
          error ? 'border-red-500/50 focus:ring-red-500/30' : 'border/50',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
