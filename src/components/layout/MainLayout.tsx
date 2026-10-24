import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
    </div>
  );
}

export function MainLayout() {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isSidePanel = pageUrl.includes('sidepanel.html');
  const isFullPage = pageUrl.includes('fullpage.html');
  const [extensionSidebarCollapsed, setExtensionSidebarCollapsed] = useState<boolean | null>(
    isSidePanel ? true : isFullPage ? false : null
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-page">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          collapsed={extensionSidebarCollapsed ?? undefined}
          onToggle={extensionSidebarCollapsed === null ? undefined : () => {
            setExtensionSidebarCollapsed((collapsed) => !collapsed);
          }}
        />
        <main className="flex-1 min-w-0 overflow-hidden">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
