import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { tools, groupByCategory } from '../../core/registry';
import { CATEGORIES } from '../../core/types';
import { useAppStore } from '../../store';
import { cn } from '../../core/utils/cn';

export function Sidebar() {
  const [search, setSearch] = useState('');
  const { sidebarCollapsed, toggleSidebar, recentTools } = useAppStore();

  const filtered = search.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.includes(search.toLowerCase()))
      )
    : tools;

  const grouped = groupByCategory(filtered);

  if (sidebarCollapsed) {
    return (
      <aside className="w-12 border-r border-strong flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-md text-faint hover:text-secondary hover:bg-elevated transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-1 mt-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <NavLink
                key={tool.id}
                to={`/tool/${tool.id}`}
                title={tool.name}
                className={({ isActive }) =>
                  cn(
                    'w-8 h-8 flex items-center justify-center rounded-md transition-colors',
                    isActive
                      ? 'bg-violet-600/20 text-violet-400'
                      : 'text-faint hover:text-secondary hover:bg-elevated'
                  )
                }
              >
                <Icon className="w-4 h-4" />
              </NavLink>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 border-r border-strong flex flex-col shrink-0 overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-strong">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full h-8 bg-elevated/60 border border/50 rounded-md pl-8 pr-3 text-sm text-secondary placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-faint hover:text-secondary"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tool list */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {/* Recent */}
        {!search && recentTools.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5">
              <Clock className="w-3 h-3 text-placeholder" />
              <span className="text-xs font-semibold text-placeholder uppercase tracking-wider">Recent</span>
            </div>
            {recentTools
              .map((id) => tools.find((t) => t.id === id))
              .filter(Boolean)
              .map((tool) => {
                const Icon = tool!.icon;
                return (
                  <NavLink
                    key={tool!.id}
                    to={`/tool/${tool!.id}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 mx-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-violet-600/15 text-violet-300'
                          : 'text-text-muted hover:text-secondary hover:bg-elevated/60'
                      )
                    }
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tool!.name}</span>
                  </NavLink>
                );
              })}
            <div className="mx-3 mt-2 border-t border-strong" />
          </div>
        )}

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const catTools = grouped.get(cat.id);
          if (!catTools?.length) return null;
          return (
            <div key={cat.id} className="mb-3">
              <div className="px-3 py-1.5">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', cat.color)}>
                  {cat.label}
                </span>
              </div>
              {catTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <NavLink
                    key={tool.id}
                    to={`/tool/${tool.id}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 mx-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                          : 'text-text-muted hover:text-secondary hover:bg-elevated/60'
                      )
                    }
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tool.name}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-placeholder">No tools match "{search}"</p>
          </div>
        )}
      </nav>

      {/* Collapse button */}
      <div className="border-t border-strong p-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-placeholder hover:text-text-muted hover:bg-elevated/50 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Collapse
        </button>
      </div>
    </aside>
  );
}
