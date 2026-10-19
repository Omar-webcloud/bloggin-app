"use client";

import { useState } from "react";
import BlogList from "../components/BlogList";
import HelpModal from "../components/HelpModal";
import TermsModal from "../components/TermsModal";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full pt-6 sm:pt-8 pb-16">
        <BlogList />
      </main>

      {/* Modern Footer matching the improved UI design */}
      <footer className="mt-auto py-10 border-t border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">
              Bloggin<span className="text-sage-600 dark:text-sage-300">&apos;</span>
            </span>
            <span className="text-muted-foreground/60">•</span>
            <p className="text-xs text-muted-foreground">
              &copy; 2026 BLOGGIN App by Omar. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <button
              onClick={() => setShowHelpModal(true)}
              className="hover:text-foreground transition-colors"
            >
              Help &amp; Shortcuts
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-foreground transition-colors"
            >
              Terms and Conditions
            </button>
            <a
              href="#top"
              onClick={scrollToTop}
              className="hover:text-sage-600 dark:hover:text-sage-300 transition-colors flex items-center gap-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}
