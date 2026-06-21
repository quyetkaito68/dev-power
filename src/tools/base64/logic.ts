import type { Base64Result } from './types';

export function encodeBase64(input: string): Base64Result {
  if (!input) return { success: false, output: '', error: 'Input is empty' };
  try {
    // Handle UTF-8 correctly
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return { success: true, output: btoa(binary) };
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message };
  }
}

export function decodeBase64(input: string): Base64Result {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, output: '', error: 'Input is empty' };
  try {
    const binary = atob(trimmed);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { success: true, output: new TextDecoder().decode(bytes) };
  } catch {
    return { success: false, output: '', error: 'Invalid Base64 string — check for invalid characters or padding' };
  }
}

export function isValidBase64(s: string): boolean {
  try {
    atob(s.trim());
    return true;
  } catch {
    return false;
  }
}
