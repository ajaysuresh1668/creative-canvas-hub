import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FloatingLetters from '@/components/FloatingLetters';
import { Button } from '@/components/ui/button';
import { 
  Upload, RotateCw, FlipHorizontal, FlipVertical,
  Crop, Download, Sun, Contrast, Droplets,
  Image as ImageIcon, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [filter, setFilter] = useState('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = image;
    link.click();
    toast.success('Image downloaded!');
  };

  const resetEdits = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFilter('none');
    toast.success('Edits reset!');
  };

  const clearImage = () => {
    setImage(null);
    resetEdits();
    toast.success('Image cleared!');
  };

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Blur', value: 'blur(2px)' },
    { name: 'Invert', value: 'invert(100%)' },
  ];

  const imageStyle: React.CSSProperties = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filter !== 'none' ? filter : ''}`,
    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
  };

  return (
    <>
      <Helmet>
        <title>Free Image Editor - Crop, Filter & Edit Images Online | Free Edit Hub</title>
        <meta name="description" content="Free online image editor. Crop, rotate, add filters, adjust brightness and more. No watermarks, no sign-up." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <FloatingLetters />
        <Navbar />

        <main className="pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <ImageIcon className="w-4 h-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Image Editor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text-secondary">Image Editor</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Edit your images with powerful tools. Crop, rotate, filter, and more.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Controls */}
              <div className="glass-card rounded-2xl p-6 space-y-6 order-2 lg:order-1">
                <h3 className="font-semibold text-lg">Adjustments</h3>

                {/* Brightness */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Sun className="w-4 h-4" />
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Contrast className="w-4 h-4" />
                    Contrast: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Droplets className="w-4 h-4" />
                    Saturation: {saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Transform Controls */}
                <div>
                  <h4 className="text-sm text-muted-foreground mb-3">Transform</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setRotation((r) => r - 90)}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      title="Rotate Left"
                    >
                      <RotateCw className="w-4 h-4 transform -scale-x-100" />
                    </button>
                    <button
                      onClick={() => setRotation((r) => r + 90)}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      title="Rotate Right"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`p-3 rounded-lg transition-colors ${flipH ? 'bg-primary/20 text-primary' : 'bg-muted/50 hover:bg-muted'}`}
                      title="Flip Horizontal"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`p-3 rounded-lg transition-colors ${flipV ? 'bg-primary/20 text-primary' : 'bg-muted/50 hover:bg-muted'}`}
                      title="Flip Vertical"
                    >
                      <FlipVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <h4 className="text-sm text-muted-foreground mb-3">Filters</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filters.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setFilter(f.value)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          filter === f.value
                            ? 'bg-secondary/20 text-secondary border border-secondary/30'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-border/30">
                  <Button variant="glass" className="w-full" onClick={resetEdits}>
                    Reset Edits
                  </Button>
                  <Button variant="glow" className="w-full" onClick={handleDownload} disabled={!image}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div
                  className="glass-card rounded-2xl min-h-[500px] flex items-center justify-center overflow-hidden relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="Editing"
                        className="max-w-full max-h-[600px] object-contain transition-all duration-200"
                        style={imageStyle}
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-destructive/80 hover:bg-destructive transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div
                      className="text-center cursor-pointer p-12"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-10 h-10 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop or click to select
                      </p>
                      <Button variant="secondary">
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
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

export default ImageEditor;
