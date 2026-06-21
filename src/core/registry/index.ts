import { lazy } from 'react';
import { Braces, ArrowLeftRight, Image, QrCode, Shuffle } from 'lucide-react';
import type { Tool } from '../types';

const JsonTool = lazy(() => import('../../tools/json'));
const Base64Tool = lazy(() => import('../../tools/base64'));
const ImageBase64Tool = lazy(() => import('../../tools/imageBase64'));
const QrTool = lazy(() => import('../../tools/qr'));
const RandomTool = lazy(() => import('../../tools/random'));

export const tools: Tool[] = [
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Format, minify, and validate JSON with error highlighting',
    category: 'formatter',
    icon: Braces,
    component: JsonTool,
    keywords: ['json', 'format', 'prettify', 'minify', 'validate', 'parse', 'lint'],
  },
  {
    id: 'base64',
    name: 'Base64',
    description: 'Encode text to Base64 or decode Base64 to text with UTF-8 support',
    category: 'encoder',
    icon: ArrowLeftRight,
    component: Base64Tool,
    keywords: ['base64', 'encode', 'decode', 'text', 'utf8', 'binary'],
  },
  {
    id: 'image-base64',
    name: 'Image ↔ Base64',
    description: 'Convert images to Base64 data URLs or preview images from Base64',
    category: 'media',
    icon: Image,
    component: ImageBase64Tool,
    keywords: ['image', 'base64', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'data url', 'convert'],
  },
  {
    id: 'qr',
    name: 'QR Code',
    description: 'Generate QR codes from text or URLs and scan QR codes from images',
    category: 'generator',
    icon: QrCode,
    component: QrTool,
    keywords: ['qr', 'qrcode', 'barcode', 'scan', 'generate', 'url', 'link'],
  },
  {
    id: 'random',
    name: 'Random Generator',
    description: 'Generate random text, emails, phone numbers, UUIDs, and colors',
    category: 'generator',
    icon: Shuffle,
    component: RandomTool,
    keywords: ['random', 'generate', 'uuid', 'email', 'phone', 'color', 'string', 'text', 'fake', 'mock'],
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function searchTools(query: string): Tool[] {
  if (!query.trim()) return tools;
  const q = query.toLowerCase();
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  );
}

export function groupByCategory(list: Tool[]) {
  const map = new Map<string, Tool[]>();
  list.forEach((t) => {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  });
  return map;
}
