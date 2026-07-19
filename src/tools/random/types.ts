export type RandomTextCharset = 'alpha' | 'alphanumeric' | 'all';
export type PhoneFormat = 'vn' | 'us' | 'uk';
export type ResultFormat = 'newline' | 'space' | 'semicolon' | 'list';

export interface RandomColor {
  hex: string;
  rgb: string;
  hsl: string;
}
