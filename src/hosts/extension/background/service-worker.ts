type MessagePayload = {
  type: string;
  payload?: unknown;
};

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const payload = message as MessagePayload;

  if (payload?.type === 'ping') {
    sendResponse({ ok: true });
    return true;
  }

  if (payload?.type === 'open-side-panel') {
    sendResponse({ ok: true });
    return true;
  }

  if (payload?.type === 'open-full-page') {
    sendResponse({ ok: true });
    return true;
  }

  return true;
});
