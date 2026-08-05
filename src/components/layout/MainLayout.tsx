import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../../store';

function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
    </div>
  );
}

export function MainLayout() {
  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed);

  useEffect(() => {
    const isSidePanel = typeof window !== 'undefined' && window.location.href.includes('sidepanel.html');
    if (isSidePanel) {
      setSidebarCollapsed(true);
    }
  }, [setSidebarCollapsed]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-page">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
