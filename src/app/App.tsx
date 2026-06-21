import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CommandPalette } from '../components/CommandPalette';
import { WelcomePage, ToolLoader } from './router';
import { useAppStore } from '../store';

export default function App() {
  const { isDark } = useAppStore();

  // Sync dark class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
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
  );
}
