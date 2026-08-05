export type SecretKeyMode = 'encrypt' | 'decrypt';

export interface SecretKeyResult {
  success: boolean;
  output: string;
  error?: string;
}
