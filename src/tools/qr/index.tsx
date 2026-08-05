import { useState, useRef, useCallback, useEffect, DragEvent } from 'react';
import { Download, QrCode, Camera, Upload, X, Copy } from 'lucide-react';
import { ToolWrapper } from '../../components/ToolWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { CopyButton } from '../../components/ui/CopyButton';
import { generateQR, downloadQR, copyQRImageToClipboard, scanQRFromFile, scanQRFromWebcam } from './logic';
import type { QrTab } from './types';

const TABS = [
  { id: 'generate', label: 'Generate' },
  { id: 'scan', label: 'Scan' },
];

export default function QrTool() {
  const [tab, setTab] = useState<QrTab>('generate');

  // Generate state
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [genError, setGenError] = useState('');
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [pasteError, setPasteError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [size] = useState(280);

  // Scan state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [scanError, setScanError] = useState('');
  const [dragging, setDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setQrDataUrl('');
      setGenError('');
      return;
    }
    const res = await generateQR(text, size);
    if (res.success) {
      setQrDataUrl(res.dataUrl);
      setGenError('');
    } else {
      setQrDataUrl('');
      setGenError(res.error ?? 'Failed to generate QR code');
    }
  }, [text, size]);

  const handleCopyImage = useCallback(async () => {
    if (!qrDataUrl) return;
    setCopying(true);
    setCopyError('');
    try {
      await copyQRImageToClipboard(qrDataUrl);
    } catch (error) {
      setCopyError((error as Error).message || 'Unable to copy QR image');
    } finally {
      setCopying(false);
    }
  }, [qrDataUrl]);

  // Auto-generate on text change
  useEffect(() => {
    const t = setTimeout(handleGenerate, 300);
    return () => clearTimeout(t);
  }, [handleGenerate]);

  // Ctrl+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter' && tab === 'generate') {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleGenerate, tab]);

  const stopWebcam = useCallback(() => {
    abortRef.current?.abort();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const startWebcam = async () => {
    setScanResult('');
    setScanError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      abortRef.current = new AbortController();
      const result = await scanQRFromWebcam(videoRef.current!, abortRef.current.signal);
      if (result) setScanResult(result);
      stopWebcam();
    } catch (e) {
      setScanError(`Camera error: ${(e as Error).message}`);
      setScanning(false);
    }
  };

  const createImagePreview = useCallback((file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  }), []);

  const handleScanFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setScanError('Please select an image file');
      setImagePreview('');
      setImageFileName('');
      return;
    }

    setScanResult('');
    setScanError('');
    setPasteError('');

    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFileName(file.name);
    } catch {
      setImagePreview('');
      setImageFileName('');
    }

    const result = await scanQRFromFile(file);
    if (result) setScanResult(result);
    else setScanError('No QR code found in the image');
  }, [createImagePreview]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (tab !== 'scan') return;

      const items = event.clipboardData?.items;
      if (!items || items.length === 0) return;

      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
      if (!imageItem) return;

      event.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        void handleScanFile(file);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleScanFile, tab]);

  useEffect(() => () => stopWebcam(), [stopWebcam]);

  return (
    <ToolWrapper
      title="QR Code"
      description="Generate QR codes from any text or URL, or scan QR codes from images."
      category="generator"
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <Tabs tabs={TABS} active={tab} onChange={(id) => { setTab(id as QrTab); stopWebcam(); }} className="w-52" />

        {tab === 'generate' ? (
          <div className="flex flex-col gap-4">
            <Input
              label="Text or URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or any text..."
            />

            {genError && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                <p className="text-sm text-red-400">{genError}</p>
              </div>
            )}

            {qrDataUrl ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="rounded-xl bg-white p-4 shadow-lg">
                  <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 block" />
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => downloadQR(qrDataUrl)}>
                    <Download className="w-3.5 h-3.5" />
                    Download PNG
                  </Button>
                  <Button variant="outline" onClick={handleCopyImage} disabled={copying}>
                    <Copy className="w-3.5 h-3.5" />
                    {copying ? 'Copying...' : 'Copy PNG'}
                  </Button>
                </div>
                {copyError && (
                  <p className="text-sm text-red-400">{copyError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 rounded-lg border border-dashed border">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-muted mx-auto mb-2" />
                  <p className="text-sm text-placeholder">QR code will appear here</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* File scan */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleScanFile(e.target.files[0])} />
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) void handleScanFile(f);
              }}
              onPaste={(e) => {
                const clipboardItems = Array.from(e.clipboardData?.items ?? []);
                const imageItem = clipboardItems.find((item) => item.type.startsWith('image/'));
                if (imageItem) {
                  e.preventDefault();
                  const file = imageItem.getAsFile();
                  if (file) void handleScanFile(file);
                }
              }}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors p-8 ${
                dragging ? 'border-violet-500 bg-violet-500/5' : 'border hover:border-muted hover:bg-elevated/30'
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="QR preview" className="max-h-40 max-w-full object-contain rounded" />
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-secondary">{imageFileName || 'Image preview'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview('');
                        setImageFileName('');
                        setScanResult('');
                        setScanError('');
                        setPasteError('');
                      }}
                      className="text-faint hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-faint" />
                  <div className="text-center">
                    <p className="text-sm text-secondary">Drop image with QR code here or click to browse</p>
                    <p className="text-xs text-faint mt-1">Paste (Ctrl+V), drag & drop, or browse</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-elevated" />
              <span className="text-xs text-faint">or</span>
              <div className="flex-1 h-px bg-elevated" />
            </div>

            {pasteError && (
              <p className="text-sm text-red-400">{pasteError}</p>
            )}

            {/* Webcam */}
            {scanning ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative rounded-lg overflow-hidden border border">
                  <video ref={videoRef} className="w-full max-w-sm block" playsInline muted />
                  <div className="absolute inset-0 border-2 border-violet-500/50 rounded-lg pointer-events-none" />
                </div>
                <Button variant="danger" onClick={stopWebcam}>
                  <X className="w-3.5 h-3.5" />
                  Stop Camera
                </Button>
                <p className="text-xs text-faint">Point camera at a QR code</p>
              </div>
            ) : (
              <Button variant="outline" onClick={startWebcam} className="self-start">
                <Camera className="w-4 h-4" />
                Use Webcam
              </Button>
            )}

            {/* Scan result */}
            {scanError && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                <p className="text-sm text-red-400">{scanError}</p>
              </div>
            )}
            {scanResult && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">QR Content Detected</span>
                  <CopyButton text={scanResult} />
                </div>
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <p className="text-sm text-emerald-300 font-mono break-all">{scanResult}</p>
                  {scanResult.startsWith('http') && (
                    <a
                      href={scanResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-violet-400 hover:text-violet-300 underline"
                    >
                      Open URL →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
