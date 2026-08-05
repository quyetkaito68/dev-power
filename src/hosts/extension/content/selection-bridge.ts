export function getSelectedText(): string {
  if (typeof window === 'undefined') return '';
  return window.getSelection()?.toString() ?? '';
}
