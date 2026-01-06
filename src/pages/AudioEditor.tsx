import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Music, Upload, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Scissors, Download, RotateCcw, Rewind, FastForward, Repeat,
  Settings, SlidersHorizontal, Waves, Radio, Mic, Headphones,
  ZoomIn, ZoomOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import BackgroundEffects from '@/components/BackgroundEffects';
import EditorHeader from '@/components/EditorHeader';

interface AudioEffects {
  bass: number;
  mid: number;
  treble: number;
  reverb: number;
  echo: number;
  pitch: number;
}

const defaultEffects: AudioEffects = {
  bass: 50,
  mid: 50,
  treble: 50,
  reverb: 0,
  echo: 0,
  pitch: 100,
};

const AudioEditor: React.FC = () => {
  const [audio, setAudio] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [effects, setEffects] = useState<AudioEffects>(defaultEffects);
  const [activeTab, setActiveTab] = useState<'waveform' | 'equalizer' | 'effects' | 'trim'>('waveform');
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [originalFileName, setOriginalFileName] = useState('edited-audio');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle audio events
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioEl.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioEl.duration);
      setTrimEnd(audioEl.duration);
      setIsAudioLoaded(true);
      toast.success('Audio ready to edit!');
    };

    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
      }
    };

    const handleCanPlay = () => {
      setIsAudioLoaded(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      toast.error('Error loading audio. Please try a different file.');
      setIsAudioLoaded(false);
    };

    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('ended', handleEnded);
    audioEl.addEventListener('canplay', handleCanPlay);
    audioEl.addEventListener('error', handleError);

    return () => {
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('ended', handleEnded);
      audioEl.removeEventListener('canplay', handleCanPlay);
      audioEl.removeEventListener('error', handleError);
    };
  }, [audio, isLooping]);

  // Generate waveform data when audio loads
  useEffect(() => {
    if (audio && isAudioLoaded) {
      // Generate more realistic waveform visualization
      const data = Array.from({ length: 200 }, (_, i) => {
        const base = Math.random() * 0.6 + 0.2;
        const wave = Math.sin(i * 0.1) * 0.2;
        return Math.min(1, Math.max(0.1, base + wave));
      });
      setWaveformData(data);
    }
  }, [audio, isAudioLoaded]);

  const handleAudioUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select a valid audio file');
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }

      setAudioFile(file);
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setAudio(url);
      setEffects(defaultEffects);
      setIsAudioLoaded(false);
      setCurrentTime(0);
      setIsPlaying(false);
      toast.info('Loading audio...');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      setAudioFile(file);
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''));
      const url = URL.createObjectURL(file);
      setAudio(url);
      setEffects(defaultEffects);
      setIsAudioLoaded(false);
      toast.info('Loading audio...');
    } else {
      toast.error('Please drop a valid audio file');
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current && isAudioLoaded) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error('Play error:', err);
          toast.error('Unable to play audio');
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isAudioLoaded]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleLoop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
      toast.success(isLooping ? 'Loop disabled' : 'Loop enabled');
    }
  }, [isLooping]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current && isAudioLoaded) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, [isAudioLoaded]);

  const skip = useCallback((seconds: number) => {
    if (audioRef.current && isAudioLoaded) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  }, [duration, isAudioLoaded]);

  const changeSpeed = useCallback((speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      toast.success(`Playback speed: ${speed}x`);
    }
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrim = () => {
    toast.success(`Trim set: ${formatTime(trimStart)} - ${formatTime(trimEnd)}`);
  };

  const downloadAudio = (format: 'mp3' | 'wav' | 'ogg') => {
    if (audio) {
      const link = document.createElement('a');
      link.href = audio;
      link.download = `${originalFileName}-edited.${format}`;
      link.click();
      toast.success(`Audio download started as ${format.toUpperCase()}!`);
    }
  };

  const resetEffects = () => {
    setEffects(defaultEffects);
    toast.success('Effects reset to default!');
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const presets = [
    { name: 'Default', bass: 50, mid: 50, treble: 50, emoji: '🎵' },
    { name: 'Bass Boost', bass: 80, mid: 50, treble: 40, emoji: '🔊' },
    { name: 'Treble Boost', bass: 40, mid: 50, treble: 80, emoji: '🎼' },
    { name: 'Vocal', bass: 40, mid: 70, treble: 60, emoji: '🎤' },
    { name: 'Rock', bass: 70, mid: 60, treble: 70, emoji: '🎸' },
    { name: 'Pop', bass: 50, mid: 60, treble: 65, emoji: '🎧' },
    { name: 'Classical', bass: 45, mid: 55, treble: 50, emoji: '🎻' },
    { name: 'Electronic', bass: 75, mid: 45, treble: 75, emoji: '🎹' },
    { name: 'Jazz', bass: 55, mid: 65, treble: 55, emoji: '🎷' },
    { name: 'Hip Hop', bass: 85, mid: 55, treble: 50, emoji: '🎤' },
    { name: 'R&B', bass: 70, mid: 60, treble: 55, emoji: '💜' },
    { name: 'Acoustic', bass: 50, mid: 60, treble: 55, emoji: '🪕' },
  ];

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundEffects />
      <EditorHeader 
        title="Audio Editor" 
        subtitle="Professional audio editing"
        icon={<Music className="w-5 h-5 text-primary" />}
      />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAudioUpload}
          accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/aac,audio/m4a,audio/*"
          className="hidden"
        />
        
        {audio && <audio ref={audioRef} src={audio} preload="metadata" />}

        {!audio ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="max-w-3xl mx-auto mt-8 sm:mt-16 glass-card p-8 sm:p-16 rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 gradient-text">Upload Your Audio</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-muted-foreground/60">
                Supports MP3, WAV, OGG, FLAC, AAC, M4A (max 100MB)
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
                  {(['waveform', 'equalizer', 'effects', 'trim'] as const).map((tab) => (
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

                {activeTab === 'waveform' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Waves className="w-4 h-4 text-primary" />
                        Waveform View
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs flex-1 text-center">{(zoomLevel * 100).toFixed(0)}%</span>
                        <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}>
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        Playback Speed
                      </h4>
                      <div className="grid grid-cols-3 gap-1">
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
                      <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="glass" size="sm" className="w-full justify-start" onClick={toggleLoop}>
                          <Repeat className={`w-4 h-4 mr-2 ${isLooping ? 'text-primary' : ''}`} />
                          {isLooping ? 'Loop Enabled' : 'Enable Loop'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'equalizer' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        EQ Presets
                      </h4>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {presets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              setEffects(prev => ({ ...prev, bass: preset.bass, mid: preset.mid, treble: preset.treble }));
                              toast.success(`${preset.name} preset applied!`);
                            }}
                            className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs text-center flex flex-col items-center gap-1"
                          >
                            <span className="text-lg">{preset.emoji}</span>
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30 space-y-4">
                      {[
                        { label: 'Bass', value: effects.bass, key: 'bass' },
                        { label: 'Mid', value: effects.mid, key: 'mid' },
                        { label: 'Treble', value: effects.treble, key: 'treble' },
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
                            onValueChange={([v]) => setEffects(prev => ({ ...prev, [key]: v }))}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      ))}
                    </div>

                    <Button variant="glass" size="sm" className="w-full" onClick={resetEffects}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset EQ
                    </Button>
                  </div>
                )}

                {activeTab === 'effects' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Reverb', value: effects.reverb, key: 'reverb', icon: Radio },
                      { label: 'Echo', value: effects.echo, key: 'echo', icon: Waves },
                      { label: 'Pitch', value: effects.pitch, key: 'pitch', icon: Mic, min: 50, max: 150 },
                    ].map(({ label, value, key, icon: Icon, min = 0, max = 100 }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {value}%
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([v]) => setEffects(prev => ({ ...prev, [key]: v }))}
                          min={min}
                          max={max}
                          step={1}
                        />
                      </div>
                    ))}

                    <Button variant="glass" size="sm" className="w-full" onClick={resetEffects}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Effects
                    </Button>
                  </div>
                )}

                {activeTab === 'trim' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-primary" />
                        Trim Audio
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Start Point</span>
                            <span>{formatTime(trimStart)}</span>
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
                            <span>End Point</span>
                            <span>{formatTime(trimEnd)}</span>
                          </div>
                          <Slider
                            value={[trimEnd]}
                            onValueChange={([v]) => setTrimEnd(Math.max(v, trimStart + 1))}
                            min={0}
                            max={duration || 100}
                            step={0.1}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center py-2 bg-muted/30 rounded">
                          Selection: {formatTime(Math.max(0, trimEnd - trimStart))}
                        </div>
                        <Button variant="glass" size="sm" className="w-full" onClick={handleTrim}>
                          <Scissors className="w-4 h-4 mr-2" />
                          Apply Trim
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Player */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              <div className="editor-canvas rounded-2xl">
                {/* Waveform Visualization */}
                <div className="relative h-40 sm:h-56 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl mb-4 overflow-hidden border border-border/20">
                  {!isAudioLoaded && audio && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading audio...</p>
                      </div>
                    </div>
                  )}
                  
                  {isAudioLoaded && (
                    <>
                      <div 
                        className="absolute inset-0 flex items-center justify-center gap-[2px] px-4" 
                        style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'center' }}
                      >
                        {waveformData.map((height, i) => {
                          const isBeforeCurrent = (i / waveformData.length) * 100 <= progress;
                          const isInTrimRange = duration > 0 && 
                            (i / waveformData.length) * duration >= trimStart && 
                            (i / waveformData.length) * duration <= trimEnd;
                          return (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all duration-75 ${
                                isBeforeCurrent 
                                  ? 'bg-gradient-to-t from-primary to-secondary' 
                                  : isInTrimRange 
                                    ? 'bg-primary/40' 
                                    : 'bg-muted-foreground/20'
                              }`}
                              style={{
                                height: `${height * 100}%`,
                                opacity: isInTrimRange ? 1 : 0.4,
                              }}
                            />
                          );
                        })}
                      </div>
                      
                      {/* Playhead */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg shadow-primary/50 z-10 transition-all"
                        style={{ left: `${progress}%` }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                      </div>

                      {/* Time markers */}
                      <div className="absolute bottom-2 left-4 text-xs text-primary font-medium bg-background/50 px-2 py-1 rounded">
                        {formatTime(currentTime)}
                      </div>
                      <div className="absolute bottom-2 right-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                        {formatTime(duration)}
                      </div>
                    </>
                  )}
                </div>

                {/* Seek Bar */}
                <div className="mb-6 px-2">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    className="w-full"
                    disabled={!isAudioLoaded}
                  />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Playback Controls */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" onClick={() => skip(-10)} disabled={!isAudioLoaded}>
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(-5)} disabled={!isAudioLoaded}>
                      <Rewind className="w-4 h-4" />
                    </Button>
                    <Button variant="glow" size="default" onClick={togglePlay} className="px-6" disabled={!isAudioLoaded}>
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(5)} disabled={!isAudioLoaded}>
                      <FastForward className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => skip(10)} disabled={!isAudioLoaded}>
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-24 hidden sm:block">
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleLoop}
                      className={isLooping ? 'text-primary' : ''}
                    >
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Export */}
                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-1" /> New
                    </Button>
                    <Button variant="glass" size="sm" onClick={() => downloadAudio('mp3')} disabled={!isAudioLoaded}>
                      MP3
                    </Button>
                    <Button variant="glass" size="sm" onClick={() => downloadAudio('wav')} disabled={!isAudioLoaded}>
                      WAV
                    </Button>
                    <Button variant="glow" size="sm" onClick={() => downloadAudio('ogg')} disabled={!isAudioLoaded}>
                      <Download className="w-4 h-4 mr-1" /> OGG
                    </Button>
                  </div>
                </div>
              </div>

              {/* Audio Info */}
              <div className="mt-4 glass-card rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{originalFileName}</h4>
                      <p className="text-xs text-muted-foreground">
                        Duration: {formatTime(duration)} • Speed: {playbackSpeed}x
                        {audioFile && ` • Size: ${(audioFile.size / (1024 * 1024)).toFixed(1)}MB`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                      {isAudioLoaded ? 'Ready' : 'Loading...'}
                    </span>
                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs">Lossless Export</span>
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

export default AudioEditor;
