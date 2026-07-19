import { useNavigate } from 'react-router-dom';
import { Command, Wrench } from 'lucide-react';
import { tools } from '../core/registry';
import { cn } from '../core/utils/cn';
import { useAppStore } from '../store';

const categoryColors: Record<string, string> = {
  formatter: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/15',
  encoder: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/15',
  generator: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15',
  media: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/15',
  text: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/15',
};

export function WelcomePage() {
  const navigate = useNavigate();
  const { addRecentTool, setCommandPaletteOpen } = useAppStore();

  const handleTool = (id: string) => {
    addRecentTool(id);
    navigate(`/tool/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-6">
        <Wrench className="w-8 h-8 text-violet-400" />
      </div>

      <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">
        Dev<span className="text-violet-400">Power</span>
      </h1>
      <p className="text-faint text-sm mb-10 max-w-md">
        Fast, client-side developer utilities. All tools run entirely in your browser — no data leaves your machine.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl mb-10">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleTool(tool.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border text-left transition-colors',
                categoryColors[tool.category]
              )}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-secondary">{tool.name}</div>
                <div className="text-xs text-faint mt-0.5 line-clamp-2">{tool.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 text-xs text-placeholder hover:text-text-muted transition-colors border border-strong hover:border rounded-lg px-4 py-2"
      >
        <Command className="w-3.5 h-3.5" />
        Press Ctrl+K to search tools
      </button>
    </div>
  );
}
