import { chromeMessage } from '../bridge/messages';
import { getSelectedText } from './selection-bridge';

function notifyPageReady() {
  void chrome.runtime.sendMessage(chromeMessage.ready());
}

function logSelection() {
  const text = getSelectedText();
  if (text) {
    console.debug('[DevPower] Selected text:', text);
  }
}

void notifyPageReady();
logSelection();
