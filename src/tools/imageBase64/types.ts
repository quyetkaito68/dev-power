export type ImageTab = 'toBase64' | 'fromBase64';

export interface ImageConvertResult {
  success: boolean;
  output: string;
  mimeType?: string;
  error?: string;
}
