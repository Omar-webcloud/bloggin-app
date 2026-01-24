"use client"

import { Info } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpModal({ 
  isOpen, 
  onClose 
}: HelpModalProps) {
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
      <div className="bg-card from-card to-card/95 border border-border rounded-lg shadow-2xl w-full max-w-[500px] p-6 animate-[fadeIn_0.2s_ease-out]">
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Info className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-xl font-bold m-0">Help</h2>
          
          <div className="text-center w-full text-foreground/80 text-[0.95rem] m-0 space-y-2">
            <p>Bloggin lets you write and publish text based blog posts in a clean and simple way.</p>
            <p>Create a post by writing in the editor and saving it when you are ready.</p>
            <p>You can edit or delete your posts at any time.</p>
            <p>Use Bloggin to share your thoughts clearly and without distractions.</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors text-sm font-medium border-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
