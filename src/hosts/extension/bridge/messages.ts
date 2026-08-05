export const chromeMessage = {
  ready: () => ({ type: 'extension:ready' }),
  ping: () => ({ type: 'ping' }),
  openSidePanel: () => ({ type: 'open-side-panel' }),
  openFullPage: () => ({ type: 'open-full-page' }),
};
