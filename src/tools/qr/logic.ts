import QRCode from 'qrcode';
import jsQR from 'jsqr';
import type { QrGenerateResult } from './types';

export async function generateQR(text: string, size = 300): Promise<QrGenerateResult> {
  if (!text.trim()) return { success: false, dataUrl: '', error: 'Input is empty' };
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
    return { success: true, dataUrl };
  } catch (e) {
    return { success: false, dataUrl: '', error: (e as Error).message };
  }
}

export function downloadQR(dataUrl: string, filename = 'qrcode') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function copyQRImageToClipboard(dataUrl: string): Promise<void> {
  if (!dataUrl) throw new Error('No QR image available');
  if (typeof navigator === 'undefined' || !navigator.clipboard?.write) {
    throw new Error('Clipboard API is not available in this browser');
  }
  if (typeof ClipboardItem === 'undefined') {
    throw new Error('Clipboard image copy is not supported in this browser');
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  await navigator.clipboard.write([new ClipboardItem({ [blob.type || 'image/png']: blob })]);
}

export async function scanQRFromClipboard(): Promise<string | null> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.read) {
    throw new Error('Clipboard API is not available in this browser');
  }

  const items = await navigator.clipboard.read();
  for (const item of items) {
    const imageType = Array.from(item.types).find((type) => type.startsWith('image/'));
    if (!imageType) continue;

    const blob = await item.getType(imageType);
    const file = new File([blob], `clipboard-${Date.now()}.${imageType.split('/')[1] || 'png'}`, { type: imageType });
    return scanQRFromFile(file);
  }

  return null;
}

export function scanQRFromFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(data.data, data.width, data.height);
        resolve(code?.data ?? null);
      };
      img.onerror = () => resolve(null);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export async function scanQRFromWebcam(
  videoEl: HTMLVideoElement,
  signal: AbortSignal
): Promise<string | null> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const context = ctx;

  return new Promise((resolve) => {
    function tick() {
      if (signal.aborted) return resolve(null);
      if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const data = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(data.data, data.width, data.height);
        if (code) return resolve(code.data);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
