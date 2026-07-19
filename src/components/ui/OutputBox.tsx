import { CopyButton } from './CopyButton';
import { cn } from '../../core/utils/cn';

interface OutputBoxProps {
  label?: string;
  value: string;
  error?: string;
  success?: boolean;
  className?: string;
  mono?: boolean;
  rows?: number;
  actions?: React.ReactNode;
}

export function OutputBox({ label, value, error, success, className, mono = true, rows = 8, actions }: OutputBoxProps) {
  const hasContent = Boolean(value || error);

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-h-0">
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {actions}
          {value && <CopyButton text={value} />}
        </div>
      </div>

      {error ? (
        <div className="flex-1 rounded-md border border-red-500/30 bg-red-500/5 p-3">
          <p className="text-sm text-red-400 font-mono">{error}</p>
        </div>
      ) : (
        <div
          className={cn(
            'flex-1 min-h-0 rounded-md border border/50 bg-surface/50',
            success && value && 'border-emerald-500/30 bg-emerald-500/5',
            className
          )}
        >
          {hasContent ? (
            <pre
              className={cn(
                'h-full overflow-auto p-3 text-sm whitespace-pre-wrap break-all',
                mono ? 'font-mono' : 'font-sans',
                success && value ? 'text-emerald-300' : 'text-secondary'
              )}
              style={{ minHeight: `${rows * 1.625}rem` }}
            >
              {value}
            </pre>
          ) : (
            <div
              className="flex items-center justify-center text-placeholder text-sm italic"
              style={{ minHeight: `${rows * 1.625}rem` }}
            >
              Output will appear here
            </div>
          )}
        </div>
      )}
    </div>
  );
}
