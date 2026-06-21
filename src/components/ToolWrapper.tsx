import type { ReactNode } from 'react';
import { Badge } from './ui/Badge';
import type { ToolCategory } from '../core/types';

interface ToolWrapperProps {
  title: string;
  description: string;
  category: ToolCategory;
  children: ReactNode;
}

export function ToolWrapper({ title, description, category, children }: ToolWrapperProps) {
  return (
    <div className="flex flex-col h-full gap-5 p-6 overflow-auto">
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">{title}</h1>
            <Badge category={category} />
          </div>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
