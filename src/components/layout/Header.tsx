import { Sun, Moon, Command, Wrench } from 'lucide-react';
import { useAppStore } from '../../store';
import { Button } from '../ui/Button';

export function Header() {
  const { isDark, toggleDark, setCommandPaletteOpen } = useAppStore();

  return (
    <header className="h-12 border-b border-strong flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
          <Wrench className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm text-secondary tracking-tight">
          Dev<span className="text-violet-400">Power</span>
        </span>
        <span className="hidden sm:block text-xs text-placeholder ml-1">— Developer Utility Toolbox</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex gap-1.5 text-faint hover:text-secondary"
          title="Open command palette (Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="text-xs">Ctrl+K</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDark}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="text-text-muted hover:text-secondary"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
