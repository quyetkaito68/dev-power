import type { JsonResult } from './types';

export function formatJson(input: string, indent = 2): JsonResult {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, output: '', error: 'Input is empty' };
  try {
    const parsed = JSON.parse(trimmed);
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { success: false, output: '', error: formatJsonError(e as SyntaxError, trimmed) };
  }
}

export function minifyJson(input: string): JsonResult {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, output: '', error: 'Input is empty' };
  try {
    const parsed = JSON.parse(trimmed);
    return { success: true, output: JSON.stringify(parsed) };
  } catch (e) {
    return { success: false, output: '', error: formatJsonError(e as SyntaxError, trimmed) };
  }
}

export function validateJson(input: string): JsonResult {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, output: '', error: 'Input is empty' };
  try {
    const parsed = JSON.parse(trimmed);
    const type = Array.isArray(parsed) ? 'array' : typeof parsed;
    return { success: true, output: `Valid JSON — root type: ${type}` };
  } catch (e) {
    return { success: false, output: '', error: formatJsonError(e as SyntaxError, trimmed) };
  }
}

function formatJsonError(e: SyntaxError, input: string): string {
  const msg = e.message;
  // Extract line/column from V8-style error messages
  const posMatch = msg.match(/position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const lines = input.slice(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    return `${msg} (line ${line}, col ${col})`;
  }
  return msg;
}
