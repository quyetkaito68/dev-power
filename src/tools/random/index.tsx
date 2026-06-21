import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { CopyButton } from '../../components/ui/CopyButton';
import { randomText, randomEmail, randomPhone, randomUUID, randomColor } from './logic';
import type { RandomTextCharset, PhoneFormat } from './types';

interface ResultRowProps {
  label: string;
  value: string;
  accent?: string;
  children?: React.ReactNode;
}

function ResultRow({ label, value, accent, children }: ResultRowProps) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-md bg-zinc-800/40 border border-zinc-700/30">
      {accent && (
        <div
          className="w-6 h-6 rounded-md shrink-0 border border-zinc-700/50"
          style={{ backgroundColor: accent }}
        />
      )}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-zinc-500 block mb-0.5">{label}</span>
        <span className="text-sm text-zinc-200 font-mono break-all">{value}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {children}
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function RandomTool() {
  const [textLength, setTextLength] = useState(32);
  const [textCharset, setTextCharset] = useState<RandomTextCharset>('alphanumeric');
  const [phoneFormat, setPhoneFormat] = useState<PhoneFormat>('vn');

  const [textResult, setTextResult] = useState('');
  const [emailResult, setEmailResult] = useState('');
  const [phoneResult, setPhoneResult] = useState('');
  const [uuidResult, setUuidResult] = useState('');
  const [colorResult, setColorResult] = useState<{ hex: string; rgb: string; hsl: string } | null>(null);

  const [count, setCount] = useState(1);

  const multiGenerate = (fn: () => string, n: number) =>
    Array.from({ length: n }, fn).join('\n');

  return (
    <ToolWrapper
      title="Random Data Generator"
      description="Generate random strings, emails, phone numbers, UUIDs, and colors."
      category="generator"
    >
      <div className="flex flex-col gap-6">
        {/* Text */}
        <Section title="Random Text">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Length</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={4}
                  max={256}
                  value={textLength}
                  onChange={(e) => setTextLength(Number(e.target.value))}
                  className="w-32 accent-violet-500"
                />
                <span className="text-sm text-zinc-300 w-8 text-right tabular-nums">{textLength}</span>
              </div>
            </div>
            <Select
              label="Charset"
              value={textCharset}
              onChange={(e) => setTextCharset(e.target.value as RandomTextCharset)}
              options={[
                { value: 'alphanumeric', label: 'Alphanumeric' },
                { value: 'alpha', label: 'Alpha only' },
                { value: 'all', label: 'All characters' },
              ]}
            />
            <CountSelect value={count} onChange={setCount} />
            <Button onClick={() => setTextResult(multiGenerate(() => randomText(textLength, textCharset), count))}>
              <RefreshCw className="w-3.5 h-3.5" />
              Generate
            </Button>
          </div>
          {textResult && <ResultRow label="Random text" value={textResult} />}
        </Section>

        {/* Email */}
        <Section title="Random Email">
          <div className="flex flex-wrap items-end gap-3">
            <CountSelect value={count} onChange={setCount} />
            <Button onClick={() => setEmailResult(multiGenerate(randomEmail, count))}>
              <RefreshCw className="w-3.5 h-3.5" />
              Generate
            </Button>
          </div>
          {emailResult && <ResultRow label="Random email" value={emailResult} />}
        </Section>

        {/* Phone */}
        <Section title="Random Phone">
          <div className="flex flex-wrap items-end gap-3">
            <Select
              label="Format"
              value={phoneFormat}
              onChange={(e) => setPhoneFormat(e.target.value as PhoneFormat)}
              options={[
                { value: 'vn', label: 'Vietnam (+84)' },
                { value: 'us', label: 'USA (+1)' },
                { value: 'uk', label: 'UK (+44)' },
              ]}
            />
            <CountSelect value={count} onChange={setCount} />
            <Button onClick={() => setPhoneResult(multiGenerate(() => randomPhone(phoneFormat), count))}>
              <RefreshCw className="w-3.5 h-3.5" />
              Generate
            </Button>
          </div>
          {phoneResult && <ResultRow label="Random phone" value={phoneResult} />}
        </Section>

        {/* UUID */}
        <Section title="UUID v4">
          <div className="flex flex-wrap items-end gap-3">
            <CountSelect value={count} onChange={setCount} />
            <Button onClick={() => setUuidResult(multiGenerate(randomUUID, count))}>
              <RefreshCw className="w-3.5 h-3.5" />
              Generate
            </Button>
          </div>
          {uuidResult && <ResultRow label="UUID" value={uuidResult} />}
        </Section>

        {/* Color */}
        <Section title="Random Color">
          <Button onClick={() => setColorResult(randomColor())}>
            <RefreshCw className="w-3.5 h-3.5" />
            Generate
          </Button>
          {colorResult && (
            <div className="flex flex-col gap-2">
              <ResultRow label="HEX" value={colorResult.hex} accent={colorResult.hex} />
              <ResultRow label="RGB" value={colorResult.rgb} />
              <ResultRow label="HSL" value={colorResult.hsl} />
            </div>
          )}
        </Section>
      </div>
    </ToolWrapper>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-zinc-700/40 bg-zinc-900/30">
      <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      {children}
    </div>
  );
}

function CountSelect({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <Select
      label="Count"
      value={String(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      options={[
        { value: '1', label: '1' },
        { value: '5', label: '5' },
        { value: '10', label: '10' },
        { value: '20', label: '20' },
      ]}
    />
  );
}
