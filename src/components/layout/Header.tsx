import { Sun, Moon, Command, Wrench } from 'lucide-react';
import { useAppStore } from '../../store';
import { Button } from '../ui/Button';

export function Header() {
  const { isDark, toggleDark, setCommandPaletteOpen } = useAppStore();

  return (
    <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
          <Wrench className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm text-zinc-200 tracking-tight">
          Dev<span className="text-violet-400">Power</span>
        </span>
        <span className="hidden sm:block text-xs text-zinc-600 ml-1">— Developer Utility Toolbox</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex gap-1.5 text-zinc-500 hover:text-zinc-300"
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
          className="text-zinc-400 hover:text-zinc-200"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
