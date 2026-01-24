"use client"

import { FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ 
  isOpen, 
  onClose 
}: TermsModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-card from-card to-card/95 border border-border rounded-lg shadow-2xl w-full max-w-[600px] p-6 animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        
        <div className="flex flex-col items-center text-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-xl font-bold m-0 shrink-0">Terms and Conditions</h2>
        </div>

          <div className="text-left w-full text-foreground/80 text-[0.95rem] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <p className="font-semibold">By using Bloggin you agree to these terms and conditions.</p>
            
            <p>You are responsible for the content you create and publish on Bloggin'. Do not post content that is illegal harmful offensive or violates the rights of others.</p>
            
            <p>You keep ownership of your content. By publishing on Bloggin' you allow the platform to store display and distribute your content as part of the service.</p>
            
            <p>Bloggin' may remove content that violates these terms or suspend accounts that misuse the platform.</p>
            
            <p>The service is provided as is. Bloggin' does not guarantee uninterrupted access or data preservation.</p>
            
            <p>These terms may be updated at any time. Continued use of Bloggin' means you accept the updated terms.</p>
          </div>

        <div className="flex gap-3 mt-6 justify-center shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors text-sm font-medium border-none"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
