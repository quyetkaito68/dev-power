import { useState, useCallback, useEffect, useMemo } from 'react';
import { Play, X, ArrowUpDown } from 'lucide-react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { OutputBox } from '../../components/ui/OutputBox';
import { Select } from '../../components/ui/Select';
import { transformText, type TextTransform, TRANSFORM_GROUPS } from './logic';
import type { TextFormatterResult } from './types';

export default function TextFormatterTool() {
  const [input, setInput] = useState('');
  const [selectedTransform, setSelectedTransform] = useState<TextTransform>('lowercase');
  const [result, setResult] = useState<TextFormatterResult | null>(null);

  const run = useCallback(() => {
    if (!input.trim()) {
      setResult({ success: false, output: '', error: 'Input is empty' });
      return;
    }
    setResult(transformText(input, selectedTransform));
  }, [input, selectedTransform]);

  // Auto-run on input change for better UX
  useEffect(() => {
    const timer = setTimeout(run, 150);
    return () => clearTimeout(timer);
  }, [input, selectedTransform, run]);

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const handleSwap = () => {
    if (result?.output) {
      setInput(result.output);
    }
  };

  const handleLoadSample = () => {
    const sample = `Hello World
This is a TEST
  multiple   spaces
Tiếng Việt Có Dấu
café naïve résumé

line 3
line 1
line 2
line 1`;
    setInput(sample);
  };

  const transformOptions = useMemo(
    () =>
      TRANSFORM_GROUPS.flatMap((group) =>
        group.transforms.map((t) => ({
          value: t.id,
          label: `${t.label} (${group.label})`,
        }))
      ),
    []
  );

  return (
    <ToolWrapper
      title="Text Formatter"
      description="Transform text into different naming conventions and formats"
      category="text"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Input Panel */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex flex-col gap-2">
            <Textarea
              label="Input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text here...&#10;&#10;Transformations apply automatically"
              className="min-h-[360px] md:min-h-[440px] lg:min-h-[520px] lg:h-full"
              spellCheck={false}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={selectedTransform}
                onChange={(e) => setSelectedTransform(e.target.value as TextTransform)}
                options={transformOptions}
                className="flex-1 min-w-[200px]"
              />
              <Button onClick={run}>
                <Play className="w-3.5 h-3.5" />
                Transform
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <X className="w-3.5 h-3.5" />
                Clear
              </Button>
              <Button variant="outline" onClick={handleSwap} disabled={!result?.output}>
                <ArrowUpDown className="w-3.5 h-3.5" />
                Swap
              </Button>
              <button
                onClick={handleLoadSample}
                className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Load sample
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <OutputBox
          label="Output"
          value={result?.output ?? ''}
          error={result?.success === false ? result.error : undefined}
          success={result?.success}
          rows={12}
        />
      </div>
    </ToolWrapper>
  );
}