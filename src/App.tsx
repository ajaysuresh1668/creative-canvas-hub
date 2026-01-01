import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import TextEditor from "./pages/TextEditor";
import ImageEditor from "./pages/ImageEditor";
import VideoEditor from "./pages/VideoEditor";
import AudioEditor from "./pages/AudioEditor";
import DocumentEditor from "./pages/DocumentEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
