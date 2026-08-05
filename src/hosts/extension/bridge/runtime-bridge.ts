export function sendExtensionMessage(message: unknown) {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    return chrome.runtime.sendMessage(message);
  }

  return Promise.resolve({ ok: true });
}
