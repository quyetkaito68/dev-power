import { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, X } from 'lucide-react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { OutputBox } from '../../components/ui/OutputBox';
import { Tabs } from '../../components/ui/Tabs';
import { CopyButton } from '../../components/ui/CopyButton';
import { fileToBase64, base64ToImageSrc, downloadImage, humanFileSize } from './logic';
import type { ImageTab } from './types';

const TABS = [
  { id: 'toBase64', label: 'Image → Base64' },
  { id: 'fromBase64', label: 'Base64 → Image' },
];

export default function ImageBase64Tool() {
  const [tab, setTab] = useState<ImageTab>('toBase64');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // to-base64 state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [clipboardMessage, setClipboardMessage] = useState('');

  // from-base64 state
  const [b64Input, setB64Input] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [imgError, setImgError] = useState('');

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setClipboardMessage('No image found in clipboard.');
      return;
    }
    setImageFile(file);
    setClipboardMessage('');
    const result = await fileToBase64(file);
    if (result.success) {
      setImagePreview(result.output);
      setBase64Output(result.output);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (tab !== 'toBase64') return;

      const items = event.clipboardData?.items;
      if (!items || items.length === 0) {
        setClipboardMessage('No image found in clipboard.');
        return;
      }

      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
      if (!imageItem) {
        setClipboardMessage('No image found in clipboard.');
        return;
      }

      event.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        void processFile(file);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile, tab]);

  const handleB64Convert = () => {
    const res = base64ToImageSrc(b64Input);
    if (res.success) {
      setImageSrc(res.output);
      setImgError('');
    } else {
      setImageSrc('');
      setImgError(res.error ?? 'Invalid base64 image');
    }
  };

  const handleTabChange = (id: string) => {
    setTab(id as ImageTab);
    // If switching to from-base64 and we have a result, pre-fill
    if (id === 'fromBase64' && base64Output) {
      setB64Input(base64Output);
    }
  };

  return (
    <ToolWrapper
      title="Image ↔ Base64"
      description="Convert images to Base64 data URLs or preview images from Base64 strings."
      category="media"
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <Tabs tabs={TABS} active={tab} onChange={handleTabChange} className="w-64" />

        {tab === 'toBase64' ? (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors p-8 ${
                dragging
                  ? 'border-violet-500 bg-violet-500/5'
                  : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'
              }`}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 max-w-full object-contain rounded"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-300">{imageFile?.name}</span>
                    <span className="text-xs text-zinc-500">{humanFileSize(imageFile?.size ?? 0)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview('');
                        setBase64Output('');
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-300">Drop image here or click to browse</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF, WebP supported</p>
                    <p className="text-xs text-zinc-500 mt-1">Drag & Drop, Select File, or Paste (Ctrl + V)</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                    <Upload className="w-3.5 h-3.5" />
                    Choose file
                  </Button>
                </>
              )}
            </div>
            {clipboardMessage && (
              <p className="text-sm text-zinc-400">{clipboardMessage}</p>
            )}

            {/* Base64 output */}
            {base64Output && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Base64 Output</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{humanFileSize(base64Output.length)}</span>
                    <CopyButton text={base64Output} />
                  </div>
                </div>
                <textarea
                  readOnly
                  value={base64Output}
                  rows={5}
                  className="w-full resize-none rounded-md border border-zinc-700/50 bg-zinc-900/50 px-3 py-2.5 text-xs text-zinc-300 font-mono focus:outline-none scrollbar-thin"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            <div className="flex flex-col gap-3">
              <Textarea
                label="Base64 Input"
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                placeholder="Paste Base64 string or data URL here..."
                className="min-h-[200px] lg:min-h-0 lg:h-full"
                spellCheck={false}
              />
              <Button onClick={handleB64Convert}>
                <ImageIcon className="w-3.5 h-3.5" />
                Preview Image
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Image Preview</span>
              {imgError ? (
                <OutputBox label="" value="" error={imgError} />
              ) : imageSrc ? (
                <div className="flex-1 rounded-md border border-zinc-700/50 bg-zinc-900/50 flex flex-col items-center justify-center gap-3 p-4">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-h-60 max-w-full object-contain rounded"
                    onError={() => setImgError('Failed to render image — check if the Base64 is a valid image')}
                  />
                  <Button variant="outline" size="sm" onClick={() => downloadImage(imageSrc)}>
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>
              ) : (
                <div className="flex-1 rounded-md border border-zinc-700/50 bg-zinc-900/50 flex items-center justify-center min-h-[200px]">
                  <p className="text-sm text-zinc-600 italic">Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
