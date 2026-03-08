"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import RightClickBlocker from "./RightClickBlocker";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerModalProps {
  url: string;
  title: string;
  trigger?: React.ReactNode;
}

export default function PDFViewerModal({ url, title, trigger }: PDFViewerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  // Measure container width for responsive PDF sizing
  const onWrapperRefChange = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerWidth(node.getBoundingClientRect().width);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));

  // Global right click blocker for the modal session (extra safety)
  useEffect(() => {
    if (isOpen) {
      const handleEvent = (e: MouseEvent) => {
        if (e.type === "contextmenu" || (e.type === "mousedown" && e.button === 2)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("contextmenu", handleEvent, true);
      document.addEventListener("mousedown", handleEvent, true);
      return () => {
        document.removeEventListener("contextmenu", handleEvent, true);
        document.removeEventListener("mousedown", handleEvent, true);
      };
    } else {
      // Reset state when closed
      setScale(1.0);
      setIsLoading(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="md:max-w-7xl w-[98vw] h-[95vh] p-0 gap-0 overflow-hidden flex flex-col border-none sm:rounded-2xl bg-slate-100 dark:bg-slate-900"
      >
        <RightClickBlocker className="flex-1 flex flex-col overflow-hidden w-full h-full">
          {/* Header */}
          <DialogHeader className="p-3 md:p-4 border-b bg-white dark:bg-slate-900 flex flex-row items-center justify-between shrink-0 w-full z-10 shadow-sm relative">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 pr-4">
                <DialogTitle className="text-base md:text-lg font-bold truncate max-w-[200px] sm:max-w-sm md:max-w-md">
                  {title}
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Protected View
                </p>
              </div>
            </div>

            {/* Zoom Controls */}
            {numPages && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 mr-8">
                <button
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-50 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-medium w-10 text-center text-slate-600 dark:text-slate-300">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 3}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-50 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            )}
          </DialogHeader>

          {/* PDF Content Area */}
          <div className="flex-1 relative overflow-y-auto overflow-x-hidden w-full bg-[#525659] dark:bg-slate-950 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 p-2 md:p-6 flex justify-center">
            
            {/* The Document Wrapper */}
            <div ref={onWrapperRefChange} className="w-full max-w-5xl flex justify-center">
              <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center justify-center h-64 text-slate-300 gap-3 mt-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm font-medium">Loading Document...</p>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-center max-w-md mx-auto mt-20">
                    <MapPin className="h-10 w-10 text-red-400 mb-3" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Failed to load PDF.</p>
                    <p className="text-xs text-slate-500 mt-1">The document might be invalid or unavailable.</p>
                  </div>
                }
                className="flex flex-col items-center gap-4 md:gap-6 w-full"
              >
                {Array.from(new Array(numPages || 0), (el, index) => (
                  <div 
                    key={`page_${index + 1}`} 
                    className="relative bg-white shadow-xl max-w-full"
                    // Extreme right-click protection on the page container
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <Page
                      pageNumber={index + 1}
                      // Make width responsive based on container, up to a max
                      width={containerWidth ? Math.min(containerWidth, 1024) * scale : undefined}
                      scale={containerWidth ? undefined : scale}
                      className="max-w-full"
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      loading={
                        <div className="w-[800px] h-[1000px] max-w-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                        </div>
                      }
                    />
                    
                    {/* Transparent invincible shield over each page content */}
                    <div 
                      className="absolute inset-0 z-10" 
                      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onMouseDown={(e) => { if(e.button===2){e.preventDefault(); e.stopPropagation();} }}
                      style={{ cursor: 'default' }}
                    />
                  </div>
                ))}
              </Document>
            </div>
            
          </div>
        </RightClickBlocker>
      </DialogContent>
    </Dialog>
  );
}
