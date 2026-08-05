declare const chrome: {
  runtime: {
    getURL: (path: string) => string;
    sendMessage: (message: unknown) => Promise<unknown>;
    onInstalled: {
      addListener: (listener: () => void) => void;
    };
    onMessage: {
      addListener: (listener: (message: unknown, sender: unknown, sendResponse: (response?: unknown) => void) => boolean | void) => void;
    };
  };
  contextMenus?: {
    create: (createProperties: { id: string; title: string; contexts: string[]; documentUrlPatterns?: string[] }) => Promise<void>;
    onClicked: {
      addListener: (listener: (info: { pageUrl?: string; selectionText?: string; linkUrl?: string; srcUrl?: string; menuItemId: string; }, tab?: { id?: number; windowId?: number }) => void) => void;
    };
  };
  storage?: {
    local?: {
      get: (keys?: string | string[] | Record<string, unknown>) => Promise<Record<string, unknown>>;
      set: (items: Record<string, unknown>) => Promise<void>;
    };
  };
  sidePanel?: {
    setOptions: (options: { path: string }) => Promise<void>;
    open: (options: { tabId?: number; windowId?: number }) => Promise<void>;
  };
  tabs?: {
    query: (queryInfo: { active?: boolean; currentWindow?: boolean; windowId?: number }) => Promise<Array<{ id?: number; windowId?: number }>>;
    create: (options: { url: string }) => Promise<unknown>;
  };
  windows?: {
    getCurrent: () => Promise<{ id?: number }>;
  };
};
