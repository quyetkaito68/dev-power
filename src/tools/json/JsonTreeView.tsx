import { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronDown, ChevronsDown, ChevronsUp } from 'lucide-react';
import { cn } from '../../core/utils/cn';
import { CopyButton } from '../../components/ui/CopyButton';

interface JsonTreeViewProps {
  data: unknown;
}

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function getCollapsiblePaths(data: unknown, prefix = 'root'): string[] {
  if (data === null || typeof data !== 'object') return [];
  const paths: string[] = [prefix];
  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      paths.push(...getCollapsiblePaths(item, `${prefix}.${i}`));
    });
  } else {
    Object.entries(data).forEach(([key, val]) => {
      paths.push(...getCollapsiblePaths(val, `${prefix}.${key}`));
    });
  }
  return paths;
}

function getPreview(data: unknown): string {
  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    const items = data.slice(0, 3).map(previewSingle).join(', ');
    return data.length > 3 ? `[${items}, …${data.length}]` : `[${items}]`;
  }
  if (isObject(data)) {
    const keys = Object.keys(data);
    if (keys.length === 0) return '{}';
    const items = keys.slice(0, 3).map((k) => `${k}: ${previewSingle(data[k])}`).join(', ');
    return keys.length > 3 ? `{${items}, …${keys.length}}` : `{${items}}`;
  }
  return previewSingle(data);
}

function previewSingle(data: unknown): string {
  if (data === null) return 'null';
  if (typeof data === 'string') return `"${data.length > 20 ? data.slice(0, 20) + '…' : data}"`;
  if (typeof data === 'number' || typeof data === 'boolean') return String(data);
  if (Array.isArray(data)) return `Array(${data.length})`;
  if (isObject(data)) return `Object{${Object.keys(data).length}}`;
  return String(data);
}

interface JsonNodeProps {
  data: unknown;
  path: string;
  label: string | null;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  depth: number;
  isLast: boolean;
}

function JsonNode({ data, path, label, expanded, onToggle, depth, isLast }: JsonNodeProps) {
  const isExpanded = expanded.has(path);

  // --- Primitives ---
  if (data === null || data === undefined) {
    return (
      <Line depth={depth} isLast={isLast}>
        <ToggleSpacer />
        {label !== null && <KeyLabel label={label} />}
        <span className="text-red-400">null</span>
      </Line>
    );
  }

  if (typeof data === 'string') {
    return (
      <Line depth={depth} isLast={isLast}>
        <ToggleSpacer />
        {label !== null && <KeyLabel label={label} />}
        <span className="text-emerald-400 break-all">"{data}"</span>
      </Line>
    );
  }

  if (typeof data === 'number') {
    return (
      <Line depth={depth} isLast={isLast}>
        <ToggleSpacer />
        {label !== null && <KeyLabel label={label} />}
        <span className="text-blue-400">{data}</span>
      </Line>
    );
  }

  if (typeof data === 'boolean') {
    return (
      <Line depth={depth} isLast={isLast}>
        <ToggleSpacer />
        {label !== null && <KeyLabel label={label} />}
        <span className="text-purple-400">{String(data)}</span>
      </Line>
    );
  }

  // --- Object / Array ---
  const isArray = Array.isArray(data);
  const entries: [string, unknown][] = isArray
    ? (data as unknown[]).map((v, i) => [String(i), v])
    : Object.entries(data as Record<string, unknown>);
  const open = isArray ? '[' : '{';
  const close = isArray ? ']' : '}';
  const preview = isExpanded ? null : ` ${getPreview(data)}`;

  return (
    <div style={{ paddingLeft: `${depth * 1.25}rem` }}>
      {/* Toggle line */}
      <div
        className={cn(
          'flex items-center cursor-pointer group/line',
          'hover:bg-white/[0.03] -ml-1 pl-1 pr-1 rounded transition-colors'
        )}
        onClick={() => onToggle(path)}
      >
        <span className="w-4 shrink-0 flex items-center justify-center text-zinc-500 group-hover/line:text-zinc-300 transition-colors">
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
        {label !== null && <KeyLabel label={label} />}
        <span className="text-zinc-500">{open}</span>
        {preview !== null && (
          <>
            <span className="text-zinc-500 truncate">{preview}</span>
            <span className="text-zinc-500">{close}</span>
            {!isLast && <span className="text-zinc-600">,</span>}
          </>
        )}
      </div>

      {/* Children */}
      {isExpanded && (
        <>
          {entries.map(([key, val], i) => (
            <JsonNode
              key={`${path}.${key}`}
              data={val}
              path={`${path}.${key}`}
              label={key}
              expanded={expanded}
              onToggle={onToggle}
              depth={depth + 1}
              isLast={i === entries.length - 1}
            />
          ))}
          <Line depth={depth} isLast={isLast}>
            <ToggleSpacer />
            <span className="text-zinc-500">{close}</span>
          </Line>
        </>
      )}
    </div>
  );
}

function Line({ depth, isLast, children }: { depth: number; isLast: boolean; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center"
      style={{ paddingLeft: `${depth * 1.25}rem` }}
    >
      {children}
      {!isLast && <span className="text-zinc-600 ml-px">,</span>}
    </div>
  );
}

function ToggleSpacer() {
  return <span className="w-4 shrink-0" />;
}

function KeyLabel({ label }: { label: string }) {
  const isIndex = /^\d+$/.test(label);
  return (
    <span className={isIndex ? 'text-zinc-500' : 'text-zinc-400'}>
      {isIndex ? `${label}: ` : `"${label}": `}
    </span>
  );
}

export function JsonTreeView({ data }: JsonTreeViewProps) {
  const allPaths = useMemo(() => getCollapsiblePaths(data), [data]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allPaths));

  // Sync when data changes (new parse)
  useEffect(() => {
    setExpanded(new Set(allPaths));
  }, [allPaths]);

  const onToggle = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setExpanded(new Set(allPaths)), [allPaths]);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Viewer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-secondary transition-colors px-2 py-1 rounded hover:bg-muted/50"
            title="Expand all"
          >
            <ChevronsDown className="w-3.5 h-3.5" />
            Expand
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-secondary transition-colors px-2 py-1 rounded hover:bg-muted/50"
            title="Collapse all"
          >
            <ChevronsUp className="w-3.5 h-3.5" />
            Collapse
          </button>
          <CopyButton text={JSON.stringify(data, null, 2)} size="sm" />
        </div>
      </div>
      <div className="flex-1 min-h-0 rounded-md border border/50 bg-surface/50 overflow-auto p-3 font-mono text-sm">
        <JsonNode
          data={data}
          path="root"
          label={null}
          expanded={expanded}
          onToggle={onToggle}
          depth={0}
          isLast={true}
        />
      </div>
    </div>
  );
}
