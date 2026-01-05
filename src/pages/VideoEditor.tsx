import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Video, Upload, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Scissors, Download, RotateCcw, Maximize, Minimize,
  Layers, Type, Sparkles, SlidersHorizontal,
  ChevronLeft, ChevronRight, Film, Sticker, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import FloatingLetters from '@/components/FloatingLetters';
import EditorHeader from '@/components/EditorHeader';
import { filterPresets, filterCategories, categoryDisplayNames, defaultFilter, type FilterPreset } from '@/lib/filterPresets';

interface VideoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  isMarquee: boolean;
}

interface StickerOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

const VideoEditor: React.FC = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [filters, setFilters] = useState<VideoFilters>({ ...defaultFilter });
  const [activeTab, setActiveTab] = useState<'timeline' | 'filters' | 'overlays' | 'audio'>('timeline');
  const [showTrimHandles, setShowTrimHandles] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('edited-video');
  const [selectedCategory, setSelectedCategory] = useState<FilterPreset['category']>('basic');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Text & Sticker overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [stickers, setStickers] = useState<StickerOverlay[]>([]);
  const [newText, setNewText] = useState('');
  const [textFontSize, setTextFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textFontFamily, setTextFontFamily] = useState('Arial');
  const [textFontWeight, setTextFontWeight] = useState('normal');
  const [isMarquee, setIsMarquee] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle video events
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoEl.duration);
      setTrimEnd(videoEl.duration);
      setIsVideoLoaded(true);
      toast.success('Video ready to edit!');
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      toast.error('Error loading video. Please try a different file.');
      setIsVideoLoaded(false);
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoEl.addEventListener('ended', handleEnded);
    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('error', handleError);

    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoEl.removeEventListener('ended', handleEnded);
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('error', handleError);
    };
  }, [video]);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error('File size must be less than 500MB');
        return;
      }

      setVideoFile(file);
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setVideo(url);
      setFilters({ ...defaultFilter });
      setIsVideoLoaded(false);
      setCurrentTime(0);
      setIsPlaying(false);
      toast.info('Loading video...');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error('File size must be less than 500MB');
        return;
      }
      setVideoFile(file);
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setVideo(url);
      setFilters({ ...defaultFilter });
      setIsVideoLoaded(false);
      toast.info('Loading video...');
    } else {
      toast.error('Please drop a valid video file');
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current && isVideoLoaded) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Play error:', err);
          toast.error('Unable to play video');
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isVideoLoaded]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (videoRef.current && isVideoLoaded) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, [isVideoLoaded]);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current && isVideoLoaded) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  }, [duration, isVideoLoaded]);

  const changeSpeed = useCallback((speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      toast.success(`Playback speed: ${speed}x`);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilterString = () => {
    return `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
    `.trim();
  };

  const handleTrim = () => {
    toast.success(`Trim set: ${formatTime(trimStart)} - ${formatTime(trimEnd)}`);
    setShowTrimHandles(true);
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
      isMarquee: isMarquee,
    };
    
    setTextOverlays(prev => [...prev, overlay]);
    setNewText('');
    toast.success('Text added to video!');
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

  const downloadVideo = () => {
    if (video) {
      const link = document.createElement('a');
      link.href = video;
      link.download = `${originalFileName}-edited.mp4`;
      link.click();
      toast.success('Video download started!');
    }
  };

  const applyFilter = (preset: FilterPreset) => {
    setFilters({
      brightness: preset.brightness,
      contrast: preset.contrast,
      saturation: preset.saturation,
      hue: preset.hue,
      blur: preset.blur,
      sepia: preset.sepia,
      grayscale: preset.grayscale,
    });
    toast.success(`${preset.name} filter applied!`);
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilter });
    toast.success('Filters reset!');
  };

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

  const getCategoryFilters = () => {
    return filterPresets.filter(f => f.category === selectedCategory);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLetters />
      <EditorHeader 
        title="Video Editor" 
        subtitle="Professional video editing"
        icon={<Video className="w-5 h-5 text-primary" />}
      />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleVideoUpload}
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
          className="hidden"
        />

        {!video ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="max-w-3xl mx-auto mt-8 sm:mt-16 glass-card p-8 sm:p-16 rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Film className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 gradient-text">Upload Your Video</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-muted-foreground/60">
                Supports MP4, WebM, MOV, AVI (max 500MB)
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
                  {(['timeline', 'filters', 'overlays', 'audio'] as const).map((tab) => (
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

                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-primary" />
                        Trim Video
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Start: {formatTime(trimStart)}</span>
                          </div>
                          <Slider
                            value={[trimStart]}
                            onValueChange={([v]) => setTrimStart(Math.min(v, trimEnd - 1))}
                            min={0}
                            max={duration || 100}
                            step={0.1}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>End: {formatTime(trimEnd)}</span>
                          </div>
                          <Slider
                            value={[trimEnd]}
                            onValueChange={([v]) => setTrimEnd(Math.max(v, trimStart + 1))}
                            min={0}
                            max={duration || 100}
                            step={0.1}
                          />
                        </div>
                        <Button variant="glass" size="sm" className="w-full" onClick={handleTrim}>
                          <Scissors className="w-4 h-4 mr-2" />
                          Apply Trim
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        Playback Speed
                      </h4>
                      <div className="grid grid-cols-4 gap-1">
                        {speedOptions.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => changeSpeed(speed)}
                            className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                              playbackSpeed === speed 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted/30 hover:bg-muted/50'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'filters' && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {/* Category selector */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Filter Category</h4>
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

                    {/* Filter grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {getCategoryFilters().map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyFilter(preset)}
                          className="p-2 rounded-xl bg-muted/30 hover:bg-primary/20 hover:scale-105 transition-all text-center group relative overflow-hidden border border-transparent hover:border-primary/40"
                        >
                          <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-muted via-accent/10 to-muted/50 mb-1 group-hover:scale-110 transition-transform overflow-hidden flex items-center justify-center">
                            <div 
                              className="w-full h-full bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 flex items-center justify-center text-xl"
                              style={{ filter: `brightness(${preset.brightness}%) contrast(${preset.contrast}%) saturate(${preset.saturation}%) sepia(${preset.sepia}%) grayscale(${preset.grayscale}%) hue-rotate(${preset.hue}deg)` }}
                            >
                              {preset.emoji}
                            </div>
                          </div>
                          <span className="text-xs font-medium">{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    <Button variant="glass" size="sm" className="w-full" onClick={resetFilters}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                )}

                {activeTab === 'overlays' && (
                  <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                    {/* Text Overlay */}
                    <div>
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
                              <option value="Verdana">Verdana</option>
                              <option value="Times New Roman">Times</option>
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
                              max={120}
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
                        {['😀', '😎', '❤️', '⭐', '🔥', '💯', '✨', '🎉', '👑', '🌟', '💖', '🎨', '🎬', '🎥', '🎵', '🎮', '🚀', '💫'].map((emoji) => (
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

                    {/* Effects */}
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Manual Adjustments
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Brightness', key: 'brightness', value: filters.brightness, min: 50, max: 150 },
                          { label: 'Contrast', key: 'contrast', value: filters.contrast, min: 50, max: 150 },
                          { label: 'Saturation', key: 'saturation', value: filters.saturation, min: 0, max: 200 },
                        ].map(({ label, key, value, min, max }) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{label}</span>
                              <span className="text-muted-foreground">{value}%</span>
                            </div>
                            <Slider
                              value={[value]}
                              onValueChange={([v]) => setFilters(prev => ({ ...prev, [key]: v }))}
                              min={min}
                              max={max}
                              step={1}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'audio' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-primary" />
                        Volume Control
                      </h4>
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>{volume}%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Audio Options</h4>
                      <div className="space-y-2">
                        <Button variant="glass" size="sm" className="w-full justify-start" onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                          {isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Player */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              <div ref={containerRef} className="editor-canvas rounded-2xl">
                {/* Video */}
                <div className="relative bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    src={video}
                    className="w-full max-h-[60vh] object-contain"
                    style={{ filter: getFilterString() }}
                    onClick={togglePlay}
                    playsInline
                    preload="metadata"
                  />
                  
                  {/* Loading indicator */}
                  {!isVideoLoaded && video && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading video...</p>
                      </div>
                    </div>
                  )}
                  
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
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        transform: 'translate(-50%, -50%)',
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
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {sticker.emoji}
                    </div>
                  ))}
                  
                  {/* Play/Pause overlay */}
                  {!isPlaying && isVideoLoaded && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Timeline */}
                <div className="mt-4 px-2">
                  <div className="relative">
                    <Slider
                      value={[currentTime]}
                      onValueChange={handleSeek}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      className="w-full"
                      disabled={!isVideoLoaded}
                    />
                    {showTrimHandles && duration > 0 && (
                      <>
                        <div 
                          className="absolute top-0 h-2 bg-primary/30 rounded-l pointer-events-none"
                          style={{ left: 0, width: `${(trimStart / duration) * 100}%` }}
                        />
                        <div 
                          className="absolute top-0 h-2 bg-primary/30 rounded-r pointer-events-none"
                          style={{ left: `${(trimEnd / duration) * 100}%`, right: 0 }}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" onClick={() => skip(-10)} disabled={!isVideoLoaded}>
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(-5)} disabled={!isVideoLoaded}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="glow" size="sm" onClick={togglePlay} className="px-4" disabled={!isVideoLoaded}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(5)} disabled={!isVideoLoaded}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(10)} disabled={!isVideoLoaded}>
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-20 hidden sm:block">
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-1" /> New
                    </Button>
                    <Button variant="glow" size="sm" onClick={downloadVideo} disabled={!isVideoLoaded}>
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="mt-4 glass-card rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{originalFileName}</h4>
                      <p className="text-xs text-muted-foreground">
                        Duration: {formatTime(duration)} • Speed: {playbackSpeed}x
                        {videoFile && ` • Size: ${(videoFile.size / (1024 * 1024)).toFixed(1)}MB`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                      {isVideoLoaded ? 'Ready' : 'Loading...'}
                    </span>
                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs">100+ Filters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoEditor;
