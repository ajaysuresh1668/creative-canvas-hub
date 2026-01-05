import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Upload, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Heart, Share2, Download, Plus, ListMusic, Search,
  ChevronLeft, ChevronRight, Clock, Disc3, Radio, Mic2, Headphones,
  Library, TrendingUp, Star, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import FloatingLetters from '@/components/FloatingLetters';
import EditorHeader from '@/components/EditorHeader';

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

const MusicPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'library' | 'playlist' | 'favorites'>('library');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeat === 'all' || tracks.length > 0) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentTrack, repeat, tracks]);

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newTracks: Track[] = [];
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('audio/')) {
        const track: Track = {
          id: `${Date.now()}-${index}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          duration: 0,
          url: URL.createObjectURL(file),
        };
        newTracks.push(track);
      }
    });

    if (newTracks.length > 0) {
      setTracks(prev => [...prev, ...newTracks]);
      if (!currentTrack) {
        setCurrentTrack(newTracks[0]);
      }
      toast.success(`Added ${newTracks.length} track(s) to library!`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newTracks: Track[] = [];

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('audio/')) {
        const track: Track = {
          id: `${Date.now()}-${index}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          duration: 0,
          url: URL.createObjectURL(file),
        };
        newTracks.push(track);
      }
    });

    if (newTracks.length > 0) {
      setTracks(prev => [...prev, ...newTracks]);
      if (!currentTrack) {
        setCurrentTrack(newTracks[0]);
      }
      toast.success(`Added ${newTracks.length} track(s)!`);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) {
      if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      }
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const playNext = () => {
    if (tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    let nextIndex: number;
    
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    
    playTrack(tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    
    playTrack(tracks[prevIndex]);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
        toast.info('Removed from favorites');
      } else {
        newFavorites.add(trackId);
        toast.success('Added to favorites!');
      }
      return newFavorites;
    });
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTracks = tracks.filter(track =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayTracks = activeView === 'favorites' 
    ? filteredTracks.filter(t => favorites.has(t.id))
    : filteredTracks;

  const genres = [
    { name: 'Pop', icon: '🎵', color: 'from-pink-500 to-rose-500' },
    { name: 'Rock', icon: '🎸', color: 'from-red-500 to-orange-500' },
    { name: 'Jazz', icon: '🎷', color: 'from-amber-500 to-yellow-500' },
    { name: 'Classical', icon: '🎻', color: 'from-emerald-500 to-teal-500' },
    { name: 'Electronic', icon: '🎧', color: 'from-cyan-500 to-blue-500' },
    { name: 'Hip Hop', icon: '🎤', color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLetters />
      <EditorHeader 
        title="Music Player" 
        subtitle="Your personal music library"
        icon={<Music className="w-5 h-5 text-primary" />}
      />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFilesUpload}
          accept="audio/*"
          multiple
          className="hidden"
        />
        <audio ref={audioRef} src={currentTrack?.url} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="editor-sidebar rounded-2xl">
              <div className="space-y-2 mb-6">
                {[
                  { id: 'library', icon: Library, name: 'Library' },
                  { id: 'playlist', icon: ListMusic, name: 'Playlists' },
                  { id: 'favorites', icon: Heart, name: 'Favorites' },
                ].map(({ id, icon: Icon, name }) => (
                  <button
                    key={id}
                    onClick={() => setActiveView(id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeView === id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{name}</span>
                    {id === 'favorites' && favorites.size > 0 && (
                      <span className="ml-auto text-xs bg-secondary/30 px-2 py-0.5 rounded-full">
                        {favorites.size}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-border/30 pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" />
                  Browse Genres
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre.name}
                      onClick={() => toast.info(`${genre.name} radio coming soon!`)}
                      className={`p-3 rounded-xl bg-gradient-to-br ${genre.color} text-white text-center hover:scale-105 transition-transform`}
                    >
                      <span className="text-xl block mb-1">{genre.icon}</span>
                      <span className="text-xs font-medium">{genre.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                <Button 
                  variant="glow" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Music
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tracks, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border border-border/30 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Track List or Upload Area */}
            {tracks.length === 0 ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="glass-card p-8 sm:p-16 rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 gradient-text">Add Your Music</h3>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                    Drag & drop audio files or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Supports MP3, WAV, OGG, FLAC, M4A
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {activeView === 'favorites' ? 'Favorites' : 'Your Library'}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {displayTracks.length} track{displayTracks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {displayTracks.map((track, index) => (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${
                        currentTrack?.id === track.id 
                          ? 'bg-primary/20 border border-primary/40' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        {currentTrack?.id === track.id && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-1 bg-primary rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 100}%`,
                                  animationDelay: `${i * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <Music className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.has(track.id) ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
                      </button>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(track.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Now Playing Bar */}
            {currentTrack && (
              <div className="mt-6 glass-card rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Album Art */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center flex-shrink-0">
                    <Disc3 className={`w-10 h-10 sm:w-12 sm:h-12 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <h4 className="font-semibold text-lg truncate">{currentTrack.name}</h4>
                    <p className="text-muted-foreground text-sm">{currentTrack.artist}</p>

                    {/* Progress */}
                    <div className="mt-3">
                      <Slider
                        value={[currentTime]}
                        onValueChange={handleSeek}
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShuffle(!shuffle)}
                    className={shuffle ? 'text-primary' : ''}
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={playPrevious}>
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button variant="glow" onClick={togglePlay} className="w-12 h-12 rounded-full p-0">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={playNext}>
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
                    className={repeat !== 'off' ? 'text-primary' : ''}
                  >
                    <Repeat className="w-4 h-4" />
                    {repeat === 'one' && <span className="text-[10px] absolute">1</span>}
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="w-24 sm:w-32">
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MusicPlayer;
