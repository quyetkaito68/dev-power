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
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isPopup = pageUrl.includes('popup.html');

  return (
    <div className={`flex flex-col h-full overflow-auto ${isPopup ? 'gap-3 p-3' : 'gap-5 p-6'}`}>
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className={`${isPopup ? 'text-lg' : 'text-xl'} font-bold text-primary tracking-tight`}>{title}</h1>
            {!isPopup && <Badge category={category} />}
          </div>
          {!isPopup && <p className="text-sm text-text-muted">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
