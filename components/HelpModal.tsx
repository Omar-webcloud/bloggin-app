"use client";

import { HelpCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sage-500/10 text-sage-600 dark:text-sage-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Help &amp; Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Welcome to <strong className="text-foreground">Bloggin&apos;</strong> — a fast, distraction-free publishing space for everyday stories, thoughts, and reflections.
          </p>

          <div className="p-4 rounded-xl bg-muted border border-border space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium">Focus Search Bar</span>
              <kbd className="font-mono px-2 py-0.5 rounded bg-card border border-border text-foreground font-semibold">
                ⌘K / Ctrl+K
              </kbd>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium">Write New Story</span>
              <kbd className="font-mono px-2 py-0.5 rounded bg-card border border-border text-foreground font-semibold">
                N
              </kbd>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium">Close Reader / Modals</span>
              <kbd className="font-mono px-2 py-0.5 rounded bg-card border border-border text-foreground font-semibold">
                Esc
              </kbd>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Click any card title or &ldquo;Full Blog&rdquo; button to launch the distraction-free article reader with adjustable typography sizes and reading progress indicator.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 rounded-xl transition-colors text-xs font-semibold shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
