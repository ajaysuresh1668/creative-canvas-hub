import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import FloatingLetters from '@/components/FloatingLetters';
import { Button } from '@/components/ui/button';
import { 
  Upload, FileText, Download, Trash2,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Highlighter
} from 'lucide-react';
import { toast } from 'sonner';

const DocumentEditor: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
      
      // Read text content if it's a text file
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentContent(e.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        setDocumentContent('Document preview available after processing...');
      }
      toast.success('Document uploaded successfully!');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentContent(e.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        setDocumentContent('Document preview available after processing...');
      }
      toast.success('Document uploaded successfully!');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, '') + '-edited.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document downloaded!');
  };

  const clearDocument = () => {
    setUploadedFile(null);
    setDocumentContent('');
    setFileName('');
    toast.success('Document cleared!');
  };

  return (
    <>
      <Helmet>
        <title>Free Document Editor - Edit PDFs & Documents Online | Free Edit Hub</title>
        <meta name="description" content="Free online document editor. Edit PDFs, Word docs, and more. Format text, add images, and export easily." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <FloatingLetters />
        <Navbar />

        <main className="pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <FileText className="w-4 h-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Document Editor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text-secondary">Document Editor</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Edit your documents with full formatting control.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {uploadedFile ? (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{fileName}</span>
                    </div>

                    <div className="w-px h-8 bg-border/30 mx-2" />

                    {/* Format Buttons */}
                    <div className="flex gap-1">
                      {[
                        { icon: Bold, title: 'Bold' },
                        { icon: Italic, title: 'Italic' },
                        { icon: Underline, title: 'Underline' },
                        { icon: Highlighter, title: 'Highlight' },
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

                    <Button variant="ghost" size="sm" onClick={clearDocument}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button variant="glow" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  {/* Document Content */}
                  <div className="glass-card rounded-2xl p-6">
                    <textarea
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                      className="w-full min-h-[500px] p-4 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-secondary/50 font-sans text-base leading-relaxed"
                      placeholder="Your document content will appear here..."
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="glass-card rounded-2xl min-h-[500px] flex items-center justify-center cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center p-12">
                    <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload a Document</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop or click to select (PDF, DOCX, TXT)
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
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DocumentEditor;
