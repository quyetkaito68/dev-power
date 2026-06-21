export interface JsonResult {
  success: boolean;
  output: string;
  error?: string;
}

export type JsonAction = 'format' | 'minify' | 'validate';
