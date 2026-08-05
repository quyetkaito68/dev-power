import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { CommandPalette } from '../../../components/CommandPalette';
import { WelcomePage, ToolLoader } from '../../../app/router';
import { useAppStore } from '../../../store';

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
    <div className="min-h-[420px] w-[360px] overflow-hidden bg-page text-primary">
      <div className="flex items-center gap-2 border-b border-strong px-3 py-2">
        <button onClick={handleOpenSidePanel} className="rounded-md border border-strong px-2 py-1 text-xs hover:bg-elevated">
          Open Side Panel
        </button>
        <button onClick={handleOpenFullPage} className="rounded-md border border-strong px-2 py-1 text-xs hover:bg-elevated">
          Open Full Page
        </button>
      </div>
      <HashRouter>
        <CommandPalette />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="tool/:id" element={<ToolLoader />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
