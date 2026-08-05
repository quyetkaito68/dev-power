import type { SecretKeyResult } from './types';

function utf8ToBytes(input: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(input) as Uint8Array<ArrayBuffer>;
}

function bytesToUtf8(bytes: Uint8Array<ArrayBuffer>): string {
  return new TextDecoder().decode(bytes);
}

function toArrayBuffer(bytes: Uint8Array<ArrayBuffer>): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function base64ToBytes(input: string): Uint8Array<ArrayBuffer> {
  const binary = atob(input);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}

function bytesToBase64(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('dev-power-salt-v1'),
      iterations: 200_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function createIv(): Uint8Array<ArrayBuffer> {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  return iv as Uint8Array<ArrayBuffer>;
}

export async function encryptWithSecretKey(input: string, secret: string): Promise<SecretKeyResult> {
  if (!input.trim()) return { success: false, output: '', error: 'Input is empty' };
  if (!secret.trim()) return { success: false, output: '', error: 'Secret key is empty' };

  try {
    const key = await deriveKey(secret);
    const iv = createIv();
    const encoded = utf8ToBytes(input);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, toArrayBuffer(encoded));
    const payload = `${bytesToBase64(iv)}.${bytesToBase64(new Uint8Array(ciphertext as ArrayBuffer))}`;
    return { success: true, output: payload };
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message };
  }
}

export async function decryptWithSecretKey(input: string, secret: string): Promise<SecretKeyResult> {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, output: '', error: 'Input is empty' };
  if (!secret.trim()) return { success: false, output: '', error: 'Secret key is empty' };

  try {
    const [ivBase64, ciphertextBase64] = trimmed.split('.');
    if (!ivBase64 || !ciphertextBase64) {
      return { success: false, output: '', error: 'Invalid encrypted payload format' };
    }

    const key = await deriveKey(secret);
    const iv = base64ToBytes(ivBase64);
    const ciphertext = base64ToBytes(ciphertextBase64);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, toArrayBuffer(ciphertext));
    return { success: true, output: bytesToUtf8(new Uint8Array(plaintext as ArrayBuffer)) };
  } catch {
    return { success: false, output: '', error: 'Invalid secret key or payload' };
  }
}
