type MessagePayload = {
  type: string;
  payload?: unknown;
};

type ContextMenuPayload = {
  selectedText?: string;
  pageUrl?: string;
};

const DEVPOWER_MENU_ID = 'devpower-open-sidepanel';

async function storeContextText(selectedText?: string) {
  if (selectedText?.trim()) {
    await chrome.storage?.local?.set({ devpowerContextText: selectedText.trim() });
  } else {
    await chrome.storage?.local?.set({ devpowerContextText: '' });
  }
}

async function openDevPowerSidePanel(selectedText?: string) {
  if (!chrome.sidePanel) return;

  await chrome.sidePanel.setOptions({ path: 'sidepanel.html' });
  await storeContextText(selectedText);
}

chrome.runtime.onInstalled.addListener(() => {
  void chrome.contextMenus?.create({
    id: DEVPOWER_MENU_ID,
    title: 'Open DevPower',
    contexts: ['selection', 'page', 'link', 'image'],
  });
});

chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== DEVPOWER_MENU_ID) return;

  const selectedText = info.selectionText?.trim() || '';

  if (chrome.sidePanel) {
    void chrome.sidePanel.setOptions({ path: 'sidepanel.html' });

    if (tab?.id !== undefined) {
      void chrome.sidePanel.open({ tabId: tab.id });
    } else if (tab?.windowId !== undefined) {
      void chrome.sidePanel.open({ windowId: tab.windowId });
    }
  }

  void (async () => {
    await storeContextText(selectedText);

    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText);
      } catch {
        // ignore clipboard errors
      }
    }
  })();
});

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const payload = message as MessagePayload;

  if (payload?.type === 'ping') {
    sendResponse({ ok: true });
    return true;
  }

  if (payload?.type === 'open-side-panel') {
    void openDevPowerSidePanel(typeof payload.payload === 'string' ? payload.payload : undefined);
    sendResponse({ ok: true });
    return true;
  }

  if (payload?.type === 'open-full-page') {
    sendResponse({ ok: true });
    return true;
  }

  return true;
});
