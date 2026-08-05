import { useCallback, useEffect, useState } from 'react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { OutputBox } from '../../components/ui/OutputBox';
import { Tabs } from '../../components/ui/Tabs';
import { decryptWithSecretKey, encryptWithSecretKey } from './logic';
import type { SecretKeyMode, SecretKeyResult } from './types';

const TABS = [
  { id: 'encrypt', label: 'Encrypt' },
  { id: 'decrypt', label: 'Decrypt' },
];

export default function SecretKeyTool() {
  const [mode, setMode] = useState<SecretKeyMode>('encrypt');
  const [input, setInput] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [result, setResult] = useState<SecretKeyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(async () => {
    setIsLoading(true);
    if (mode === 'encrypt') {
      setResult(await encryptWithSecretKey(input, secretKey));
    } else {
      setResult(await decryptWithSecretKey(input, secretKey));
    }
    setIsLoading(false);
  }, [input, mode, secretKey]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        void run();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [run]);

  useEffect(() => {
    if (!input && !secretKey) {
      setResult(null);
    }
  }, [input, secretKey]);

  return (
    <ToolWrapper
      title="Secret Key Encryptor"
      description="Encrypt text with a secret key so only someone with the same key can decrypt it. Runs entirely in your browser."
      category="encoder"
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <Tabs tabs={TABS} active={mode} onChange={(id) => setMode(id as SecretKeyMode)} className="w-48" />

        <Input
          label="Secret key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter a strong secret key..."
          spellCheck={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          <Textarea
            label={mode === 'encrypt' ? 'Plain text' : 'Encrypted payload'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Type or paste text to encrypt...' : 'Paste encrypted payload to decrypt...'}
            className="min-h-[240px] lg:min-h-0 lg:h-full"
            spellCheck={false}
          />
          <OutputBox
            label={mode === 'encrypt' ? 'Encrypted output' : 'Decrypted text'}
            value={result?.output ?? ''}
            error={result?.success === false ? result.error : undefined}
            success={result?.success}
            rows={10}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => void run()} disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </Button>
          <button
            onClick={() => {
              setInput('');
              setSecretKey('');
              setResult(null);
            }}
            className="text-xs text-text-muted hover:text-secondary transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
}
