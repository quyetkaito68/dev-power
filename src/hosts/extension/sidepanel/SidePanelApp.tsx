import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { WelcomePage, ToolLoader } from '../../../app/router';
import { useAppStore } from '../../../store';

export default function SidePanelApp() {
  const { isDark, setContextText } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    const readContextText = async () => {
      const stored = await chrome.storage?.local?.get('devpowerContextText');
      const text = typeof stored?.devpowerContextText === 'string' ? stored.devpowerContextText : '';
      setContextText(text);
    };

    void readContextText();
  }, [setContextText]);

  return (
    <div className="min-h-screen h-full w-full bg-page text-primary">
      <HashRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="tool/:id" element={<ToolLoader />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
