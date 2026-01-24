"use client";

import { useState } from "react";
import BlogList from "../components/BlogList";
import HelpModal from "../components/HelpModal";
import TermsModal from "../components/TermsModal";

export default function Home() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 flex-grow">
        <BlogList />
      </main>

      <footer className="mt-16 py-8 border-t border-border text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-4">
            <button 
                onClick={() => setShowHelpModal(true)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                Help
            </button>
            <button 
                onClick={() => setShowTermsModal(true)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                Terms and Conditions
            </button>
          </div>
          <p className="text-muted-foreground">&copy; BLOGGIN App by Omar. All rights reserved.</p>
        </div>
      </footer>

      <HelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
    </div>
  );
}
