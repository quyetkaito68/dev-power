import type { ImageConvertResult } from './types';

export function fileToBase64(file: File): Promise<ImageConvertResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({ success: true, output: result, mimeType: file.type });
    };
    reader.onerror = () => resolve({ success: false, output: '', error: 'Failed to read file' });
    reader.readAsDataURL(file);
  });
}

export function base64ToImageSrc(input: string): ImageConvertResult {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, output: '', error: 'Input is empty' };

  // Already a data URL
  if (trimmed.startsWith('data:image/')) {
    return { success: true, output: trimmed };
  }

  // Raw base64 — detect format by magic bytes prefix
  const mimeType = detectMimeFromBase64(trimmed);
  return { success: true, output: `data:${mimeType};base64,${trimmed}`, mimeType };
}

function detectMimeFromBase64(b64: string): string {
  try {
    const prefix = atob(b64.slice(0, 16));
    const bytes = Array.from(prefix).map((c) => c.charCodeAt(0));
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
  } catch {}
  return 'image/png';
}

export function downloadImage(src: string, filename = 'image') {
  const ext = src.match(/data:image\/(\w+)/)?.[1] ?? 'png';
  const a = document.createElement('a');
  a.href = src;
  a.download = `${filename}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
