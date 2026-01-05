import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Download, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Highlighter,
  Save, Copy, Trash2, Search, Replace, Undo2, Redo2, Eye, EyeOff,
  FileImage, Table, Link, Quote, Code, Heading1, Heading2, Heading3,
  Printer, Share2, Settings, Sparkles, Languages, Mic, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FloatingLetters from '@/components/FloatingLetters';
import EditorHeader from '@/components/EditorHeader';

const DocumentEditor: React.FC = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('untitled-document');
  const [isEditing, setIsEditing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'format' | 'insert' | 'tools'>('format');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setDocumentContent(content);
          setHistory([content]);
          setHistoryIndex(0);
          toast.success('Document loaded!');
        };
        reader.readAsText(file);
      } else {
        toast.info('File uploaded! Text extraction for this format coming soon.');
        setDocumentContent(`Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type}\n\n[Content preview for this format coming soon...]`);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          setDocumentContent(content);
          setHistory([content]);
          setHistoryIndex(0);
          toast.success('Document loaded!');
        };
        reader.readAsText(file);
      } else {
        toast.info('File uploaded! Text extraction coming soon.');
      }
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setDocumentContent(newContent);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDocumentContent(history[historyIndex - 1]);
      toast.success('Undone!');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDocumentContent(history[historyIndex + 1]);
      toast.success('Redone!');
    }
  };

  const downloadDocument = (format: 'txt' | 'md' | 'html' | 'pdf') => {
    let content = documentContent;
    let mimeType = 'text/plain';

    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
  </style>
</head>
<body>
${documentContent.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('\n')}
</body>
</html>`;
      mimeType = 'text/html';
    } else if (format === 'md') {
      mimeType = 'text/markdown';
    } else if (format === 'pdf') {
      toast.info('PDF export coming soon! Downloading as HTML for now.');
      format = 'html' as any;
      mimeType = 'text/html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format.toUpperCase()}!`);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(documentContent);
    toast.success('Copied to clipboard!');
  };

  const clearDocument = () => {
    setDocumentContent('');
    setUploadedFile(null);
    setFileName('untitled-document');
    setHistory(['']);
    setHistoryIndex(0);
    toast.success('Document cleared!');
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    const count = (documentContent.match(new RegExp(searchQuery, 'gi')) || []).length;
    toast.info(`Found ${count} occurrence(s)`);
  };

  const handleReplace = () => {
    if (!searchQuery) return;
    const newContent = documentContent.replace(new RegExp(searchQuery, 'g'), replaceQuery);
    setDocumentContent(newContent);
    toast.success('Replaced all occurrences!');
  };

  const insertAtCursor = (textBefore: string, textAfter: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = documentContent.substring(start, end);
    const newContent = documentContent.substring(0, start) + textBefore + selectedText + textAfter + documentContent.substring(end);
    
    setDocumentContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textBefore.length, start + textBefore.length + selectedText.length);
    }, 0);
  };

  const wordCount = documentContent.trim() ? documentContent.trim().split(/\s+/).length : 0;
  const charCount = documentContent.length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLetters />
      <EditorHeader 
        title="Document Editor" 
        subtitle="Edit and process documents"
        icon={<FileText className="w-5 h-5 text-primary" />}
      />

      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md,.html,.doc,.docx,.pdf"
          className="hidden"
        />

        {!uploadedFile && !documentContent ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="max-w-3xl mx-auto mt-8 sm:mt-16 glass-card p-8 sm:p-16 rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 gradient-text">Upload Your Document</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-muted-foreground/60">
                Supports TXT, MD, HTML, DOC, DOCX, PDF
              </p>
              <div className="mt-6">
                <Button variant="glass" onClick={(e) => { e.stopPropagation(); setDocumentContent(''); setUploadedFile(null); setIsEditing(true); }}>
                  Or Start a New Document
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar */}
            <div className="xl:col-span-1 order-2 xl:order-1">
              <div className="editor-sidebar rounded-2xl">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-muted/30 rounded-xl mb-4">
                  {(['format', 'insert', 'tools'] as const).map((tab) => (
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
                      <label className="text-xs text-muted-foreground mb-2 block">Text Style</label>
                      <div className="grid grid-cols-4 gap-1">
                        <button onClick={() => insertAtCursor('**', '**')} className="editor-toolbar-btn" title="Bold">
                          <Bold className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertAtCursor('*', '*')} className="editor-toolbar-btn" title="Italic">
                          <Italic className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertAtCursor('<u>', '</u>')} className="editor-toolbar-btn" title="Underline">
                          <Underline className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertAtCursor('~~', '~~')} className="editor-toolbar-btn" title="Strikethrough">
                          <Strikethrough className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Headings</label>
                      <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => insertAtCursor('# ')} className="editor-toolbar-btn" title="Heading 1">
                          <Heading1 className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertAtCursor('## ')} className="editor-toolbar-btn" title="Heading 2">
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertAtCursor('### ')} className="editor-toolbar-btn" title="Heading 3">
                          <Heading3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Lists</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button onClick={() => insertAtCursor('- ')} className="editor-toolbar-btn flex items-center gap-1 text-xs">
                          <List className="w-4 h-4" /> Bullet
                        </button>
                        <button onClick={() => insertAtCursor('1. ')} className="editor-toolbar-btn flex items-center gap-1 text-xs">
                          <ListOrdered className="w-4 h-4" /> Numbered
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'insert' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => insertAtCursor('[', '](url)')} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <Link className="w-4 h-4" /> Link
                      </button>
                      <button onClick={() => insertAtCursor('![alt](', ')')} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <FileImage className="w-4 h-4" /> Image
                      </button>
                      <button onClick={() => insertAtCursor('> ')} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <Quote className="w-4 h-4" /> Quote
                      </button>
                      <button onClick={() => insertAtCursor('`', '`')} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                        <Code className="w-4 h-4" /> Code
                      </button>
                      <button onClick={() => insertAtCursor('\n```\n', '\n```\n')} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs col-span-2">
                        <Code className="w-4 h-4" /> Code Block
                      </button>
                      <button onClick={() => toast.info('Table insertion coming soon!')} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs col-span-2">
                        <Table className="w-4 h-4" /> Insert Table
                      </button>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <label className="text-xs text-muted-foreground mb-2 block">Quick Elements</label>
                      <div className="space-y-2">
                        <button onClick={() => insertAtCursor('\n---\n')} className="w-full p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs text-left">
                          Horizontal Line (---)
                        </button>
                        <button onClick={() => insertAtCursor('- [ ] ')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                          <CheckCircle className="w-4 h-4" /> Checkbox
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="space-y-4">
                    <div>
                      <Button 
                        variant="glass" 
                        size="sm" 
                        className="w-full mb-2"
                        onClick={() => setShowSearch(!showSearch)}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Find & Replace
                      </Button>
                      
                      {showSearch && (
                        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                          <input
                            type="text"
                            placeholder="Find..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 rounded bg-muted/50 border border-border/50 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Replace with..."
                            value={replaceQuery}
                            onChange={(e) => setReplaceQuery(e.target.value)}
                            className="w-full p-2 rounded bg-muted/50 border border-border/50 text-sm"
                          />
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleSearch} className="flex-1 text-xs">
                              Find
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleReplace} className="flex-1 text-xs">
                              Replace All
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <label className="text-xs text-muted-foreground mb-2 block">AI Features</label>
                      <div className="space-y-2">
                        <button onClick={() => toast.info('AI Summary coming soon!')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                          <Sparkles className="w-4 h-4" />
                          Summarize Document
                        </button>
                        <button onClick={() => toast.info('AI Translation coming soon!')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                          <Languages className="w-4 h-4" />
                          Translate Document
                        </button>
                        <button onClick={() => toast.info('OCR coming soon!')} className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/20 transition-all text-xs">
                          <FileText className="w-4 h-4" />
                          Extract Text (OCR)
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <label className="text-xs text-muted-foreground mb-2 block">Document Info</label>
                      <div className="p-3 bg-muted/30 rounded-lg space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Words:</span>
                          <span className="font-medium">{wordCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Characters:</span>
                          <span className="font-medium">{charCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File:</span>
                          <span className="font-medium truncate max-w-[120px]">{uploadedFile?.name || 'New Document'}</span>
                        </div>
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
                  <button onClick={clearDocument} className="editor-toolbar-btn" title="Clear">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button onClick={() => setIsEditing(!isEditing)} className={`editor-toolbar-btn ${!isEditing ? 'editor-toolbar-btn-active' : ''}`} title="Toggle Preview">
                    {isEditing ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="glass" size="sm" onClick={() => downloadDocument('txt')} className="text-xs sm:text-sm">
                    <Download className="w-4 h-4 mr-1" /> TXT
                  </Button>
                  <Button variant="glass" size="sm" onClick={() => downloadDocument('md')} className="text-xs sm:text-sm">
                    MD
                  </Button>
                  <Button variant="glass" size="sm" onClick={() => downloadDocument('html')} className="text-xs sm:text-sm">
                    HTML
                  </Button>
                  <Button variant="glow" size="sm" onClick={() => downloadDocument('pdf')} className="text-xs sm:text-sm">
                    PDF
                  </Button>
                </div>
              </div>

              {/* Document Area */}
              <div className="editor-canvas rounded-2xl">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={documentContent}
                    onChange={handleContentChange}
                    placeholder="Start typing your document here... Or upload a file to edit.

Markdown formatting supported:
• **bold** or *italic*
• # Heading 1, ## Heading 2
• - Bullet list or 1. Numbered list
• > Blockquote
• `inline code` or ``` code block ```
• [Link text](url)
• ![Image alt](url)"
                    className="w-full min-h-[400px] sm:min-h-[500px] p-4 sm:p-6 bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground/50 font-mono text-sm leading-relaxed"
                  />
                ) : (
                  <div 
                    className="min-h-[400px] sm:min-h-[500px] p-4 sm:p-6 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: documentContent
                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                        .replace(/\*(.*)\*/gim, '<em>$1</em>')
                        .replace(/~~(.*)~~/gim, '<del>$1</del>')
                        .replace(/`([^`]+)`/gim, '<code>$1</code>')
                        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                        .replace(/^- (.*$)/gim, '<li>$1</li>')
                        .replace(/\n/gim, '<br>')
                    }}
                  />
                )}
              </div>

              {/* Footer Info */}
              <div className="mt-4 glass-card rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {wordCount} words • {charCount} characters
                    </span>
                    {uploadedFile && (
                      <span className="text-muted-foreground">
                        • {(uploadedFile.size / 1024).toFixed(2)} KB
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary">Markdown Ready</span>
                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary">
                      {isEditing ? 'Edit Mode' : 'Preview Mode'}
                    </span>
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

export default DocumentEditor;
