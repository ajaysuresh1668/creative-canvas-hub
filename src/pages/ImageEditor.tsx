import React, { useState, useRef, useCallback } from 'react';
import { 
  Image, Upload, Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, 
  Sun, Contrast, Droplets, Palette, Type, Eye, Focus, ImagePlus, Smile,
  Undo2, Redo2, ZoomIn, ZoomOut,
  Sparkles, Copy, Trash2,
  SlidersHorizontal, Grid3X3, Frame,
  ImageMinus, Sticker
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import BackgroundEffects from '@/components/BackgroundEffects';
import EditorHeader from '@/components/EditorHeader';
import { filterPresets, filterCategories, categoryDisplayNames, type FilterPreset } from '@/lib/filterPresets';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  isMarquee: boolean;
}

interface StickerOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

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
  // Face toning
  smoothness: number;
  glow: number;
  warmth: number;
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
  smoothness: 0,
  glow: 0,
  warmth: 0,
};

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<HistoryState>(defaultState);
  const [history, setHistory] = useState<HistoryState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'effects' | 'tools' | 'overlays' | 'face'>('adjust');
  const [zoom, setZoom] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#00d4ff');
  const [showGrid, setShowGrid] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('edited-image');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  
  // Text overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [newText, setNewText] = useState('');
  const [textFontSize, setTextFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textFontFamily, setTextFontFamily] = useState('Arial');
  const [textFontWeight, setTextFontWeight] = useState('normal');
  const [textFontStyle, setTextFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [isMarquee, setIsMarquee] = useState(false);
  
  // Stickers
  const [stickers, setStickers] = useState<StickerOverlay[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
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

  // Simulate background removal
  const removeBackground = async () => {
    if (!image) return;
    setIsRemovingBg(true);
    toast.info('Removing background...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, we'll apply a transparency effect
    updateState({ grayscale: 0 });
    setIsRemovingBg(false);
    toast.success('Background removed! (Demo - actual removal requires API)');
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        toast.success('New background added!');
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextOverlay = () => {
    if (!newText.trim()) {
      toast.error('Please enter some text');
      return;
    }
    
    const overlay: TextOverlay = {
      id: Date.now().toString(),
      text: newText,
      x: 50,
      y: 50,
      fontSize: textFontSize,
      fontFamily: textFontFamily,
      color: textColor,
      fontWeight: textFontWeight,
      fontStyle: textFontStyle,
      textDecoration: textDecoration,
      isMarquee: isMarquee,
    };
    
    setTextOverlays(prev => [...prev, overlay]);
    setNewText('');
    toast.success('Text added!');
  };

  const addSticker = (emoji: string) => {
    const sticker: StickerOverlay = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      size: 48,
    };
    setStickers(prev => [...prev, sticker]);
    toast.success('Sticker added!');
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(t => t.id !== id));
  };

  const removeSticker = (id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
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
        // Draw background if exists
        if (backgroundImage) {
          const bgImg = new window.Image();
          bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            drawMainImage();
          };
          bgImg.src = backgroundImage;
        } else {
          drawMainImage();
        }
        
        function drawMainImage() {
          ctx!.filter = getFilterString();
          ctx!.save();
          ctx!.translate(canvas.width / 2, canvas.height / 2);
          ctx!.rotate((currentState.rotation * Math.PI) / 180);
          ctx!.scale(currentState.flipH ? -1 : 1, currentState.flipV ? -1 : 1);
          ctx!.drawImage(img, -img.width / 2, -img.height / 2);
          ctx!.restore();
          ctx!.filter = 'none';
          
          // Draw text overlays
          textOverlays.forEach(overlay => {
            ctx!.font = `${overlay.fontStyle} ${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
            ctx!.fillStyle = overlay.color;
            ctx!.fillText(overlay.text, (overlay.x / 100) * canvas.width, (overlay.y / 100) * canvas.height);
          });
          
          // Draw stickers
          stickers.forEach(sticker => {
            ctx!.font = `${sticker.size}px Arial`;
            ctx!.fillText(sticker.emoji, (sticker.x / 100) * canvas.width, (sticker.y / 100) * canvas.height);
          });
          
          const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
          const link = document.createElement('a');
          link.download = `${originalFileName}-edited.${format}`;
          link.href = canvas.toDataURL(mimeType, 0.95);
          link.click();
          toast.success(`Downloaded as ${format.toUpperCase()}!`);
        }
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

  const [selectedCategory, setSelectedCategory] = useState<FilterPreset['category']>('basic');

  const getCategoryFilters = () => {
    return filterPresets.filter(f => f.category === selectedCategory);
  };

  const applyPreset = (preset: FilterPreset) => {
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
      <BackgroundEffects />
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
        <input
          type="file"
          ref={bgInputRef}
          onChange={handleBackgroundUpload}
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
                  {(['adjust', 'filters', 'overlays', 'face', 'tools'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
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
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {/* Category selector */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as FilterPreset['category'])}
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/30 text-sm"
                      >
                        {filterCategories.map((cat) => (
                          <option key={cat} value={cat}>{categoryDisplayNames[cat]}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {getCategoryFilters().map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyPreset(preset)}
                          className="p-2 rounded-xl bg-muted/30 hover:bg-primary/20 hover:scale-105 transition-all text-center group relative overflow-hidden border border-transparent hover:border-primary/40"
                        >
                          <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 mb-1 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform" 
                            style={{
                              filter: `brightness(${preset.brightness}%) contrast(${preset.contrast}%) saturate(${preset.saturation}%) sepia(${preset.sepia}%) grayscale(${preset.grayscale}%) hue-rotate(${preset.hue}deg)`
                            }}
                          >
                            {preset.emoji}
                          </div>
                          <span className="text-xs font-medium">{preset.name}</span>
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'overlays' && (
                  <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                    {/* Background Options */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <ImageMinus className="w-4 h-4 text-primary" />
                        Background
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="glass" 
                          size="sm" 
                          className="w-full"
                          onClick={removeBackground}
                          disabled={isRemovingBg}
                        >
                          {isRemovingBg ? 'Removing...' : '🪄 Remove BG'}
                        </Button>
                        <Button 
                          variant="glass" 
                          size="sm" 
                          className="w-full"
                          onClick={() => bgInputRef.current?.click()}
                        >
                          🖼️ Add BG
                        </Button>
                        {backgroundImage && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="col-span-2"
                            onClick={() => setBackgroundImage(null)}
                          >
                            ❌ Remove New BG
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Text Overlay */}
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Type className="w-4 h-4 text-primary" />
                        Add Text
                      </h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder="Enter your text..."
                          className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/30 text-sm focus:outline-none focus:border-primary/50"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Font</label>
                            <select
                              value={textFontFamily}
                              onChange={(e) => setTextFontFamily(e.target.value)}
                              className="w-full px-2 py-1.5 rounded bg-muted/50 border border-border/30 text-xs"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Impact">Impact</option>
                              <option value="Comic Sans MS">Comic Sans</option>
                              <option value="Courier New">Courier</option>
                              <option value="Times New Roman">Times</option>
                              <option value="Verdana">Verdana</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Size</label>
                            <input
                              type="number"
                              value={textFontSize}
                              onChange={(e) => setTextFontSize(Number(e.target.value))}
                              className="w-full px-2 py-1.5 rounded bg-muted/50 border border-border/30 text-xs"
                              min={8}
                              max={200}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => setTextFontWeight(textFontWeight === 'bold' ? 'normal' : 'bold')}
                              className={`px-2 py-1 rounded text-xs font-bold ${textFontWeight === 'bold' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
                            >
                              B
                            </button>
                            <button
                              onClick={() => setTextFontStyle(textFontStyle === 'italic' ? 'normal' : 'italic')}
                              className={`px-2 py-1 rounded text-xs italic ${textFontStyle === 'italic' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
                            >
                              I
                            </button>
                            <button
                              onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
                              className={`px-2 py-1 rounded text-xs underline ${textDecoration === 'underline' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
                            >
                              U
                            </button>
                            <button
                              onClick={() => setIsMarquee(!isMarquee)}
                              className={`px-2 py-1 rounded text-xs ${isMarquee ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
                              title="Marquee Animation"
                            >
                              ⟷
                            </button>
                          </div>
                        </div>
                        <Button variant="glow" size="sm" className="w-full" onClick={addTextOverlay}>
                          Add Text
                        </Button>
                        
                        {/* Added texts */}
                        {textOverlays.length > 0 && (
                          <div className="space-y-1 mt-2">
                            {textOverlays.map((overlay) => (
                              <div key={overlay.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs">
                                <span className="truncate">{overlay.text}</span>
                                <button onClick={() => removeTextOverlay(overlay.id)} className="text-red-400 hover:text-red-500">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stickers & Emojis */}
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Sticker className="w-4 h-4 text-primary" />
                        Stickers & Emoji
                      </h4>
                      <div className="grid grid-cols-6 gap-1">
                        {['😀', '😎', '❤️', '⭐', '🔥', '💯', '✨', '🎉', '👑', '🌟', '💖', '🎨', '🌈', '🦋', '🌸', '💎', '🎭', '🎪', '🎯', '🏆', '💫', '🌺', '🍀', '🎵'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addSticker(emoji)}
                            className="p-2 text-xl hover:scale-125 transition-transform hover:bg-muted/50 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      {stickers.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {stickers.map((sticker) => (
                            <button 
                              key={sticker.id} 
                              onClick={() => removeSticker(sticker.id)}
                              className="px-2 py-1 rounded bg-muted/30 text-sm hover:bg-red-500/20"
                            >
                              {sticker.emoji} ✕
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Frames */}
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Frame className="w-4 h-4 text-primary" />
                        Frames
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: 'None', value: null, preview: '⬜' },
                          { name: 'Simple', value: 'simple', preview: '🖼️' },
                          { name: 'Rounded', value: 'rounded', preview: '⭕' },
                          { name: 'Polaroid', value: 'polaroid', preview: '📷' },
                          { name: 'Film', value: 'film', preview: '🎞️' },
                          { name: 'Vintage', value: 'vintage', preview: '🏛️' },
                          { name: 'Neon', value: 'neon', preview: '💡' },
                          { name: 'Shadow', value: 'shadow', preview: '🌑' },
                        ].map((frame) => (
                          <button
                            key={frame.name}
                            onClick={() => {
                              setSelectedFrame(frame.value);
                              toast.success(`${frame.name} frame applied!`);
                            }}
                            className={`p-2 rounded-lg text-center transition-all ${
                              selectedFrame === frame.value 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted/30 hover:bg-muted/50'
                            }`}
                          >
                            <span className="text-lg block">{frame.preview}</span>
                            <span className="text-[10px]">{frame.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'face' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Smile className="w-4 h-4 text-primary" />
                      Face Toning & Beauty
                    </h4>
                    
                    {[
                      { label: 'Smoothness', value: currentState.smoothness, key: 'smoothness', max: 100 },
                      { label: 'Glow', value: currentState.glow, key: 'glow', max: 100 },
                      { label: 'Warmth', value: currentState.warmth, key: 'warmth', max: 100 },
                    ].map(({ label, value, key, max }) => (
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
                          max={max}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Natural', smoothness: 20, glow: 15, warmth: 10, emoji: '🌿' },
                          { name: 'Soft Skin', smoothness: 50, glow: 30, warmth: 20, emoji: '✨' },
                          { name: 'Studio', smoothness: 40, glow: 50, warmth: 15, emoji: '📸' },
                          { name: 'Glamour', smoothness: 60, glow: 60, warmth: 30, emoji: '💄' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              updateState({
                                smoothness: preset.smoothness,
                                glow: preset.glow,
                                warmth: preset.warmth,
                              });
                              toast.success(`${preset.name} preset applied!`);
                            }}
                            className="p-3 rounded-xl bg-muted/30 hover:bg-primary/20 transition-all text-center"
                          >
                            <span className="text-2xl block mb-1">{preset.emoji}</span>
                            <span className="text-xs font-medium">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Lens Effects</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {['🔮 Blur', '⭐ Star', '❤️ Hearts', '🌈 Rainbow', '✨ Sparkle', '🎭 Mask'].map((lens) => (
                          <button
                            key={lens}
                            onClick={() => toast.info(`${lens} lens coming soon!`)}
                            className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs text-center"
                          >
                            {lens}
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
                      <h4 className="text-sm font-medium mb-3">Quick Effects</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Sepia', key: 'sepia', value: 50 },
                          { label: 'B&W', key: 'grayscale', value: 100 },
                          { label: 'Invert', key: 'invert', value: 100 },
                          { label: 'Reset', key: 'reset', value: 0 },
                        ].map(({ label, key, value }) => (
                          <Button
                            key={label}
                            variant="glass"
                            size="sm"
                            onClick={() => {
                              if (key === 'reset') {
                                resetAll();
                              } else {
                                updateState({ [key]: value } as any);
                              }
                            }}
                          >
                            {label}
                          </Button>
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
              <div className={`editor-canvas rounded-2xl overflow-hidden ${selectedFrame === 'simple' ? 'border-4 border-foreground' : ''} ${selectedFrame === 'rounded' ? 'rounded-[50px]' : ''} ${selectedFrame === 'polaroid' ? 'bg-white p-4 pb-16' : ''} ${selectedFrame === 'neon' ? 'ring-4 ring-primary shadow-[0_0_30px_rgba(0,212,255,0.5)]' : ''} ${selectedFrame === 'shadow' ? 'shadow-2xl' : ''}`}>
                <div 
                  className="relative w-full min-h-[300px] sm:min-h-[500px] flex items-center justify-center bg-muted/20 rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
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
                  
                  {/* Text Overlays Display */}
                  {textOverlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      className={`absolute pointer-events-none ${overlay.isMarquee ? 'animate-marquee' : ''}`}
                      style={{
                        left: `${overlay.x}%`,
                        top: `${overlay.y}%`,
                        fontSize: `${overlay.fontSize}px`,
                        fontFamily: overlay.fontFamily,
                        color: overlay.color,
                        fontWeight: overlay.fontWeight,
                        fontStyle: overlay.fontStyle,
                        textDecoration: overlay.textDecoration,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {overlay.text}
                    </div>
                  ))}
                  
                  {/* Stickers Display */}
                  {stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${sticker.x}%`,
                        top: `${sticker.y}%`,
                        fontSize: `${sticker.size}px`,
                      }}
                    >
                      {sticker.emoji}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>History: {historyIndex + 1}/{history.length}</span>
                  <span>Zoom: {zoom}%</span>
                  <span>Texts: {textOverlays.length}</span>
                  <span>Stickers: {stickers.length}</span>
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
