import type { RandomColor, RandomTextCharset, PhoneFormat } from './types';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ALPHANUM = ALPHA + '0123456789';
const ALL_CHARS = ALPHANUM + '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function randomText(length: number, charset: RandomTextCharset = 'alphanumeric'): string {
  const pool = charset === 'alpha' ? ALPHA : charset === 'alphanumeric' ? ALPHANUM : ALL_CHARS;
  return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
}

const FIRST_NAMES = ['alex', 'sam', 'jordan', 'taylor', 'morgan', 'casey', 'riley', 'quinn', 'drew', 'reese', 'avery', 'blake'];
const LAST_NAMES = ['smith', 'jones', 'taylor', 'brown', 'davis', 'wilson', 'miller', 'moore', 'pham', 'nguyen', 'tran', 'le'];
const EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'icloud.com', 'dev.io'];

export function randomEmail(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const num = Math.floor(Math.random() * 9999);
  const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];
  const sep = Math.random() > 0.5 ? '.' : '_';
  return `${first}${sep}${last}${num}@${domain}`;
}

const VN_PREFIXES = ['032','033','034','035','036','037','038','039','096','097','098','086','083','084','085','070','079','077','076','091','094','088','058','089'];

export function randomPhone(format: PhoneFormat = 'vn'): string {
  const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (format) {
    case 'vn': {
      const prefix = VN_PREFIXES[Math.floor(Math.random() * VN_PREFIXES.length)];
      return `${prefix} ${digits(3)} ${digits(4)}`;
    }
    case 'us':
      return `(${rand(200, 999)}) ${rand(200, 999)}-${digits(4)}`;
    case 'uk':
      return `+44 7${rand(100, 999)} ${digits(3)} ${digits(3)}`;
  }
}

export function randomUUID(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function randomColor(): RandomColor {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  const rgb = `rgb(${r}, ${g}, ${b})`;

  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }

  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  return { hex, rgb, hsl };
}

export function randomNumber(min: number, max: number, decimals = 0): string {
  const value = Math.random() * (max - min) + min;
  return value.toFixed(decimals);
}

export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}
