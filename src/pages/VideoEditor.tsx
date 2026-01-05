import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, Upload, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Scissors, Download, RotateCcw, FastForward, Rewind, Maximize, Minimize,
  Settings, Layers, Type, Music, Image, Sparkles, Clock, SlidersHorizontal,
  ChevronLeft, ChevronRight, Square, Circle, Zap, Film, Palette, Sun, Contrast
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import FloatingLetters from '@/components/FloatingLetters';
import EditorHeader from '@/components/EditorHeader';

interface VideoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
}

const defaultFilters: VideoFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sepia: 0,
  grayscale: 0,
};

const VideoEditor: React.FC = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [filters, setFilters] = useState<VideoFilters>(defaultFilters);
  const [activeTab, setActiveTab] = useState<'timeline' | 'filters' | 'effects' | 'audio'>('timeline');
  const [showTrimHandles, setShowTrimHandles] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('edited-video');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      setDuration(video.duration);
      setTrimEnd(video.duration);
    };
    const handleEnd = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnd);
    };
  }, [video]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setVideo(url);
      setFilters(defaultFilters);
      toast.success('Video loaded successfully!');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setVideo(url);
      setFilters(defaultFilters);
      toast.success('Video loaded successfully!');
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      toast.success(`Playback speed: ${speed}x`);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time: number) => {
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

  const downloadVideo = () => {
    if (video) {
      const link = document.createElement('a');
      link.href = video;
      link.download = `${originalFileName}-edited.mp4`;
      link.click();
      toast.success('Video download started!');
    }
  };

  const presetFilters = [
    { name: 'Original', ...defaultFilters, emoji: '🎬' },
    { name: 'Cinematic', brightness: 95, contrast: 120, saturation: 90, hue: 10, blur: 0, sepia: 10, grayscale: 0, emoji: '🎥' },
    { name: 'Vintage', brightness: 110, contrast: 90, saturation: 70, hue: 0, blur: 0, sepia: 40, grayscale: 0, emoji: '📽️' },
    { name: 'B&W Film', brightness: 105, contrast: 130, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100, emoji: '⬛' },
    { name: 'Warm', brightness: 105, contrast: 105, saturation: 120, hue: 15, blur: 0, sepia: 15, grayscale: 0, emoji: '🔥' },
    { name: 'Cool', brightness: 100, contrast: 110, saturation: 90, hue: 200, blur: 0, sepia: 0, grayscale: 0, emoji: '❄️' },
    { name: 'Dramatic', brightness: 90, contrast: 150, saturation: 80, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🎭' },
    { name: 'Dream', brightness: 115, contrast: 85, saturation: 110, hue: 330, blur: 1, sepia: 5, grayscale: 0, emoji: '💭' },
    // New attractive video filters
    { name: 'Blockbuster', brightness: 98, contrast: 125, saturation: 105, hue: 5, blur: 0, sepia: 8, grayscale: 0, emoji: '🎞️' },
    { name: 'Horror', brightness: 80, contrast: 145, saturation: 60, hue: 180, blur: 0, sepia: 0, grayscale: 20, emoji: '👻' },
    { name: 'Romance', brightness: 108, contrast: 95, saturation: 90, hue: 350, blur: 0.5, sepia: 12, grayscale: 0, emoji: '💕' },
    { name: 'Action', brightness: 95, contrast: 140, saturation: 115, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '💥' },
    { name: 'Sci-Fi', brightness: 90, contrast: 130, saturation: 140, hue: 200, blur: 0, sepia: 0, grayscale: 0, emoji: '🚀' },
    { name: 'Western', brightness: 105, contrast: 110, saturation: 85, hue: 25, blur: 0, sepia: 35, grayscale: 0, emoji: '🤠' },
    { name: 'Neon Night', brightness: 85, contrast: 140, saturation: 180, hue: 280, blur: 0, sepia: 0, grayscale: 0, emoji: '🌃' },
    { name: 'Summer', brightness: 110, contrast: 105, saturation: 130, hue: 40, blur: 0, sepia: 8, grayscale: 0, emoji: '☀️' },
    { name: 'Winter', brightness: 108, contrast: 110, saturation: 70, hue: 210, blur: 0, sepia: 0, grayscale: 15, emoji: '❄️' },
    { name: 'Documentary', brightness: 100, contrast: 115, saturation: 95, hue: 0, blur: 0, sepia: 5, grayscale: 0, emoji: '📹' },
    { name: 'Music Video', brightness: 105, contrast: 135, saturation: 160, hue: 320, blur: 0, sepia: 0, grayscale: 0, emoji: '🎵' },
    { name: 'Anime', brightness: 108, contrast: 120, saturation: 145, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🎌' },
    { name: 'Vlog', brightness: 105, contrast: 108, saturation: 115, hue: 10, blur: 0, sepia: 5, grayscale: 0, emoji: '📱' },
    { name: 'Thriller', brightness: 85, contrast: 140, saturation: 80, hue: 190, blur: 0, sepia: 5, grayscale: 10, emoji: '🔪' },
    { name: 'Fantasy', brightness: 102, contrast: 115, saturation: 125, hue: 290, blur: 0.3, sepia: 0, grayscale: 0, emoji: '🧙' },
    { name: 'Noir', brightness: 88, contrast: 150, saturation: 30, hue: 0, blur: 0, sepia: 15, grayscale: 50, emoji: '🕵️' },
  ];

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

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
          accept="video/*"
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
                Supports MP4, WebM, MOV, AVI
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
                  {(['timeline', 'filters', 'effects', 'audio'] as const).map((tab) => (
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
                            max={duration}
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
                            max={duration}
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
                        <Clock className="w-4 h-4 text-primary" />
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

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Add Elements</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: Type, name: 'Text' },
                          { icon: Image, name: 'Image' },
                          { icon: Music, name: 'Audio' },
                          { icon: Layers, name: 'Overlay' },
                        ].map(({ icon: Icon, name }) => (
                          <button
                            key={name}
                            onClick={() => toast.info(`${name} overlay coming soon!`)}
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

                {activeTab === 'filters' && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-2">
                      {presetFilters.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setFilters(preset);
                            toast.success(`${preset.name} filter applied!`);
                          }}
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
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'effects' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Brightness', icon: Sun, value: filters.brightness, key: 'brightness', min: 50, max: 150 },
                      { label: 'Contrast', icon: Contrast, value: filters.contrast, key: 'contrast', min: 50, max: 150 },
                      { label: 'Saturation', icon: Palette, value: filters.saturation, key: 'saturation', min: 0, max: 200 },
                      { label: 'Hue', icon: Palette, value: filters.hue, key: 'hue', min: 0, max: 360 },
                    ].map(({ label, icon: Icon, value, key, min, max }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {value}{key === 'hue' ? '°' : '%'}
                          </span>
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

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3">Quick Effects</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Slow Mo', icon: Rewind },
                          { name: 'Speed Up', icon: FastForward },
                          { name: 'Reverse', icon: RotateCcw },
                          { name: 'Loop', icon: Circle },
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
                        <Button variant="glass" size="sm" className="w-full justify-start" onClick={() => toast.info('Coming soon!')}>
                          <Music className="w-4 h-4 mr-2" />
                          Add Background Music
                        </Button>
                        <Button variant="glass" size="sm" className="w-full justify-start" onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                          {isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        </Button>
                        <Button variant="glass" size="sm" className="w-full justify-start" onClick={() => toast.info('Coming soon!')}>
                          <SlidersHorizontal className="w-4 h-4 mr-2" />
                          Audio Equalizer
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
                  />
                  
                  {/* Play/Pause overlay */}
                  {!isPlaying && (
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
                    />
                    {showTrimHandles && (
                      <>
                        <div 
                          className="absolute top-0 h-2 bg-primary/30 rounded-l"
                          style={{ left: 0, width: `${(trimStart / duration) * 100}%` }}
                        />
                        <div 
                          className="absolute top-0 h-2 bg-primary/30 rounded-r"
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
                    <Button variant="ghost" size="sm" onClick={() => skip(-10)}>
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(-5)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="glow" size="sm" onClick={togglePlay} className="px-4">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(5)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(10)}>
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
                    <Button variant="glow" size="sm" onClick={downloadVideo}>
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Timeline Track */}
              <div className="mt-4 glass-card rounded-xl p-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <Video className="w-4 h-4 text-primary" />
                    <div className="flex-1 h-8 bg-gradient-to-r from-primary/40 to-secondary/40 rounded relative overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 bg-primary/50"
                        style={{ left: `${(trimStart / duration) * 100}%`, width: `${((trimEnd - trimStart) / duration) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-dashed border-border/50">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Drop audio track here</span>
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
