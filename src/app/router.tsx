import { Suspense, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getToolById } from '../core/registry';
import { useAppStore } from '../store';
import { WelcomePage } from '../components/WelcomePage';

function ToolLoader() {
  const { id } = useParams<{ id: string }>();
  const addRecentTool = useAppStore((s) => s.addRecentTool);

  const tool = id ? getToolById(id) : null;

  useEffect(() => {
    if (tool) addRecentTool(tool.id);
  }, [tool, addRecentTool]);

  if (!id) return <WelcomePage />;
  if (!tool) return <Navigate to="/" replace />;

  const Component = tool.component;

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center h-full">
          <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

export { WelcomePage, ToolLoader };
