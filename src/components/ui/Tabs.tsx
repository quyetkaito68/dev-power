import { cn } from '../../core/utils/cn';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 rounded-lg bg-elevated/60 p-1 border border/40', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            active === tab.id
              ? 'bg-muted text-primary shadow-sm'
              : 'text-text-muted hover:text-secondary hover:bg-muted/50'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
