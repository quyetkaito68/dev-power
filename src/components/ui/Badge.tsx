import { cn } from '../../core/utils/cn';
import type { ToolCategory } from '../../core/types';

const categoryColors: Record<ToolCategory, string> = {
  formatter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  encoder: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  generator: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  media: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  text: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const categoryLabels: Record<ToolCategory, string> = {
  formatter: 'Formatter',
  encoder: 'Encoder',
  generator: 'Generator',
  media: 'Media',
  text: 'Text',
};

interface BadgeProps {
  category: ToolCategory;
  className?: string;
}

export function Badge({ category, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        categoryColors[category],
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}
