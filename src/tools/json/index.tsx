import { useState, useCallback, useEffect } from 'react';
import { Play, Minimize2, CheckCircle } from 'lucide-react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { OutputBox } from '../../components/ui/OutputBox';
import { formatJson, minifyJson, validateJson } from './logic';
import type { JsonResult } from './types';

const SAMPLE = `{
  "name": "DevPower",
  "version": "1.0.0",
  "tools": ["json", "base64", "qr", "random"],
  "active": true,
  "config": {
    "theme": "dark",
    "indent": 2
  }
}`;

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [result, setResult] = useState<JsonResult | null>(null);

  const run = useCallback(
    (action: 'format' | 'minify' | 'validate') => {
      if (action === 'format') setResult(formatJson(input, indent));
      else if (action === 'minify') setResult(minifyJson(input));
      else setResult(validateJson(input));
    },
    [input, indent]
  );

  // Ctrl+Enter to format
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        run('format');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [run]);

  return (
    <ToolWrapper
      title="JSON Formatter"
      description="Format, minify, and validate JSON. Press Ctrl+Enter to format."
      category="formatter"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Input */}
        <div className="flex flex-col gap-3 min-h-0">
          <Textarea
            label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste JSON here...\n\nCtrl+Enter to format`}
            className="min-h-[280px] lg:min-h-0 lg:h-full"
            spellCheck={false}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => run('format')}>
              <Play className="w-3.5 h-3.5" />
              Format
            </Button>
            <Button variant="outline" onClick={() => run('minify')}>
              <Minimize2 className="w-3.5 h-3.5" />
              Minify
            </Button>
            <Button variant="outline" onClick={() => run('validate')}>
              <CheckCircle className="w-3.5 h-3.5" />
              Validate
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-zinc-500">Indent:</span>
              {[2, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setIndent(n)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    indent === n
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setInput(SAMPLE)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Load sample
            </button>
          </div>
        </div>

        {/* Output */}
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
