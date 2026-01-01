import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FloatingLetters from '@/components/FloatingLetters';
import { Button } from '@/components/ui/button';
import { 
  Upload, Play, Pause, Volume2, VolumeX,
  Scissors, Music, Download, Trash2, SkipBack, SkipForward
} from 'lucide-react';
import { toast } from 'sonner';

const AudioEditor: React.FC = () => {
  const [audio, setAudio] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudio(url);
      setFileName(file.name);
      toast.success('Audio uploaded successfully!');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudio(url);
      setFileName(file.name);
      toast.success('Audio uploaded successfully!');
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const clearAudio = () => {
    setAudio(null);
    setFileName('');
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    toast.success('Audio cleared!');
  };

  return (
    <>
      <Helmet>
        <title>Free Audio Editor - Trim, Cut & Edit Audio Online | Free Edit Hub</title>
        <meta name="description" content="Free online audio editor. Trim, cut, adjust volume, and more. No watermarks, no sign-up required." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <FloatingLetters />
        <Navbar />

        <main className="pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Music className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Audio Editor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Audio Editor</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Trim, cut, and enhance your audio files with precision.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Audio Upload Area */}
              <div
                className="glass-card rounded-2xl overflow-hidden relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {audio ? (
                  <div className="p-8">
                    <audio
                      ref={audioRef}
                      src={audio}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />
                    
                    {/* Waveform Placeholder */}
                    <div className="relative h-32 bg-muted/30 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
                      <div className="flex items-end gap-1 h-full py-4">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-primary/40 rounded-full transition-all duration-75"
                            style={{
                              height: `${Math.random() * 60 + 20}%`,
                              opacity: currentTime / duration > i / 60 ? 1 : 0.3,
                            }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={clearAudio}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-destructive/80 hover:bg-destructive transition-colors"
                        title="Remove Audio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* File Name */}
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">{fileName}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm text-muted-foreground w-12">
                        {formatTime(currentTime)}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {formatTime(duration)}
                      </span>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <button
                        onClick={() => skip(-10)}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        title="Skip Back 10s"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <button
                        onClick={togglePlay}
                        className="p-4 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </button>
                      <button
                        onClick={() => skip(10)}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        title="Skip Forward 10s"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-32 accent-primary"
                      />
                      <span className="text-sm text-muted-foreground w-12">{volume}%</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3 pt-4 border-t border-border/30">
                      <Button variant="glass">
                        <Scissors className="w-4 h-4 mr-2" />
                        Trim Audio
                      </Button>
                      <Button variant="glow">
                        <Download className="w-4 h-4 mr-2" />
                        Export Audio
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="min-h-[400px] flex items-center justify-center cursor-pointer p-12"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Upload an Audio File</h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop or click to select (MP3, WAV, etc.)
                      </p>
                      <Button variant="default">
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AudioEditor;
