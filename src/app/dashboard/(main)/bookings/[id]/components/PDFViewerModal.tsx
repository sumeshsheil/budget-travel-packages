"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, MapPin } from "lucide-react";
import { useState } from "react";

interface PDFViewerModalProps {
  url: string;
  title: string;
  trigger?: React.ReactNode;
}

export default function PDFViewerModal({ url, title, trigger }: PDFViewerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Appending #toolbar=0 to suggest browsers to hide the toolbar (works in Chrome, Safari, Edge)
  const viewerUrl = `${url}#toolbar=0&navpanes=0&scrollbar=0`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col border-none sm:rounded-2xl">
        <DialogHeader className="p-4 border-b bg-white dark:bg-slate-900 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {title}
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View Only Mode
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-none"
            title={title}
          />
          {/* Transparent overlay at the top to make it harder to click browser PDF controls if they appear */}
          <div className="absolute top-0 left-0 w-full h-12 bg-transparent z-10 pointer-events-none" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
