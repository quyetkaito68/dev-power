import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isDark: boolean;
  toggleDark: () => void;
  recentTools: string[];
  addRecentTool: (id: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDark: true,
      toggleDark: () => {
        set((s) => {
          const next = !s.isDark;
          document.documentElement.classList.toggle('dark', next);
          document.documentElement.classList.toggle('light', !next);
          return { isDark: next };
        });
      },

      recentTools: [],
      addRecentTool: (id) =>
        set((s) => ({
          recentTools: [id, ...s.recentTools.filter((t) => t !== id)].slice(0, 5),
        })),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'devpower-settings',
      partialize: (s) => ({ isDark: s.isDark, recentTools: s.recentTools, sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);
