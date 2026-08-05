declare const chrome: {
  runtime: {
    getURL: (path: string) => string;
    sendMessage: (message: unknown) => Promise<unknown>;
    onMessage: {
      addListener: (listener: (message: unknown, sender: unknown, sendResponse: (response?: unknown) => void) => boolean | void) => void;
    };
  };
  storage?: {
    local?: {
      get: (keys?: string | string[] | Record<string, unknown>) => Promise<unknown>;
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
