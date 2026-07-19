import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useAppStore } from '../store';
import { searchTools } from '../core/registry';
import { cn } from '../core/utils/cn';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, addRecentTool } = useAppStore();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = searchTools(query);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const select = (toolId: string) => {
    addRecentTool(toolId);
    navigate(`/tool/${toolId}`);
    setCommandPaletteOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      select(results[activeIndex].id);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
      onClick={() => setCommandPaletteOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg bg-surface border border/60 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-strong">
          <Search className="w-4 h-4 text-faint shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-sm text-secondary placeholder:text-placeholder focus:outline-none"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="text-faint hover:text-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-1.5 scrollbar-thin">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-placeholder">
              No tools found for "{query}"
            </div>
          ) : (
            results.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => select(tool.id)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    i === activeIndex ? 'bg-violet-600/15 text-violet-300' : 'text-secondary hover:bg-elevated/60'
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                    i === activeIndex ? 'bg-violet-600/20' : 'bg-elevated'
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{tool.name}</div>
                    <div className="text-xs text-faint truncate">{tool.description}</div>
                  </div>
                  {i === activeIndex && (
                    <kbd className="ml-auto shrink-0 text-xs text-faint bg-elevated border border rounded px-1.5 py-0.5">
                      ↵
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-strong px-4 py-2 flex items-center gap-4 text-xs text-placeholder">
          <span><kbd className="bg-elevated border border rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="bg-elevated border border rounded px-1">↵</kbd> select</span>
          <span><kbd className="bg-elevated border border rounded px-1">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
