import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

export type ToolCategory = 'formatter' | 'encoder' | 'generator' | 'media';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  component: ComponentType;
  keywords: string[];
}

export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'formatter', label: 'Formatters', color: 'text-blue-400' },
  { id: 'encoder', label: 'Encoders', color: 'text-violet-400' },
  { id: 'generator', label: 'Generators', color: 'text-emerald-400' },
  { id: 'media', label: 'Media', color: 'text-orange-400' },
];
