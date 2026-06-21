export interface Base64Result {
  success: boolean;
  output: string;
  error?: string;
}

export type Base64Mode = 'encode' | 'decode';
