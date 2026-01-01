import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FloatingLetters from '@/components/FloatingLetters';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link2, 
  Undo, Redo, Download, Copy, Type
} from 'lucide-react';
import { toast } from 'sonner';

const TextEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Space Grotesk');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document downloaded!');
  };

  const handleClear = () => {
    setText('');
    toast.success('Editor cleared!');
  };

  return (
    <>
      <Helmet>
        <title>Free Text Editor - Format & Edit Text Online | Free Edit Hub</title>
        <meta name="description" content="Free online text editor with rich formatting. Bold, italic, lists, and more. No sign-up required." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <FloatingLetters />
        <Navbar />

        <main className="pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Type className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Text Editor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Text Editor</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Write and format your text with our powerful free editor.
              </p>
            </div>

            {/* Editor Container */}
            <div className="max-w-4xl mx-auto">
              {/* Toolbar */}
              <div className="glass-card rounded-t-2xl p-4 border-b-0 flex flex-wrap items-center gap-2">
                {/* Font Controls */}
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="bg-muted/50 border border-border/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Space Grotesk">Space Grotesk</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>

                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="bg-muted/50 border border-border/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>

                <div className="w-px h-8 bg-border/30 mx-2" />

                {/* Format Buttons */}
                <div className="flex gap-1">
                  {[
                    { icon: Bold, title: 'Bold' },
                    { icon: Italic, title: 'Italic' },
                    { icon: Underline, title: 'Underline' },
                    { icon: Strikethrough, title: 'Strikethrough' },
                  ].map(({ icon: Icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                <div className="w-px h-8 bg-border/30 mx-2" />

                {/* Alignment */}
                <div className="flex gap-1">
                  {[
                    { icon: AlignLeft, title: 'Align Left' },
                    { icon: AlignCenter, title: 'Align Center' },
                    { icon: AlignRight, title: 'Align Right' },
                  ].map(({ icon: Icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                <div className="w-px h-8 bg-border/30 mx-2" />

                {/* Lists */}
                <div className="flex gap-1">
                  {[
                    { icon: List, title: 'Bullet List' },
                    { icon: ListOrdered, title: 'Numbered List' },
                    { icon: Link2, title: 'Insert Link' },
                  ].map(({ icon: Icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                {/* Undo/Redo */}
                <div className="flex gap-1">
                  <button title="Undo" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Undo className="w-4 h-4" />
                  </button>
                  <button title="Redo" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Redo className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing your text here..."
                className="w-full min-h-[400px] p-6 bg-card/80 backdrop-blur-sm border border-border/30 border-t-0 rounded-b-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                }}
              />

              {/* Footer Stats & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button variant="glass" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="glow" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TextEditor;
