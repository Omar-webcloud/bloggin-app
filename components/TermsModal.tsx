"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sage-500/10 text-sage-600 dark:text-sage-300">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Terms and Conditions</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-muted-foreground space-y-3 overflow-y-auto pr-2 leading-relaxed">
          <p className="font-semibold text-foreground">
            By using Bloggin&apos;, you agree to these terms and guidelines.
          </p>
          <p>
            All articles published on Bloggin&apos; represent the personal reflections, creative writing, and insights of their respective authors.
          </p>
          <p>
            You retain full ownership of your written content. By publishing on Bloggin&apos;, you grant the platform permission to display and share your content as part of the service.
          </p>
          <p>
            Please respect community members: avoid harmful, harassing, or illegal content. We reserve the right to remove any stories that violate these principles.
          </p>
          <p className="text-xs text-muted-foreground/80 pt-2 border-t border-border">
            &copy; 2026 BLOGGIN App by Omar. All rights reserved.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 rounded-xl transition-colors text-xs font-semibold shadow-sm"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
