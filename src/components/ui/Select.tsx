import { cn } from '../../core/utils/cn';
import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  containerClassName?: string;
}

export function Select({ label, options, className, containerClassName, ...props }: SelectProps) {
  return (
    <div className={cn('flex w-fit max-w-full flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</label>
      )}
      <div className="relative">
        <select
          {...props}
          className={cn(
            'h-9 w-full rounded-md border border/50 bg-surface px-3 pr-9 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors appearance-none cursor-pointer',
            className
          )}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      </div>
    </div>
  );
}
