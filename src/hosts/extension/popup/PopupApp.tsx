import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { tools } from '../../../core/registry';
import { useAppStore } from '../../../store';

const popupTools = tools.filter((tool) => tool.showInPopup);

export default function PopupApp() {
  const { isDark } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const handleOpenSidePanel = async () => {
    if (!chrome.sidePanel) {
      return;
    }

    try {
      await chrome.sidePanel.setOptions({ path: 'sidepanel.html' });
      const currentWindow = await chrome.windows?.getCurrent();
      if (currentWindow?.id !== undefined) {
        await chrome.sidePanel.open({ windowId: currentWindow.id });
      } else {
        await chrome.sidePanel.open({});
      }
      window.close();
    } catch (error) {
      console.error('Failed to open side panel', error);
    }
  };

  const handleOpenFullPage = async () => {
    if (chrome.tabs) {
      try {
        await chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
      } catch (error) {
        console.error('Failed to open full page', error);
      }
    }
  };

  return (
    <div className="flex min-h-[420px] max-h-[600px] w-[360px] flex-col overflow-hidden bg-page text-primary">
      <div className="flex shrink-0 items-center gap-2 border-b border-strong px-3 py-2">
        <button onClick={handleOpenFullPage} className="rounded-md border border-strong px-2 py-1 text-xs hover:bg-elevated">
          Open Full Page
        </button>
        <button onClick={handleOpenSidePanel} className="rounded-md border border-strong px-2 py-1 text-xs hover:bg-elevated">
          Open Side Panel
        </button>
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto">
        {popupTools.map((tool) => {
          const ToolComponent = tool.component;
          return (
            <Suspense
              key={tool.id}
              fallback={
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                </div>
              }
            >
              <ToolComponent />
            </Suspense>
          );
        })}
      </main>
    </div>
  );
}
