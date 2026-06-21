export type QrTab = 'generate' | 'scan';

export interface QrGenerateResult {
  success: boolean;
  dataUrl: string;
  error?: string;
}
