import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FloatingLetters from '@/components/FloatingLetters';
import { Button } from '@/components/ui/button';
import { 
  Upload, Play, Pause, Volume2, VolumeX,
  Scissors, Film, Download, Trash2, SkipBack, SkipForward
} from 'lucide-react';
import { toast } from 'sonner';

const VideoEditor: React.FC = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideo(url);
      toast.success('Video uploaded successfully!');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideo(url);
      toast.success('Video uploaded successfully!');
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const clearVideo = () => {
    setVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    toast.success('Video cleared!');
  };

  return (
    <>
      <Helmet>
        <title>Free Video Editor - Trim, Cut & Edit Videos Online | Free Edit Hub</title>
        <meta name="description" content="Free online video editor. Trim, cut, adjust speed, and more. No watermarks, no sign-up required." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <FloatingLetters />
        <Navbar />

        <main className="pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Film className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Video Editor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Video Editor</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Trim, cut, and enhance your videos with ease.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Video Player Area */}
              <div
                className="glass-card rounded-2xl overflow-hidden relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {video ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={video}
                      className="w-full max-h-[500px] object-contain bg-background/50"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />
                    <button
                      onClick={clearVideo}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-destructive/80 hover:bg-destructive transition-colors"
                      title="Remove Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="min-h-[400px] flex items-center justify-center cursor-pointer p-12"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-10 h-10 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Upload a Video</h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop or click to select
                      </p>
                      <Button variant="secondary">
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>

              {/* Controls */}
              {video && (
                <div className="glass-card rounded-2xl mt-4 p-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-12">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 accent-accent"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => skip(-10)}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      title="Skip Back 10s"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-4 rounded-full bg-accent/20 hover:bg-accent/30 text-accent transition-colors"
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
                    <button
                      onClick={toggleMute}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Speed Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2">Speed:</span>
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-accent/20 text-accent border border-accent/30'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 pt-4 border-t border-border/30">
                    <Button variant="glass">
                      <Scissors className="w-4 h-4 mr-2" />
                      Trim Video
                    </Button>
                    <Button variant="glow">
                      <Download className="w-4 h-4 mr-2" />
                      Export Video
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VideoEditor;
