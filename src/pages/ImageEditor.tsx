import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Image, Upload, Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, 
  Sun, Contrast, Droplets, Palette, Crop, Type, Square, Circle, Triangle,
  Undo2, Redo2, ZoomIn, ZoomOut, Move, Eraser, Paintbrush, Wand2, 
  Sparkles, Layers, Eye, EyeOff, Copy, Trash2, Save, Share2, ImagePlus,
  SlidersHorizontal, Focus, Maximize2, Grid3X3, Pipette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import FloatingLetters from '@/components/FloatingLetters';
import EditorHeader from '@/components/EditorHeader';

interface HistoryState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
  sepia: number;
  grayscale: number;
  invert: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  opacity: number;
  sharpen: number;
}

const defaultState: HistoryState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hue: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  opacity: 100,
  sharpen: 0,
};

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<HistoryState>(defaultState);
  const [history, setHistory] = useState<HistoryState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'effects' | 'tools'>('adjust');
  const [zoom, setZoom] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#00d4ff');
  const [showGrid, setShowGrid] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('edited-image');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateState = useCallback((updates: Partial<HistoryState>) => {
    const newState = { ...currentState, ...updates };
    setCurrentState(newState);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentState, history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentState(history[historyIndex - 1]);
      toast.success('Undone!');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentState(history[historyIndex + 1]);
      toast.success('Redone!');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setCurrentState(defaultState);
        setHistory([defaultState]);
        setHistoryIndex(0);
        toast.success('Image loaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setCurrentState(defaultState);
        setHistory([defaultState]);
        setHistoryIndex(0);
        toast.success('Image loaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setCurrentState(defaultState);
    setHistory([defaultState]);
    setHistoryIndex(0);
    setZoom(100);
    toast.success('All edits reset!');
  };

  const getFilterString = () => {
    return `
      brightness(${currentState.brightness}%)
      contrast(${currentState.contrast}%)
      saturate(${currentState.saturation}%)
      blur(${currentState.blur}px)
      hue-rotate(${currentState.hue}deg)
      sepia(${currentState.sepia}%)
      grayscale(${currentState.grayscale}%)
      invert(${currentState.invert}%)
      opacity(${currentState.opacity}%)
    `.trim();
  };

  const getTransformString = () => {
    return `
      rotate(${currentState.rotation}deg)
      scaleX(${currentState.flipH ? -1 : 1})
      scaleY(${currentState.flipV ? -1 : 1})
      scale(${zoom / 100})
    `.trim();
  };

  const downloadImage = (format: 'png' | 'jpg' | 'webp') => {
    if (!image) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = getFilterString();
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((currentState.rotation * Math.PI) / 180);
        ctx.scale(currentState.flipH ? -1 : 1, currentState.flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
        const link = document.createElement('a');
        link.download = `${originalFileName}-edited.${format}`;
        link.href = canvas.toDataURL(mimeType, 0.95);
        link.click();
        toast.success(`Downloaded as ${format.toUpperCase()}!`);
      }
    };
    img.src = image;
  };

  const copyToClipboard = async () => {
    if (!image) return;
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.filter = getFilterString();
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              toast.success('Image copied to clipboard!');
            }
          });
        }
      };
      img.src = image;
    } catch {
      toast.error('Failed to copy image');
    }
  };

  const presetFilters = [
    { name: 'Original', brightness: 100, contrast: 100, saturation: 100, sepia: 0, grayscale: 0, hue: 0 },
    { name: 'Vivid', brightness: 110, contrast: 120, saturation: 140, sepia: 0, grayscale: 0, hue: 0 },
    { name: 'Warm', brightness: 105, contrast: 105, saturation: 110, sepia: 20, grayscale: 0, hue: 10 },
    { name: 'Cool', brightness: 100, contrast: 110, saturation: 90, sepia: 0, grayscale: 0, hue: 200 },
    { name: 'Vintage', brightness: 110, contrast: 85, saturation: 70, sepia: 40, grayscale: 0, hue: 0 },
    { name: 'B&W', brightness: 105, contrast: 120, saturation: 0, sepia: 0, grayscale: 100, hue: 0 },
    { name: 'Dramatic', brightness: 95, contrast: 150, saturation: 80, sepia: 0, grayscale: 0, hue: 0 },
    { name: 'Fade', brightness: 115, contrast: 80, saturation: 80, sepia: 10, grayscale: 0, hue: 0 },
    { name: 'Sunset', brightness: 105, contrast: 110, saturation: 130, sepia: 15, grayscale: 0, hue: 350 },
    { name: 'Night', brightness: 80, contrast: 130, saturation: 70, sepia: 0, grayscale: 0, hue: 230 },
    { name: 'Pop', brightness: 110, contrast: 130, saturation: 150, sepia: 0, grayscale: 0, hue: 0 },
    { name: 'Matte', brightness: 110, contrast: 90, saturation: 85, sepia: 5, grayscale: 0, hue: 0 },
  ];

  const applyPreset = (preset: typeof presetFilters[0]) => {
    updateState({
      brightness: preset.brightness,
      contrast: preset.contrast,
      saturation: preset.saturation,
      sepia: preset.sepia,
      grayscale: preset.grayscale,
      hue: preset.hue,
    });
    toast.success(`${preset.name} filter applied!`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLetters />
      <EditorHeader 
        title="Image Editor" 
        subtitle="Professional editing tools"
        icon={<Image className="w-5 h-5 text-primary" />}
      />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="max-w-3xl mx-auto mt-8 sm:mt-16 glass-card p-8 sm:p-16 rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ImagePlus className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 gradient-text">Upload Your Image</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-muted-foreground/60">
                Supports PNG, JPG, GIF, WebP, SVG
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar */}
            <div className="xl:col-span-1 order-2 xl:order-1">
              <div className="editor-sidebar rounded-2xl">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-muted/30 rounded-xl mb-4 overflow-x-auto">
                  {(['adjust', 'filters', 'effects', 'tools'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === 'adjust' && (
                  <div className="space-y-4 sm:space-y-5">
                    {[
                      { label: 'Brightness', icon: Sun, value: currentState.brightness, key: 'brightness', min: 0, max: 200 },
                      { label: 'Contrast', icon: Contrast, value: currentState.contrast, key: 'contrast', min: 0, max: 200 },
                      { label: 'Saturation', icon: Droplets, value: currentState.saturation, key: 'saturation', min: 0, max: 200 },
                      { label: 'Hue Rotate', icon: Palette, value: currentState.hue, key: 'hue', min: 0, max: 360 },
                      { label: 'Opacity', icon: Eye, value: currentState.opacity, key: 'opacity', min: 0, max: 100 },
                      { label: 'Blur', icon: Focus, value: currentState.blur, key: 'blur', min: 0, max: 20 },
                    ].map(({ label, icon: Icon, value, key, min, max }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {value}{key === 'hue' ? '°' : key === 'blur' ? 'px' : '%'}
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([v]) => updateState({ [key]: v } as any)}
                          min={min}
                          max={max}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'filters' && (
                  <div className="grid grid-cols-3 gap-2">
                    {presetFilters.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-2 rounded-xl bg-muted/30 hover:bg-primary/20 transition-all text-center group"
                      >
                        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 mb-1 group-hover:scale-105 transition-transform" 
                          style={{
                            filter: `brightness(${preset.brightness}%) contrast(${preset.contrast}%) saturate(${preset.saturation}%) sepia(${preset.sepia}%) grayscale(${preset.grayscale}%)`
                          }}
                        />
                        <span className="text-xs">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'effects' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Sepia', value: currentState.sepia, key: 'sepia' },
                      { label: 'Grayscale', value: currentState.grayscale, key: 'grayscale' },
                      { label: 'Invert', value: currentState.invert, key: 'invert' },
                    ].map(({ label, value, key }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {value}%
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([v]) => updateState({ [key]: v } as any)}
                          min={0}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Quick Effects</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Vignette', icon: Circle },
                          { name: 'Grain', icon: Grid3X3 },
                          { name: 'Glow', icon: Sparkles },
                          { name: 'Sharpen', icon: Wand2 },
                        ].map(({ name, icon: Icon }) => (
                          <button
                            key={name}
                            onClick={() => toast.info(`${name} effect coming soon!`)}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-sm"
                          >
                            <Icon className="w-4 h-4" />
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Transform</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="glass" size="sm" onClick={() => updateState({ rotation: currentState.rotation - 90 })}>
                          <RotateCcw className="w-4 h-4 mr-1" /> Left
                        </Button>
                        <Button variant="glass" size="sm" onClick={() => updateState({ rotation: currentState.rotation + 90 })}>
                          <RotateCw className="w-4 h-4 mr-1" /> Right
                        </Button>
                        <Button variant="glass" size="sm" onClick={() => updateState({ flipH: !currentState.flipH })}>
                          <FlipHorizontal className="w-4 h-4 mr-1" /> Flip H
                        </Button>
                        <Button variant="glass" size="sm" onClick={() => updateState({ flipV: !currentState.flipV })}>
                          <FlipVertical className="w-4 h-4 mr-1" /> Flip V
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Zoom</h4>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="flex-1 text-center text-sm">{zoom}%</span>
                        <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Color Picker</h4>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-12 h-12"
                        />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Selected</div>
                          <div className="text-sm font-mono">{selectedColor}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toast.info('Eyedropper coming soon!')}>
                          <Pipette className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Drawing Tools</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { icon: Paintbrush, name: 'Brush' },
                          { icon: Eraser, name: 'Eraser' },
                          { icon: Type, name: 'Text' },
                          { icon: Square, name: 'Shape' },
                        ].map(({ icon: Icon, name }) => (
                          <button
                            key={name}
                            onClick={() => toast.info(`${name} tool coming soon!`)}
                            className="p-3 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all"
                            title={name}
                          >
                            <Icon className="w-5 h-5 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Area */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              {/* Toolbar */}
              <div className="editor-toolbar mb-4 flex flex-wrap justify-between">
                <div className="flex flex-wrap items-center gap-1">
                  <button onClick={undo} disabled={historyIndex <= 0} className="editor-toolbar-btn disabled:opacity-50" title="Undo">
                    <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button onClick={redo} disabled={historyIndex >= history.length - 1} className="editor-toolbar-btn disabled:opacity-50" title="Redo">
                    <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="w-px h-6 bg-border/50 mx-1" />
                  <button onClick={() => fileInputRef.current?.click()} className="editor-toolbar-btn" title="Upload New">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button onClick={resetAll} className="editor-toolbar-btn" title="Reset All">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button onClick={() => setShowGrid(!showGrid)} className={`editor-toolbar-btn ${showGrid ? 'editor-toolbar-btn-active' : ''}`} title="Toggle Grid">
                    <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={copyToClipboard} className="editor-toolbar-btn" title="Copy to Clipboard">
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="w-px h-6 bg-border/50 mx-1" />
                  <Button variant="glass" size="sm" onClick={() => downloadImage('png')} className="text-xs sm:text-sm">
                    <Download className="w-4 h-4 mr-1" /> PNG
                  </Button>
                  <Button variant="glass" size="sm" onClick={() => downloadImage('jpg')} className="text-xs sm:text-sm">
                    JPG
                  </Button>
                  <Button variant="glow" size="sm" onClick={() => downloadImage('webp')} className="text-xs sm:text-sm">
                    WebP
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              <div className="editor-canvas rounded-2xl overflow-hidden">
                <div className="relative w-full min-h-[300px] sm:min-h-[500px] flex items-center justify-center bg-muted/20 rounded-xl overflow-hidden">
                  {showGrid && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-primary/20" />
                      ))}
                    </div>
                  )}
                  <img
                    src={image}
                    alt="Editing"
                    className="max-w-full max-h-[60vh] object-contain transition-all duration-200"
                    style={{
                      filter: getFilterString(),
                      transform: getTransformString(),
                    }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>History: {historyIndex + 1}/{history.length}</span>
                  <span>Zoom: {zoom}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary">AI-Enhanced</span>
                  <span className="px-2 py-1 rounded bg-secondary/20 text-secondary">No Watermark</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageEditor;
