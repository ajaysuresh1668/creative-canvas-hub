import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import TextEditor from "./pages/TextEditor";
import ImageEditor from "./pages/ImageEditor";
import VideoEditor from "./pages/VideoEditor";
import AudioEditor from "./pages/AudioEditor";
import DocumentEditor from "./pages/DocumentEditor";
import MusicPlayer from "./pages/MusicPlayer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/text-editor" element={<TextEditor />} />
              <Route path="/image-editor" element={<ImageEditor />} />
              <Route path="/video-editor" element={<VideoEditor />} />
              <Route path="/audio-editor" element={<AudioEditor />} />
              <Route path="/document-editor" element={<DocumentEditor />} />
              <Route path="/music-player" element={<MusicPlayer />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
