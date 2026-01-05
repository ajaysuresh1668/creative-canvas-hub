import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Undo2, Redo2, Download, Copy, Trash2, Save, 
  Palette, Sun, Moon, FileText, Sparkles, Hash, Quote, Code, Heading1, Heading2, 
  ChevronDown, Check, Eye, EyeOff, LayoutTemplate, Wand2, Languages, Mic, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FloatingLetters from '@/components/FloatingLetters';
import EditorHeader from '@/components/EditorHeader';

interface TextStats {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
}

const TextEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Space Grotesk');
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textColor, setTextColor] = useState('#e2e8f0');
  const [bgColor, setBgColor] = useState('transparent');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'format' | 'style' | 'tools'>('format');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fonts = [
    'Space Grotesk', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 
    'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino'
  ];

  const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setText(history[historyIndex - 1]);
      toast.success('Undone!');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setText(history[historyIndex + 1]);
      toast.success('Redone!');
    }
  };

  const getStats = (): TextStats => {
    const trimmedText = text.trim();
    const characters = text.length;
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const sentences = trimmedText ? (trimmedText.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = trimmedText ? trimmedText.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const readingTime = `${Math.max(1, Math.ceil(words / 200))} min`;
    
    return { characters, words, sentences, paragraphs, readingTime };
  };

  const stats = getStats();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadText = (format: 'txt' | 'html' | 'md') => {
    let content = text;
    let filename = `document.${format}`;
    let mimeType = 'text/plain';

    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body {
      font-family: ${fontFamily}, sans-serif;
      font-size: ${fontSize}px;
      line-height: ${lineHeight};
      letter-spacing: ${letterSpacing}px;
      color: ${textColor};
      text-align: ${textAlign};
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  ${text.split('\n').map(p => `<p>${p}</p>`).join('\n  ')}
</body>
</html>`;
      mimeType = 'text/html';
    } else if (format === 'md') {
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format.toUpperCase()}!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setText(ev.target?.result as string);
        toast.success('File loaded!');
      };
      reader.readAsText(file);
    }
  };

  const insertTemplate = (template: string) => {
    const templates: Record<string, string> = {
      letter: `Dear [Recipient],

I hope this letter finds you well. I am writing to...

[Body of the letter]

Thank you for your time and consideration.

Best regards,
[Your Name]`,
      email: `Subject: [Subject Line]

Hi [Name],

[Opening line]

[Main content]

Best,
[Your Name]`,
      blog: `# [Blog Title]

## Introduction
[Hook your readers with an engaging introduction]

## Main Point 1
[Expand on your first main idea]

## Main Point 2
[Develop your second point]

## Conclusion
[Wrap up and call to action]`,
      meeting: `# Meeting Notes
**Date:** [Date]
**Attendees:** [Names]

## Agenda
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]

## Discussion Points
- 

## Action Items
- [ ] [Task 1] - [Owner]
- [ ] [Task 2] - [Owner]

## Next Meeting
[Date and Time]`,
    };

    setText(templates[template] || '');
    toast.success('Template inserted!');
  };

  const transformText = (type: 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase') => {
    let newText = text;
    switch (type) {
      case 'uppercase':
        newText = text.toUpperCase();
        break;
      case 'lowercase':
        newText = text.toLowerCase();
        break;
      case 'titlecase':
        newText = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentencecase':
        newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
    }
    setText(newText);
    toast.success(`Converted to ${type}!`);
  };

  const clearText = () => {
    setText('');
    setHistory(['']);
    setHistoryIndex(0);
    toast.success('Text cleared!');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLetters />
      <EditorHeader 
        title="Text Editor" 
        subtitle="Rich text editing"
        icon={<Type className="w-5 h-5 text-primary" />}
      />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md,.html"
          className="hidden"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="editor-sidebar rounded-2xl">
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted/30 rounded-xl mb-4">
                {(['format', 'style', 'tools'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'format' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full p-2 rounded-lg bg-muted/30 border border-border/50 text-sm"
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-muted/30 border border-border/50 text-sm"
                    >
                      {fontSizes.map((size) => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Text Formatting</label>
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        onClick={() => setIsBold(!isBold)}
                        className={`editor-toolbar-btn ${isBold ? 'editor-toolbar-btn-active' : ''}`}
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={`editor-toolbar-btn ${isItalic ? 'editor-toolbar-btn-active' : ''}`}
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsUnderline(!isUnderline)}
                        className={`editor-toolbar-btn ${isUnderline ? 'editor-toolbar-btn-active' : ''}`}
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsStrikethrough(!isStrikethrough)}
                        className={`editor-toolbar-btn ${isStrikethrough ? 'editor-toolbar-btn-active' : ''}`}
                      >
                        <Strikethrough className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Alignment</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { align: 'left' as const, icon: AlignLeft },
                        { align: 'center' as const, icon: AlignCenter },
                        { align: 'right' as const, icon: AlignRight },
                        { align: 'justify' as const, icon: AlignJustify },
                      ].map(({ align, icon: Icon }) => (
                        <button
                          key={align}
                          onClick={() => setTextAlign(align)}
                          className={`editor-toolbar-btn ${textAlign === align ? 'editor-toolbar-btn-active' : ''}`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'style' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 h-10"
                      />
                      <span className="text-xs font-mono flex-1">{textColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Line Height</label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">{lineHeight}</div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Letter Spacing</label>
                    <input
                      type="range"
                      min="-2"
                      max="10"
                      step="0.5"
                      value={letterSpacing}
                      onChange={(e) => setLetterSpacing(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">{letterSpacing}px</div>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <label className="text-xs text-muted-foreground mb-2 block">Editor Theme</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                          theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="text-xs">Dark</span>
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                          theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-xs">Light</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Templates</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Letter', key: 'letter' },
                        { name: 'Email', key: 'email' },
                        { name: 'Blog', key: 'blog' },
                        { name: 'Meeting', key: 'meeting' },
                      ].map(({ name, key }) => (
                        <button
                          key={key}
                          onClick={() => insertTemplate(key)}
                          className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <label className="text-xs text-muted-foreground mb-2 block">Transform Text</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => transformText('uppercase')} className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        UPPERCASE
                      </button>
                      <button onClick={() => transformText('lowercase')} className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        lowercase
                      </button>
                      <button onClick={() => transformText('titlecase')} className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        Title Case
                      </button>
                      <button onClick={() => transformText('sentencecase')} className="p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        Sentence case
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <label className="text-xs text-muted-foreground mb-2 block">AI Features</label>
                    <div className="space-y-2">
                      <button onClick={() => toast.info('AI Grammar Check coming soon!')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <Wand2 className="w-4 h-4" />
                        Grammar Check
                      </button>
                      <button onClick={() => toast.info('AI Translation coming soon!')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <Languages className="w-4 h-4" />
                        Translate
                      </button>
                      <button onClick={() => toast.info('Speech to Text coming soon!')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <Mic className="w-4 h-4" />
                        Speech to Text
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
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
                <button onClick={() => fileInputRef.current?.click()} className="editor-toolbar-btn" title="Open File">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={copyToClipboard} className="editor-toolbar-btn" title="Copy All">
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={clearText} className="editor-toolbar-btn" title="Clear">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={() => setShowPreview(!showPreview)} className={`editor-toolbar-btn ${showPreview ? 'editor-toolbar-btn-active' : ''}`} title="Toggle Preview">
                  {showPreview ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="glass" size="sm" onClick={() => downloadText('txt')} className="text-xs sm:text-sm">
                  <Download className="w-4 h-4 mr-1" /> TXT
                </Button>
                <Button variant="glass" size="sm" onClick={() => downloadText('md')} className="text-xs sm:text-sm">
                  MD
                </Button>
                <Button variant="glow" size="sm" onClick={() => downloadText('html')} className="text-xs sm:text-sm">
                  HTML
                </Button>
              </div>
            </div>

            {/* Text Area */}
            <div className={`editor-canvas rounded-2xl ${theme === 'light' ? 'bg-white' : ''}`}>
              {showPreview ? (
                <div 
                  className="min-h-[400px] sm:min-h-[500px] p-4 prose prose-invert max-w-none"
                  style={{
                    fontFamily: fontFamily,
                    fontSize: `${fontSize}px`,
                    textAlign: textAlign,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: `${isUnderline ? 'underline' : ''} ${isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
                    color: textColor,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}px`,
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: text.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('') 
                  }}
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Start typing your text here... ✨"
                  className={`w-full min-h-[400px] sm:min-h-[500px] p-4 bg-transparent border-0 outline-none resize-none ${
                    theme === 'light' ? 'text-gray-900 placeholder:text-gray-400' : 'placeholder:text-muted-foreground/50'
                  }`}
                  style={{
                    fontFamily: fontFamily,
                    fontSize: `${fontSize}px`,
                    textAlign: textAlign,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: `${isUnderline ? 'underline' : ''} ${isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
                    color: theme === 'light' ? '#1a1a1a' : textColor,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}px`,
                  }}
                />
              )}
            </div>

            {/* Stats Bar */}
            <div className="mt-4 glass-card rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Characters:</span>
                    <span className="font-medium">{stats.characters.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground">Words:</span>
                    <span className="font-medium">{stats.words.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Sentences:</span>
                    <span className="font-medium">{stats.sentences}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Reading Time:</span>
                    <span className="font-medium">{stats.readingTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary">Auto-Save</span>
                  <span className="px-2 py-1 rounded bg-secondary/20 text-secondary">History: {history.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextEditor;
