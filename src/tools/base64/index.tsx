import { useState, useCallback, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { OutputBox } from '../../components/ui/OutputBox';
import { Tabs } from '../../components/ui/Tabs';
import { encodeBase64, decodeBase64 } from './logic';
import type { Base64Mode, Base64Result } from './types';

const TABS = [
  { id: 'encode', label: 'Encode' },
  { id: 'decode', label: 'Decode' },
];

export default function Base64Tool() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Base64Result | null>(null);

  const run = useCallback(() => {
    if (mode === 'encode') setResult(encodeBase64(input));
    else setResult(decodeBase64(input));
  }, [mode, input]);

  // Ctrl+Enter to convert
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [run]);

  // Auto-run on input change for small inputs
  useEffect(() => {
    if (input.length > 0 && input.length < 10000) run();
    else if (!input) setResult(null);
  }, [input, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleModeChange = (id: string) => {
    setMode(id as Base64Mode);
    // Swap input/output
    if (result?.success && result.output) {
      setInput(result.output);
      setResult(null);
    }
  };

  return (
    <ToolWrapper
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 to text. Full UTF-8 support."
      category="encoder"
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <div className="flex items-center gap-4">
          <Tabs
            tabs={TABS}
            active={mode}
            onChange={handleModeChange}
            className="w-48"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (result?.success && result.output) {
                setInput(result.output);
                setResult(null);
              }
            }}
            title="Swap input and output"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Swap
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          <Textarea
            label={mode === 'encode' ? 'Plain text' : 'Base64 string'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Type or paste text to encode...'
                : 'Paste Base64 string to decode...'
            }
            className="min-h-[240px] lg:min-h-0 lg:h-full"
            spellCheck={false}
          />
          <OutputBox
            label={mode === 'encode' ? 'Base64 output' : 'Decoded text'}
            value={result?.output ?? ''}
            error={result?.success === false ? result.error : undefined}
            success={result?.success}
            rows={10}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={run}>Convert</Button>
          <button
            onClick={() => { setInput(''); setResult(null); }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
}
